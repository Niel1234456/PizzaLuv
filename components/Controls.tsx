import React, { useState, useMemo } from 'react';
import { Size, Sauce, SelectedTopping } from '../types';
import { SIZES, SAUCES, TOPPINGS } from '../constants';
import { Check, Circle, ArrowRight, ShoppingCart, Flame, Search, ChevronLeft, ChevronRight, ArrowDownAZ, ArrowUpAZ, CircleDollarSign } from 'lucide-react';
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

const TOPPINGS_PER_PAGE = 8;

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
  // Toppings Tab UI State
  const [toppingSearch, setToppingSearch] = useState('');
  const [toppingSort, setToppingSort] = useState<'name' | 'price'>('name');
  const [toppingSortOrder, setToppingSortOrder] = useState<'asc' | 'desc'>('asc');
  const [toppingPage, setToppingPage] = useState(1);

  const handleTabChange = (tab: 'size' | 'sauce' | 'toppings') => {
      soundEffects.select();
      onTabChange(tab);
  };

  const handleToppingSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setToppingSearch(e.target.value);
      setToppingPage(1);
  };

  const toggleToppingSort = () => {
      soundEffects.select();
      if (toppingSort === 'name') {
          setToppingSort('price');
          setToppingSortOrder('asc'); // Default price low-high
      } else {
          setToppingSort('name');
          setToppingSortOrder('asc'); // Default name A-Z
      }
  };

  const filteredToppings = useMemo(() => {
    let result = [...TOPPINGS];
    
    // Search
    if (toppingSearch) {
        const q = toppingSearch.toLowerCase();
        result = result.filter(t => t.name.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
        if (toppingSort === 'name') {
            return toppingSortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
            return toppingSortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        }
    });

    return result;
  }, [toppingSearch, toppingSort, toppingSortOrder]);

  const paginatedToppings = useMemo(() => {
      const start = (toppingPage - 1) * TOPPINGS_PER_PAGE;
      return filteredToppings.slice(start, start + TOPPINGS_PER_PAGE);
  }, [filteredToppings, toppingPage]);

  const totalPages = Math.ceil(filteredToppings.length / TOPPINGS_PER_PAGE);

  const nextPage = () => {
    if (toppingPage < totalPages) {
        soundEffects.select();
        setToppingPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (toppingPage > 1) {
        soundEffects.select();
        setToppingPage(p => p - 1);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Modern Floating Tab Bar - Updated to warm colors */}
      <div className="px-5 mb-6">
        <div className="flex p-1.5 bg-orange-50 rounded-2xl relative overflow-hidden border border-orange-100">
            {(['size', 'sauce', 'toppings'] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 relative py-2.5 rounded-xl text-xs font-bold transition-all z-10 capitalize ${activeTab === tab ? 'text-orange-900' : 'text-slate-400 hover:text-orange-600'}`}
            >
                {activeTab === tab && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(249,115,22,0.15)] ring-1 ring-orange-100"
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
                <p className="text-orange-800/50 text-sm font-medium mt-1">Select the perfect size for you</p>
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
                        : 'border-transparent bg-white hover:bg-orange-50 hover:border-orange-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        {/* Visual Size Indicator */}
                        <div className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                             size.id === 's' ? 'w-12 h-12' : 
                             size.id === 'm' ? 'w-14 h-14' : 
                             size.id === 'l' ? 'w-16 h-16' : 
                             'w-20 h-20' // XL size
                        }`}>
                             <img 
                                src="https://cdn-icons-png.flaticon.com/512/9633/9633377.png"
                                alt={size.name}
                                className="w-full h-full object-contain drop-shadow-md"
                             />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-slate-800 text-sm">{size.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-orange-600 font-bold text-sm">₱{size.price}</span>
                                <span className="text-slate-300 text-xs">•</span>
                                <span className="text-slate-400 text-xs font-medium">{size.calories} cal</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        currentSize.id === size.id ? 'bg-orange-500 text-white' : 'bg-orange-50 text-transparent'
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
                <p className="text-orange-800/50 text-sm font-medium mt-1">Start with the foundation</p>
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
                        ? 'bg-white ring-2 ring-orange-500 shadow-lg shadow-orange-500/10' 
                        : 'bg-white hover:bg-orange-50 hover:shadow-md'
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
                            <span className="text-xs text-slate-400 font-medium">{sauce.price === 0 ? 'Free' : `+₱${sauce.price}`}</span>
                            <span className="text-[10px] text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100">{sauce.calories} cal</span>
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
                className="flex flex-col h-full"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300" />
                        <input 
                            type="text" 
                            placeholder="Search ingredients..." 
                            value={toppingSearch}
                            onChange={handleToppingSearch}
                            className="w-full bg-white border border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-black outline-none transition-all shadow-sm placeholder:text-gray-400"
                        />
                    </div>
                    <button 
                        onClick={toggleToppingSort}
                        className="bg-white border border-orange-100 hover:border-orange-400 p-2 rounded-xl text-black hover:text-slate-700 transition-colors shadow-sm"
                        title="Sort"
                    >
                        {toppingSort === 'name' ? <ArrowDownAZ size={16} /> : <CircleDollarSign size={16} />}
                    </button>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-red-100">Tap to cycle</span>
                    <span className="text-[10px] text-black">Whole → Left → Right</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0 overflow-y-auto p-1 pb-2 scrollbar-hide">
                {paginatedToppings.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-orange-300 text-xs">
                        No toppings found
                    </div>
                ) : (
                    paginatedToppings.map((topping) => {
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
                            ? 'bg-white shadow-[0_2px_8px_rgba(239,68,68,0.15)] ring-2 ring-red-500 z-10' 
                            : 'bg-white hover:bg-orange-50 border border-transparent hover:border-orange-100'}
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
                            
                            {/* Mode Indicator Badge - Warm Red color */}
                            {isSelected && (
                                <motion.div 
                                    key={coverage}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm border border-white"
                                >
                                    {coverage === 'whole' && <Circle size={10} fill="currentColor" />}
                                    {coverage === 'left' && <div className="w-2.5 h-2.5 rounded-full bg-white relative overflow-hidden"><div className="absolute left-0 top-0 w-1.5 h-3 bg-red-600"></div></div>}
                                    {coverage === 'right' && <div className="w-2.5 h-2.5 rounded-full bg-white relative overflow-hidden"><div className="absolute right-0 top-0 w-1.5 h-3 bg-red-600"></div></div>}
                                </motion.div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs leading-tight truncate text-black">{topping.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[10px] font-medium ${isSelected ? 'text-red-600' : 'text-slate-500'}`}>
                                    {isSelected && coverage !== 'whole' ? 'Half ' : ''}+₱{displayPrice.toFixed(0)}
                                </span>
                                <span className="text-[10px] text-red-600 font-medium">{displayCal} cal</span>
                            </div>
                        </div>
                        </motion.button>
                    );
                    })
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                  <div className="mt-3 pt-3 border-t border-orange-100 flex items-center justify-between">
                      <button 
                          onClick={prevPage}
                          disabled={toppingPage === 1}
                          className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-black"
                      >
                          <ChevronLeft size={16} />
                      </button>
                      <span className="text-[10px] font-bold text-black">
                          {toppingPage} / {totalPages}
                      </span>
                      <button 
                          onClick={nextPage}
                          disabled={toppingPage === totalPages}
                          className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-black"
                      >
                          <ChevronRight size={16} />
                      </button>
                  </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};