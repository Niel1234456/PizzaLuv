import React from 'react';
import { Crust, Cut } from '../types';
import { CRUSTS, CUTS } from '../constants';
import { Check, Layers, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundEffects } from '../utils/sound';

interface CrustSidebarProps {
  currentCrust: Crust;
  currentCut: Cut;
  onSetCrust: (crust: Crust) => void;
  onSetCut: (cut: Cut) => void;
}

// Custom SVG Icons for the cut types to make it visual
const CutIcon = ({ id, color }: { id: string; color: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.2" fill="currentColor" fillOpacity="0.05" />
      {id === 'classic' && (
        <>
          <path d="M12 2 L12 22" />
          <path d="M2 12 L22 12" />
          <path d="M4.93 4.93 L19.07 19.07" />
          <path d="M19.07 4.93 L4.93 19.07" />
        </>
      )}
      {id === 'square' && (
        <>
           <path d="M8 2 L8 22" />
           <path d="M16 2 L16 22" />
           <path d="M2 8 L22 8" />
           <path d="M2 16 L22 16" />
        </>
      )}
      {id === 'party' && (
        <>
           <path d="M6 3 L6 21" />
           <path d="M12 2 L12 22" />
           <path d="M18 3 L18 21" />
           <path d="M3 6 L21 6" />
           <path d="M2 12 L22 12" />
           <path d="M3 18 L21 18" />
        </>
      )}
      {/* 'uncut' has no internal lines */}
    </svg>
  );
};

export const CrustSidebar: React.FC<CrustSidebarProps> = ({
  currentCrust,
  currentCut,
  onSetCrust,
  onSetCut
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-6 shrink-0 border-b border-white/40">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                BASE & CUT
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Configure your perfect foundation</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide space-y-8">
            
            {/* Dough Selection */}
            <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                     <Layers size={14} className="text-orange-500" />
                     <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Dough Style</span>
                </div>
                
                <div className="space-y-3">
                    {CRUSTS.map((crust) => {
                        const isSelected = currentCrust.id === crust.id;
                        return (
                            <motion.button
                                key={crust.id}
                                onClick={() => {
                                    soundEffects.select();
                                    onSetCrust(crust);
                                }}
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full group relative p-3.5 rounded-2xl text-left transition-all duration-300 border ${
                                    isSelected
                                    ? 'bg-gradient-to-br from-orange-500 to-red-500 border-transparent shadow-lg shadow-orange-500/20 text-white'
                                    : 'bg-white/60 border-white/40 hover:bg-white hover:shadow-md text-slate-700'
                                }`}
                            >
                                <div className="flex justify-between items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                {crust.name}
                                            </span>
                                            {crust.price > 0 && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                                    isSelected ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'
                                                }`}>
                                                    +${crust.price}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-[11px] font-medium leading-snug ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                            {crust.description}
                                        </div>
                                    </div>
                                    
                                    {/* Animated Selection Indicator */}
                                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                                        isSelected 
                                        ? 'bg-white text-orange-500 shadow-sm scale-100' 
                                        : 'bg-slate-100/50 text-transparent scale-90 opacity-0 group-hover:opacity-100'
                                    }`}>
                                        <Check size={14} strokeWidth={4} />
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </section>

            {/* Cut Selection */}
            <section>
                 <div className="flex items-center gap-2 mb-4 px-1">
                     <Scissors size={14} className="text-slate-500" />
                     <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Slicing</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {CUTS.map((cut) => {
                         const isSelected = currentCut.id === cut.id;
                         return (
                            <motion.button
                                key={cut.id}
                                onClick={() => {
                                    soundEffects.select();
                                    onSetCut(cut);
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative aspect-square flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                                    isSelected
                                    ? 'bg-slate-800 border-slate-800 text-white shadow-xl shadow-slate-900/20'
                                    : 'bg-white/60 border-white/40 hover:bg-white hover:border-white text-slate-500 hover:text-slate-800 hover:shadow-md'
                                }`}
                            >
                                <div className={`w-12 h-12 mb-2 transition-transform duration-300 ${isSelected ? 'scale-110 text-orange-400' : 'scale-100 text-current opacity-60'}`}>
                                    <CutIcon id={cut.id} color="currentColor" />
                                </div>
                                <div className="font-bold text-xs text-center tracking-tight">{cut.name}</div>
                                
                                {isSelected && (
                                    <motion.div 
                                        layoutId="cut-indicator"
                                        className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </section>

        </div>
    </div>
  );
};