import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Pizza } from 'lucide-react';
import Confetti from 'react-confetti';
import { PizzaState } from '../types';
import { TOPPINGS } from '../constants';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PizzaState;
  totalPrice: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, state, totalPrice }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Confetti only inside this context ideally, or full screen */}
      <div className="fixed inset-0 pointer-events-none z-60">
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-50"
      >
        <div className="bg-green-500 p-6 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Pizza size={200} className="absolute -left-10 -top-10 rotate-12" />
                <Pizza size={150} className="absolute -right-10 bottom-0 -rotate-12" />
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 mx-auto mb-3 shadow-lg"
            >
                <CheckCircle size={32} strokeWidth={3} />
            </motion.div>
            <h2 className="text-2xl font-bold relative z-10">Order Confirmed!</h2>
            <p className="text-green-100 relative z-10">Your pizza is being prepared.</p>
        </div>

        <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Order Summary</h3>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Size: {state.size.name}</span>
                    <span className="font-semibold text-gray-900">${state.size.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Sauce: {state.sauce.name}</span>
                    <span className="font-semibold text-gray-900">
                        {state.sauce.price > 0 ? `$${state.sauce.price.toFixed(2)}` : 'Included'}
                    </span>
                </div>
                
                {state.toppings.length > 0 && (
                    <div className="border-t border-dashed my-2 pt-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1 block">Toppings</span>
                        {state.toppings.map(selected => {
                            const topping = TOPPINGS.find(t => t.id === selected.id);
                            if (!topping) return null;
                            
                            const multiplier = state.size.toppingPriceMultiplier;
                            let price = topping.price * multiplier;
                            if (selected.coverage !== 'whole') price *= 0.5;

                            return (
                                <div key={selected.id} className="flex justify-between items-center py-0.5">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 pl-2 border-l-2 border-gray-200">{topping.name}</span>
                                        {selected.coverage !== 'whole' && (
                                            <span className="text-[10px] text-gray-400 pl-2 uppercase font-bold">{selected.coverage} Half</span>
                                        )}
                                    </div>
                                    <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t-2 border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg active:scale-95 transform duration-100"
            >
                Start New Pizza
            </button>
        </div>
      </motion.div>
    </div>
  );
};