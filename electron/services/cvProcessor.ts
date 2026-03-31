import * as fs from 'fs';
// @ts-ignore - pdf-parse doesn't have types
import pdfParse from 'pdf-parse';
import { saveCVAnalysis, updateSyncStatus } from './database.js';
import { v4 as uuidv4 } from 'uuid';

const pdf: any = pdfParse;

// Local text extraction from PDFs and DOCX
export async function extractTextFromFile(filePath: string): Promise<string> {
  if (filePath.endsWith('.pdf')) {
    return extractFromPDF(filePath);
  } else if (filePath.endsWith('.docx') || filePath.endsWith('.doc')) {
    return extractFromDOCX(filePath);
  }
  throw new Error('Unsupported file format');
}

async function extractFromPDF(filePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdf(fileBuffer);
  return data.text;
}

async function extractFromDOCX(filePath: string): Promise<string> {
  // Using a lightweight approach - for production, consider python-docx or similar
  const fileBuffer = fs.readFileSync(filePath);
  // Simple text extraction from DOCX XML
  const text = fileBuffer.toString('utf8', 0, Math.min(100000, fileBuffer.length));
  const textMatches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
  return textMatches.map(match => match.replace(/<[^>]+>/g, '')).join(' ');
}

// Local LLM-based CV analysis (using transformers.js for local inference)
async function analyzeWithLocalLLM(
  cvContent: string,
  jobData: {
    title: string;
    required_skills: string;
    min_experience: number;
    english_level: string;
    location: string;
  }
): Promise<{
  fit_score: number;
  experience_score: number;
  skills_score: number;
  location_score: number;
  english_score: number;
  analysis: Record<string, unknown>;
}> {
  // For MVP, using a simplified local analysis approach
  // In production, you could use:
  // - transformers.js (DistilBERT for semantic similarity)
  // - ollama for running local LLMs
  // - or custom ML models

  const analysis = performLocalAnalysis(cvContent, jobData);
  return analysis;
}

function performLocalAnalysis(
  cvContent: string,
  jobData: {
    title: string;
    required_skills: string;
    min_experience: number;
    english_level: string;
    location: string;
  }
): {
  fit_score: number;
  experience_score: number;
  skills_score: number;
  location_score: number;
  english_score: number;
  analysis: Record<string, unknown>;
} {
  const cvLower = cvContent.toLowerCase();

  // Extract years of experience
  const experienceRegex = /(\d+)\s*(?:years?|yrs?|y\.o\.e\.?)/gi;
  const experienceMatches = Array.from(cvContent.matchAll(experienceRegex)).map(m => parseInt(m[1]));
  const yearsExperience = experienceMatches.length > 0 ? Math.max(...experienceMatches) : 0;

  // Experience score (0-40)
  const experienceScore = Math.min(40, (yearsExperience / jobData.min_experience) * 40);

  // Skills matching (0-30)
  const requiredSkills = jobData.required_skills.split(',').map(s => s.trim().toLowerCase());
  const matchedSkills = requiredSkills.filter(skill => cvLower.includes(skill));
  const skillsScore = (matchedSkills.length / requiredSkills.length) * 30;

  // Location matching (0-15) - basic check
  const locationScore = cvLower.includes(jobData.location.toLowerCase()) ? 15 : 5;

  // English level assessment (0-15) - based on content quality
  const englishScore = assessEnglishLevel(cvContent, jobData.english_level);

  const fitScore = experienceScore + skillsScore + locationScore + englishScore;

  return {
    fit_score: Math.min(100, fitScore),
    experience_score: experienceScore,
    skills_score: skillsScore,
    location_score: locationScore,
    english_score: englishScore,
    analysis: {
      yearsExperience,
      matchedSkills,
      skillGaps: requiredSkills.filter(s => !matchedSkills.includes(s)),
      contentLength: cvContent.length,
    },
  };
}

function assessEnglishLevel(cvContent: string, requiredLevel: string): number {
  const contentLength = cvContent.length;
  const wordCount = cvContent.split(/\s+/).length;
  const avgWordLength = contentLength / wordCount;

  // Simple heuristic: higher word count and avg length suggest more detailed English
  let baseScore = 0;
  if (wordCount > 200) baseScore = 10;
  if (wordCount > 500) baseScore = 12;
  if (wordCount > 1000) baseScore = 15;

  // Adjust based on required level
  if (requiredLevel.toLowerCase().includes('native')) {
    return Math.min(15, baseScore);
  } else if (requiredLevel.toLowerCase().includes('fluent') || requiredLevel.toLowerCase().includes('c2')) {
    return Math.min(15, baseScore);
  }

  return baseScore;
}

export async function processCVFile(
  filePath: string,
  jobId: string
): Promise<{
  id: string;
  fit_score: number;
  filename: string;
}> {
  try {
    // Extract text from CV
    const cvContent = await extractTextFromFile(filePath);

    if (!cvContent || cvContent.trim().length === 0) {
      throw new Error('Could not extract text from CV file');
    }

    // Get job details from database
    const { getDatabase } = await import('./database');
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM jobs WHERE id = ?');
    const jobData = stmt.get(jobId) as any;

    if (!jobData) {
      throw new Error('Job not found');
    }

    // Analyze CV with local LLM
    const analysisResult = await analyzeWithLocalLLM(cvContent, {
      title: jobData.title,
      required_skills: jobData.required_skills,
      min_experience: jobData.min_experience,
      english_level: jobData.english_level,
      location: jobData.location,
    });

    // Save to local database
    const analysisId = uuidv4();
    saveCVAnalysis({
      id: analysisId,
      job_id: jobId,
      cv_filename: filePath.split('\\').pop() || 'unknown',
      cv_content: cvContent,
      fit_score: analysisResult.fit_score,
      experience_score: analysisResult.experience_score,
      skills_score: analysisResult.skills_score,
      location_score: analysisResult.location_score,
      english_score: analysisResult.english_score,
      analysis_json: JSON.stringify(analysisResult.analysis),
    });

    // Update sync status - increment CVs processed
    const { getSyncStatus } = await import('./database');
    const syncStatus = getSyncStatus();
    if (syncStatus) {
      updateSyncStatus({
        total_cvs_processed: (syncStatus.total_cvs_processed || 0) + 1,
        credits_remaining: Math.max(0, (syncStatus.credits_remaining || 0) - 1),
      });
    }

    return {
      id: analysisId,
      fit_score: analysisResult.fit_score,
      filename: filePath.split('\\').pop() || 'unknown',
    };
  } catch (error) {
    throw new Error(`CV processing failed: ${String(error)}`);
  }
}
