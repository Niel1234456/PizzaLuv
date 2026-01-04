import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Pizza } from 'lucide-react';
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="fixed inset-0 pointer-events-none z-60">
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} colors={['#F97316', '#DC2626', '#EAB308', '#ffffff']} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden z-50 ring-1 ring-black/5"
      >
        <div className="p-8 pb-0 text-center">
            <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
            >
                <Check size={40} strokeWidth={4} />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Order Placed!</h2>
            <p className="text-slate-500 text-sm">Your pizza is being prepared with love.</p>
        </div>

        <div className="p-8">
            <div className="bg-orange-50 rounded-2xl p-5 mb-6 border border-orange-100">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-orange-200/50">
                    <div>
                        <span className="block font-bold text-slate-800 text-lg">{state.size.name}</span>
                        <span className="text-xs text-orange-600">{state.crust.name}</span>
                    </div>
                    <span className="font-black text-orange-600 text-xl">₱{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Sauce</span>
                        <span className="font-medium text-slate-700">{state.sauce.name}</span>
                    </div>
                    {state.toppings.length > 0 ? (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Toppings</span>
                            <span className="font-medium text-slate-700 text-right max-w-[200px] leading-tight">
                                {state.toppings.map(t => TOPPINGS.find(x => x.id === t.id)?.name).join(', ')}
                            </span>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400 italic">No toppings selected</div>
                    )}
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base hover:bg-black transition-colors shadow-lg shadow-slate-900/20 active:scale-[0.98]"
            >
                Make Another Pizza
            </button>
        </div>
      </motion.div>
    </div>
  );
};