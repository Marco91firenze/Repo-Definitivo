import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { JobForm } from './JobForm';
import { JobList } from './JobList';
import { CVUpload } from './CVUpload';
import { ResultsDashboard } from './ResultsDashboard';
import LanguageSelector from './LanguageSelector';
import { LogOut, Briefcase, Upload, BarChart3 } from 'lucide-react';

type View = 'jobs' | 'upload' | 'results';

interface Company {
  company_name: string;
  free_cvs_remaining: number;
  total_cvs_processed: number;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [view, setView] = useState<View>('jobs');
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [refreshJobs, setRefreshJobs] = useState(0);

  useEffect(() => {
    if (user) {
      loadCompany();
    }
  }, [user]);

  const loadCompany = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('companies')
      .select('company_name, free_cvs_remaining, total_cvs_processed')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setCompany(data);
    }
  };

  const handleJobCreated = () => {
    setView('jobs');
    setRefreshJobs(prev => prev + 1);
  };

  const handleJobSelected = (jobId: string) => {
    setSelectedJobId(jobId);
    setView('upload');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">CV Fit Check</h1>
                {company && (
                  <p className="text-xs text-slate-500">{company.company_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <LanguageSelector />
              {company && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-right">
                    <p className="text-slate-500">Free CVs Remaining</p>
                    <p className="font-semibold text-slate-900">{company.free_cvs_remaining}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500">Total Processed</p>
                    <p className="font-semibold text-slate-900">{company.total_cvs_processed}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('dashboard.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 mb-8 bg-white p-1 rounded-lg shadow-sm inline-flex">
          <button
            onClick={() => setView('jobs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              view === 'jobs'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>{t('dashboard.jobPosting')}</span>
          </button>
          <button
            onClick={() => setView('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              view === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>{t('dashboard.uploadCVs')}</span>
          </button>
          <button
            onClick={() => setView('results')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              view === 'results'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>{t('dashboard.results')}</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {view === 'jobs' && (
            <div className="space-y-8">
              <JobForm onJobCreated={handleJobCreated} />
              <JobList key={refreshJobs} onJobSelected={handleJobSelected} />
            </div>
          )}
          {view === 'upload' && <CVUpload selectedJobId={selectedJobId} />}
          {view === 'results' && <ResultsDashboard />}
        </div>
      </div>
    </div>
  );
}
