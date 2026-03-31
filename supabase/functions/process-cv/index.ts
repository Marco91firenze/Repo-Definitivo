import { createClient } from 'npm:@supabase/supabase-js@2';
import * as pdfjsLib from 'npm:pdfjs-dist@4.0.379/legacy/build/pdf.mjs';
import { findSkillMatches, extractSkillEvidence, normalizeSkill } from './skill-matcher.ts';
import { stageOneExtraction, stageTwoDeepAnalysis } from './analysis-stages.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://aicvscanner.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProcessCVRequest {
  cv_id: string;
  file_url: string;
  language?: string;
}

interface JobRequirements {
  title: string;
  location: string;
  english_level: string;
  minimum_experience: number;
  required_skills: string[];
  description: string;
  scoring_parameters?: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { cv_id, file_url, language = 'en' }: ProcessCVRequest = await req.json();

    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('*, jobs(*)')
      .eq('id', cv_id)
      .single();

    if (cvError || !cvData) {
      return new Response(
        JSON.stringify({ error: 'CV not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cvData.company_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase
      .from('cvs')
      .update({ upload_status: 'processing' })
      .eq('id', cv_id);

    let filePath = '';
    if (file_url.includes('/storage/v1/object/public/cvs/')) {
      filePath = decodeURIComponent(file_url.split('/storage/v1/object/public/cvs/')[1]);
    } else if (file_url.includes('/object/public/cvs/')) {
      filePath = decodeURIComponent(file_url.split('/object/public/cvs/')[1]);
    } else {
      throw new Error('Invalid file URL format');
    }

    const cvText = await extractTextFromFile(filePath, supabase);

    await supabase
      .from('cvs')
      .update({ extracted_text: cvText })
      .eq('id', cv_id);

    const jobReqs: JobRequirements = {
      title: cvData.jobs.title,
      location: cvData.jobs.location,
      english_level: cvData.jobs.english_level,
      minimum_experience: cvData.jobs.minimum_experience,
      required_skills: cvData.jobs.required_skills,
      description: cvData.jobs.description || '',
      scoring_parameters: cvData.jobs.scoring_parameters,
    };

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured. Please add your OpenAI API key to the edge function secrets.');
    }

    const structuredData = await stageOneExtraction(cvText, openaiApiKey);

    const skillMatches = findSkillMatches(cvText, jobReqs.required_skills);

    const skillEvidence: Record<string, string> = {};
    const skillVariationsMatched: Record<string, string[]> = {};

    for (const [skill, match] of skillMatches.entries()) {
      if (match.found) {
        skillEvidence[skill] = extractSkillEvidence(cvText, skill);
        skillVariationsMatched[skill] = match.variations;
      }
    }

    const analysis = await stageTwoDeepAnalysis(
      structuredData,
      cvText,
      jobReqs,
      skillMatches,
      openaiApiKey,
      language
    );

    analysis.skill_evidence = skillEvidence;
    analysis.skill_variations_matched = skillVariationsMatched;

    const { error: analysisError } = await supabase
      .from('cv_analyses')
      .insert({
        cv_id: cv_id,
        job_id: cvData.job_id,
        candidate_name: analysis.name,
        fit_score: analysis.fit_score,
        experience_score: analysis.experience_score,
        skills_score: analysis.skills_score,
        location_score: analysis.location_score,
        english_score: analysis.english_score,
        years_experience: analysis.years_experience,
        location: analysis.location,
        english_level: analysis.english_level,
        other_languages: analysis.other_languages || '',
        summary: analysis.summary,
        skill_breakdown: analysis.skill_breakdown,
        reasoning_chain: analysis.reasoning_chain,
        key_strengths: analysis.key_strengths,
        gaps: analysis.gaps,
        risk_factors: analysis.risk_factors,
        recommendation: analysis.recommendation,
        recommendation_reasoning: analysis.recommendation_reasoning,
        experience_quality_score: analysis.experience_quality_score,
        skill_relevance_score: analysis.skill_relevance_score,
        confidence_level: analysis.confidence_level,
        skill_evidence: analysis.skill_evidence,
        skill_variations_matched: analysis.skill_variations_matched,
      });

    if (analysisError) throw analysisError;

    await supabase
      .from('cvs')
      .update({ upload_status: 'completed' })
      .eq('id', cv_id);

    const { data: companyData } = await supabase
      .from('companies')
      .select('free_cvs_remaining, total_cvs_processed')
      .eq('id', cvData.company_id)
      .single();

    if (companyData) {
      await supabase
        .from('companies')
        .update({
          free_cvs_remaining: Math.max(0, companyData.free_cvs_remaining - 1),
          total_cvs_processed: companyData.total_cvs_processed + 1,
        })
        .eq('id', cvData.company_id);
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function extractTextFromFile(filePath: string, supabaseClient: any): Promise<string> {
  try {
    const { data, error } = await supabaseClient.storage
      .from('cvs')
      .download(filePath);

    if (error) {
      throw error;
    }

    const arrayBuffer = await data.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    fullText = fullText.replace(/\s+/g, ' ').trim();

    if (fullText.length < 50) {
      throw new Error('Extracted text is too short. The file may be empty or in an unsupported format.');
    }

    return fullText.substring(0, 15000);
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}
