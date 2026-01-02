import React from 'react';
import { Crust, Cut } from '../types';
import { CRUSTS, CUTS } from '../constants';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundEffects } from '../utils/sound';

interface CrustSidebarProps {
  currentCrust: Crust;
  currentCut: Cut;
  onSetCrust: (crust: Crust) => void;
  onSetCut: (cut: Cut) => void;
}

export const CrustSidebar: React.FC<CrustSidebarProps> = ({
  currentCrust,
  currentCut,
  onSetCrust,
  onSetCut
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
        <div className="p-4 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dough & Cut</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide space-y-6">
            
            {/* Dough Selection */}
            <div className="space-y-3">
                <div className="text-sm font-bold text-slate-800">Crust Style</div>
                <div className="space-y-2">
                    {CRUSTS.map((crust) => (
                        <button
                        key={crust.id}
                        onClick={() => {
                            soundEffects.select();
                            onSetCrust(crust);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center group ${
                            currentCrust.id === crust.id
                            ? 'bg-white ring-2 ring-orange-500 shadow-md'
                            : 'bg-white hover:bg-slate-50 hover:shadow-sm'
                        }`}
                        >
                            <div className="min-w-0 pr-2">
                                <div className="font-bold text-slate-800 text-xs leading-tight">{crust.name}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{crust.description}</div>
                            </div>
                            {currentCrust.id === crust.id && (
                                <div className="text-orange-500 flex-shrink-0">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cut Selection */}
            <div className="space-y-3">
                <div className="text-sm font-bold text-slate-800">Slicing</div>
                <div className="grid grid-cols-1 gap-2">
                    {CUTS.map((cut) => (
                        <button
                        key={cut.id}
                        onClick={() => {
                            soundEffects.select();
                            onSetCut(cut);
                        }}
                        className={`p-3 rounded-xl transition-all flex items-center gap-3 text-left ${
                            currentCut.id === cut.id
                            ? 'bg-slate-800 text-white shadow-lg'
                            : 'bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                        >
                            <div className="flex-1">
                                <div className={`font-bold text-xs ${currentCut.id === cut.id ? 'text-white' : 'text-slate-700'}`}>{cut.name}</div>
                                <div className={`text-[10px] mt-0.5 ${currentCut.id === cut.id ? 'text-slate-400' : 'text-slate-400'}`}>{cut.description}</div>
                            </div>
                            {currentCut.id === cut.id && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
};