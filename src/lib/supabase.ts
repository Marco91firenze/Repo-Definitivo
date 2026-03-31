import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          company_name: string;
          vat_number: string | null;
          email: string;
          free_cvs_remaining: number;
          total_cvs_processed: number;
          created_at: string;
        };
        Insert: {
          id: string;
          company_name: string;
          vat_number?: string | null;
          email: string;
          free_cvs_remaining?: number;
          total_cvs_processed?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          vat_number?: string | null;
          email?: string;
          free_cvs_remaining?: number;
          total_cvs_processed?: number;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          location: string | null;
          english_level: string | null;
          minimum_experience: number;
          required_skills: string[];
          description: string | null;
          status: 'active' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          location?: string | null;
          english_level?: string | null;
          minimum_experience?: number;
          required_skills?: string[];
          description?: string | null;
          status?: 'active' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          location?: string | null;
          english_level?: string | null;
          minimum_experience?: number;
          required_skills?: string[];
          description?: string | null;
          status?: 'active' | 'completed';
          created_at?: string;
        };
      };
      cvs: {
        Row: {
          id: string;
          job_id: string;
          company_id: string;
          file_name: string;
          file_url: string;
          linkedin_url: string | null;
          extracted_text: string | null;
          upload_status: 'pending' | 'processing' | 'completed' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          company_id: string;
          file_name: string;
          file_url: string;
          linkedin_url?: string | null;
          extracted_text?: string | null;
          upload_status?: 'pending' | 'processing' | 'completed' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          company_id?: string;
          file_name?: string;
          file_url?: string;
          linkedin_url?: string | null;
          extracted_text?: string | null;
          upload_status?: 'pending' | 'processing' | 'completed' | 'failed';
          created_at?: string;
        };
      };
      cv_analyses: {
        Row: {
          id: string;
          cv_id: string;
          job_id: string;
          candidate_name: string | null;
          fit_score: number;
          experience_score: number;
          skills_score: number;
          location_score: number;
          english_score: number;
          years_experience: number;
          location: string | null;
          english_level: string | null;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          job_id: string;
          candidate_name?: string | null;
          fit_score?: number;
          experience_score?: number;
          skills_score?: number;
          location_score?: number;
          english_score?: number;
          years_experience?: number;
          location?: string | null;
          english_level?: string | null;
          summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cv_id?: string;
          job_id?: string;
          candidate_name?: string | null;
          fit_score?: number;
          experience_score?: number;
          skills_score?: number;
          location_score?: number;
          english_score?: number;
          years_experience?: number;
          location?: string | null;
          english_level?: string | null;
          summary?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
