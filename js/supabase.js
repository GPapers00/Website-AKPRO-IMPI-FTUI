// js/supabase.js
const supabaseUrl = 'https://yuowevnqampepskwlgbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b3dldm5xYW1wZXBza3dsZ2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzkyNTAsImV4cCI6MjA5NzcxNTI1MH0.MX2tsfgkPEazK-pdPeXfXi8vyfdmSZ5cIdRsmTlDKQs';

export const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
  console.error("Supabase library not loaded. Ensure the CDN script is present in index.html.");
}
