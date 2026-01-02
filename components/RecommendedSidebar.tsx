import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RECOMMENDED_PIZZAS, SAUCES, SIZES, CRUSTS, CUTS } from '../constants';
import { RecommendedPizza, PizzaState } from '../types';
import { PizzaVisuals } from './PizzaVisuals';
import { soundEffects } from '../utils/sound';
import { ArrowRight, X, ChefHat, Check } from 'lucide-react';

interface RecommendedSidebarProps {
  onSelectPizza: (preset: RecommendedPizza) => void;
}

export const RecommendedSidebar: React.FC<RecommendedSidebarProps> = ({ onSelectPizza }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleItemClick = (id: string) => {
    soundEffects.select();
    setSelectedId(selectedId === id ? null : id);
  };

  const handleConfirm = (e: React.MouseEvent, pizza: RecommendedPizza) => {
    e.stopPropagation();
    soundEffects.confirm();
    onSelectPizza(pizza);
  };

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, type: "spring", damping: 20 }}
      className="hidden md:flex flex-col h-[92vh] w-[280px] absolute left-5 top-[4vh] bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/40 ring-1 ring-black/5 z-20 overflow-hidden"
    >
      <div className="p-6 bg-white/50 border-b border-white/60 backdrop-blur-md z-10">
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
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chef's Selection</h2>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{RECOMMENDED_PIZZAS.length}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pb-4">
            {RECOMMENDED_PIZZAS.map((pizza) => {
                const isSelected = selectedId === pizza.id;
                
                // Scale adjusted to 0.75 to ensure crust is fully visible within the thumbnail circle
                const tempState: PizzaState = {
                    size: { ...SIZES[1], scale: 0.75 }, 
                    sauce: SAUCES.find(s => s.id === pizza.sauceId) || SAUCES[0],
                    toppings: pizza.toppings.map(tId => ({ id: tId, coverage: 'whole' })),
                    crust: CRUSTS[0],
                    cut: CUTS[0]
                };

                return (
                    <motion.div
                        key={pizza.id}
                        layout
                        initial={{ borderRadius: 16 }}
                        onClick={() => handleItemClick(pizza.id)}
                        className={`relative transition-all duration-300 overflow-hidden cursor-pointer group border ${
                            isSelected 
                            ? 'bg-white border-orange-200 ring-4 ring-orange-500/10 shadow-xl z-10' 
                            : 'bg-white border-transparent hover:border-slate-100 hover:shadow-lg'
                        }`}
                    >
                        <div className="p-3">
                            <div className="flex items-start gap-4">
                                {/* Large Pizza Visual */}
                                <motion.div 
                                    layout
                                    className="w-24 h-24 flex-shrink-0 bg-slate-50 rounded-full overflow-hidden relative shadow-inner"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PizzaVisuals 
                                            state={tempState} 
                                            isThumbnail={true} 
                                            idPrefix={`thumb-${pizza.id}-`} 
                                        />
                                    </div>
                                </motion.div>

                                {/* Name & Info Side-by-Side */}
                                <motion.div layout className="flex-1 min-w-0 pt-2">
                                    <h3 className={`font-bold leading-tight transition-colors ${
                                        isSelected ? 'text-slate-900 text-lg' : 'text-slate-700 text-base'
                                    }`}>
                                        {pizza.name}
                                    </h3>
                                    
                                    {!isSelected && (
                                         <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                                            {pizza.description}
                                        </p>
                                    )}

                                    {/* Selection Indicator if not fully expanded yet */}
                                    {!isSelected && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>View details</span>
                                            <ArrowRight size={10} />
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Expandable Content: Description & Button */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-3 border-t border-slate-100 mt-3">
                                            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                                {pizza.description}
                                            </p>

                                            <button
                                                onClick={(e) => handleConfirm(e, pizza)}
                                                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-black transition-all flex items-center justify-center gap-2"
                                            >
                                                <span>Choose {pizza.name}</span>
                                                <div className="bg-white/20 rounded-full p-0.5">
                                                     <Check size={12} strokeWidth={3} />
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {isSelected && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(null);
                                }}
                                className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </motion.div>
                );
            })}
        </div>
      </div>
    </motion.div>
  );
};