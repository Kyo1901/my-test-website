import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cizusiaqkymgiicmgsqs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpenVzaWFxa3ltZ2lpY21nc3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzI4NzcsImV4cCI6MjA4NjQwODg3N30.WoJaHb4RNLzbxJuolv1pZfh0zkfOiCcyEMCITeqd4vs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
