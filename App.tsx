import React, { useState, useEffect } from 'react';
// @ts-ignore
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CateringPage from './pages/Catering';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import { supabase } from './supabaseClient';
import Preloader from './components/Preloader';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // El modo demo solo se activa si no hay llaves válidas en absoluto
  const isDemo = !supabase;

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }).catch(err => {
        console.error("Error en sesión:", err);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Preloader />;

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-deepBlack bg-bone">
        {isDemo && (
          <div className="bg-red-600 text-white text-center text-[10px] font-black uppercase tracking-widest py-2 z-[60] fixed top-0 w-full shadow-xl">
            Atención: Sin conexión a base de datos. Verifique su archivo .env
          </div>
        )}
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cotizaciones" element={<CateringPage />} />
            <Route path="/perfil" element={user ? <ProfilePage user={user} /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={user?.email === 'admin@caporal.com' ? <AdminDashboard /> : <AdminLogin />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;