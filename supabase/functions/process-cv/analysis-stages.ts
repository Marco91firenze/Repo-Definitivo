export interface StructuredData {
  name: string;
  yearsExperience: number;
  location: string;
  englishLevel: string;
  otherLanguages: string;
  skills: {
    skill: string;
    experienceLevel: string;
    yearsWithSkill: number;
  }[];
  workHistory: {
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  recentExperience: string[];
}

export interface DeepAnalysis {
  name: string;
  fit_score: number;
  experience_score: number;
  skills_score: number;
  location_score: number;
  english_score: number;
  experience_quality_score: number;
  skill_relevance_score: number;
  confidence_level: number;
  years_experience: number;
  location: string;
  english_level: string;
  other_languages: string;
  summary: string;
  skill_breakdown: {
    skill: string;
    percentage: number;
    assessment: string;
    evidence: string;
  }[];
  key_strengths: string[];
  gaps: string[];
  risk_factors: string[];
  recommendation: string;
  recommendation_reasoning: string;
  reasoning_chain: {
    experience_reasoning: string;
    skills_reasoning: string;
    location_reasoning: string;
    english_reasoning: string;
    overall_reasoning: string;
  };
  skill_evidence: Record<string, string>;
  skill_variations_matched: Record<string, string[]>;
}

export async function stageOneExtraction(
  cvText: string,
  apiKey: string
): Promise<StructuredData> {
  const prompt = `You are an expert CV parser. Extract structured information from this CV.

CV Text:
${cvText}

Return ONLY valid JSON with this exact structure:
{
  "name": "full name",
  "yearsExperience": 0,
  "location": "city, country",
  "englishLevel": "native/fluent/advanced/intermediate/basic",
  "otherLanguages": "Spanish (fluent), French (intermediate)" or empty string if none,
  "skills": [
    {
      "skill": "skill name",
      "experienceLevel": "expert/advanced/intermediate/beginner",
      "yearsWithSkill": 0
    }
  ],
  "workHistory": [
    {
      "company": "company name",
      "role": "job title",
      "duration": "dates or duration",
      "responsibilities": ["key responsibility 1", "key responsibility 2"]
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "institution name",
      "year": "graduation year"
    }
  ],
  "recentExperience": ["recent role or achievement 1", "recent role or achievement 2"]
}

IMPORTANT:
- Extract ALL skills mentioned, with realistic experience levels
- Calculate total years of professional experience
- Identify English proficiency from CV indicators (native speaker, studied in English, TOEFL/IELTS scores, etc.)
- List work history in reverse chronological order
- Focus on extracting facts, not making judgments`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Failed to parse stage 1 response');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function stageTwoDeepAnalysis(
  structuredData: StructuredData,
  cvText: string,
  jobReqs: any,
  skillMatches: Map<string, any>,
  apiKey: string,
  language: string = 'en'
): Promise<DeepAnalysis> {
  const isRemote = jobReqs.location.toLowerCase().includes('remote');

  const params = jobReqs.scoring_parameters || {
    param1: { name: 'Experience', max_score: 40, requirement: `${jobReqs.minimum_experience} years minimum experience` },
    param2: { name: 'Skills', max_score: 30, requirement: `Required skills: ${jobReqs.required_skills.join(', ')}` },
    param3: { name: 'Location', max_score: isRemote ? 0 : 15, requirement: isRemote ? 'Not applicable (remote position)' : `Location: ${jobReqs.location}` },
    param4: { name: 'English', max_score: isRemote ? 30 : 15, requirement: `English level: ${jobReqs.english_level}` },
  };

  const skillMatchSummary = Array.from(skillMatches.entries())
    .map(([skill, match]) => `${skill}: ${match.found ? 'FOUND' : 'NOT FOUND'} (confidence: ${match.confidence}%)${match.variations.length > 0 ? `, variations: ${match.variations.join(', ')}` : ''}`)
    .join('\n');

  const languageInstructions: Record<string, string> = {
    en: 'Write all text fields (summary, reasoning, assessments, recommendations) in English.',
    it: 'Scrivi tutti i campi di testo (sintesi, ragionamenti, valutazioni, raccomandazioni) in ITALIANO.',
    es: 'Escribe todos los campos de texto (resumen, razonamientos, evaluaciones, recomendaciones) en ESPAÑOL.',
    fr: 'Écrivez tous les champs de texte (résumé, raisonnements, évaluations, recommandations) en FRANÇAIS.',
    de: 'Schreiben Sie alle Textfelder (Zusammenfassung, Begründungen, Bewertungen, Empfehlungen) auf DEUTSCH.',
    'pt-BR': 'Escreva todos os campos de texto (resumo, raciocínios, avaliações, recomendações) em PORTUGUÊS.',
    nl: 'Schrijf alle tekstvelden (samenvatting, redeneringen, beoordelingen, aanbevelingen) in het NEDERLANDS.'
  };

  const languageInstruction = languageInstructions[language] || languageInstructions['en'];

  const prompt = `You are an expert HR analyst performing a deep assessment of a candidate against job requirements.

IMPORTANT: ${languageInstruction}

JOB REQUIREMENTS:
Position: ${jobReqs.title}
${jobReqs.description ? `Description: ${jobReqs.description}` : ''}

SCORING CRITERIA:
1. ${params.param1.name} (max ${params.param1.max_score} points): ${params.param1.requirement}
2. ${params.param2.name} (max ${params.param2.max_score} points): ${params.param2.requirement}
3. ${params.param3.name} (max ${params.param3.max_score} points): ${params.param3.requirement}
4. ${params.param4.name} (max ${params.param4.max_score} points): ${params.param4.requirement}

CANDIDATE STRUCTURED DATA:
${JSON.stringify(structuredData, null, 2)}

SKILL MATCH ANALYSIS:
${skillMatchSummary}

SCORING EXAMPLES:

EXCELLENT CANDIDATE (85-100 points):
- 8+ years relevant experience with clear progression
- 90%+ of required skills with deep expertise
- Perfect location/language match
- Example: Senior developer with 10 years React/Node, led teams, all required skills mastered

GOOD CANDIDATE (70-84 points):
- Meets minimum experience with solid background
- 75-90% required skills, good proficiency
- Location/language suitable
- Example: 5 years relevant experience, most skills present, some gaps in advanced areas

ACCEPTABLE CANDIDATE (55-69 points):
- Close to minimum requirements
- 60-75% required skills
- Some gaps but trainable
- Example: 3 years experience, core skills present, missing some secondary requirements

WEAK CANDIDATE (40-54 points):
- Below minimum experience or quality concerns
- 40-60% required skills
- Significant gaps
- Example: Junior level for mid role, only basic skills, lacks several requirements

POOR CANDIDATE (0-39 points):
- Does not meet basic requirements
- <40% required skills
- Major misalignment
- Example: Wrong field entirely, minimal overlap

${isRemote ? 'NOTE: This is REMOTE - location is NOT a factor. Award 0 for location_score.' : ''}

REASONING PROCESS (think through each step):
1. EXPERIENCE ASSESSMENT: Analyze years, relevance, seniority, progression, recency
2. SKILLS ASSESSMENT: Evaluate proficiency, breadth, depth, practical application
3. ${!isRemote ? 'LOCATION ASSESSMENT: Check location match or relocation willingness' : 'LOCATION: Skip (remote position)'}
4. ENGLISH ASSESSMENT: Evaluate communication ability for role requirements
5. OVERALL FIT: Synthesize all factors into holistic assessment

Return ONLY valid JSON with this exact structure:
{
  "name": "${structuredData.name}",
  "fit_score": 0,
  "experience_score": 0,
  "skills_score": 0,
  "location_score": 0,
  "english_score": 0,
  "experience_quality_score": 0,
  "skill_relevance_score": 0,
  "confidence_level": 0,
  "years_experience": ${structuredData.yearsExperience},
  "location": "${structuredData.location}",
  "english_level": "${structuredData.englishLevel}",
  "other_languages": "${structuredData.otherLanguages || ''}",
  "summary": "3-4 sentence critical assessment explicitly addressing ${isRemote ? 'THREE' : 'ALL FOUR'} scoring criteria with specific evidence",
  "skill_breakdown": [
    {
      "skill": "skill name",
      "percentage": 0,
      "assessment": "proficiency assessment",
      "evidence": "specific evidence from CV"
    }
  ],
  "key_strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "risk_factors": ["concern 1", "concern 2"],
  "recommendation": "strong_yes/yes/maybe/no/strong_no",
  "recommendation_reasoning": "2-3 sentence reasoning for recommendation with specific examples",
  "reasoning_chain": {
    "experience_reasoning": "detailed reasoning about experience quality and relevance",
    "skills_reasoning": "detailed reasoning about skills match and proficiency",
    "location_reasoning": "${isRemote ? 'Not applicable - remote position' : 'detailed reasoning about location fit'}",
    "english_reasoning": "detailed reasoning about English proficiency",
    "overall_reasoning": "synthesis of all factors into final recommendation"
  },
  "skill_evidence": {},
  "skill_variations_matched": {}
}

CRITICAL REQUIREMENTS:
- Be strict: Most candidates score 50-75. Only exceptional matches score 80+
- Provide specific evidence and examples in all reasoning
- key_strengths: 2-4 items most relevant to THIS role
- gaps: Specific missing skills or experience
- risk_factors: Red flags, concerns, or uncertainties (or empty array if none)
- confidence_level: 0-100 based on how clear the CV information is
- experience_quality_score: Not just years, but relevance, progression, seniority
- skill_relevance_score: How well skills match what this role actually needs`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Failed to parse stage 2 response');
  }

  const analysis = JSON.parse(jsonMatch[0]);

  const totalMaxScore = params.param1.max_score + params.param2.max_score +
                        params.param3.max_score + params.param4.max_score;

  return {
    ...analysis,
    fit_score: Math.min(100, Math.max(0, analysis.fit_score || 0)),
    experience_score: Math.min(params.param1.max_score, Math.max(0, analysis.experience_score || 0)),
    skills_score: Math.min(params.param2.max_score, Math.max(0, analysis.skills_score || 0)),
    location_score: isRemote ? 0 : Math.min(params.param3.max_score, Math.max(0, analysis.location_score || 0)),
    english_score: Math.min(params.param4.max_score, Math.max(0, analysis.english_score || 0)),
    experience_quality_score: Math.min(100, Math.max(0, analysis.experience_quality_score || 0)),
    skill_relevance_score: Math.min(100, Math.max(0, analysis.skill_relevance_score || 0)),
    confidence_level: Math.min(100, Math.max(0, analysis.confidence_level || 0)),
    location: isRemote ? 'Remote' : analysis.location,
  };
}
