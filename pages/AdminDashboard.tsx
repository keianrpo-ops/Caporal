import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { MenuItem, Reservation, ClientProfile, MenuCategory, Pet, Room } from '../types';
import { 
  LogOut, 
  Calendar, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  RefreshCcw,
  Users,
  Smartphone,
  ClipboardList,
  Upload,
  Edit3,
  Save,
  Loader2,
  Mail,
  Send,
  Star,
  Award,
  TrendingUp,
  Clock,
  ChevronRight,
  Dog,
  MapPin,
  Image as ImageIcon,
  ShieldCheck,
  Bed,
  Sparkles,
  MessageSquare,
  Heart,
  Settings,
  Eye,
  Home,
  UtensilsCrossed
} from 'lucide-react';

const categories: MenuCategory[] = [
  'Entradas', 
  'Platos de Autor', 
  'Gourmet', 
  'Tradición', 
  'DOMINGOS DEL TÍPICO', 
  'Coctelería', 
  'Postres',
  'Menú Canino Gourmet'
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservas' | 'menu' | 'clientes' | 'cotizaciones' | 'suites'>('reservas');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // --- STATES PARA FORMULARIO MENÚ ---
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState({
    categoria: 'Platos de Autor' as MenuCategory,
    nombre_plato: '',
    descripcion: '',
    precio: 0,
    imagen_url: ''
  });

  // --- STATES PARA FORMULARIO SUITES (ECOPARADISE) ---
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState({
    nombre: '',
    descripcion: '',
    precio_noche: 0,
    imagen_url: '',
    disponible: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Resetear estados al cambiar de pestaña para evitar contaminación de UI
    setShowAddMenu(false);
    setShowAddRoom(false);
    setEditingId(null);
    setEditingRoomId(null);
    setSelectedFile(null);
    setFilePreview(null);
  }, [activeTab]);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      if (activeTab === 'reservas') {
        const { data } = await supabase
          .from('reservas')
          .select('*')
          .order('fecha', { ascending: false })
          .order('hora', { ascending: false });
        setReservations(data || []);
      } else if (activeTab === 'menu') {
        const { data } = await supabase
          .from('menu')
          .select('*')
          .order('categoria', { ascending: true });
        setMenuItems(data || []);
      } else if (activeTab === 'clientes') {
        const { data } = await supabase
          .from('perfiles_clientes')
          .select('*, mascotas_clientes(*)')
          .order('puntos', { ascending: false });
        setClients(data || []);
      } else if (activeTab === 'cotizaciones') {
        const { data } = await supabase
          .from('cotizaciones_catering')
          .select('*')
          .order('created_at', { ascending: false });
        setQuotes(data || []);
      } else if (activeTab === 'suites') {
        const { data } = await supabase
          .from('habitaciones')
          .select('*')
          .order('created_at', { ascending: true });
        setRooms(data || []);
      }
    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File, folder: 'menu' | 'suites'): Promise<string | null> => {
    if (!supabase) return null;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      alert('Error en carga de imagen: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --- LÓGICA DE GUARDADO DE MENÚ ---
  const saveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = menuForm.imagen_url;
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile, 'menu');
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }
      
      const payload = { ...menuForm, imagen_url: finalImageUrl };
      
      let result;
      if (editingId) {
        result = await supabase.from('menu').update(payload).eq('id', editingId);
      } else {
        result = await supabase.from('menu').insert([payload]);
      }
      
      if (result.error) throw result.error;
      
      console.log("Menú guardado con éxito");
      setShowAddMenu(false);
      fetchData();
    } catch (err: any) {
      alert("Error al guardar plato: " + err.message);
      console.error("Error completo Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE GUARDADO DE SUITES (REVISIÓN DE PERSISTENCIA) ---
  const saveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Iniciando guardado de suite...");
      let finalImageUrl = roomForm.imagen_url;
      
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile, 'suites');
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }
      
      const payload = { 
        nombre: roomForm.nombre,
        descripcion: roomForm.descripcion,
        precio_noche: roomForm.precio_noche,
        imagen_url: finalImageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
        disponible: roomForm.disponible
      };

      console.log("Payload a enviar:", payload);

      let result;
      if (editingRoomId) {
        result = await supabase.from('habitaciones').update(payload).eq('id', editingRoomId);
      } else {
        result = await supabase.from('habitaciones').insert([payload]);
      }
      
      if (result.error) {
        console.error("Error devuelto por Supabase:", result.error);
        throw result.error;
      }
      
      console.log("Suite consolidada con éxito en DB");
      setShowAddRoom(false);
      setEditingRoomId(null);
      fetchData(); // Refrescamos la lista para ver el nuevo registro
    } catch (err: any) {
      alert("Error al guardar suite en EcoParadise: " + err.message);
      console.error("Excepción capturada:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (window.confirm('¿Desea retirar esta creación de la carta oficial?')) {
      await supabase.from('menu').delete().eq('id', id);
      fetchData();
    }
  };

  const deleteRoom = async (id: string) => {
    if (window.confirm('¿Desea eliminar esta Suite de EcoParadise?')) {
      await supabase.from('habitaciones').delete().eq('id', id);
      fetchData();
    }
  };

  const startEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomForm({
      nombre: room.nombre,
      descripcion: room.descripcion || '',
      precio_noche: room.precio_noche,
      imagen_url: room.imagen_url || '',
      disponible: room.disponible
    });
    setFilePreview(room.imagen_url || null);
    setShowAddRoom(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateReservationStatus = async (id: string, status: Reservation['estado'], celular: string) => {
    if (!supabase) return;
    try {
      await supabase.from('reservas').update({ estado: status }).eq('id', id);
      
      // Lógica de Fidelización: Al marcar como asistida se otorgan puntos
      if (status === 'asistida') {
        const { data: profile } = await supabase
          .from('perfiles_clientes')
          .select('*')
          .eq('celular', celular)
          .single();
          
        if (profile) {
          const nuevosPuntos = profile.puntos + 50;
          let nuevoNivel = profile.nivel_lealtad;
          
          if (nuevosPuntos >= 1500) nuevoNivel = 'Oro';
          else if (nuevosPuntos >= 500) nuevoNivel = 'Plata';
          
          await supabase.from('perfiles_clientes').update({ 
            puntos: nuevosPuntos,
            visitas: (profile.visitas || 0) + 1,
            nivel_lealtad: nuevoNivel
          }).eq('id', profile.id);
        }
      }
      fetchData();
    } catch (err: any) {
      alert("Error en actualización: " + err.message);
    }
  };

  const handleSendMail = (email: string, nombre: string) => {
    const subject = encodeURIComponent("Club Caporal 1961 - Atención VIP");
    const body = encodeURIComponent(`Cordial saludo ${nombre},\n\nLe contactamos desde la Gerencia Central de Caporal 1961...`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col xl:flex-row font-sans">
      
      {/* SIDEBAR DE CONTROL GERENCIAL */}
      <aside className="w-80 bg-deepBlack text-bone flex flex-col hidden xl:flex shadow-2xl border-r border-burgundy/30 fixed h-full z-50">
        <div className="p-16 border-b border-white/5 flex flex-col items-center">
          <img src="/logo-caporal.png" alt="Logo" className="h-24 w-auto mb-8 grayscale brightness-200" />
          <div className="text-center">
             <span className="text-burgundy font-black text-[10px] uppercase tracking-[0.5em] block mb-2">GERENCIA CENTRAL</span>
             <h2 className="text-bone font-serif text-2xl uppercase tracking-widest leading-none">Legado 1961</h2>
          </div>
        </div>
        <nav className="flex-grow p-10 space-y-4 overflow-y-auto">
          {[
            { id: 'reservas', icon: Calendar, label: 'Rituales (Reservas)' },
            { id: 'suites', icon: Home, label: 'EcoParadise Suites' },
            { id: 'menu', icon: BookOpen, label: 'Control de la Carta' },
            { id: 'clientes', icon: Users, label: 'Club Caporal VIP' },
            { id: 'cotizaciones', icon: ClipboardList, label: 'Eventos & Catering' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center justify-between px-8 py-6 rounded-sm transition-all text-[11px] font-black uppercase tracking-[0.3em] group ${activeTab === item.id ? 'bg-burgundy text-white shadow-2xl' : 'text-stone-600 hover:text-bone hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-6">
                <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-stone-700 group-hover:text-burgundy'} /> 
                {item.label}
              </div>
              {activeTab === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-white/5">
           <button onClick={handleLogout} className="w-full py-4 border border-stone-800 text-stone-600 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-burgundy hover:text-burgundy transition-all">
              <LogOut size={16} /> Finalizar Sesión
           </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="flex-grow xl:ml-80 pt-80 xl:pt-32 p-6 md:p-16 w-full max-w-[1600px] mx-auto min-h-screen">
        
        {/* ENCABEZADO DE PESTAÑA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 animate-fade-in relative z-10">
          <div>
            <span className="text-burgundy font-black text-[11px] uppercase tracking-[0.5em] block mb-4">PANEL DE CONTROL / {activeTab.toUpperCase()}</span>
            <h1 className="text-7xl md:text-[8rem] font-serif text-deepBlack uppercase tracking-tighter leading-none">
              {activeTab === 'reservas' ? 'Rituales' : activeTab === 'menu' ? 'Carta' : activeTab === 'clientes' ? 'Lealtad' : activeTab === 'suites' ? 'Suites' : 'Eventos'}
            </h1>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchData} className="bg-white p-6 shadow-xl hover:shadow-burgundy/10 transition-all rounded-sm">
              <RefreshCcw size={24} className={loading ? 'animate-spin text-burgundy' : 'text-stone-400'} />
            </button>
            {(activeTab === 'menu' || activeTab === 'suites') && (
              <button 
                onClick={() => activeTab === 'menu' ? setShowAddMenu(!showAddMenu) : setShowAddRoom(!showAddRoom)} 
                className="bg-burgundy text-white px-10 py-6 font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-4 hover:scale-105 transition-all"
              >
                <Plus size={16} /> {showAddMenu || showAddRoom ? 'Cerrar Panel' : 'Añadir Nuevo'}
              </button>
            )}
          </div>
        </div>

        {loading && !showAddMenu && !showAddRoom ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
             <div className="w-20 h-20 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
             <p className="font-serif italic text-3xl text-stone-300">Sincronizando el Legado...</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* --- MÓDULO RITUALES (RESERVAS) --- */}
            {activeTab === 'reservas' && (
              <div className="grid grid-cols-1 gap-12">
                {reservations.length === 0 ? (
                  <div className="bg-white p-24 text-center border-2 border-dashed border-stone-200">
                     <Calendar size={60} className="mx-auto text-stone-100 mb-6" />
                     <p className="font-serif italic text-3xl text-stone-300">Sin rituales agendados.</p>
                  </div>
                ) : reservations.map(res => (
                  <div key={res.id} className={`bg-white group overflow-hidden shadow-3xl hover:shadow-burgundy/10 transition-all border-l-[40px] flex flex-col ${
                    res.estado === 'asistida' ? 'border-green-600 opacity-60' : 
                    res.es_experiencia_especial ? 'border-burgundy' : 
                    res.con_mascota ? 'border-amber-500' : 'border-stone-400'
                  }`}>
                    <div className="p-12 md:p-16">
                       <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                          <div className="space-y-6">
                             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block">Anfitrión</span>
                             <h3 className="text-5xl font-serif uppercase tracking-tighter text-deepBlack leading-none">{res.nombre}</h3>
                             <a href={`https://wa.me/57${res.celular.replace(/\s/g, '')}`} target="_blank" className="flex items-center gap-3 text-burgundy font-black text-[11px] uppercase tracking-widest hover:underline">
                                <Smartphone size={16} /> WhatsApp: {res.celular}
                             </a>
                          </div>
                          <div className="space-y-6">
                             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block">Ritual</span>
                             <div className="text-2xl font-black text-deepBlack"><Calendar className="inline mr-3 text-burgundy/40" size={20}/> {res.fecha}</div>
                             <div className="text-2xl font-black text-deepBlack"><Clock className="inline mr-3 text-burgundy/40" size={20}/> @ {res.hora}</div>
                          </div>
                          <div className="space-y-6">
                             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block">Comensales</span>
                             <div className="flex items-center gap-6">
                                <Users size={32} className="text-stone-200" />
                                <span className="text-6xl font-serif text-deepBlack tracking-tighter">{res.personas}</span>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block">EcoParadise</span>
                             {res.incluye_alojamiento ? (
                               <div className="bg-deepBlack text-white p-6 rounded-sm border-l-4 border-burgundy">
                                  <p className="font-serif text-[10px] uppercase tracking-widest text-burgundy mb-2">SUITE ACTIVA</p>
                                  <p className="text-xl font-serif italic">{res.tipo_alojamiento}</p>
                                  <p className="text-[9px] uppercase tracking-widest text-stone-500 mt-2">{res.duracion_estancia}</p>
                               </div>
                             ) : <p className="text-stone-300 italic pt-4">Solo Experiencia de Mesa</p>}
                          </div>
                       </div>

                       <div className="mt-12 pt-12 border-t border-stone-100 flex flex-col lg:flex-row justify-between gap-10">
                          <div className="bg-stone-50 p-10 border-l-4 border-burgundy flex-grow">
                             <p className="text-[10px] font-black uppercase text-burgundy mb-4">Pre-selección de Menú & Notas VIP:</p>
                             <p className="font-serif italic text-3xl text-stone-600 leading-relaxed">
                               "{res.platos_preseleccionados || res.detalles_especiales || 'Sin preferencias registradas'}"
                             </p>
                             {res.con_mascota && (
                               <div className="mt-6 flex items-center gap-4 text-amber-600">
                                  <Dog size={24} />
                                  <span className="text-[11px] font-black uppercase tracking-widest">Protocolo Pet-Friendly: {res.numero_mascotas} Caninos</span>
                               </div>
                             )}
                          </div>
                          <div className="flex flex-col gap-4 shrink-0 w-full lg:w-64">
                             {res.estado === 'pendiente' && <button onClick={() => updateReservationStatus(res.id, 'confirmada', res.celular)} className="bg-blue-600 text-white w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-blue-700 transition-all">CONFIRMAR RITUAL</button>}
                             {res.estado === 'confirmada' && <button onClick={() => updateReservationStatus(res.id, 'asistida', res.celular)} className="bg-green-600 text-white w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-green-700 transition-all">MARCAR ASISTENCIA</button>}
                             <button onClick={() => updateReservationStatus(res.id, 'cancelada', res.celular)} className="bg-white border-2 border-stone-100 text-stone-300 w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] hover:text-red-600 hover:border-red-600 transition-all">ANULAR RESERVA</button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- MÓDULO SUITES (ECOPARADISE) --- */}
            {activeTab === 'suites' && (
              <>
                {showAddRoom && (
                  <div className="animate-fade-in-down">
                    <form onSubmit={saveRoom} className="bg-white p-12 md:p-24 shadow-4xl rounded-sm border-t-[20px] border-burgundy mb-24">
                      <h2 className="font-serif text-6xl uppercase tracking-tighter mb-20 pb-12 border-b border-stone-100 flex items-center gap-10 text-deepBlack">
                        <Bed size={50} className="text-burgundy" /> {editingRoomId ? 'Refinar Suite' : 'Nueva Experiencia EcoParadise'}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Nombre Identitario de la Suite</label>
                           <input required className="w-full p-8 border-b-2 border-stone-100 outline-none focus:border-burgundy bg-stone-50 font-serif text-4xl uppercase tracking-tighter" value={roomForm.nombre} onChange={(e) => setRoomForm({...roomForm, nombre: e.target.value})} />
                        </div>
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Precio por Ritual Nocturno ($)</label>
                           <input type="number" required className="w-full p-8 border-b-2 border-stone-100 outline-none focus:border-burgundy bg-stone-50 font-black text-6xl tracking-tighter" value={roomForm.precio_noche} onChange={(e) => setRoomForm({...roomForm, precio_noche: Number(e.target.value)})} />
                        </div>
                        <div className="md:col-span-2 space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Descripción Curada (Amenities, Vista, Filosofía)</label>
                           <textarea required className="w-full p-12 border-b-2 border-stone-100 outline-none focus:border-burgundy h-64 bg-stone-50 italic text-stone-600 font-serif text-4xl leading-relaxed" value={roomForm.descripcion} onChange={(e) => setRoomForm({...roomForm, descripcion: e.target.value})} />
                        </div>
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Fotografía de Autor</label>
                           <div onClick={() => fileInputRef.current?.click()} className="w-full p-16 border-4 border-dashed border-stone-100 bg-stone-50 hover:border-burgundy transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-8 group">
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                              {filePreview ? <img src={filePreview} className="h-48 w-auto object-cover rounded-sm shadow-4xl" /> : <ImageIcon className="text-stone-200 group-hover:text-burgundy" size={80} />}
                              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-stone-400">Vincular Registro Fotográfico</p>
                           </div>
                        </div>
                        <div className="space-y-6 flex flex-col justify-center">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em] mb-4">Disponibilidad Inmediata</label>
                           <div className="flex gap-6">
                              <button type="button" onClick={() => setRoomForm({...roomForm, disponible: true})} className={`flex-1 py-6 border-2 font-black text-[12px] uppercase tracking-widest transition-all ${roomForm.disponible ? 'bg-green-600 text-white border-green-600 shadow-xl' : 'bg-white text-stone-300 border-stone-100'}`}>Habilitada</button>
                              <button type="button" onClick={() => setRoomForm({...roomForm, disponible: false})} className={`flex-1 py-6 border-2 font-black text-[12px] uppercase tracking-widest transition-all ${!roomForm.disponible ? 'bg-red-600 text-white border-red-600 shadow-xl' : 'bg-white text-stone-300 border-stone-100'}`}>Mantenimiento</button>
                           </div>
                        </div>
                        <div className="md:col-span-2 pt-20">
                           <button type="submit" disabled={loading || uploading} className="w-full bg-deepBlack text-white py-14 uppercase tracking-[1em] font-black hover:bg-burgundy transition-all shadow-4xl flex items-center justify-center gap-10 text-[16px]">
                              {loading || uploading ? <Loader2 className="animate-spin" size={48} /> : <><Save size={40} /> Consolidar Suite en EcoParadise</>}
                           </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {!showAddRoom && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 animate-fade-in">
                     {rooms.map(room => (
                       <div key={room.id} className="bg-white rounded-sm overflow-hidden shadow-3xl border border-stone-100 group transition-all duration-1000 hover:-translate-y-6">
                          <div className="h-96 overflow-hidden relative">
                             <img src={room.imagen_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-125" />
                             <div className={`absolute top-8 right-8 px-8 py-3 font-black text-[11px] uppercase tracking-[0.4em] shadow-4xl ${room.disponible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                {room.disponible ? 'Disponible' : 'Ocupada'}
                             </div>
                             <div className="absolute bottom-8 left-8 bg-burgundy text-white px-10 py-4 font-black text-3xl shadow-4xl tracking-tighter border border-white/20">
                                ${Number(room.precio_noche).toLocaleString()}
                             </div>
                          </div>
                          <div className="p-14">
                             <h3 className="font-serif text-5xl uppercase tracking-tighter mb-6 text-deepBlack">{room.nombre}</h3>
                             <p className="text-stone-500 font-light italic text-2xl mb-12 h-20 overflow-hidden leading-relaxed">"{room.descripcion}"</p>
                             <div className="flex justify-end gap-6 pt-10 border-t border-stone-50">
                                <button onClick={() => startEditRoom(room)} className="text-stone-300 hover:text-burgundy transition-all p-4 bg-stone-50 rounded-full"><Settings size={28} /></button>
                                <button onClick={() => deleteRoom(room.id)} className="text-stone-300 hover:text-red-600 transition-all p-4 bg-stone-50 rounded-full"><Trash2 size={28} /></button>
                             </div>
                          </div>
                       </div>
                     ))}
                     <div onClick={() => setShowAddRoom(true)} className="border-4 border-dashed border-stone-200 flex flex-col items-center justify-center p-24 text-stone-300 hover:border-burgundy/20 hover:text-burgundy transition-all cursor-pointer bg-white/50 min-h-[600px] group">
                        <Plus size={120} className="mb-10 group-hover:scale-125 transition-transform duration-700" />
                        <p className="font-black uppercase tracking-[0.5em] text-[16px] text-center leading-loose">Inaugurar Nueva Suite<br/>EcoParadise</p>
                     </div>
                  </div>
                )}
              </>
            )}

            {/* --- MÓDULO CONTROL DE CARTA (MENÚ) --- */}
            {activeTab === 'menu' && (
              <>
                {showAddMenu && (
                  <div className="animate-fade-in-down">
                    <form onSubmit={saveMenuItem} className="bg-white p-12 md:p-24 shadow-4xl rounded-sm border-t-[20px] border-burgundy mb-24">
                      <h2 className="font-serif text-6xl uppercase tracking-tighter mb-20 pb-12 border-b border-stone-100 flex items-center gap-10 text-deepBlack">
                        <UtensilsCrossed size={50} className="text-burgundy" /> {editingId ? 'Refinar Creación' : 'Nueva Experiencia Gastronómica'}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Título del Plato</label>
                           <input required className="w-full p-8 border-b-2 border-stone-100 outline-none focus:border-burgundy bg-stone-50 font-serif text-4xl uppercase tracking-tighter" value={menuForm.nombre_plato} onChange={(e) => setMenuForm({...menuForm, nombre_plato: e.target.value})} />
                        </div>
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Sección de la Carta</label>
                           <select className="w-full p-8 border-b-2 border-stone-100 outline-none focus:border-burgundy bg-stone-50 text-[14px] font-black uppercase tracking-[0.3em] cursor-pointer" value={menuForm.categoria} onChange={(e) => setMenuForm({...menuForm, categoria: e.target.value as MenuCategory})}>
                              {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                           </select>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Descripción Gourmet (Detalle de Ingredientes & Técnica)</label>
                           <textarea required className="w-full p-12 border-b-2 border-stone-100 outline-none focus:border-burgundy h-64 bg-stone-50 italic text-stone-600 font-serif text-4xl leading-relaxed" value={menuForm.descripcion} onChange={(e) => setMenuForm({...menuForm, descripcion: e.target.value})} />
                        </div>
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Precio Gastronómico ($)</label>
                           <input type="number" required className="w-full p-8 border-b-2 border-stone-100 outline-none focus:border-burgundy bg-stone-50 font-black text-6xl tracking-tighter" value={menuForm.precio} onChange={(e) => setMenuForm({...menuForm, precio: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-6">
                           <label className="text-[11px] uppercase font-black text-stone-400 tracking-[0.5em]">Imagen Profesional (Platillo Terminado)</label>
                           <div onClick={() => fileInputRef.current?.click()} className="w-full p-16 border-4 border-dashed border-stone-100 bg-stone-50 hover:border-burgundy transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-8 group">
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                              {filePreview ? <img src={filePreview} className="h-48 w-auto object-cover rounded-sm shadow-4xl" /> : <Upload className="text-stone-200 group-hover:text-burgundy" size={80} />}
                              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-stone-400">Vincular Fotografía Profesional</p>
                           </div>
                        </div>
                        <div className="md:col-span-2 pt-20">
                           <button type="submit" disabled={loading || uploading} className="w-full bg-deepBlack text-white py-14 uppercase tracking-[1em] font-black hover:bg-burgundy transition-all shadow-4xl flex items-center justify-center gap-10 text-[16px]">
                              {loading || uploading ? <Loader2 className="animate-spin" size={48} /> : <><Save size={40} /> Consolidar en la Carta Oficial</>}
                           </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {!showAddMenu && (
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-20 animate-fade-in">
                    {menuItems.map(item => (
                      <div key={item.id} className="bg-white overflow-hidden shadow-4xl border border-stone-100 relative group transition-all duration-[1200ms] hover:-translate-y-6">
                        <div className="h-96 overflow-hidden relative">
                           <img src={item.imagen_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2500ms] group-hover:scale-125" />
                           <div className="absolute top-0 right-0 p-10 flex gap-8 translate-y-[-100%] group-hover:translate-y-0 transition-all duration-700 z-10">
                              <button onClick={() => { setEditingId(item.id); setMenuForm(item); setFilePreview(item.imagen_url); setShowAddMenu(true); window.scrollTo({top:0, behavior:'smooth'}); }} className="bg-white text-deepBlack p-6 shadow-4xl hover:bg-burgundy hover:text-white transition-all rounded-full"><Edit3 size={28}/></button>
                              <button onClick={() => deleteMenuItem(item.id)} className="bg-white text-red-600 p-6 shadow-4xl hover:bg-red-600 hover:text-white transition-all rounded-full"><Trash2 size={28}/></button>
                           </div>
                           <div className="absolute bottom-10 left-10 bg-burgundy text-white px-10 py-4 font-black text-3xl shadow-4xl tracking-tighter border border-white/20">
                              ${Number(item.precio).toLocaleString()}
                           </div>
                        </div>
                        <div className="p-14">
                           <span className="text-[10px] uppercase font-black tracking-[0.6em] text-burgundy mb-6 block italic">{item.categoria}</span>
                           <h3 className="font-serif text-5xl uppercase tracking-tighter mb-8 text-deepBlack leading-none">{item.nombre_plato}</h3>
                           <p className="text-stone-400 text-2xl font-light italic mb-10 h-24 overflow-hidden leading-relaxed">"{item.descripcion}"</p>
                        </div>
                      </div>
                    ))}
                    <div onClick={() => setShowAddMenu(true)} className="border-4 border-dashed border-stone-200 flex flex-col items-center justify-center p-24 text-stone-300 hover:border-burgundy/20 hover:text-burgundy transition-all cursor-pointer bg-white/50 min-h-[600px] group">
                       <Plus size={120} className="mb-10 group-hover:scale-125 transition-transform duration-700" />
                       <p className="font-black uppercase tracking-[0.5em] text-[16px] text-center leading-loose">Añadir Nueva Creación<br/>a la Carta</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* --- MÓDULO CLUB CAPORAL VIP (CLIENTES) --- */}
            {activeTab === 'clientes' && (
              <div className="bg-white shadow-4xl overflow-x-auto rounded-sm border border-stone-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-deepBlack text-bone text-[11px] uppercase tracking-[0.4em]">
                    <tr>
                      <th className="px-16 py-14">Socio Club Caporal</th>
                      <th className="px-16 py-14 text-center">Inversión / Puntos</th>
                      <th className="px-16 py-14 text-center">Nivel VIP</th>
                      <th className="px-16 py-14 text-right">CRM Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {clients.map(client => (
                      <tr key={client.id} className="hover:bg-stone-50 transition-colors group">
                        <td className="px-16 py-16 flex items-center gap-12">
                          <div className="w-24 h-24 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-serif text-4xl border-4 border-white shadow-2xl transition-transform group-hover:scale-110">
                             {client.nombre?.[0] || 'V'}
                          </div>
                          <div>
                             <p className="font-serif text-5xl uppercase tracking-tighter text-deepBlack">{client.nombre}</p>
                             <span className="text-stone-400 text-sm font-black tracking-[0.2em]">{client.celular}</span>
                          </div>
                        </td>
                        <td className="px-16 py-16 text-center">
                           <p className="text-6xl font-black text-burgundy tracking-tighter leading-none">{client.puntos}</p>
                           <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-4">{client.visitas || 0} Rituales Realizados</p>
                        </td>
                        <td className="px-16 py-16 text-center">
                           <span className={`px-10 py-4 text-[12px] font-black uppercase tracking-[0.4em] border-3 shadow-2xl ${
                             client.nivel_lealtad === 'Oro' ? 'bg-amber-100 text-amber-700 border-amber-400' :
                             client.nivel_lealtad === 'Plata' ? 'bg-stone-100 text-stone-600 border-stone-400' :
                             'bg-white text-burgundy border-burgundy'
                           }`}>
                             {client.nivel_lealtad}
                           </span>
                        </td>
                        <td className="px-16 py-16 text-right">
                           <div className="flex justify-end gap-6">
                              <button onClick={() => client.email && handleSendMail(client.email, client.nombre || '')} className="p-7 bg-stone-100 text-stone-400 hover:bg-burgundy hover:text-white transition-all rounded-sm shadow-3xl">
                                 <Send size={32} />
                              </button>
                              <button className="p-7 bg-stone-100 text-stone-400 hover:bg-deepBlack hover:text-white transition-all rounded-sm shadow-3xl">
                                 <Award size={32} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- MÓDULO EVENTOS & CATERING (COTIZACIONES) --- */}
            {activeTab === 'cotizaciones' && (
              <div className="space-y-16 animate-fade-in">
                {quotes.length === 0 ? (
                  <div className="bg-white p-32 text-center border-2 border-dashed border-stone-200">
                     <ClipboardList size={80} className="mx-auto text-stone-100 mb-10" />
                     <p className="font-serif italic text-4xl text-stone-300">Sin solicitudes de catering pendientes.</p>
                  </div>
                ) : quotes.map(quote => (
                  <div key={quote.id} className="bg-white p-16 shadow-4xl border border-stone-100 flex flex-col md:flex-row justify-between items-center gap-16 transition-all hover:border-burgundy rounded-sm group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-burgundy"></div>
                    <div className="flex-grow">
                       <div className="flex items-center gap-10 mb-10">
                          <span className="bg-burgundy text-white px-10 py-3 text-[11px] font-black uppercase tracking-[0.5em] shadow-xl">{quote.tipo_evento}</span>
                          <span className="text-stone-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-3"><Users size={16}/> {quote.num_personas} Pax</span>
                          <span className="text-stone-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-3"><Calendar size={16}/> {quote.fecha_evento || 'Por definir'}</span>
                       </div>
                       <h4 className="font-serif text-7xl uppercase tracking-tighter text-deepBlack mb-10 leading-none">{quote.nombre_cliente}</h4>
                       <p className="text-stone-500 italic font-serif text-4xl leading-relaxed max-w-6xl mb-12">"{quote.mensaje || "El cliente no ha dejado requerimientos específicos."}"</p>
                    </div>
                    <div className="flex flex-col gap-10 text-right min-w-[400px]">
                       <div className="space-y-4">
                          <p className="text-deepBlack font-black text-4xl flex items-center justify-end gap-6 tracking-tighter"><Smartphone size={40} className="text-burgundy" /> {quote.telefono}</p>
                          <p className="text-stone-400 font-serif italic text-2xl">{quote.email}</p>
                       </div>
                       <button onClick={() => quote.email && handleSendMail(quote.email, quote.nombre_cliente)} className="w-full py-10 bg-deepBlack text-bone text-[13px] font-black uppercase tracking-[0.6em] hover:bg-burgundy transition-all flex items-center justify-center gap-8 shadow-4xl">
                          <Send size={32}/> INICIAR GESTIÓN VIP
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
