
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Phone, Users, Calendar, Utensils, Send, CheckCircle } from 'lucide-react';

const CateringPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    email: '',
    telefono: '',
    tipo_evento: 'Boda',
    fecha_evento: '',
    num_personas: 50,
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('cotizaciones_catering').insert([formData]);
    
    if (!error) {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 bg-bone text-center">
        <div className="max-w-2xl mx-auto bg-white p-16 shadow-2xl rounded-sm border-t-8 border-burgundy">
          <CheckCircle size={80} className="text-green-600 mx-auto mb-8" />
          <h1 className="text-4xl font-serif mb-6 uppercase">Solicitud Enviada</h1>
          <p className="text-stone-500 text-lg mb-10 leading-relaxed italic">
            Gracias por confiar en Caporal 1961 para su evento. Un coordinador de eventos se pondrá en contacto con usted en menos de 24 horas.
          </p>
          <button onClick={() => setSuccess(false)} className="bg-burgundy text-white px-12 py-4 uppercase tracking-widest text-sm font-bold">Volver al Formulario</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-bone">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="text-burgundy uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Servicios de Catering</span>
          <h1 className="text-6xl font-serif text-deepBlack mb-8 uppercase tracking-tighter leading-none">Eventos Inolvidables</h1>
          <p className="text-stone-600 text-xl font-light leading-relaxed mb-12 italic">
            Llevamos la experiencia de autor de Caporal 1961 a su ubicación preferida. Desde bodas íntimas hasta grandes eventos corporativos.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-burgundy transition-all">
                <Utensils className="text-burgundy group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-serif text-xl uppercase tracking-widest mb-2">Menú Personalizado</h4>
                <p className="text-stone-500 font-light">Diseñamos una propuesta gastronómica acorde a la temática de su evento.</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-burgundy transition-all">
                <Users className="text-burgundy group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-serif text-xl uppercase tracking-widest mb-2">Personal de Élite</h4>
                <p className="text-stone-500 font-light">Meseros, bartenders y chefs profesionales a su disposición.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 md:p-16 shadow-2xl rounded-sm border border-stone-100">
          <h2 className="text-3xl font-serif mb-10 text-center uppercase tracking-widest">Solicitar Cotización</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400">Nombre Completo</label>
                <input required className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none" value={formData.nombre_cliente} onChange={e => setFormData({...formData, nombre_cliente: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400">Email</label>
                <input type="email" required className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400">Teléfono</label>
                <input required className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400">Tipo de Evento</label>
                <select className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none bg-transparent" value={formData.tipo_evento} onChange={e => setFormData({...formData, tipo_evento: e.target.value})}>
                  <option>Boda</option>
                  <option>Corporativo</option>
                  <option>Cumpleaños</option>
                  <option>Aniversario</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400">Fecha Tentativa</label>
                <input type="date" className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none" value={formData.fecha_evento} onChange={e => setFormData({...formData, fecha_evento: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400">Número de Personas</label>
                <input type="number" className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none" value={formData.num_personas} onChange={e => setFormData({...formData, num_personas: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400">Detalles adicionales</label>
              <textarea className="w-full p-4 border-b-2 border-stone-200 focus:border-burgundy outline-none h-32" value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-burgundy text-white py-5 uppercase tracking-[0.3em] font-bold hover:bg-burgundy/80 transition-all shadow-xl flex items-center justify-center gap-4">
              {loading ? 'Procesando...' : <><Send size={18} /> Enviar Solicitud</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CateringPage;
