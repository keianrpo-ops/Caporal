import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { MenuItem, MenuCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Check, Plus, Info, ArrowRight, UtensilsCrossed, Trash2, Loader2 } from 'lucide-react';
// @ts-ignore
import { useSearchParams, useNavigate } from 'react-router-dom';

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

const MOCK_MENU: MenuItem[] = [
  { id: '1', nombre_plato: 'Pescado Caporal', categoria: 'Platos de Autor', descripcion: 'Pesca del día con patacón artesanal y ensalada cítrica.', precio: 45000, imagen_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070', disponible: true },
  { id: '2', nombre_plato: 'Gourmet Burger', categoria: 'Gourmet', descripcion: 'Carne madurada en pan de masa madre con vegetales frescos.', precio: 32000, imagen_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899', disponible: true }
];

const MenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'All';
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
    const saved = localStorage.getItem('caporal_mesa_previa');
    if (saved) {
      try { setSelectedItems(JSON.parse(saved)); } catch (e) { console.error("Error al cargar carrito:", e); }
    }
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') setFilteredItems(items);
    else setFilteredItems(items.filter(i => i.categoria === activeCategory));
  }, [activeCategory, items]);

  const fetchMenu = async () => {
    setLoading(true);
    if (!supabase) { setItems(MOCK_MENU); setIsPreview(true); setLoading(false); return; }
    try {
      const { data, error } = await supabase.from('menu').select('*').order('categoria', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) { setItems(MOCK_MENU); setIsPreview(true); } 
      else { setItems(data); setIsPreview(false); }
    } catch (err) { setItems(MOCK_MENU); setIsPreview(true); } 
    finally { setLoading(false); }
  };

  const toggleSelection = (item: MenuItem) => {
    let newSelection;
    if (selectedItems.find(i => i.id === item.id)) { newSelection = selectedItems.filter(i => i.id !== item.id); } 
    else { newSelection = [...selectedItems, item]; setIsDrawerOpen(true); }
    setSelectedItems(newSelection);
    localStorage.setItem('caporal_mesa_previa', JSON.stringify(newSelection));
  };

  const totalPrice = selectedItems.reduce((acc, curr) => acc + Number(curr.precio), 0);
  const handleReserve = () => { setIsDrawerOpen(false); navigate('/'); setTimeout(() => { document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' }); }, 600); };

  return (
    <div className="min-h-screen bg-bone pt-32 pb-20 px-4 relative font-sans overflow-x-hidden">
      
      {/* BOTÓN FLOTANTE MÁS DISCRETO */}
      {selectedItems.length > 0 && !isDrawerOpen && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-8 right-8 z-[60]">
          <button onClick={() => setIsDrawerOpen(true)} className="bg-burgundy text-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center border-2 border-white group relative hover:scale-105 transition-all">
            <ShoppingBag size={28} />
            <span className="absolute -top-1 -right-1 bg-deepBlack text-bone w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border border-white">
              {selectedItems.length}
            </span>
          </button>
        </motion.div>
      )}

      {/* DRAWER REDISEÑADO - Ahora es elegante y de ancho controlado */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-deepBlack/80 backdrop-blur-sm z-[100]" />
            <motion.aside 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} 
              className="fixed right-0 top-0 h-full w-full max-w-lg md:max-w-xl bg-bone z-[110] flex flex-col shadow-2xl border-l border-burgundy/5"
            >
              
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div>
                   <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-tighter text-deepBlack leading-none mb-2">Mi Selección</h2>
                   <p className="text-burgundy text-[9px] font-black uppercase tracking-[0.4em] italic">Resumen de Mesa</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-stone-300 hover:text-burgundy transition-all"><X size={32} strokeWidth={1.5} /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-stone-50/30">
                {selectedItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 space-y-4">
                     <UtensilsCrossed size={80} strokeWidth={0.5} />
                     <p className="font-serif italic text-2xl">Mesa vacía</p>
                  </div>
                ) : selectedItems.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 shadow-md flex gap-4 items-center border border-stone-100 rounded-sm group relative">
                    <div className="w-24 h-24 shrink-0 overflow-hidden rounded-sm border border-stone-50">
                      <img src={item.imagen_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.nombre_plato} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-serif text-lg md:text-xl uppercase tracking-tighter text-deepBlack group-hover:text-burgundy transition-colors line-clamp-1">{item.nombre_plato}</h4>
                         <button onClick={() => toggleSelection(item)} className="p-1.5 text-stone-200 hover:text-red-600 transition-all"><Trash2 size={18}/></button>
                      </div>
                      <p className="text-stone-400 font-serif italic text-xs mb-3 line-clamp-2 leading-relaxed">"{item.descripcion}"</p>
                      <div className="flex justify-between items-end border-t border-stone-50 pt-3">
                         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-burgundy">{item.categoria}</span>
                         <span className="font-serif text-xl text-deepBlack tracking-tighter">${Number(item.precio).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedItems.length > 0 && (
                <div className="p-8 bg-white border-t border-stone-100 shadow-2xl sticky bottom-0 z-20">
                  <div className="flex justify-between items-end mb-8">
                     <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-300">TOTAL</span>
                        <div className="w-8 h-[1px] bg-burgundy"></div>
                     </div>
                     <span className="text-5xl md:text-6xl font-serif text-burgundy tracking-tighter leading-none">${totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setIsDrawerOpen(false)} className="py-4 text-[9px] font-black uppercase tracking-[0.3em] border border-stone-200 hover:border-burgundy text-stone-400 hover:text-burgundy transition-all rounded-sm shadow-sm">Seguir Explorando</button>
                    <button onClick={handleReserve} className="bg-burgundy text-white py-4 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl flex items-center justify-center gap-4 group rounded-sm active:scale-95 transition-all">CONFIRMAR RITUAL <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/></button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-burgundy uppercase tracking-[0.6em] text-[10px] font-black mb-6 block opacity-60">Legado Gastronómico</span>
          <h1 className="text-6xl md:text-8xl font-serif text-deepBlack mb-8 tracking-tighter uppercase leading-none">La Carta</h1>
          <p className="text-stone-500 italic max-w-xl mx-auto font-light text-lg">Personalice su experiencia antes de su llegada a la casona.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-24 px-4">
          <button onClick={() => setSearchParams({ cat: 'All' })} className={`px-8 py-4 rounded-sm text-[9px] font-black uppercase tracking-[0.4em] transition-all shadow-md ${activeCategory === 'All' ? 'bg-burgundy text-white border-burgundy' : 'bg-white text-stone-500 border-stone-100 hover:border-burgundy'}`}>Todos</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSearchParams({ cat })} className={`px-8 py-4 rounded-sm text-[9px] font-black uppercase tracking-[0.4em] transition-all shadow-md ${activeCategory === cat ? 'bg-burgundy text-white' : 'bg-white text-stone-500 border-stone-100 hover:border-burgundy'}`}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-40">
             <Loader2 className="animate-spin text-burgundy mx-auto mb-6" size={40} />
             <p className="text-stone-300 font-serif italic text-xl">Sincronizando fogones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.find(i => i.id === item.id);
              return (
                <div key={item.id} className={`bg-white rounded-sm overflow-hidden shadow-xl border transition-all duration-500 flex flex-col group relative ${isSelected ? 'border-burgundy scale-[1.01] z-10' : 'border-stone-50 hover:-translate-y-2'}`}>
                  <div className="h-[350px] overflow-hidden relative">
                    <img src={item.imagen_url} className="w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-110 grayscale group-hover:grayscale-0" alt={item.nombre_plato} />
                    <div className="absolute top-4 right-4 bg-burgundy/90 text-white px-5 py-2 text-xl font-black shadow-lg tracking-tighter border border-white/10">${Number(item.precio).toLocaleString()}</div>
                    {isSelected && <div className="absolute inset-0 bg-burgundy/10 backdrop-blur-sm flex items-center justify-center"><div className="bg-white text-burgundy p-4 rounded-full shadow-xl animate-bounce"><Check size={32} strokeWidth={3} /></div></div>}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="text-[9px] uppercase tracking-[0.5em] font-black mb-4 text-burgundy italic">{item.categoria}</span>
                    <h3 className="text-2xl md:text-3xl font-serif text-deepBlack mb-4 uppercase tracking-tighter leading-tight group-hover:text-burgundy transition-colors">{item.nombre_plato}</h3>
                    <p className="text-stone-500 font-light text-base italic flex-grow mb-8 leading-relaxed">"{item.descripcion}"</p>
                    <button onClick={() => toggleSelection(item)} className={`w-full py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-lg ${isSelected ? 'bg-burgundy text-white' : 'bg-deepBlack text-bone hover:bg-burgundy'}`}>{isSelected ? <Check size={16}/> : <Plus size={16}/>} {isSelected ? 'Seleccionado' : 'Añadir a Mesa'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #F9F6F2; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #800020; border-radius: 10px; }`}</style>
    </div>
  );
};

export default MenuPage;