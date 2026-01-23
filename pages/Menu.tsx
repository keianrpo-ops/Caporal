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
  {
    id: '1',
    nombre_plato: 'Pescado Caporal',
    categoria: 'Platos de Autor',
    descripcion: 'Pesca del día con patacón artesanal y ensalada cítrica de la casa.',
    precio: 45000,
    imagen_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070',
    disponible: true
  },
  {
    id: '2',
    nombre_plato: 'Gourmet Burger',
    categoria: 'Gourmet',
    descripcion: 'Carne madurada en pan artesanal de masa madre con vegetales frescos.',
    precio: 32000,
    imagen_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899',
    disponible: true
  },
  {
    id: '3',
    nombre_plato: 'Sancocho de Gallina',
    categoria: 'DOMINGOS DEL TÍPICO',
    descripcion: 'El tradicional de los domingos, cocinado a fuego lento con el secreto de la casa.',
    precio: 38000,
    imagen_url: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=2070',
    disponible: true
  },
  {
    id: '4',
    nombre_plato: 'Ceviche de la Casona',
    categoria: 'Entradas',
    descripcion: 'Dados de pescado fresco marinados en leche de tigre con toques de cilantro.',
    precio: 28000,
    imagen_url: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=2070',
    disponible: true
  },
  {
    id: '5',
    nombre_plato: 'Gin Tonic de Autor',
    categoria: 'Coctelería',
    descripcion: 'Mixología artesanal con botánicos locales, tónica premium y cristalería de lujo.',
    precio: 25000,
    imagen_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2114',
    disponible: true
  },
  {
    id: '6',
    nombre_plato: 'Volcán de Chocolate 1961',
    categoria: 'Postres',
    descripcion: 'Centro líquido de cacao al 70%, servido con helado artesanal de vainilla.',
    precio: 18000,
    imagen_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2070',
    disponible: true
  }
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
    if (!supabase) {
      setItems(MOCK_MENU);
      setIsPreview(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .order('categoria', { ascending: true });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setItems(MOCK_MENU);
        setIsPreview(true);
      } else {
        setItems(data);
        setIsPreview(false);
      }
    } catch (err) {
      console.error(err);
      setItems(MOCK_MENU);
      setIsPreview(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item: MenuItem) => {
    let newSelection;
    if (selectedItems.find(i => i.id === item.id)) {
      newSelection = selectedItems.filter(i => i.id !== item.id);
    } else {
      newSelection = [...selectedItems, item];
      setIsDrawerOpen(true);
    }
    setSelectedItems(newSelection);
    localStorage.setItem('caporal_mesa_previa', JSON.stringify(newSelection));
  };

  const totalPrice = selectedItems.reduce((acc, curr) => acc + Number(curr.precio), 0);

  const handleReserve = () => {
    setIsDrawerOpen(false);
    navigate('/');
    setTimeout(() => {
      document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bone pt-48 pb-20 px-4 relative font-sans overflow-x-hidden">
      
      {/* INDICADOR DE MODO DEMO */}
      {isPreview && (
        <div className="max-w-7xl mx-auto mb-12">
           <div className="bg-burgundy/10 border border-burgundy/20 p-6 flex items-center gap-6 rounded-sm text-burgundy shadow-xl">
              <Info size={24} />
              <p className="text-[11px] font-black uppercase tracking-[0.3em]">
                MODO DE RESPALDO ACTIVADO: Visualizando creaciones de muestra del Legado.
              </p>
           </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE DEL CARRITO MEJORADO */}
      {selectedItems.length > 0 && !isDrawerOpen && (
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="fixed bottom-10 right-10 z-[60]"
        >
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="bg-burgundy text-white w-28 h-28 md:w-32 md:h-32 rounded-full shadow-[0_20px_60px_-15px_rgba(128,0,32,0.5)] flex items-center justify-center border-4 border-white group relative hover:scale-110 transition-transform"
          >
            <ShoppingBag size={40} className="md:size-48" />
            <span className="absolute -top-2 -right-2 bg-deepBlack text-bone w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-2xl">
              {selectedItems.length}
            </span>
          </button>
        </motion.div>
      )}

      {/* DRAWER LATERAL (MI SELECCIÓN) - REDISEÑO TOTALMENTE IMPONENTE */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDrawerOpen(false)} 
              className="fixed inset-0 bg-deepBlack/95 backdrop-blur-xl z-[100]" 
            />
            <motion.aside 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 120 }} 
              className="fixed right-0 top-0 h-full w-full lg:max-w-4xl bg-bone z-[110] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] border-l border-burgundy/10"
            >
              
              {/* Header de Selección - Mucho más grande */}
              <div className="p-10 md:p-20 border-b border-stone-200 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="space-y-6">
                   <h2 className="font-serif text-6xl md:text-[5.5rem] uppercase tracking-tighter text-deepBlack leading-none">Mi Selección</h2>
                   <p className="text-burgundy text-[12px] md:text-[14px] font-black uppercase tracking-[0.8em] italic flex items-center gap-6">
                      <div className="w-16 h-[2px] bg-burgundy"></div> RESUMEN DE MESA
                   </p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)} 
                  className="p-6 text-stone-300 hover:text-burgundy transition-all hover:scale-110"
                >
                  <X size={72} strokeWidth={1} />
                </button>
              </div>

              {/* Cuerpo de Selección - Imágenes y Textos escalados para un look de autor */}
              <div className="flex-grow overflow-y-auto p-10 md:p-20 space-y-16 custom-scrollbar">
                {selectedItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 space-y-12">
                     <UtensilsCrossed size={200} strokeWidth={0.5} />
                     <p className="font-serif italic text-5xl">Su mesa espera su elección</p>
                  </div>
                ) : selectedItems.map(item => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="bg-white p-6 md:p-12 shadow-3xl flex flex-col md:flex-row gap-12 items-center border border-stone-100 rounded-sm group relative"
                  >
                    {/* Imagen mucho más grande en el resumen */}
                    <div className="w-full md:w-80 h-80 md:h-72 shrink-0 overflow-hidden rounded-sm border-2 border-stone-50">
                      <img 
                        src={item.imagen_url} 
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125 grayscale group-hover:grayscale-0" 
                        alt={item.nombre_plato}
                      />
                    </div>
                    
                    <div className="flex-grow w-full">
                      <div className="flex justify-between items-start mb-6">
                         <h4 className="font-serif text-5xl md:text-6xl uppercase tracking-tighter text-deepBlack group-hover:text-burgundy transition-colors">
                           {item.nombre_plato}
                         </h4>
                         <button 
                           onClick={() => toggleSelection(item)} 
                           className="p-4 text-stone-200 hover:text-red-600 transition-all hover:bg-red-50 rounded-full"
                         >
                           <Trash2 size={32}/>
                         </button>
                      </div>
                      
                      <p className="text-stone-400 font-serif italic text-2xl md:text-3xl mb-10 leading-relaxed">
                        "{item.descripcion}"
                      </p>
                      
                      <div className="flex justify-between items-end border-t border-stone-50 pt-8">
                         <span className="text-[12px] font-black uppercase tracking-[0.5em] text-burgundy">
                           {item.categoria}
                         </span>
                         <span className="font-serif text-5xl md:text-6xl text-deepBlack tracking-tighter">
                           ${Number(item.precio).toLocaleString()}
                         </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer de Selección - Total Masivo e Imponente */}
              {selectedItems.length > 0 && (
                <div className="p-12 md:p-20 bg-white border-t border-stone-200 shadow-4xl sticky bottom-0 z-20">
                  <div className="flex justify-between items-end mb-16">
                     <div className="space-y-4">
                        <span className="text-[16px] uppercase tracking-[1em] font-black text-stone-400">INVERSIÓN TOTAL</span>
                        <div className="w-24 h-1 bg-burgundy"></div>
                     </div>
                     <span className="text-8xl md:text-[10rem] font-serif text-burgundy tracking-tighter leading-none">
                       ${totalPrice.toLocaleString()}
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button 
                      onClick={() => setIsDrawerOpen(false)} 
                      className="py-10 text-[12px] font-black uppercase tracking-[0.6em] border-3 border-stone-100 hover:border-burgundy text-stone-500 hover:text-burgundy transition-all rounded-sm shadow-xl"
                    >
                      Seguir Explorando
                    </button>
                    <button 
                      onClick={handleReserve} 
                      className="bg-burgundy text-white py-10 font-black uppercase tracking-[0.6em] text-[14px] shadow-4xl flex items-center justify-center gap-8 group rounded-sm active:scale-95 transition-all"
                    >
                      CONFIRMAR RITUAL 
                      <ArrowRight size={28} className="group-hover:translate-x-4 transition-transform"/>
                    </button>
                  </div>
                  
                  <p className="text-center text-[10px] text-stone-300 font-serif italic mt-12 uppercase tracking-[0.4em]">
                    "Su selección nos permitirá orquestar una experiencia sin precedentes"
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CONTENIDO PRINCIPAL DE LA CARTA */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <span className="text-burgundy uppercase tracking-[1em] text-[14px] font-black mb-10 block opacity-60">Legado Gastronómico</span>
          <h1 className="text-8xl md:text-[11rem] font-serif text-deepBlack mb-12 tracking-tighter uppercase leading-none">La Carta</h1>
          <p className="text-stone-500 italic max-w-2xl mx-auto font-light text-2xl">
            Seleccione sus creaciones favoritas para personalizar su experiencia en la casona.
          </p>
          <div className="w-40 h-[1px] bg-burgundy mx-auto mt-16 opacity-30"></div>
        </div>

        {/* FILTROS DE CATEGORÍA */}
        <div className="flex flex-wrap justify-center gap-6 mb-40 px-4">
          <button 
            onClick={() => setSearchParams({ cat: 'All' })} 
            className={`px-12 py-6 rounded-sm text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-xl ${
              activeCategory === 'All' ? 'bg-burgundy text-white border-burgundy scale-105' : 'bg-white text-stone-500 border-stone-100 hover:border-burgundy'
            }`}
          >
            Todos los platos
          </button>
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSearchParams({ cat })} 
              className={`px-12 py-6 rounded-sm text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-xl ${
                activeCategory === cat ? 'bg-burgundy text-white shadow-2xl scale-105' : 'bg-white text-stone-500 border-stone-100 hover:border-burgundy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-56">
             <div className="w-24 h-24 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
             <p className="text-stone-300 font-serif italic text-4xl animate-pulse">Sincronizando con los fogones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-24 px-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.find(i => i.id === item.id);
              return (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-sm overflow-hidden shadow-3xl border transition-all duration-700 flex flex-col group relative ${
                    isSelected ? 'border-burgundy scale-[1.02] z-10' : 'border-stone-100 hover:-translate-y-6'
                  }`}
                >
                  <div className="h-[500px] overflow-hidden relative">
                    <img 
                      src={item.imagen_url} 
                      className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-125 grayscale group-hover:grayscale-0" 
                      alt={item.nombre_plato} 
                    />
                    <div className="absolute top-10 right-10 bg-burgundy/90 text-white px-8 py-3 text-3xl font-black shadow-4xl tracking-tighter border border-white/20">
                      ${Number(item.precio).toLocaleString()}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-burgundy/20 backdrop-blur-sm flex items-center justify-center">
                         <div className="bg-white text-burgundy p-6 rounded-full shadow-4xl animate-bounce">
                            <Check size={60} strokeWidth={3} />
                         </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-14 flex flex-col flex-grow">
                    <span className="text-[11px] uppercase tracking-[0.7em] font-black mb-8 text-burgundy italic">
                      {item.categoria}
                    </span>
                    <h3 className="text-5xl font-serif text-deepBlack mb-10 uppercase tracking-tighter leading-tight group-hover:text-burgundy transition-colors">
                      {item.nombre_plato}
                    </h3>
                    <p className="text-stone-500 font-light text-2xl italic flex-grow mb-16 leading-relaxed">
                      "{item.descripcion}"
                    </p>
                    
                    <button 
                      onClick={() => toggleSelection(item)} 
                      className={`w-full py-8 rounded-sm text-[13px] font-black uppercase tracking-[0.6em] transition-all flex items-center justify-center gap-8 shadow-2xl ${
                        isSelected ? 'bg-burgundy text-white' : 'bg-deepBlack text-bone hover:bg-burgundy'
                      }`}
                    >
                      {isSelected ? <><Check size={24}/> Seleccionado</> : <><Plus size={24}/> Añadir a mi mesa</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Estilos Adicionales para el Scrollbar del Drawer */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F9F6F2;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #800020;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;