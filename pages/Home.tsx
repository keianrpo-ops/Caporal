
import React from 'react';
import { motion } from 'framer-motion';
import ReservationForm from '../components/ReservationForm';
import { ChefHat, History, Award, Star, ArrowRight, MapPin, Dog, Leaf, Camera, Coffee, Compass } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden bg-bone">
      {/* Hero Section - Eco-Luxury Elevation */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 parallax-bg opacity-40 bg-fixed bg-center bg-cover scale-110" 
          style={{ backgroundImage: 'url("https://ecoparadisepereira.com/wp-content/uploads/2023/11/Eco-Paradise-Home-Hero.jpg")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-deepBlack/95 via-deepBlack/60 to-bone/10 z-1"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center px-4"
        >
          <div className="flex items-center justify-center gap-4 mb-10 opacity-70">
             <Leaf size={16} className="text-burgundy" />
             <span className="text-bone font-serif italic text-sm tracking-[0.5em] uppercase">Santuario Rural @ EcoParadise</span>
             <Leaf size={16} className="text-burgundy" />
          </div>

          <h1 className="text-8xl md:text-[13rem] font-serif text-bone tracking-tighter uppercase leading-none mb-6">
            Caporal
          </h1>
          
          <div className="flex items-center justify-center gap-8 mb-16">
            <div className="h-[1px] w-24 bg-burgundy/40"></div>
            <span className="text-burgundy font-bold text-4xl tracking-widest">1961</span>
            <div className="h-[1px] w-24 bg-burgundy/40"></div>
          </div>
          
          <p className="text-bone/80 max-w-2xl mx-auto font-serif italic text-2xl md:text-3xl leading-relaxed tracking-[0.15em] mb-20">
            "Alta cocina de autor en el corazón del paisaje cafetero"
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button 
              onClick={() => scrollToSection('reservas')} 
              className="bg-burgundy text-white px-16 py-6 rounded-sm hover:scale-105 transition-all uppercase tracking-[0.4em] text-[10px] font-black shadow-2xl border border-burgundy"
            >
              Agendar Experiencia
            </button>
            <button 
              onClick={() => scrollToSection('ecoparadise')} 
              className="border border-white/20 text-bone px-16 py-6 rounded-sm hover:bg-white hover:text-deepBlack transition-all uppercase tracking-[0.4em] text-[10px] font-black backdrop-blur-sm"
            >
              Ubicación Rural
            </button>
          </div>
        </motion.div>
      </section>

      {/* EcoParadise Integration - Lujo Rural */}
      <section id="ecoparadise" className="py-48 bg-deepBlack text-bone relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
               <span className="text-burgundy text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
                  <MapPin size={16} /> Km 12 Vía Pereira - Armenia
               </span>
               <h2 className="text-7xl md:text-8xl font-serif uppercase tracking-tighter leading-none">El Ritual del Campo</h2>
               <p className="text-stone-400 text-2xl font-light italic leading-relaxed border-l-4 border-burgundy pl-12">
                 "Ubicados dentro de EcoParadise Pereira, Caporal 1961 fusiona la elegancia de la arquitectura colonial con la serenidad de los bosques risaraldenses."
               </p>
               
               <div className="grid grid-cols-2 gap-8 pt-10">
                  <div className="p-8 border border-white/5 bg-white/5 rounded-sm flex flex-col gap-4 group hover:border-burgundy transition-all">
                     <Dog size={28} className="text-burgundy" />
                     <h4 className="font-serif text-lg uppercase tracking-widest">Pet-Friendly Elite</h4>
                     <p className="text-stone-500 text-sm italic">Prepararemos un rincón de confort para su compañero.</p>
                  </div>
                  <div className="p-8 border border-white/5 bg-white/5 rounded-sm flex flex-col gap-4 group hover:border-burgundy transition-all">
                     <Compass size={28} className="text-burgundy" />
                     <h4 className="font-serif text-lg uppercase tracking-widest">Destino de Autor</h4>
                     <p className="text-stone-500 text-sm italic">Un escape gastronómico a minutos de la ciudad.</p>
                  </div>
               </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 border-[20px] border-white/5 -m-10 z-0"></div>
              
              {/* === LA RUTA AHORA APUNTA A TU ARCHIVO LOCAL === */}
              <img 
                src="/ritual-campo.jpg" 
                className="relative z-10 w-full h-[650px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 shadow-3xl"
                alt="Caporal 1961 - Experiencia Ritual del Campo"
                onError={(e) => {
                  // Fallback por si aún no has movido la foto
                  (e.target as HTMLImageElement).src = "https://ecoparadisepereira.com/wp-content/uploads/2023/11/Eco-Paradise-Habitaciones-Suite.jpg";
                }}
              />
              {/* ================================================ */}

              <div className="absolute -bottom-12 -left-12 bg-burgundy p-12 shadow-2xl z-20">
                 <p className="font-serif text-4xl uppercase tracking-tighter leading-none">Tradición &</p>
                 <p className="font-serif text-4xl uppercase tracking-tighter leading-none">Bienestar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión de Autor */}
      <section className="py-48 bg-bone">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20">
          <motion.div whileHover={{ y: -10 }} className="bg-white p-20 shadow-2xl border-t-[10px] border-burgundy transition-all duration-500">
            <Award size={40} className="text-burgundy mb-10" />
            <h3 className="text-5xl font-serif uppercase mb-8 tracking-tighter">Misión</h3>
            <p className="text-stone-500 text-2xl font-light italic leading-relaxed">
              "Preservar y evolucionar la herencia culinaria desde 1961, ofreciendo una cocina de autor que rinde homenaje a nuestras raíces a través de técnicas contemporáneas y un servicio excepcional."
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="bg-deepBlack text-bone p-20 shadow-2xl border-t-[10px] border-burgundy transition-all duration-500">
            <Star size={40} className="text-burgundy mb-10" />
            <h3 className="text-5xl font-serif uppercase mb-8 tracking-tighter">Visión</h3>
            <p className="text-stone-400 text-2xl font-light italic leading-relaxed">
              "Convertirnos en el referente regional de la alta cocina de autor, siendo reconocidos por la armonía entre la arquitectura colonial, el campo y la innovación gastronómica."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reservas con Sección Pet-Friendly */}
      <section id="reservas" className="py-48 bg-stone-100 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-24">
            <span className="text-burgundy uppercase tracking-[0.5em] text-[11px] font-black mb-6 block">Gestión de Mesa VIP</span>
            <h2 className="text-7xl md:text-8xl font-serif text-deepBlack mb-8 uppercase tracking-tighter leading-none">Su lugar en la Casona</h2>
            <p className="text-stone-500 italic text-2xl font-light">"Especifique si viaja con su mascota para preparar su recibimiento".</p>
          </div>
          <ReservationForm />
          
          <div className="mt-20 flex flex-col items-center gap-8">
             <div className="flex items-center gap-4 bg-white px-10 py-5 rounded-full shadow-xl border border-burgundy/10 group hover:border-burgundy transition-all cursor-default">
                <Dog size={24} className="text-burgundy group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-deepBlack">Anfitrión Pet-Friendly Autorizado</span>
             </div>
             <p className="text-stone-400 text-xs font-serif italic">Atención directa: 321 891 22 46</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
