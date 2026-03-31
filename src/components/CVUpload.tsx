import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  english_level: string;
  minimum_experience: number;
  required_skills: string[];
}

interface CVUploadProps {
  selectedJobId: string | null;
}

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface Company {
  free_cvs_remaining: number;
  total_credits_purchased: number;
}

export function CVUpload({ selectedJobId: initialJobId }: CVUploadProps) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobId);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadJobs();
      loadCompany();
    }
  }, [user]);

  useEffect(() => {
    if (initialJobId) {
      setSelectedJobId(initialJobId);
    }
  }, [initialJobId]);

  const loadCompany = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('companies')
      .select('free_cvs_remaining, total_credits_purchased')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setCompany(data);
    }
  };

  const loadJobs = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) {
      setJobs(data);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const pdfDocxFiles = newFiles.filter(
      (file) =>
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
    );

    const uploadedFiles: UploadedFile[] = pdfDocxFiles.map((file) => ({
      file,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processCV = async (file: File, jobId: string): Promise<void> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user!.id}/${jobId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('cvs')
      .getPublicUrl(filePath);

    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .insert({
        job_id: jobId,
        company_id: user!.id,
        file_name: file.name,
        file_url: publicUrl,
        upload_status: 'pending',
      })
      .select()
      .single();

    if (cvError) throw cvError;

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-cv`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_id: cvData.id,
        file_url: publicUrl,
        language: language,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process CV');
    }
  };

  const getTotalAvailableCredits = () => {
    if (!company) return 0;
    return company.free_cvs_remaining + (company.total_credits_purchased || 0);
  };

  const hasEnoughCredits = (cvCount: number) => {
    return getTotalAvailableCredits() >= cvCount;
  };

  const handleUpload = async () => {
    if (!selectedJobId || files.length === 0 || !company) return;

    const pendingCount = files.filter(f => f.status === 'pending').length;

    if (!hasEnoughCredits(pendingCount)) {
      setShowUpgradeModal(true);
      return;
    }

    setProcessing(true);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading' } : f))
      );

      try {
        await processCV(files[i].file, selectedJobId);
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'success' } : f))
        );

        await loadCompany();
      } catch (error: any) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'error', error: error.message } : f
          )
        );
      }
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {company && getTotalAvailableCredits() <= 10 && company.free_cvs_remaining === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            You have {company.total_credits_purchased} purchased CVs remaining. Consider upgrading for more capacity.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('cvUpload.selectJob')}
          {company && (
            <span className="ml-2 text-sm text-slate-500">
              ({getTotalAvailableCredits()} CV{getTotalAvailableCredits() !== 1 ? 's' : ''} available)
            </span>
          )}
        </label>
        <select
          value={selectedJobId || ''}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={processing}
        >
          <option value="">{t('cvUpload.chooseJob')}</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.location}
            </option>
          ))}
        </select>
      </div>

      {selectedJobId && (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Select CV Files
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your CV files here or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              disabled={processing}
            />
            <label
              htmlFor="file-input"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Browse Files
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">
                {t('cvUpload.files')} ({files.length})
              </h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {file.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    {file.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                  {file.status === 'pending' && !processing && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-slate-600 ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={processing || files.every((f) => f.status !== 'pending')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Analyzing CVs...' : 'Analyze Selected CVs'}
                </button>
                {files.some((f) => f.status === 'success') && (
                  <button
                    onClick={() => setFiles([])}
                    className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg transition-colors"
                  >
                    {t('cvUpload.clear')}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Not Enough Credits</h3>
            <p className="text-slate-600 mb-6">
              You have {getTotalAvailableCredits()} CV{getTotalAvailableCredits() !== 1 ? 's' : ''} available, but are trying to upload {files.filter(f => f.status === 'pending').length}. Please upgrade your plan or use fewer CVs.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Choose Fewer CVs
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  window.location.href = 'https://billing.stripe.com';
                }}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg transition"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
