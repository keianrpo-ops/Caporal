import React from 'react';
import { motion } from 'framer-motion';
import ReservationForm from '../components/ReservationForm';
import { ChefHat, History, Award, Star, ArrowRight, MapPin, Dog, Leaf, Camera, Coffee, Compass } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';
// Importamos los activos necesarios para asegurar compatibilidad con Vercel
// @ts-ignore
import ritualCampoImg from '../ritual-campo.jpg';
// @ts-ignore
import logoCaporal from '../logo-caporal.png';

const Home: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden bg-bone">
      {/* Hero Section - Refined Proportions */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 parallax-bg opacity-60 bg-fixed bg-center bg-cover scale-105" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070")' }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-deepBlack via-deepBlack/40 to-deepBlack z-1"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
             <div className="h-[1px] w-8 bg-burgundy"></div>
             <span className="text-bone font-serif italic text-xs uppercase tracking-[0.4em]">Cocina de Autor & Mixología</span>
             <div className="h-[1px] w-8 bg-burgundy"></div>
          </motion.div>

          {/* LOGO REDUCIDO - De 700px a 500px para mayor elegancia */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-12 flex justify-center"
          >
            <img 
              src={logoCaporal} 
              alt="Caporal 1961 Logo" 
              className="w-[280px] md:w-[480px] h-auto object-contain drop-shadow-[0_0_30px_rgba(128,0,32,0.6)] invert brightness-[2] transition-all duration-700 hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const h1 = document.createElement('h1');
                  h1.className = "text-6xl md:text-8xl font-serif text-bone tracking-tighter uppercase";
                  h1.innerText = "CAPORAL 1961";
                  parent.appendChild(h1);
                }
              }}
            />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-bone/80 max-w-2xl mx-auto font-serif italic text-lg md:text-xl leading-relaxed tracking-[0.1em] mb-16"
          >
            "Sintiendo la historia en cada bocado, destilando elegancia en cada plato o bebida"
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => scrollToSection('reservas')} 
              className="group relative overflow-hidden bg-burgundy text-white px-12 py-5 rounded-sm transition-all uppercase tracking-[0.3em] text-[10px] font-black shadow-xl border border-burgundy"
            >
              <span className="relative z-10">Agendar Ritual</span>
              <div className="absolute inset-0 bg-deepBlack translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
            
            <Link 
              to="/menu"
              className="border border-white/20 text-bone px-12 py-5 rounded-sm hover:bg-white hover:text-deepBlack transition-all uppercase tracking-[0.3em] text-[10px] font-black backdrop-blur-md"
            >
              Explorar Carta
            </Link>
          </div>
        </motion.div>
      </section>

      {/* EcoParadise Integration - Altura ajustada de py-48 a py-24 */}
      <section id="ecoparadise" className="py-24 bg-deepBlack text-bone relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <span className="text-burgundy text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
                  <MapPin size={14} /> Km 12 Vía Pereira - Armenia
               </span>
               <h2 className="text-5xl md:text-6xl font-serif uppercase tracking-tighter leading-none">El Ritual del Campo</h2>
               <p className="text-stone-400 text-lg font-light italic leading-relaxed border-l-2 border-burgundy pl-8">
                 "Ubicados dentro de EcoParadise Pereira, Caporal 1961 fusiona la elegancia de la arquitectura colonial con la serenidad de los bosques risaraldenses."
               </p>
               
               <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="p-6 border border-white/5 bg-white/5 rounded-sm flex flex-col gap-3 group hover:border-burgundy transition-all">
                     <Dog size={22} className="text-burgundy" />
                     <h4 className="font-serif text-base uppercase tracking-widest">Pet-Friendly Elite</h4>
                     <p className="text-stone-500 text-xs italic">Cuidado exclusivo para su compañero.</p>
                  </div>
                  <div className="p-6 border border-white/5 bg-white/5 rounded-sm flex flex-col gap-3 group hover:border-burgundy transition-all">
                     <Compass size={22} className="text-burgundy" />
                     <h4 className="font-serif text-base uppercase tracking-widest">Destino de Autor</h4>
                     <p className="text-stone-500 text-xs italic">Un escape gastronómico excepcional.</p>
                  </div>
               </div>
            </div>
            <div className="relative">
              <img 
                src={ritualCampoImg} 
                className="relative z-10 w-full h-[450px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 shadow-3xl"
                alt="Caporal 1961"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ecoparadisepereira.com/wp-content/uploads/2023/11/Eco-Paradise-Habitaciones-Suite.jpg";
                }}
              />
              <div className="absolute -bottom-8 -left-8 bg-burgundy p-8 shadow-2xl z-20">
                 <p className="font-serif text-2xl uppercase tracking-tighter leading-none">Tradición &</p>
                 <p className="font-serif text-2xl uppercase tracking-tighter leading-none">Bienestar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión con escala reducida */}
      <section className="py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-12 shadow-xl border-t-8 border-burgundy transition-all">
            <Award size={32} className="text-burgundy mb-6" />
            <h3 className="text-3xl font-serif uppercase mb-4 tracking-tighter">Misión</h3>
            <p className="text-stone-500 text-lg font-light italic leading-relaxed">
              "Preservar la herencia culinaria desde 1961, ofreciendo cocina de autor que rinde homenaje a nuestras raíces mediante técnicas contemporáneas."
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-deepBlack text-bone p-12 shadow-xl border-t-8 border-burgundy transition-all">
            <Star size={32} className="text-burgundy mb-6" />
            <h3 className="text-3xl font-serif uppercase mb-4 tracking-tighter">Visión</h3>
            <p className="text-stone-400 text-lg font-light italic leading-relaxed">
              "Ser el referente regional de alta cocina de autor, reconocidos por la armonía entre arquitectura, campo e innovación."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reservas con escala reducida */}
      <section id="reservas" className="py-24 bg-stone-100 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">Gestión VIP</span>
            <h2 className="text-5xl md:text-6xl font-serif text-deepBlack mb-6 uppercase tracking-tighter leading-none">Su lugar en la Casona</h2>
            <p className="text-stone-500 italic text-xl font-light">Especifique si viaja con mascota para su recibimiento.</p>
          </div>
          <ReservationForm />
        </div>
      </section>
    </div>
  );
};

export default Home;