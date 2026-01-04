import React, { useState } from 'react';
import { Crust, Cut } from '../types';
import { CRUSTS, CUTS } from '../constants';
import { Check, Layers, Scissors, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [step, setStep] = useState<'dough' | 'cut'>('dough');

  const goToCut = () => {
      soundEffects.select();
      setStep('cut');
  };

  const goToDough = () => {
      soundEffects.select();
      setStep('dough');
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Dynamic Header */}
        <div className="px-5 py-6 shrink-0 border-b border-orange-100/50 flex flex-col justify-center min-h-[90px]">
             <AnimatePresence mode="wait">
                {step === 'dough' ? (
                    <motion.div
                        key="header-dough"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                    >
                         <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            BASE & CRUST
                        </h3>
                        <p className="text-xs text-orange-800/60 font-medium mt-1">Select your perfect foundation</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="header-cut"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                    >
                         <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            SLICING STYLE
                        </h3>
                        <p className="text-xs text-orange-800/60 font-medium mt-1">How should we cut it?</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Content Pages */}
        <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
                
                {/* PAGE 1: DOUGH SELECTION */}
                {step === 'dough' && (
                    <motion.div
                        key="dough-page"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        className="absolute inset-0 overflow-y-auto px-4 py-6 scrollbar-hide pb-20"
                    >
                        <div className="flex items-center gap-2 mb-4 px-1">
                             <Layers size={14} className="text-orange-600" />
                             <span className="text-[10px] font-extrabold text-black uppercase tracking-widest">Dough Style</span>
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
                                            ? 'bg-gradient-to-br from-red-500 to-orange-500 border-transparent shadow-lg shadow-orange-500/20 text-white'
                                            : 'bg-white border-orange-100 hover:bg-orange-50 hover:border-orange-200 text-slate-700 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center gap-3">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="flex justify-between items-start mb-0.5 w-full">
                                                    <span className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                        {crust.name}
                                                    </span>
                                                    {crust.price > 0 && (
                                                        <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap ${
                                                            isSelected ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            +₱{crust.price}
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
                                                ? 'bg-white text-orange-600 shadow-sm scale-100' 
                                                : 'bg-orange-50 text-transparent scale-90 opacity-0 group-hover:opacity-100'
                                            }`}>
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <motion.button
                            onClick={goToCut}
                            className="w-full mt-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-black shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                        >
                            <span>Next: Slicing</span>
                            <ArrowRight size={14} />
                        </motion.button>
                    </motion.div>
                )}

                {/* PAGE 2: CUT SELECTION */}
                {step === 'cut' && (
                    <motion.div
                        key="cut-page"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className="absolute inset-0 overflow-y-auto px-4 py-6 scrollbar-hide pb-20"
                    >
                        <button 
                            onClick={goToDough}
                            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-orange-600 mb-6 px-1 transition-colors group"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Base
                        </button>

                         <div className="flex items-center gap-2 mb-4 px-1">
                             <Scissors size={14} className="text-red-500" />
                             <span className="text-[10px] font-extrabold text-black uppercase tracking-widest">Select Cut</span>
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
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20'
                                            : 'bg-white border-orange-100 hover:bg-orange-50 hover:border-orange-200 text-slate-500 hover:text-orange-800 hover:shadow-md'
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
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    </div>
  );
};