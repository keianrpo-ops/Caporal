
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, UserPlus, Mail, Lock, Phone, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        navigate('/perfil');
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { nombre: name, celular: phone }
          }
        });
        if (signUpError) throw signUpError;
        
        // Initial profile creation
        if (data.user) {
          await supabase.from('perfiles_clientes').insert([{
            id: data.user.id,
            nombre: name,
            celular: phone,
            puntos: 100 // Welcome points
          }]);
        }
        alert('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-deepBlack flex items-center justify-center">
      <div className="max-w-xl w-full grid grid-cols-1 lg:grid-cols-2 bg-bone shadow-2xl rounded-sm overflow-hidden">
        {/* Banner */}
        <div className="hidden lg:block bg-burgundy p-12 text-bone relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')] bg-cover"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-serif mb-6 uppercase tracking-tighter">Únete al Legado</h2>
            <p className="font-light italic mb-8 opacity-80">
              "Cada visita cuenta, cada momento se premia".
            </p>
            <ul className="space-y-4 text-sm font-light uppercase tracking-widest">
              <li className="flex items-center gap-3">✓ 15% Desc. Registro</li>
              <li className="flex items-center gap-3">✓ Puntos por Visita</li>
              <li className="flex items-center gap-3">✓ Menús Exclusivos</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="p-10 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif uppercase tracking-widest text-deepBlack">
              {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
            </h1>
            <div className="w-12 h-1 bg-burgundy mx-auto mt-4"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                    <input required className="w-full pl-6 py-2 border-b border-stone-200 outline-none focus:border-burgundy bg-transparent" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                    <input required className="w-full pl-6 py-2 border-b border-stone-200 outline-none focus:border-burgundy bg-transparent" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                <input type="email" required className="w-full pl-6 py-2 border-b border-stone-200 outline-none focus:border-burgundy bg-transparent" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                <input type="password" required className="w-full pl-6 py-2 border-b border-stone-200 outline-none focus:border-burgundy bg-transparent" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-red-600 text-[10px] uppercase font-bold italic">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-deepBlack text-bone py-4 uppercase tracking-[0.2em] font-bold hover:bg-burgundy transition-all flex items-center justify-center gap-3">
              {loading ? 'Cargando...' : <>{isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} {isLogin ? 'Ingresar' : 'Registrarme'}</>}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-8 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-burgundy transition-colors text-center"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya eres miembro? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
