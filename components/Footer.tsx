
import React from 'react';
import { Phone, Instagram, Facebook, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deepBlack text-bone py-16 border-t border-burgundy/30">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-serif text-2xl mb-6 tracking-widest uppercase">Caporal 1961</h3>
          <p className="text-stone-400 mb-6 font-light leading-relaxed">
            "Historia y cocina de autor". Un espacio donde la tradición colonial se encuentra con la gastronomía contemporánea.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-burgundy transition-colors"><Instagram /></a>
            <a href="#" className="hover:text-burgundy transition-colors"><Facebook /></a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6 uppercase tracking-widest">Contacto</h4>
          <ul className="space-y-4 text-stone-400">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-burgundy" />
              <span>321 891 22 46</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-burgundy" />
              <span>A 400 mts - Sector La Casona</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-burgundy" />
              <span>Lunes a Domingo | 11:30 AM - 10:00 PM</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6 uppercase tracking-widest">Reserva Tu Mesa</h4>
          <p className="text-stone-400 mb-6 font-light">
            Vive una experiencia única. Recomendamos reservar con anticipación para los fines de semana.
          </p>
          <a
            href="https://wa.me/573218912246"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-burgundy text-white px-8 py-3 rounded-sm uppercase tracking-widest text-sm hover:bg-burgundy/80 transition-all"
          >
            Escríbenos al WhatsApp
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-800 text-center text-stone-600 text-sm">
        &copy; {new Date().getFullYear()} Caporal 1961. Todos los derechos reservados. | Diseñado por Senior Full-Stack Dev.
      </div>
    </footer>
  );
};

export default Footer;
