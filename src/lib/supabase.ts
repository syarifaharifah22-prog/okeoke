import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase (Hardcoded untuk Mode Lama/Simpel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gvfochmzjuahllchsfnj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xn958AIh1ukFzqy_3_isxg_ddz9vYZ3';

// Check if configuration is available
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize Supabase client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
