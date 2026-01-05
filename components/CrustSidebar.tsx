import React, { useState } from 'react';
import { Crust, Cut } from '../types';
import { CRUSTS, CUTS } from '../constants';
import { Check, Layers, Scissors } from 'lucide-react';
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
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <defs>
        <clipPath id={`cut-clip-${id}`}>
            <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>
      
      {/* Pizza Base Background */}
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      
      {/* Cut Lines - Clipped to stay inside circle */}
      <g clipPath={`url(#cut-clip-${id})`} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {id === 'classic' && (
            <>
            <line x1="12" y1="0" x2="12" y2="24" />
            <line x1="0" y1="12" x2="24" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </>
        )}
        {id === 'six_slice' && (
            <>
            <line x1="12" y1="0" x2="12" y2="24" />
            <line x1="12" y1="0" x2="12" y2="24" transform="rotate(60, 12, 12)" />
            <line x1="12" y1="0" x2="12" y2="24" transform="rotate(120, 12, 12)" />
            </>
        )}
        {id === 'strips' && (
            <>
            <line x1="6" y1="0" x2="6" y2="24" />
            <line x1="10" y1="0" x2="10" y2="24" />
            <line x1="14" y1="0" x2="14" y2="24" />
            <line x1="18" y1="0" x2="18" y2="24" />
            </>
        )}
        {id === 'square' && (
            <>
            {/* 3x3 Grid pattern - Lines at approx 1/3 and 2/3 of 20 unit width centered at 12 */}
            <line x1="8.5" y1="0" x2="8.5" y2="24" />
            <line x1="15.5" y1="0" x2="15.5" y2="24" />
            <line x1="0" y1="8.5" x2="24" y2="8.5" />
            <line x1="0" y1="15.5" x2="24" y2="15.5" />
            </>
        )}
        {id === 'party' && (
            <>
            {/* 4x4 Grid pattern - Lines at 1/4 intervals */}
            <line x1="7" y1="0" x2="7" y2="24" />
            <line x1="12" y1="0" x2="12" y2="24" />
            <line x1="17" y1="0" x2="17" y2="24" />
            
            <line x1="0" y1="7" x2="24" y2="7" />
            <line x1="0" y1="12" x2="24" y2="12" />
            <line x1="0" y1="17" x2="24" y2="17" />
            </>
        )}
      </g>
      
      {/* Outer Rim (Crust) - Redrawn on top for clarity */}
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export const CrustSidebar: React.FC<CrustSidebarProps> = ({
  currentCrust,
  currentCut,
  onSetCrust,
  onSetCut
}) => {
  const [activeTab, setActiveTab] = useState<'dough' | 'cut'>('dough');

  const handleTabChange = (tab: 'dough' | 'cut') => {
      soundEffects.select();
      setActiveTab(tab);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden pt-6">
        {/* Tab Bar Header - Matching Controls.tsx style */}
        <div className="px-5 mb-2 shrink-0">
             <div className="flex p-1.5 bg-orange-50 rounded-2xl relative overflow-hidden border border-orange-100">
                {(['dough', 'cut'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-1 relative py-2.5 rounded-xl text-xs font-bold transition-all z-10 capitalize ${activeTab === tab ? 'text-orange-900' : 'text-slate-400 hover:text-orange-600'}`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeCrustTab"
                                className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(249,115,22,0.15)] ring-1 ring-orange-100"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10 tracking-wide flex items-center justify-center gap-2">
                             {tab === 'dough' ? 'Dough' : 'Slicing'}
                        </span>
                    </button>
                ))}
             </div>
        </div>

        {/* Content Pages */}
        <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
                
                {/* PAGE 1: DOUGH SELECTION */}
                {activeTab === 'dough' && (
                    <motion.div
                        key="dough-page"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="absolute inset-0 overflow-y-auto px-4 py-2 scrollbar-hide pb-20"
                    >
                         <div className="text-center mb-4 mt-2">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Layers size={14} className="text-orange-600" />
                                Base Style
                            </h3>
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
                    </motion.div>
                )}

                {/* PAGE 2: CUT SELECTION */}
                {activeTab === 'cut' && (
                    <motion.div
                        key="cut-page"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        className="absolute inset-0 overflow-y-auto px-4 py-2 scrollbar-hide pb-20"
                    >
                         <div className="text-center mb-4 mt-2">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Scissors size={14} className="text-red-500" />
                                Cut Style
                            </h3>
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