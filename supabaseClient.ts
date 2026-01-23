import { createClient } from '@supabase/supabase-js';

// URL y Key proporcionadas por el usuario
const DEFAULT_URL = 'https://vyjbejnqyazopmtegwpe.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5amJlam5xeWF6b3BtdGVnd3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzE2NDIsImV4cCI6MjA4NDcwNzY0Mn0.5GFFXgJ1OlAHxZmPVJLaQOstb2IjsQ84wgSfZ-kQmEk';

// Priorizamos las variables del archivo .env, si no existen usamos las por defecto
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Exportamos el cliente inicializado
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.error("❌ Caporal 1961: Error crítico al inicializar Supabase. Verifique las llaves.");
} else {
  console.log("✅ Caporal 1961: Conexión con Supabase establecida correctamente.");
}