import React from 'react';
import { Size, Sauce, SelectedTopping } from '../types';
import { SIZES, SAUCES, TOPPINGS } from '../constants';
import { Check, Circle, CircleDashed, ArrowRight, ArrowLeft } from 'lucide-react';
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
      {/* Modern Segmented Control Tab Bar */}
      <div className="flex p-1 bg-gray-100/80 rounded-2xl mx-4 mb-6 relative backdrop-blur-sm">
        {(['size', 'sauce', 'toppings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 relative py-3 rounded-xl text-sm font-bold transition-colors z-10 capitalize ${activeTab === tab ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
        <AnimatePresence mode="wait">
          
          {/* SIZE PANEL */}
          {activeTab === 'size' && (
            <motion.div
              key="size-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Select Size</h3>
                <p className="text-gray-500 text-sm">How hungry are you?</p>
              </div>
              <div className="flex flex-col gap-4 items-center">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                        soundEffects.select();
                        onSetSize(size);
                    }}
                    className={`w-full max-w-sm flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      currentSize.id === size.id
                        ? 'border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100'
                        : 'border-white bg-white/60 hover:bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        {/* Visual Size Indicator */}
                        <div className={`rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-yellow-100 ${
                            size.id === 's' ? 'w-10 h-10' : size.id === 'm' ? 'w-14 h-14' : 'w-20 h-20'
                        }`}>
                             <span className="text-xs font-bold text-gray-500">{size.name.split(' ')[0][0]}</span>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-gray-800 text-lg">{size.name}</div>
                            <div className="text-orange-600 font-bold">${size.price}</div>
                        </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        currentSize.id === size.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}>
                        {currentSize.id === size.id && <Check size={14} color="white" strokeWidth={4} />}
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
                <h3 className="text-lg font-bold text-gray-800">Pick Your Base</h3>
                <p className="text-gray-500 text-sm">The foundation of flavor.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {SAUCES.map((sauce) => (
                  <button
                    key={sauce.id}
                    onClick={() => {
                        soundEffects.select();
                        onSetSauce(sauce);
                    }}
                    className={`relative overflow-hidden group p-4 rounded-2xl border-2 transition-all h-40 flex flex-col items-center justify-center gap-3 ${
                        currentSauce.id === sauce.id 
                        ? 'border-orange-500 bg-white shadow-lg' 
                        : 'border-transparent bg-white/60 hover:bg-white'
                    }`}
                  >
                    <motion.div 
                        className="w-16 h-16 rounded-full shadow-inner border-4 border-white overflow-hidden flex items-center justify-center bg-white"
                        whileHover={{ scale: 1.1 }}
                    >
                        {sauce.iconUrl ? (
                            <img src={sauce.iconUrl} alt={sauce.name} className="w-full h-full object-contain p-2" />
                        ) : (
                            <div className="w-full h-full" style={{ backgroundColor: sauce.color }} />
                        )}
                    </motion.div>
                    <div className="text-center z-10">
                        <div className="font-bold text-gray-800">{sauce.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{sauce.price === 0 ? 'Included' : `+$${sauce.price}`}</div>
                    </div>
                    {currentSauce.id === sauce.id && (
                        <div className="absolute top-3 right-3 text-orange-500 bg-orange-50 rounded-full p-1">
                             <Check size={16} strokeWidth={3} />
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
                <h3 className="text-lg font-bold text-gray-800">Add Toppings</h3>
                <p className="text-gray-500 text-sm">Tap to cycle: Whole → Left → Right</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TOPPINGS.map((topping) => {
                  const selectedTopping = selectedToppings.find(t => t.id === topping.id);
                  const isSelected = !!selectedTopping;
                  const coverage = selectedTopping?.coverage;

                  // Adjust price based on size multiplier and coverage
                  // Assuming half toppings are 50% price
                  const basePrice = topping.price * currentSize.toppingPriceMultiplier;
                  const displayPrice = isSelected && coverage !== 'whole' ? basePrice * 0.5 : basePrice;

                  return (
                    <motion.button
                      key={topping.id}
                      onClick={() => onToggleTopping(topping.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200
                        ${isSelected
                          ? 'border-green-500 bg-green-50 shadow-md' 
                          : 'border-transparent bg-white/60 hover:bg-white hover:border-green-200'}
                      `}
                    >
                      <div className="w-12 h-12 mb-2 relative flex items-center justify-center">
                         {topping.iconUrl ? (
                             <img 
                                src={topping.iconUrl} 
                                alt={topping.name} 
                                className={`w-10 h-10 object-contain drop-shadow-sm transition-all duration-300 ${isSelected ? 'scale-110' : 'opacity-80 scale-100 grayscale-[30%]'}`}
                             />
                         ) : (
                             <div className="w-full h-full rounded-full opacity-80" style={{ backgroundColor: topping.color }} />
                         )}
                         
                         {/* Mode Indicator Badge */}
                         {isSelected && (
                             <motion.div 
                                key={coverage}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-sm"
                             >
                                {coverage === 'whole' && <Circle size={12} fill="currentColor" />}
                                {coverage === 'left' && <div className="w-3 h-3 rounded-full bg-white relative overflow-hidden"><div className="absolute left-0 top-0 w-1.5 h-3 bg-green-600"></div></div>}
                                {coverage === 'right' && <div className="w-3 h-3 rounded-full bg-white relative overflow-hidden"><div className="absolute right-0 top-0 w-1.5 h-3 bg-green-600"></div></div>}
                             </motion.div>
                         )}
                      </div>
                      
                      <span className="font-bold text-sm text-gray-800 text-center leading-tight">{topping.name}</span>
                      <span className="text-xs text-gray-500 font-medium mt-1">
                        {isSelected && coverage !== 'whole' ? 'Half ' : ''}+${displayPrice.toFixed(2)}
                      </span>
                      
                      {isSelected && (
                        <div className="mt-1 text-[10px] text-green-700 font-bold uppercase tracking-wider">
                            {coverage === 'whole' ? 'Whole' : coverage === 'left' ? 'Left Half' : 'Right Half'}
                        </div>
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