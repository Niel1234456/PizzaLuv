import React from 'react';
import { Size, Sauce, SelectedTopping } from '../types';
import { SIZES, SAUCES, TOPPINGS } from '../constants';
import { Check, Circle, ArrowRight, ShoppingCart, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffects } from '../utils/sound';

interface ControlsProps {
  currentSize: Size;
  currentSauce: Sauce;
  selectedToppings: SelectedTopping[];
  activeTab: 'size' | 'sauce' | 'toppings';
  onSetSize: (size: Size) => void;
  onSetSauce: (sauce: Sauce) => void;
  onToggleTopping: (toppingId: string) => void;
  onTabChange: (tab: 'size' | 'sauce' | 'toppings') => void;
}

export const Controls: React.FC<ControlsProps> = ({
  currentSize,
  currentSauce,
  selectedToppings,
  activeTab,
  onSetSize,
  onSetSauce,
  onToggleTopping,
  onTabChange
}) => {

  const handleTabChange = (tab: 'size' | 'sauce' | 'toppings') => {
      soundEffects.select();
      onTabChange(tab);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Modern Floating Tab Bar */}
      <div className="px-5 mb-6">
        <div className="flex p-1.5 bg-slate-100 rounded-2xl relative overflow-hidden">
            {(['size', 'sauce', 'toppings'] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 relative py-2.5 rounded-xl text-xs font-bold transition-all z-10 capitalize ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                {activeTab === tab && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
                )}
                <span className="relative z-10 tracking-wide">{tab}</span>
            </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          
          {/* SIZE PANEL */}
          {activeTab === 'size' && (
            <motion.div
              key="size-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Choose Size</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Select the perfect size for you</p>
              </div>
              <div className="flex flex-col gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                        soundEffects.select();
                        onSetSize(size);
                    }}
                    className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                      currentSize.id === size.id
                        ? 'border-orange-500 bg-white shadow-[0_4px_12px_rgba(249,115,22,0.15)] ring-1 ring-orange-500'
                        : 'border-transparent bg-white hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        {/* Visual Size Indicator */}
                        <div className={`rounded-full border border-dashed border-slate-300 flex items-center justify-center bg-orange-50 transition-transform group-hover:scale-110 ${
                            size.id === 's' ? 'w-10 h-10' : size.id === 'm' ? 'w-12 h-12' : 'w-14 h-14'
                        }`}>
                             <span className="text-sm font-bold text-orange-400">{size.name.charAt(0)}</span>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-slate-800 text-sm">{size.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-orange-600 font-bold text-sm">${size.price}</span>
                                <span className="text-slate-300 text-xs">•</span>
                                <span className="text-slate-400 text-xs font-medium">{size.calories} cal</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        currentSize.id === size.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-transparent'
                    }`}>
                        <Check size={14} strokeWidth={3} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SAUCE PANEL */}
          {activeTab === 'sauce' && (
            <motion.div
              key="sauce-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
               <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Base Sauce</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Start with the foundation</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SAUCES.map((sauce) => (
                  <button
                    key={sauce.id}
                    onClick={() => {
                        soundEffects.select();
                        onSetSauce(sauce);
                    }}
                    className={`relative overflow-hidden group p-4 rounded-3xl transition-all h-40 flex flex-col items-center justify-center gap-3 ${
                        currentSauce.id === sauce.id 
                        ? 'bg-white ring-2 ring-orange-500 shadow-lg' 
                        : 'bg-white hover:shadow-md'
                    }`}
                  >
                    <motion.div 
                        className="w-16 h-16 rounded-full shadow-sm bg-slate-50 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        {sauce.iconUrl ? (
                            <img src={sauce.iconUrl} alt={sauce.name} className="w-10 h-10 object-contain" />
                        ) : (
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: sauce.color }} />
                        )}
                    </motion.div>
                    <div className="text-center z-10">
                        <div className="font-bold text-slate-800 text-sm">{sauce.name}</div>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <span className="text-xs text-slate-400 font-medium">{sauce.price === 0 ? 'Free' : `+$${sauce.price}`}</span>
                            <span className="text-[10px] text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-full">{sauce.calories} cal</span>
                        </div>
                    </div>
                    {currentSauce.id === sauce.id && (
                        <div className="absolute top-3 right-3 text-orange-500">
                             <div className="bg-orange-100 rounded-full p-1">
                                <Check size={12} strokeWidth={3} />
                             </div>
                        </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* TOPPINGS PANEL */}
          {activeTab === 'toppings' && (
             <motion.div
                key="toppings-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Toppings</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Tap to cycle</span>
                    <span className="text-xs text-slate-400">Whole → Left → Right</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {TOPPINGS.map((topping) => {
                  const selectedTopping = selectedToppings.find(t => t.id === topping.id);
                  const isSelected = !!selectedTopping;
                  const coverage = selectedTopping?.coverage;

                  const basePrice = topping.price * currentSize.toppingPriceMultiplier;
                  const displayPrice = isSelected && coverage !== 'whole' ? basePrice * 0.5 : basePrice;

                  // Simple Calorie estimate per topping portion
                  const baseCal = topping.calories; 
                  const displayCal = isSelected && coverage !== 'whole' ? Math.round(baseCal * 0.5) : baseCal;

                  return (
                    <motion.button
                      key={topping.id}
                      onClick={() => onToggleTopping(topping.id)}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        relative flex items-center p-3 rounded-2xl transition-all duration-200 text-left gap-3
                        ${isSelected
                          ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-2 ring-emerald-500 z-10' 
                          : 'bg-white hover:bg-slate-50'}
                      `}
                    >
                      <div className="w-8 h-8 relative flex-shrink-0 flex items-center justify-center">
                         {topping.iconUrl ? (
                             <img 
                                src={topping.iconUrl} 
                                alt={topping.name} 
                                className={`w-full h-full object-contain drop-shadow-sm transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-95'}`}
                             />
                         ) : (
                             <div className="w-full h-full rounded-full" style={{ backgroundColor: topping.color }} />
                         )}
                         
                         {/* Mode Indicator Badge */}
                         {isSelected && (
                             <motion.div 
                                key={coverage}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm border border-white"
                             >
                                {coverage === 'whole' && <Circle size={10} fill="currentColor" />}
                                {coverage === 'left' && <div className="w-2.5 h-2.5 rounded-full bg-white relative overflow-hidden"><div className="absolute left-0 top-0 w-1.5 h-3 bg-emerald-600"></div></div>}
                                {coverage === 'right' && <div className="w-2.5 h-2.5 rounded-full bg-white relative overflow-hidden"><div className="absolute right-0 top-0 w-1.5 h-3 bg-emerald-600"></div></div>}
                             </motion.div>
                         )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <div className={`font-bold text-xs leading-tight truncate ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{topping.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {isSelected && coverage !== 'whole' ? 'Half ' : ''}+${displayPrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-300 font-medium">{displayCal} cal</span>
                          </div>
                      </div>
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