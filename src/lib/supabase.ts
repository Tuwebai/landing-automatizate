import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sriqywlzziebjhrwrtar.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXF5d2x6emllYmpocndydGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMDQ5NTMsImV4cCI6MjA4Mzg4MDk1M30.ZooDNn9-rCy21AzyCnA2-iXO79v2CrG7SRg6J_FS8Vc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
