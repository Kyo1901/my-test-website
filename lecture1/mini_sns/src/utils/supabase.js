import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cizusiaqkymgiicmgsqs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpenVzaWFxa3ltZ2lpY21nc3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzI4NzcsImV4cCI6MjA4NjQwODg3N30.WoJaHb4RNLzbxJuolv1pZfh0zkfOiCcyEMCITeqd4vs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
