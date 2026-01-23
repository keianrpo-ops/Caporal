import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  CheckCircle2, Dog, Bed, Sparkles, Loader2, UtensilsCrossed, 
  ShoppingBag, Calendar, Clock, Star
} from 'lucide-react';
import { MenuItem, Room } from '../types';

const durationOptions = [
  { label: "Solo Mesa (Experiencia Comida)", value: "Solo Mesa" },
  { label: "Pasadía de Autor (Mesa + 4h de Suite)", value: "Pasadía (4h)" },
  { label: "Ritual Nocturno (Hospedaje Completo)", value: "Noche Completa" }
];

const ReservationForm: React.FC = () => {
  const [isExperience, setIsExperience] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [preSelectedDishes, setPreSelectedDishes] = useState<MenuItem[]>([]);
  
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    fecha: todayStr,
    hora: '12:00',
    personas: 2,
    con_mascota: false,
    numero_mascotas: 1,
    nombre_mascota: '',
    es_experiencia_especial: false,
    incluye_alojamiento: false,
    tipo_alojamiento: '',
    duracion_estancia: durationOptions[0].value,
    detalles_especiales: ''
  });

  useEffect(() => {
    checkUser();
    fetchRooms();
    const saved = localStorage.getItem('caporal_mesa_previa');
    if (saved) {
      try { 
        setPreSelectedDishes(JSON.parse(saved)); 
      } catch (e) { 
        console.error("Error parsing pre-selected dishes:", e); 
      }
    }
  }, []);

  const fetchRooms = async () => {
    if (!supabase) return;
    try {
      // Forzamos el fetch para asegurar sincronización con lo que el Admin acaba de crear
      const { data, error } = await supabase
        .from('habitaciones')
        .select('*')
        .eq('disponible', true)
        .order('precio_noche', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setRooms(data);
        // Si hay suites, pre-seleccionamos la primera por defecto para agilizar el flujo
        if (!formData.tipo_alojamiento) {
          setFormData(prev => ({ ...prev, tipo_alojamiento: data[0].nombre }));
        }
      }
    } catch (err) {
      console.error("Error fetching rooms sync:", err);
    }
  };

  const checkUser = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setFormData(prev => ({ 
        ...prev, 
        nombre: session.user.user_metadata?.nombre || '',
        celular: session.user.user_metadata?.celular || ''
      }));
    }
  };

  const validateDateTime = () => {
    const selected = new Date(`${formData.fecha}T${formData.hora}`);
    const now = new Date();
    if (selected < now) {
      alert("La historia se escribe hacia adelante. Por favor, seleccione una fecha y hora futura para su ritual.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDateTime()) return;
    
    setLoading(true);
    try {
      if (!supabase) throw new Error("Sin conexión con el Legado (Supabase)");
      
      const dishNames = preSelectedDishes.map(d => d.nombre_plato).join(", ");
      
      const payload = { 
        ...formData, 
        user_id: user?.id || null,
        platos_preseleccionados: dishNames || null,
        tipo_alojamiento: formData.incluye_alojamiento ? formData.tipo_alojamiento : null,
        es_experiencia_especial: isExperience,
        estado: 'pendiente'
      };

      const { error } = await supabase.from('reservas').insert([payload]);
      if (error) throw error;

      localStorage.removeItem('caporal_mesa_previa');
      setSuccess(true);
      
      // Construcción del mensaje de WhatsApp Maestro
      const petStr = formData.con_mascota ? `🐾 Mascotas: ${formData.numero_mascotas} (${formData.nombre_mascota || 'Sin nombres'})` : "Sin mascotas";
      const stayStr = formData.incluye_alojamiento ? `🏨 Suite EcoParadise: ${formData.tipo_alojamiento} (${formData.duracion_estancia})` : "🍽️ Solo Restaurante";
      const dishStr = dishNames ? `🍱 Pre-orden: ${dishNames}` : "Menú a elección en mesa";
      const expStr = isExperience ? "✨ TIPO: EVENTO ESPECIAL / VIP" : "🍴 TIPO: RESERVA ESTÁNDAR";

      const text = `¡Hola Caporal 1961! Solicito un Ritual de Autor:\n\n${expStr}\n👤 Anfitrión: ${formData.nombre}\n📞 WhatsApp: ${formData.celular}\n📅 Fecha: ${formData.fecha}\n🕒 Hora: ${formData.hora}\n👥 PAX: ${formData.personas}\n\n${petStr}\n${stayStr}\n${dishStr}\n\n📝 Notas: ${formData.detalles_especiales || 'Ninguna'}`;
      
      window.open(`https://wa.me/573218912246?text=${encodeURIComponent(text)}`, '_blank');
    } catch (err: any) {
      alert("Error en la consolidación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-12 md:p-24 bg-white shadow-4xl border-t-[15px] border-burgundy rounded-sm animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy/5 rounded-full -mr-32 -mt-32"></div>
        <Sparkles size={100} className="text-burgundy mx-auto mb-12 animate-pulse" />
        <h3 className="text-6xl md:text-8xl font-serif uppercase tracking-tighter text-deepBlack leading-none mb-6">Ritual Agendado</h3>
        <p className="text-stone-500 mb-16 italic text-2xl md:text-3xl font-light">"Le esperamos en la casona para vivir la historia."</p>
        <button 
          onClick={() => setSuccess(false)} 
          className="bg-burgundy text-white px-20 py-6 uppercase tracking-[0.5em] font-black text-[12px] hover:bg-deepBlack transition-all shadow-4xl rounded-sm active:scale-95"
        >
          Agendar Nuevo Ritual
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Selector de Tipo de Experiencia */}
      <div className="flex bg-stone-200 p-3 rounded-sm border border-stone-300 shadow-inner">
        <button 
          type="button"
          onClick={() => setIsExperience(false)} 
          className={`flex-1 py-6 text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] transition-all rounded-sm ${!isExperience ? 'bg-deepBlack text-bone shadow-2xl' : 'text-stone-500 hover:text-deepBlack'}`}
        >
          Reserva de Mesa
        </button>
        <button 
          type="button"
          onClick={() => setIsExperience(true)} 
          className={`flex-1 py-6 text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] transition-all rounded-sm flex items-center justify-center gap-4 ${isExperience ? 'bg-burgundy text-white shadow-2xl' : 'text-stone-500 hover:text-burgundy'}`}
        >
          <Star size={18}/> Evento VIP / Especial
        </button>
      </div>

      {/* Banner de Pre-orden Detectada */}
      {preSelectedDishes.length > 0 && (
        <div className="bg-amber-50 p-10 border-4 border-dashed border-amber-300 flex flex-col md:flex-row items-center justify-between gap-10 rounded-sm shadow-2xl animate-fade-in">
          <div className="flex items-center gap-10">
            <div className="bg-amber-100 p-6 rounded-full shadow-lg">
              <UtensilsCrossed className="text-amber-600" size={48} />
            </div>
            <div>
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-amber-700 block mb-3 italic">Pre-selección Detectada</span>
              <p className="font-serif italic text-3xl text-deepBlack leading-tight">
                {preSelectedDishes.map(d => d.nombre_plato).join(", ")}
              </p>
            </div>
          </div>
          <ShoppingBag className="text-amber-200" size={80} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-12 md:p-24 shadow-4xl rounded-sm border border-stone-100 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="space-y-6">
            <label className="flex items-center gap-4 text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">
              <Star size={16} className="text-burgundy"/> Nombre del Anfitrión
            </label>
            <input 
              required 
              className="w-full py-8 border-b-3 border-stone-100 focus:border-burgundy outline-none font-serif text-4xl bg-transparent transition-all uppercase tracking-tighter" 
              placeholder="¿A nombre de quién?" 
              value={formData.nombre} 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
            />
          </div>

          <div className="space-y-6">
            <label className="flex items-center gap-4 text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">
              <Clock size={16} className="text-burgundy"/> WhatsApp de Contacto
            </label>
            <input 
              required 
              type="tel" 
              className="w-full py-8 border-b-3 border-stone-100 focus:border-burgundy outline-none font-black text-3xl bg-transparent tracking-[0.2em]" 
              placeholder="+57 321..." 
              value={formData.celular} 
              onChange={e => setFormData({...formData, celular: e.target.value})} 
            />
          </div>

          <div className="space-y-6">
            <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em] block">Fecha del Ritual</label>
            <div className="relative">
              <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 text-burgundy/40" size={32} />
              <input 
                type="date" 
                min={todayStr} 
                required 
                className="w-full py-8 border-b-3 border-stone-100 focus:border-burgundy outline-none font-black text-2xl bg-transparent cursor-pointer" 
                value={formData.fecha} 
                onChange={e => setFormData({...formData, fecha: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em] block">Hora Preferida</label>
            <div className="relative">
              <Clock className="absolute right-0 top-1/2 -translate-y-1/2 text-burgundy/40" size={32} />
              <input 
                type="time" 
                required 
                className="w-full py-8 border-b-3 border-stone-100 focus:border-burgundy outline-none font-black text-2xl bg-transparent cursor-pointer" 
                value={formData.hora} 
                onChange={e => setFormData({...formData, hora: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em] block">Comensales (Pax)</label>
            <select 
              className="w-full py-8 border-b-3 border-stone-100 focus:border-burgundy outline-none font-black text-2xl bg-transparent cursor-pointer" 
              value={formData.personas} 
              onChange={e => setFormData({...formData, personas: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,8,10,12,15,20,30,50].map(n => <option key={n} value={n}>{n} PERSONAS</option>)}
            </select>
          </div>

          {/* PROTOCOLO PET-FRIENDLY */}
          <div className="md:col-span-2 pt-12">
            <div 
              onClick={() => setFormData({...formData, con_mascota: !formData.con_mascota})} 
              className={`cursor-pointer p-12 border-4 rounded-sm flex items-center justify-between transition-all ${formData.con_mascota ? 'bg-amber-50 border-amber-500 shadow-4xl' : 'bg-stone-50 border-stone-100 hover:border-amber-200'}`}
            >
              <div className="flex items-center gap-10">
                <Dog size={64} className={formData.con_mascota ? 'text-amber-500 animate-bounce' : 'text-stone-300'} />
                <div>
                  <span className="text-[12px] font-black uppercase tracking-[0.5em] block mb-2 italic text-amber-600">Protocolo Pet-Friendly</span>
                  <p className="font-serif italic text-4xl text-deepBlack">{formData.con_mascota ? "¿Cuántos compañeros vienen?" : "¿Trae a su mascota?"}</p>
                </div>
              </div>
              {formData.con_mascota && (
                <div className="flex gap-6">
                  {[1, 2, 3].map(num => (
                    <button 
                      key={num}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFormData({...formData, numero_mascotas: num}); }}
                      className={`w-20 h-20 rounded-full border-4 font-black text-2xl transition-all ${formData.numero_mascotas === num ? 'bg-amber-500 text-white border-amber-500 shadow-2xl scale-110' : 'bg-white text-amber-500 border-amber-200'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.con_mascota && (
              <div className="mt-8 animate-fade-in-down">
                <input 
                  className="w-full py-6 border-b-2 border-amber-200 outline-none font-serif text-2xl bg-amber-50/50 px-8 italic" 
                  placeholder="Nombre de su(s) mascota(s)..." 
                  value={formData.nombre_mascota} 
                  onChange={e => setFormData({...formData, nombre_mascota: e.target.value})} 
                />
              </div>
            )}
          </div>

          {/* ALOJAMIENTO ECOPARADISE */}
          <div className="md:col-span-2 pt-16 border-t border-stone-100">
            <div 
              onClick={() => setFormData({...formData, incluye_alojamiento: !formData.incluye_alojamiento})} 
              className={`cursor-pointer p-16 border-4 rounded-sm flex items-center justify-between transition-all group ${formData.incluye_alojamiento ? 'bg-deepBlack text-white border-deepBlack shadow-4xl' : 'bg-stone-50 border-stone-100 hover:border-burgundy/20'}`}
            >
               <div className="flex items-center gap-12">
                  <Bed size={80} className={formData.incluye_alojamiento ? 'text-burgundy' : 'text-stone-300 group-hover:text-burgundy'} />
                  <div>
                     <span className="text-[12px] font-black uppercase tracking-[0.6em] block mb-2 italic text-burgundy">Experiencia EcoParadise</span>
                     <p className="font-serif italic text-5xl leading-tight">¿Incluir Suites de Lujo?</p>
                  </div>
               </div>
               {formData.incluye_alojamiento && <CheckCircle2 size={48} className="text-burgundy animate-pulse" />}
            </div>

            {formData.incluye_alojamiento && (
              <div className="mt-16 space-y-20 animate-fade-in-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {rooms.length === 0 ? (
                    <p className="col-span-full text-center py-10 text-stone-400 italic text-2xl">Buscando suites disponibles en el Legado...</p>
                  ) : rooms.map((room) => (
                    <div 
                      key={room.id}
                      onClick={() => setFormData({...formData, tipo_alojamiento: room.nombre})}
                      className={`cursor-pointer group relative overflow-hidden rounded-sm border-8 transition-all ${formData.tipo_alojamiento === room.nombre ? 'border-burgundy scale-[1.05] shadow-4xl z-10' : 'border-transparent grayscale hover:grayscale-0'}`}
                    >
                      <div className="h-96 overflow-hidden">
                        <img src={room.imagen_url} alt={room.nombre} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 p-10 text-white w-full">
                        <div className="flex justify-between items-end">
                           <div>
                              <h4 className="font-serif text-5xl uppercase tracking-tighter mb-4">{room.nombre}</h4>
                              <p className="text-[11px] text-white/50 uppercase tracking-[0.3em] font-black leading-relaxed max-w-xs">{room.descripcion}</p>
                           </div>
                           <span className="font-black text-burgundy text-3xl tracking-tighter shadow-xl bg-white px-6 py-2 rounded-sm">${Number(room.precio_noche).toLocaleString()}</span>
                        </div>
                      </div>
                      {formData.tipo_alojamiento === room.nombre && (
                        <div className="absolute top-8 right-8 bg-burgundy text-white p-5 rounded-full shadow-4xl animate-bounce">
                          <CheckCircle2 size={32} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-stone-50 p-12 rounded-sm border-2 border-stone-100 shadow-inner">
                  <label className="text-[12px] uppercase font-black text-stone-500 tracking-[0.6em] block mb-10 text-center">Modalidad de Estancia</label>
                  <div className="flex flex-col lg:flex-row gap-8">
                    {durationOptions.map(opt => (
                      <button 
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({...formData, duracion_estancia: opt.value})}
                        className={`flex-1 py-7 border-3 text-[12px] font-black uppercase tracking-[0.4em] transition-all rounded-sm shadow-xl ${formData.duracion_estancia === opt.value ? 'bg-burgundy text-white border-burgundy scale-105' : 'bg-white text-stone-400 border-stone-100 hover:border-burgundy/30'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 pt-16 border-t border-stone-100 space-y-8">
             <label className="text-[12px] uppercase font-black text-stone-400 tracking-[0.8em] block">Notas Especiales & Requerimientos de Autor</label>
             <textarea 
               className="w-full py-10 border-b-3 border-stone-100 outline-none font-serif italic text-4xl bg-stone-50 px-12 leading-relaxed placeholder:text-stone-200" 
               rows={4} 
               placeholder="Ej: Alergias, flores en suite, aniversario, platos especiales..." 
               value={formData.detalles_especiales} 
               onChange={e => setFormData({...formData, detalles_especiales: e.target.value})} 
             />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full py-14 mt-24 uppercase tracking-[1.5em] font-black text-[15px] shadow-4xl transition-all flex items-center justify-center gap-10 rounded-sm group ${isExperience ? 'bg-burgundy text-white' : 'bg-deepBlack text-bone hover:bg-burgundy'}`}
        >
           {loading ? <Loader2 className="animate-spin" size={48}/> : <><Sparkles size={40} className="group-hover:rotate-12 transition-transform"/> Consolidar Ritual</>}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;