import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RECOMMENDED_PIZZAS, SAUCES, SIZES, CRUSTS, CUTS } from '../constants';
import { RecommendedPizza, PizzaState } from '../types';
import { PizzaVisuals } from './PizzaVisuals';
import { soundEffects } from '../utils/sound';
import { ArrowRight, X, ChefHat, Check, Search, ChevronLeft, ChevronRight, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

interface RecommendedSidebarProps {
  onSelectPizza: (preset: RecommendedPizza) => void;
}

const ITEMS_PER_PAGE = 4;

export const RecommendedSidebar: React.FC<RecommendedSidebarProps> = ({ onSelectPizza }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort Logic
  const filteredAndSortedPizzas = useMemo(() => {
    let result = [...RECOMMENDED_PIZZAS];

    // 1. Search
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(lowerQ) || 
            p.description.toLowerCase().includes(lowerQ)
        );
    }

    // 2. Sort
    result.sort((a, b) => {
        if (sortOrder === 'asc') return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
    });

    return result;
  }, [searchQuery, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedPizzas.length / ITEMS_PER_PAGE);
  const currentPizzas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPizzas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPizzas, currentPage]);

  // Handlers
  const handleItemClick = (id: string) => {
    soundEffects.select();
    setSelectedId(selectedId === id ? null : id);
  };

  const handleConfirm = (e: React.MouseEvent, pizza: RecommendedPizza) => {
    e.stopPropagation();
    soundEffects.confirm();
    onSelectPizza(pizza);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1); // Reset to page 1 on search
  };

  const toggleSort = () => {
      soundEffects.select();
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const nextPage = () => {
      if (currentPage < totalPages) {
          soundEffects.select();
          setCurrentPage(prev => prev + 1);
      }
  };

  const prevPage = () => {
      if (currentPage > 1) {
          soundEffects.select();
          setCurrentPage(prev => prev - 1);
      }
  };

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, type: "spring", damping: 20 }}
      className="hidden md:flex flex-col h-[92vh] w-[280px] absolute left-5 top-[4vh] bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/40 ring-1 ring-black/5 z-20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 bg-white/50 border-b border-white/60 backdrop-blur-md z-10 space-y-4">
         <div className="flex items-center gap-3">
             <div className="bg-slate-900 text-white p-2 rounded-lg shadow-lg shadow-slate-900/20">
                 <ChefHat size={18} />
             </div>
             <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">PizzaCraft</h1>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full">Menu</span>
                </div>
             </div>
         </div>

         {/* Search & Sort Controls */}
         <div className="flex gap-2">
            <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Find flavor..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full bg-slate-50 border border-white focus:border-orange-200 focus:ring-2 focus:ring-orange-100 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all"
                />
            </div>
            <button 
                onClick={toggleSort}
                className="bg-slate-50 border border-white hover:bg-white p-2 rounded-xl text-slate-500 hover:text-orange-500 transition-colors"
                title="Sort A-Z"
            >
                {sortOrder === 'asc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
            </button>
         </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chef's Selection</h2>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{filteredAndSortedPizzas.length}</span>
        </div>
        
        {filteredAndSortedPizzas.length === 0 ? (
            <div className="text-center py-8 opacity-50">
                <span className="text-2xl block mb-2">🍕</span>
                <p className="text-xs font-medium text-slate-500">No pizzas found.</p>
            </div>
        ) : (
            <div className="space-y-3 pb-2">
                <AnimatePresence mode="wait">
                    {currentPizzas.map((pizza) => {
                        const isSelected = selectedId === pizza.id;
                        
                        // Increased scale for better visibility inside larger thumbnail
                        const tempState: PizzaState = {
                            size: { ...SIZES[1], scale: 1 }, 
                            sauce: SAUCES.find(s => s.id === pizza.sauceId) || SAUCES[0],
                            toppings: pizza.toppings.map(tId => ({ id: tId, coverage: 'whole' })),
                            crust: CRUSTS[0],
                            cut: CUTS[0]
                        };

                        return (
                            <motion.div
                                key={pizza.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onClick={() => handleItemClick(pizza.id)}
                                className={`relative transition-all duration-300 overflow-hidden cursor-pointer group border rounded-2xl ${
                                    isSelected 
                                    ? 'bg-white border-orange-200 ring-4 ring-orange-500/10 shadow-xl z-10' 
                                    : 'bg-white border-transparent hover:border-slate-100 hover:shadow-lg'
                                }`}
                            >
                                <div className="p-3">
                                    <div className="flex items-start gap-4">
                                        {/* Thumbnail - Increased size to w-20 h-20 (80px) */}
                                        <motion.div 
                                            layout
                                            className="w-20 h-20 flex-shrink-0 bg-slate-50 rounded-full overflow-hidden relative shadow-inner"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <PizzaVisuals 
                                                    state={tempState} 
                                                    isThumbnail={true} 
                                                    idPrefix={`thumb-${pizza.id}-`} 
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Info */}
                                        <motion.div layout className="flex-1 min-w-0 py-1">
                                            <h3 className={`font-bold leading-tight transition-colors ${
                                                isSelected ? 'text-slate-900 text-sm' : 'text-slate-700 text-xs'
                                            }`}>
                                                {pizza.name}
                                            </h3>
                                            
                                            {!isSelected && (
                                                <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-3">
                                                    {pizza.description}
                                                </p>
                                            )}

                                            {/* Expand details hint */}
                                            {!isSelected && (
                                                <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span>Details</span>
                                                    <ArrowRight size={8} />
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-2 border-t border-slate-100 mt-2">
                                                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                                        {pizza.description}
                                                    </p>

                                                    <button
                                                        onClick={(e) => handleConfirm(e, pizza)}
                                                        className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-slate-900/20 hover:bg-black transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <span>Select</span>
                                                        <div className="bg-white/20 rounded-full p-0.5">
                                                            <Check size={10} strokeWidth={3} />
                                                        </div>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 bg-white/60 border-t border-white/60 backdrop-blur-md flex items-center justify-between">
            <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-bold text-slate-400">
                Page {currentPage} of {totalPages}
            </span>
            <button 
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
            >
                <ChevronRight size={16} />
            </button>
        </div>
      )}
    </motion.div>
  );
};