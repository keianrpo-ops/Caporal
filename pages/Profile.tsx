
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ClientProfile, Pet } from '../types';
import { 
  Star, Award, LogOut, Gift, ShieldCheck, Dog, 
  Plus, Trash2, Heart, Save, Loader2, Sparkles,
  X as CloseIcon
} from 'lucide-react';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPet, setSavingPet] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({ nombre: '', raza: '', notas_gourmet: '' });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: prof } = await supabase.from('perfiles_clientes').select('*').eq('id', user.id).single();
      const { data: mtas } = await supabase.from('mascotas_clientes').select('*').eq('cliente_id', user.id);
      setProfile(prof);
      setPets(mtas || []);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSavingPet(true);
    try {
      const { error } = await supabase.from('mascotas_clientes').insert([{ ...newPet, cliente_id: user.id }]);
      if (error) throw error;
      
      setNewPet({ nombre: '', raza: '', notas_gourmet: '' });
      setShowAddPet(false);
      fetchData();
    } catch (err: any) {
      alert("Error al registrar: " + err.message);
    } finally {
      setSavingPet(false);
    }
  };

  const deletePet = async (id: string) => {
    if (!supabase) return;
    if (window.confirm('¿Desea retirar a su compañero del Club Caporal?')) {
      await supabase.from('mascotas_clientes').delete().eq('id', id);
      fetchData();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bone">
       <Loader2 className="animate-spin text-burgundy" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen pt-48 pb-20 px-4 bg-bone">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* PANEL DE SOCIO */}
        <div className="lg:col-span-1">
          <div className="bg-deepBlack text-bone p-12 rounded-sm shadow-3xl border-t-[10px] border-burgundy sticky top-48">
            <div className="flex justify-between mb-10 items-center">
               <ShieldCheck size={32} className="text-burgundy" />
               <span className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-500">Miembro VIP</span>
            </div>
            
            <div className="w-28 h-28 bg-burgundy rounded-full mb-10 flex items-center justify-center text-5xl font-serif border-4 border-white/5 shadow-2xl">
              {profile?.nombre?.[0]}
            </div>
            
            <h2 className="text-4xl font-serif mb-2 uppercase tracking-tighter">{profile?.nombre}</h2>
            <p className="text-burgundy text-[11px] font-black uppercase tracking-[0.4em] mb-12 italic">
               Rango {profile?.nivel_lealtad}
            </p>
            
            <div className="space-y-6 pt-10 border-t border-white/5">
              <div className="flex justify-between items-end">
                <span className="text-stone-500 text-[10px] uppercase font-black tracking-widest">Puntos de Legado</span>
                <span className="text-4xl font-serif text-white">{profile?.puntos}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-stone-500 text-[10px] uppercase font-black tracking-widest">Rituales Realizados</span>
                <span className="text-4xl font-serif text-white">{profile?.visitas}</span>
              </div>
            </div>

            <button 
              onClick={() => supabase?.auth.signOut()} 
              className="mt-16 w-full py-5 border border-stone-800 text-stone-500 hover:text-burgundy hover:border-burgundy text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* GESTIÓN DE ÁNGELES Y BENEFICIOS */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* SECCIÓN CLUB DE MASCOTAS */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
              <div className="flex items-center gap-8">
                <div className="bg-white p-5 shadow-2xl rounded-full">
                  <Heart size={40} className="text-burgundy" />
                </div>
                <div>
                  <h3 className="text-5xl font-serif text-deepBlack uppercase tracking-tighter">Ángeles de 4 Patas</h3>
                  <p className="text-stone-400 text-sm font-black uppercase tracking-[0.3em] mt-2 italic">Socios Honorarios del Club</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddPet(!showAddPet)} 
                className="bg-burgundy text-white px-8 py-5 rounded-sm shadow-2xl hover:bg-deepBlack transition-all flex items-center gap-4 text-[10px] font-black uppercase tracking-widest"
              >
                {showAddPet ? <CloseIcon size={16}/> : <Plus size={16}/>} 
                {showAddPet ? 'Cancelar' : 'Registrar Ángel'}
              </button>
            </div>

            {showAddPet && (
              <form onSubmit={addPet} className="bg-white p-12 mb-16 shadow-3xl border-t-[8px] border-burgundy animate-fade-in-down rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div className="space-y-4">
                     <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Nombre del Compañero</label>
                     <input 
                       required 
                       placeholder="Ej: Max, Luna..."
                       className="w-full p-4 border-b border-stone-200 outline-none font-serif text-2xl focus:border-burgundy bg-stone-50" 
                       value={newPet.nombre} 
                       onChange={e => setNewPet({...newPet, nombre: e.target.value})} 
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Raza / Tipo</label>
                     <input 
                       placeholder="Golden Retriever, Criollo..."
                       className="w-full p-4 border-b border-stone-200 outline-none font-serif text-2xl focus:border-burgundy bg-stone-50" 
                       value={newPet.raza} 
                       onChange={e => setNewPet({...newPet, raza: e.target.value})} 
                     />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                     <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Notas Gourmet y Cuidados Especiales</label>
                     <textarea 
                       placeholder="Alergias, gustos, platos caninos favoritos..." 
                       className="w-full p-6 border-b border-stone-200 outline-none font-serif text-xl italic focus:border-burgundy bg-stone-50" 
                       rows={3}
                       value={newPet.notas_gourmet} 
                       onChange={e => setNewPet({...newPet, notas_gourmet: e.target.value})} 
                     />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={savingPet} 
                  className="w-full bg-deepBlack text-white py-6 font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-burgundy transition-all shadow-xl"
                >
                  {savingPet ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> Guardar en el Legado</>}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {pets.map(pet => (
                <div key={pet.id} className="bg-white p-10 shadow-3xl border-l-[15px] border-amber-500 relative group overflow-hidden transition-all hover:translate-x-3">
                  <Dog size={100} className="absolute -right-8 -bottom-8 text-stone-50 opacity-10 group-hover:scale-125 transition-all duration-1000" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <h4 className="text-4xl font-serif uppercase tracking-tighter">{pet.nombre}</h4>
                    <button 
                      onClick={() => deletePet(pet.id)} 
                      className="text-stone-300 hover:text-red-600 transition-all p-2 bg-stone-50 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="h-[1px] w-8 bg-amber-500"></div>
                    <p className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">{pet.raza || 'Raza de Autor'}</p>
                  </div>
                  
                  <div className="bg-stone-50 p-6 italic font-serif leading-relaxed text-xl text-stone-600 relative z-10 border-l-2 border-stone-200">
                    "{pet.notas_gourmet || 'Deseos gastronómicos por definir...'}"
                  </div>
                </div>
              ))}
              
              {pets.length === 0 && !showAddPet && (
                <div className="col-span-full py-24 border-4 border-dashed border-stone-100 text-center rounded-sm bg-white/50">
                  <Dog size={60} className="mx-auto text-stone-200 mb-6" />
                  <p className="font-serif italic text-stone-300 text-3xl uppercase tracking-widest">Sin registros en el club</p>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Sus mascotas también merecen los beneficios de Caporal</p>
                </div>
              )}
            </div>
          </section>

          {/* TARJETA DE BENEFICIOS DINÁMICA */}
          <section className="bg-burgundy text-bone p-12 rounded-sm shadow-3xl relative overflow-hidden group">
             <Star size={150} className="absolute -right-16 -top-16 opacity-10 group-hover:rotate-45 transition-all duration-1000" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <Sparkles size={24} className="text-white animate-pulse" />
                   <h4 className="font-serif text-3xl uppercase tracking-tighter">Beneficio Activo</h4>
                </div>
                <p className="text-white/80 italic text-2xl mb-12 max-w-xl leading-relaxed">
                   "Vemos que tiene un ángel registrado. Su próxima visita incluye un **Snack Artesanal de Autor** cortesía de la casa."
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 pt-10 border-t border-white/10">
                   <div>
                      <span className="text-white/40 text-[9px] uppercase font-black tracking-widest block mb-2">Código VIP</span>
                      <div className="bg-white/10 px-6 py-3 text-[12px] font-black uppercase tracking-[0.5em] border border-white/20">PET-VIP-1961</div>
                   </div>
                   <div className="flex -space-x-3">
                      {[1,2,3].map(n => (
                        <div key={n} className="w-12 h-12 rounded-full bg-deepBlack border-2 border-burgundy flex items-center justify-center overflow-hidden">
                           <Dog size={16} className="text-burgundy opacity-50" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
