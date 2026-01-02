import React from 'react';
import { motion } from 'framer-motion';
import { RECOMMENDED_PIZZAS, SAUCES, SIZES } from '../constants';
import { RecommendedPizza, PizzaState } from '../types';
import { PizzaVisuals } from './PizzaVisuals';
import { soundEffects } from '../utils/sound';

interface RecommendedSidebarProps {
  onSelectPizza: (preset: RecommendedPizza) => void;
}

export const RecommendedSidebar: React.FC<RecommendedSidebarProps> = ({ onSelectPizza }) => {
  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="hidden md:flex flex-col h-[90vh] w-[320px] absolute left-4 top-[5vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-20 overflow-hidden"
    >
      <div className="p-6 bg-white/50 border-b border-gray-100">
         <div className="flex items-center gap-2 mb-1">
             <div className="bg-orange-600 text-white p-2 rounded-lg shadow-sm">
                 <span className="font-bold text-lg">🍕</span>
             </div>
             <h1 className="text-xl font-black tracking-tight text-gray-800">PizzaCraft</h1>
         </div>
         <p className="text-xs text-gray-500 font-medium pl-1">Interactive Builder</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Chef's Favorites</h2>
        
        {RECOMMENDED_PIZZAS.map((pizza) => {
            // Construct a temporary state for the visualization
            const tempState: PizzaState = {
                size: { ...SIZES[1], scale: 0.6 }, // Small scale for thumbnail
                sauce: SAUCES.find(s => s.id === pizza.sauceId) || SAUCES[0],
                toppings: pizza.toppings.map(tId => ({ id: tId, coverage: 'whole' }))
            };

            return (
                <motion.button
                    key={pizza.id}
                    onClick={() => {
                        soundEffects.select();
                        onSelectPizza(pizza);
                    }}
                    className="w-full bg-white rounded-2xl p-3 shadow-sm border border-transparent hover:border-orange-300 hover:shadow-md transition-all group text-left relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 relative flex-shrink-0">
                            <div className="absolute inset-0 transform scale-125">
                                <PizzaVisuals 
                                    state={tempState} 
                                    isThumbnail={true} 
                                    idPrefix={`thumb-${pizza.id}-`} 
                                />
                            </div>
                        </div>
                        <div className="flex-1 z-10">
                            <h3 className="font-bold text-gray-800 leading-tight group-hover:text-orange-600 transition-colors">
                                {pizza.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {pizza.description}
                            </p>
                            <span className="text-[10px] font-bold text-orange-500 mt-2 inline-block bg-orange-50 px-2 py-0.5 rounded-full">
                                Apply Preset
                            </span>
                        </div>
                    </div>
                </motion.button>
            );
        })}
      </div>
      
      <div className="p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          Select a favorite to start customizing
      </div>
    </motion.div>
  );
};