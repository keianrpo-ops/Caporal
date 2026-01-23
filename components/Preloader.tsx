
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-burgundy">
      <div className="relative flex flex-col items-center animate-fade-in">
        {/* Official Logo Replacement - Much Bigger */}
        <div className="mb-12 relative w-80 h-80 flex items-center justify-center">
           <img 
             src="/logo-caporal.png" 
             alt="Caporal 1961 Logo" 
             className="w-full h-full object-contain brightness-0 invert opacity-95 animate-pulse"
             onError={(e) => {
               (e.target as HTMLImageElement).style.display = 'none';
               (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="font-serif text-6xl text-bone tracking-tighter uppercase">CAPORAL</div>';
             }}
           />
           {/* Decorative ring - Adjusted to logo size */}
           <div className="absolute inset-0 border-[1px] border-bone/10 rounded-full scale-110 animate-ping"></div>
        </div>

        <div className="text-center text-bone">
          <span className="text-xs uppercase tracking-[0.8em] font-light block mb-4 opacity-60">BIENVENIDO A</span>
          <div className="flex items-center justify-center gap-6">
             <div className="h-[1px] w-16 bg-bone/20"></div>
             <span className="text-lg uppercase tracking-[0.5em] font-bold">LEGADO 1961</span>
             <div className="h-[1px] w-16 bg-bone/20"></div>
          </div>
          <p className="text-bone/40 font-serif italic mt-10 text-base tracking-[0.2em]">
            "Sintiendo la historia en cada bocado"
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-16 w-80 h-[1px] bg-white/5 overflow-hidden rounded-full">
        <div className="h-full bg-bone/40 animate-progress-indefinite"></div>
      </div>
      
      <style>{`
        @keyframes progress-indefinite {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indefinite {
          animation: progress-indefinite 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
