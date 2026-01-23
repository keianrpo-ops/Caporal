import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  LogIn, 
  Lock, 
  AlertCircle, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  Key,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@caporal.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('SISTEMA OFFLINE: Cliente de Supabase no detectado.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (loginError) {
        setAttempts(prev => prev + 1);
        if (loginError.message.includes('Email not confirmed')) {
          setError('ACCESO BLOQUEADO: El correo admin@caporal.com no ha sido confirmado en Supabase.');
        } else if (loginError.message.includes('Invalid login credentials')) {
          setError('CREDENCIALES INVÁLIDAS: La llave maestra no coincide con nuestros registros.');
        } else {
          setError(loginError.message);
        }
        throw loginError;
      }
      
      // El re-render por el cambio de estado de auth en App.tsx hará el resto
      console.log("Acceso de Gerencia validado exitosamente.");
    } catch (err: any) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deepBlack flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Fondo Decorativo Sutil */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-burgundy rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-burgundy rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-bone p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-burgundy/20 rounded-sm">
          
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
               <div className="w-24 h-24 bg-deepBlack text-burgundy rounded-full flex items-center justify-center shadow-2xl border-2 border-burgundy/30 animate-pulse">
                <ShieldCheck size={48} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-burgundy text-white p-2 rounded-full shadow-xl">
                 <Lock size={16} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-deepBlack uppercase tracking-tighter leading-none mb-4">Gerencia Central</h1>
            <p className="text-burgundy text-[11px] font-black uppercase tracking-[0.6em] italic">Acceso Restringido - Legado 1961</p>
            <div className="w-24 h-[2px] bg-burgundy/20 mx-auto mt-8"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 flex items-center gap-3">
                <Key size={12} className="text-burgundy" /> Identidad Administrativa
              </label>
              <input
                type="email"
                required
                className="w-full px-6 py-4 border-b-2 border-stone-200 focus:border-burgundy outline-none transition-all bg-stone-50/50 font-serif text-xl italic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 flex items-center gap-3">
                <Lock size={12} className="text-burgundy" /> Contraseña Maestra
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full px-6 py-4 border-b-2 border-stone-200 focus:border-burgundy outline-none transition-all bg-stone-50/50 font-black text-2xl tracking-[0.3em]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 p-6 border-l-4 border-red-600 animate-shake">
                <div className="flex items-center gap-3 text-red-600 font-black text-[11px] uppercase tracking-widest mb-2">
                  <AlertCircle size={16} /> Error de Autenticación
                </div>
                <p className="text-[12px] text-red-700 leading-relaxed italic font-serif">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deepBlack text-bone py-6 uppercase tracking-[0.8em] font-black hover:bg-burgundy transition-all shadow-2xl flex items-center justify-center gap-6 group disabled:opacity-50 overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-4">
                {loading ? 'Validando...' : 'Ingresar al Dashboard'}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-4 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-burgundy translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>

          {/* Sección de Ayuda Dinámica */}
          {(attempts >= 2 || error) && (
            <div className="mt-12 pt-8 border-t border-stone-100 animate-fade-in">
              <button 
                onClick={() => setShowRecovery(!showRecovery)}
                className="w-full flex items-center justify-between text-stone-400 hover:text-burgundy transition-colors group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  <HelpCircle size={14} /> ¿Problemas con la llave maestra?
                </span>
                <ChevronDown size={16} className={`transition-transform ${showRecovery ? 'rotate-180' : ''}`} />
              </button>
              
              {showRecovery && (
                <div className="mt-6 space-y-6 bg-stone-50 p-6 border border-stone-100 rounded-sm">
                  <div className="flex items-start gap-4">
                    <Database size={24} className="text-burgundy shrink-0 mt-1" />
                    <div className="space-y-4">
                      <p className="text-[11px] text-stone-500 uppercase font-bold leading-relaxed tracking-wider">
                        Para resetear la clave manualmente, ejecute este comando en el <strong className="text-deepBlack">SQL Editor de Supabase</strong>:
                      </p>
                      <div className="bg-deepBlack text-green-400 p-4 rounded text-[10px] font-mono overflow-x-auto shadow-inner border border-white/5">
                        UPDATE auth.users<br/>
                        SET encrypted_password = crypt('NUEVA_CLAVE', gen_salt('bf'))<br/>
                        WHERE email = 'admin@caporal.com';
                      </div>
                      <p className="text-[10px] text-stone-400 italic font-serif">
                        * Recuerde que admin@caporal.com es una cuenta de sistema interna.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
           <button 
             onClick={() => navigate('/')}
             className="text-stone-500 hover:text-burgundy text-[10px] font-black uppercase tracking-[0.5em] transition-all"
           >
             ← Volver a la Casona
           </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;