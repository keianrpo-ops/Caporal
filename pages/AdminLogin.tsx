
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deepBlack flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-bone p-10 rounded-lg shadow-2xl border border-burgundy/20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-burgundy text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-serif text-deepBlack tracking-tighter uppercase">Admin Panel</h1>
          <p className="text-stone-500 text-sm mt-2 italic tracking-wide">Exclusivo para Gerencia Caporal 1961</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border-b-2 border-stone-200 focus:border-burgundy outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border-b-2 border-stone-200 focus:border-burgundy outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm italic">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-4 uppercase tracking-[0.2em] font-semibold hover:bg-burgundy/80 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'Verificando...' : (
              <>
                <LogIn size={18} />
                Ingresar al Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
