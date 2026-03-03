import React, { useState } from 'react';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, UtensilsCrossed } from 'lucide-react';
// Importamos el logo directamente para que Vercel lo reconozca
// @ts-ignore
import logoCaporal from '../logo-caporal.png';

interface NavbarProps {
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menú', path: '/menu' },
    { name: 'Reservas', path: '/#reservas' },
    { name: 'Eventos', path: '/cotizaciones' },
    { name: 'Experiencias', path: '/#experiencias' },
  ];

  const isActive = (path: string) => location.pathname === path || (location.hash && path.includes(location.hash));

  return (
    <nav className="fixed w-full z-50 bg-deepBlack/95 backdrop-blur-md text-bone border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Brand Logo - Tamaño más equilibrado */}
          <Link to="/" className="flex items-center gap-4 group h-full py-4">
             <img 
               src={logoCaporal} 
               alt="Caporal 1961 Logo" 
               className="h-72 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(128,0,32,0.4)]" 
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 const parent = (e.target as HTMLImageElement).parentElement;
                 if (parent && !parent.querySelector('.fallback-text')) {
                   const span = document.createElement('span');
                   span.className = 'fallback-text font-serif text-xl tracking-tighter uppercase text-bone';
                   span.innerHTML = 'CAPORAL <span class="text-burgundy">1961</span>';
                   parent.appendChild(span);
                 }
               }}
             />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path.startsWith('/#') ? '/' : link.path}
                onClick={() => {
                  if (link.path.startsWith('/#')) {
                    setTimeout(() => {
                      const id = link.path.substring(2);
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className={`transition-all hover:text-burgundy tracking-[0.2em] text-[10px] font-black uppercase border-b-2 border-transparent hover:border-burgundy pb-2 ${
                  isActive(link.path) ? 'text-burgundy border-burgundy' : 'text-bone/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons Area */}
          <div className="flex items-center gap-6">
            <Link 
              to="/menu" 
              className="hidden lg:flex items-center gap-3 bg-burgundy px-5 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-burgundy transition-all shadow-lg"
            >
              <UtensilsCrossed size={12} />
              Pedido Online
            </Link>

            <Link to={user ? "/perfil" : "/auth"} className="text-stone-400 hover:text-burgundy transition-all flex items-center gap-3 group">
              <div className={`p-1.5 rounded-full border border-stone-800 transition-all group-hover:border-burgundy ${user ? 'bg-burgundy/20 border-burgundy text-burgundy' : ''}`}>
                <User size={18} />
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-[8px] uppercase tracking-widest font-black group-hover:text-bone transition-colors">
                  {user ? 'Mi Cuenta' : 'Ingresar'}
                </span>
              </div>
            </Link>
            
            <Link to="/menu" className="relative text-stone-400 hover:text-burgundy transition-all p-1.5 rounded-full border border-stone-800 hover:border-burgundy">
              <ShoppingBag size={18} />
            </Link>

            <div className="xl:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-bone hover:text-burgundy p-2 transition-transform active:scale-90">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="xl:hidden bg-deepBlack/98 border-t border-burgundy/20 animate-fade-in-down h-screen overflow-y-auto">
          <div className="px-6 py-12 space-y-6 text-center">
            <Link to="/menu" onClick={() => setIsOpen(false)} className="block py-4 bg-burgundy text-bone text-lg font-black uppercase tracking-widest">Pedido en Línea</Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path.startsWith('/#') ? '/' : link.path}
                onClick={() => {
                  setIsOpen(false);
                  if (link.path.startsWith('/#')) {
                    setTimeout(() => {
                      const id = link.path.substring(2);
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="block py-4 text-lg font-bold tracking-[0.3em] uppercase text-bone border-b border-white/5 hover:text-burgundy transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;