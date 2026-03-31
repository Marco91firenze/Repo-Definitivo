import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { Download, Trophy, ChevronDown, ChevronUp, Trash2, FileText, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getExportTranslation } from '../utils/exportTranslations';

interface ScoringParameter {
  name: string;
  max_score: number;
  requirement: string;
}

interface Job {
  id: string;
  title: string;
  scoring_parameters?: {
    param1: ScoringParameter;
    param2: ScoringParameter;
    param3: ScoringParameter;
    param4: ScoringParameter;
  };
}

interface SkillScore {
  skill: string;
  percentage: number;
  assessment: string;
  evidence?: string;
}

interface ReasoningChain {
  experience_reasoning: string;
  skills_reasoning: string;
  location_reasoning: string;
  english_reasoning: string;
  overall_reasoning: string;
}

interface Candidate {
  id: string;
  candidate_name: string;
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
  created_at: string;
  skill_breakdown: SkillScore[];
  key_strengths: string[];
  gaps: string[];
  risk_factors: string[];
  recommendation: string;
  recommendation_reasoning: string;
  reasoning_chain: ReasoningChain;
  skill_evidence: Record<string, string>;
  skill_variations_matched: Record<string, string[]>;
  jobs: Job;
}

export function ResultsDashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<{ name: string; summary: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedJobId) {
      setCandidates([]);
      loadCandidates();
    }
  }, [user, selectedJobId]);

  const loadJobs = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('jobs')
      .select('id, title, scoring_parameters')
      .eq('company_id', user.id)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setJobs(data);
      setSelectedJobId(data[0].id);
    }
  };

  const loadCandidates = async () => {
    if (!user || !selectedJobId) return;

    setLoading(true);

    const { data } = await supabase
      .from('cv_analyses')
      .select(`
        *,
        jobs!inner(title, company_id, scoring_parameters)
      `)
      .eq('job_id', selectedJobId)
      .eq('jobs.company_id', user.id)
      .order('fit_score', { ascending: false });

    if (data) {
      setCandidates(data as any);
    }
    setLoading(false);
  };

  const deleteCandidate = async (candidateId: string) => {
    if (!confirm(t('results.deleteConfirm'))) return;

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const { data: cvData } = await supabase
      .from('cvs')
      .select('file_url')
      .eq('id', candidate.id)
      .maybeSingle();

    if (cvData?.file_url) {
      const filePath = decodeURIComponent(cvData.file_url.split('/object/public/cvs/')[1] || '');
      if (filePath) {
        await supabase.storage.from('cvs').remove([filePath]);
      }
    }

    const { error } = await supabase
      .from('cv_analyses')
      .delete()
      .eq('id', candidateId);

    if (!error) {
      setCandidates(candidates.filter(c => c.id !== candidateId));
    }
  };

  const clearAllResults = async () => {
    if (!selectedJobId) return;
    if (!confirm(t('results.clearAllConfirm').replace('{count}', candidates.length.toString()))) return;

    const { error } = await supabase
      .from('cv_analyses')
      .delete()
      .eq('job_id', selectedJobId);

    if (!error) {
      setCandidates([]);
    }
  };

  const prepareWorksheetData = () => {
    const scoringParams = getScoringParams();
    const currentJob = jobs.find(j => j.id === selectedJobId);

    const worksheetData = [
      [getExportTranslation(language, 'candidateRankingReport')],
      [getExportTranslation(language, 'jobTitle'), currentJob?.title || ''],
      [getExportTranslation(language, 'exportDate'), new Date().toLocaleDateString()],
      [getExportTranslation(language, 'totalCandidates'), candidates.length],
      [],
      [
        getExportTranslation(language, 'rank'),
        getExportTranslation(language, 'candidateName'),
        getExportTranslation(language, 'overallFitScore'),
        `${scoringParams.param1.name} ${getExportTranslation(language, 'score')}`,
        `${scoringParams.param1.name} %`,
        `${scoringParams.param2.name} ${getExportTranslation(language, 'score')}`,
        `${scoringParams.param2.name} %`,
        `${scoringParams.param3.name} ${getExportTranslation(language, 'score')}`,
        `${scoringParams.param3.name} %`,
        `${scoringParams.param4.name} ${getExportTranslation(language, 'score')}`,
        `${scoringParams.param4.name} %`,
        getExportTranslation(language, 'yearsExperience'),
        getExportTranslation(language, 'location'),
        getExportTranslation(language, 'englishLevel'),
        getExportTranslation(language, 'otherLanguages'),
        getExportTranslation(language, 'summary'),
      ],
    ];

    candidates.forEach((c, index) => {
      worksheetData.push([
        index + 1,
        c.candidate_name,
        c.fit_score,
        c.experience_score,
        Math.round((c.experience_score / scoringParams.param1.max_score) * 100),
        c.skills_score,
        Math.round((c.skills_score / scoringParams.param2.max_score) * 100),
        c.location_score,
        Math.round((c.location_score / scoringParams.param3.max_score) * 100),
        c.english_score,
        Math.round((c.english_score / scoringParams.param4.max_score) * 100),
        c.years_experience,
        c.location,
        c.english_level,
        c.other_languages || '',
        c.summary,
      ]);
    });

    if (candidates.some(c => c.skill_breakdown && c.skill_breakdown.length > 0)) {
      worksheetData.push([]);
      worksheetData.push([getExportTranslation(language, 'skillBreakdown')]);
      worksheetData.push([]);

      candidates.forEach((c) => {
        if (c.skill_breakdown && c.skill_breakdown.length > 0) {
          worksheetData.push([c.candidate_name]);
          worksheetData.push([
            getExportTranslation(language, 'skill'),
            getExportTranslation(language, 'scorePercentage'),
            getExportTranslation(language, 'assessment')
          ]);
          c.skill_breakdown.forEach(skill => {
            worksheetData.push([skill.skill, skill.percentage, skill.assessment]);
          });
          worksheetData.push([]);
        }
      });
    }

    return { worksheetData, currentJob };
  };

  const exportToExcel = () => {
    const { worksheetData, currentJob } = prepareWorksheetData();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 50 },
    ];

    const boldCells = ['A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6', 'O6', 'P6'];
    boldCells.forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = { font: { bold: true } };
      }
    });

    candidates.forEach((_, index) => {
      const rowNum = index + 7;
      const cellsToMakeBold = ['C', 'L', 'M', 'N', 'P'];
      cellsToMakeBold.forEach(col => {
        const cell = `${col}${rowNum}`;
        if (worksheet[cell]) {
          worksheet[cell].s = { font: { bold: true } };
        }
      });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidate Rankings');

    XLSX.writeFile(workbook, `${currentJob?.title || 'candidates'}-rankings-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToGoogleSheets = () => {
    const { worksheetData, currentJob } = prepareWorksheetData();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 50 },
    ];

    const boldCells = ['A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6', 'O6', 'P6'];
    boldCells.forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = { font: { bold: true } };
      }
    });

    candidates.forEach((_, index) => {
      const rowNum = index + 7;
      const cellsToMakeBold = ['C', 'L', 'M', 'N', 'P'];
      cellsToMakeBold.forEach(col => {
        const cell = `${col}${rowNum}`;
        if (worksheet[cell]) {
          worksheet[cell].s = { font: { bold: true } };
        }
      });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidate Rankings');

    XLSX.writeFile(workbook, `${currentJob?.title || 'candidates'}-rankings-${new Date().toISOString().split('T')[0]}.xlsx`, { bookType: 'xlsx' });
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 bg-green-50';
    if (percentage >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSkillBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-600';
    if (score >= 50) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getScoringParams = () => {
    const currentJob = jobs.find(j => j.id === selectedJobId);
    if (!currentJob?.scoring_parameters) {
      return {
        param1: { name: 'Experience', max_score: 40 },
        param2: { name: 'Skills', max_score: 30 },
        param3: { name: 'Location', max_score: 15 },
        param4: { name: 'English', max_score: 15 },
      };
    }
    return currentJob.scoring_parameters;
  };

  const openSummaryModal = (name: string, summary: string) => {
    setSelectedSummary({ name, summary });
    setSummaryModalOpen(true);
  };

  const closeSummaryModal = () => {
    setSummaryModalOpen(false);
    setSelectedSummary(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('results.noJobsYet')}</h3>
        <p className="text-slate-600">{t('results.createJobMessage')}</p>
      </div>
    );
  }

  const scoringParams = getScoringParams();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200">
        <div className="flex space-x-1 overflow-x-auto">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedJobId === job.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {job.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {candidates.length > 0 && (
          <>
            <button
              onClick={clearAllResults}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>{t('results.clearAllResults')}</span>
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>{t('results.exportToExcel')}</span>
            </button>
            <button
              onClick={exportToGoogleSheets}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>{t('results.exportToGoogleSheets')}</span>
            </button>
          </>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('results.noResultsYet')}</h3>
          <p className="text-slate-600">{t('results.uploadCVsMessage')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-slate-600 mb-4">
            {t('results.showing')} {candidates.length} {candidates.length !== 1 ? t('results.candidates') : t('results.candidate')}
          </div>

          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full ${getFitScoreColor(
                      candidate.fit_score
                    )} flex items-center justify-center text-white font-bold text-lg`}
                  >
                    {candidate.fit_score}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {candidate.candidate_name}
                      </h3>
                      {index === 0 && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{candidate.jobs.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openSummaryModal(candidate.candidate_name, candidate.summary)}
                    className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title={t('results.viewSummary')}
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCandidate(candidate.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title={t('results.deleteResult')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === candidate.id ? null : candidate.id)
                    }
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {expandedId === candidate.id ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className={`p-3 rounded-lg ${getPercentageColor((candidate.experience_score / scoringParams.param1.max_score) * 100)}`}>
                  <p className="text-xs font-medium mb-1">{scoringParams.param1.name}</p>
                  <p className="text-lg font-bold">{Math.round((candidate.experience_score / scoringParams.param1.max_score) * 100)}%</p>
                </div>
                <div className={`p-3 rounded-lg ${getPercentageColor((candidate.skills_score / scoringParams.param2.max_score) * 100)}`}>
                  <p className="text-xs font-medium mb-1">{scoringParams.param2.name}</p>
                  <p className="text-lg font-bold">{Math.round((candidate.skills_score / scoringParams.param2.max_score) * 100)}%</p>
                </div>
                <div className={`p-3 rounded-lg ${getPercentageColor((candidate.location_score / scoringParams.param3.max_score) * 100)}`}>
                  <p className="text-xs font-medium mb-1">{scoringParams.param3.name}</p>
                  <p className="text-lg font-bold">{Math.round((candidate.location_score / scoringParams.param3.max_score) * 100)}%</p>
                </div>
                <div className={`p-3 rounded-lg ${getPercentageColor((candidate.english_score / scoringParams.param4.max_score) * 100)}`}>
                  <p className="text-xs font-medium mb-1">{scoringParams.param4.name}</p>
                  <p className="text-lg font-bold">{Math.round((candidate.english_score / scoringParams.param4.max_score) * 100)}%</p>
                </div>
              </div>

              {expandedId === candidate.id && (
                <div className="border-t border-slate-200 pt-4 space-y-4">
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">{t('results.experience')}</p>
                      <p className="font-semibold text-slate-900">
                        {candidate.years_experience} {t('results.years')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('results.location')}</p>
                      <p className="font-semibold text-slate-900">{candidate.location}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('results.englishLevel')}</p>
                      <p className="font-semibold text-slate-900">{candidate.english_level}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('results.expQuality')}</p>
                      <p className="font-semibold text-slate-900">{candidate.experience_quality_score || 0}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('results.confidence')}</p>
                      <p className="font-semibold text-slate-900">{candidate.confidence_level || 0}%</p>
                    </div>
                  </div>

                  {candidate.recommendation && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-700 text-sm font-semibold">{t('results.hiringRecommendation')}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          candidate.recommendation === 'strong_yes' ? 'bg-green-100 text-green-700' :
                          candidate.recommendation === 'yes' ? 'bg-green-50 text-green-600' :
                          candidate.recommendation === 'maybe' ? 'bg-yellow-50 text-yellow-600' :
                          candidate.recommendation === 'no' ? 'bg-red-50 text-red-600' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {candidate.recommendation.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {candidate.recommendation_reasoning}
                      </p>
                    </div>
                  )}

                  {candidate.key_strengths && candidate.key_strengths.length > 0 && (
                    <div>
                      <p className="text-slate-700 text-sm mb-2 font-semibold">{t('results.keyStrengths')}</p>
                      <ul className="space-y-1">
                        {candidate.key_strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {candidate.gaps && candidate.gaps.length > 0 && (
                    <div>
                      <p className="text-slate-700 text-sm mb-2 font-semibold">{t('results.gapsAndMissing')}</p>
                      <ul className="space-y-1">
                        {candidate.gaps.map((gap, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start">
                            <span className="text-yellow-500 mr-2">⚠</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {candidate.risk_factors && candidate.risk_factors.length > 0 && (
                    <div>
                      <p className="text-slate-700 text-sm mb-2 font-semibold">{t('results.riskFactors')}</p>
                      <ul className="space-y-1">
                        {candidate.risk_factors.map((risk, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start">
                            <span className="text-red-500 mr-2">✕</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {candidate.skill_breakdown && candidate.skill_breakdown.length > 0 && (
                    <div>
                      <p className="text-slate-700 text-sm mb-3 font-semibold">{t('results.skillBreakdown')}</p>
                      <div className="space-y-3">
                        {candidate.skill_breakdown.map((skill, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-700">{skill.skill}</span>
                              <span className={`font-bold ${
                                skill.percentage >= 75 ? 'text-green-600' :
                                skill.percentage >= 50 ? 'text-orange-600' :
                                'text-red-600'
                              }`}>
                                {skill.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getSkillBarColor(skill.percentage)}`}
                                style={{ width: `${skill.percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{skill.assessment}</p>
                            {skill.evidence && (
                              <p className="text-xs text-slate-500 italic mt-1">"{skill.evidence}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-slate-700 text-sm mb-2 font-semibold">{t('results.summary')}</p>
                    <p className="text-slate-900 text-sm leading-relaxed">
                      {candidate.summary}
                    </p>
                  </div>

                  {candidate.reasoning_chain && (
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <p className="text-blue-900 text-sm font-semibold">{t('results.detailedAnalysis')}</p>
                      <div className="space-y-2 text-sm">
                        {candidate.reasoning_chain.experience_reasoning && (
                          <div>
                            <p className="font-medium text-blue-800 mb-1">{t('results.experience')}:</p>
                            <p className="text-blue-700">{candidate.reasoning_chain.experience_reasoning}</p>
                          </div>
                        )}
                        {candidate.reasoning_chain.skills_reasoning && (
                          <div>
                            <p className="font-medium text-blue-800 mb-1">{t('results.skills')}:</p>
                            <p className="text-blue-700">{candidate.reasoning_chain.skills_reasoning}</p>
                          </div>
                        )}
                        {candidate.reasoning_chain.location_reasoning && candidate.reasoning_chain.location_reasoning !== 'Not applicable - remote position' && (
                          <div>
                            <p className="font-medium text-blue-800 mb-1">{t('results.location')}:</p>
                            <p className="text-blue-700">{candidate.reasoning_chain.location_reasoning}</p>
                          </div>
                        )}
                        {candidate.reasoning_chain.english_reasoning && (
                          <div>
                            <p className="font-medium text-blue-800 mb-1">{t('results.englishLevel')}:</p>
                            <p className="text-blue-700">{candidate.reasoning_chain.english_reasoning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {summaryModalOpen && selectedSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedSummary.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{t('results.candidateSummary')}</p>
              </div>
              <button
                onClick={closeSummaryModal}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
                {selectedSummary.summary}
              </p>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={closeSummaryModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
