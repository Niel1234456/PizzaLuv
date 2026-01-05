import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowLeft, Clock, Trash2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { CartItem } from '../types';
import { TOPPINGS } from '../constants';
import { soundEffects } from '../utils/sound';

interface OrderModalProps {
  isOpen: boolean;
  onEdit: () => void;
  onCompleted: () => void;
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onEdit, onCompleted, cart, onRemoveFromCart }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [step, setStep] = useState<'summary' | 'payment' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cashless' | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('summary');
      setPaymentMethod(null);
      // Generate a random 6-digit order ID
      setOrderId(Math.floor(Math.random() * 900000 + 100000).toString());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    soundEffects.select();
    setStep('payment');
  };

  const handlePaymentSelect = (method: 'cash' | 'cashless') => {
    soundEffects.confirm();
    setPaymentMethod(method);
    setStep('success');
  };

  const handleBackToSummary = () => {
    soundEffects.select();
    setStep('summary');
  };

  // Calculate Total Cart Price
  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price, 0);
  }, [cart]);

  // Calculate Preparation Time for the whole cart
  // Simple logic: Max prep time of single item + slight penalty for quantity
  const totalPrepTime = useMemo(() => {
    if (cart.length === 0) return 0;
    const maxItemTime = Math.max(...cart.map(i => i.prepTime));
    const quantityPenalty = (cart.length - 1) * 5; // 5 mins extra per additional pizza
    return maxItemTime + quantityPenalty;
  }, [cart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onEdit} 
      />
      
      {step === 'success' && (
        <div className="fixed inset-0 pointer-events-none z-60">
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} colors={['#F97316', '#DC2626', '#EAB308', '#ffffff']} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'summary' && (
            <motion.div 
                key="summary"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden z-50 ring-1 ring-black/5 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 bg-orange-50 border-b border-orange-100 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
                            <p className="text-xs text-orange-700/60 font-medium">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button onClick={onEdit} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Content */}
                <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
                    {cart.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 italic">
                            Your cart is empty. Start building!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <div key={item.id} className="relative bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold text-slate-800 block text-sm">{item.name}</span>
                                            <span className="text-[10px] text-slate-500">{item.description}</span>
                                        </div>
                                        <button 
                                            onClick={() => onRemoveFromCart(item.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    {/* Mini toppings list */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {item.pizzaState.toppings.slice(0, 5).map(t => {
                                            const tInfo = TOPPINGS.find(info => info.id === t.id);
                                            return tInfo ? (
                                                <span key={t.id} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                    {tInfo.name}
                                                </span>
                                            ) : null;
                                        })}
                                        {item.pizzaState.toppings.length > 5 && (
                                            <span className="text-[9px] text-slate-400 self-center">+{item.pizzaState.toppings.length - 5} more</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-end border-t border-slate-200/50 pt-2">
                                        <span className="text-xs font-medium text-slate-400">Item Price</span>
                                        <span className="font-bold text-slate-700">₱{item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Section (Totals & Action) */}
                <div className="bg-white p-6 pt-2 border-t border-slate-100">
                     {/* Prep Time Estimate */}
                    {cart.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg mb-6">
                            <div className="flex items-center gap-2 text-orange-800">
                                <Clock size={16} />
                                <span className="font-bold text-xs uppercase tracking-wide">Total Estimated Prep Time</span>
                            </div>
                            <span className="font-black text-orange-600 text-sm">~{totalPrepTime} Mins</span>
                        </div>
                    )}

                    {/* Grand Total */}
                    <div className="flex justify-between items-end bg-slate-900 text-white p-5 rounded-xl shadow-lg shadow-slate-900/10 mb-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Amount</span>
                            <span className="text-xs text-slate-500">VAT Included</span>
                        </div>
                        <span className="text-3xl font-black tracking-tight">₱{cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Footer Actions */}
                    <button 
                        onClick={handleProceedToPayment}
                        disabled={cart.length === 0}
                        className={`w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group ${cart.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        <span>Checkout</span>
                        <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={onEdit}
                        className="w-full mt-3 py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                    >
                        Back to Menu
                    </button>
                </div>
            </motion.div>
        )}

        {step === 'payment' && (
            <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden z-50 ring-1 ring-black/5 flex flex-col"
            >
                <div className="p-6 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Payment</h2>
                            <p className="text-xs text-orange-700/60 font-medium">How would you like to pay?</p>
                        </div>
                    </div>
                    <button onClick={onEdit} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <button
                        onClick={() => handlePaymentSelect('cashless')}
                        className="relative overflow-hidden w-full bg-white hover:bg-indigo-50 border-2 border-slate-100 hover:border-indigo-200 p-6 rounded-2xl flex items-center gap-5 transition-all group shadow-sm hover:shadow-md text-left"
                    >
                        {/* Background Icon */}
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                             <img src="https://cdn-icons-png.flaticon.com/512/9359/9359442.png" alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                        </div>

                        <div className="relative z-10 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform p-3">
                             <img src="https://cdn-icons-png.flaticon.com/512/9359/9359442.png" alt="Scan QR" className="w-full h-full object-contain" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-lg font-bold text-slate-800 group-hover:text-indigo-700">Cashless / QR</div>
                            <div className="text-xs text-slate-500 mt-1">Gcash, Maya, or Bank Transfer</div>
                        </div>
                    </button>

                     <button
                        onClick={() => handlePaymentSelect('cash')}
                        className="relative overflow-hidden w-full bg-white hover:bg-green-50 border-2 border-slate-100 hover:border-green-200 p-6 rounded-2xl flex items-center gap-5 transition-all group shadow-sm hover:shadow-md text-left"
                    >
                        {/* Background Icon */}
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                             <img src="https://cdn-icons-png.flaticon.com/512/7051/7051310.png" alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                        </div>

                        <div className="relative z-10 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform p-3">
                             <img src="https://cdn-icons-png.flaticon.com/512/7051/7051310.png" alt="Cash" className="w-full h-full object-contain" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-lg font-bold text-slate-800 group-hover:text-green-700">Cash Payment</div>
                            <div className="text-xs text-slate-500 mt-1">Pay at the counter</div>
                        </div>
                    </button>
                </div>

                <div className="p-6 pt-0 mt-auto">
                     <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center mb-6 border border-slate-100">
                         <span className="text-sm font-bold text-slate-500">Total to Pay</span>
                         <span className="text-2xl font-black text-slate-900">₱{cartTotal.toFixed(2)}</span>
                     </div>
                     <button 
                        onClick={handleBackToSummary}
                        className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Summary
                    </button>
                </div>
            </motion.div>
        )}

        {step === 'success' && (
            <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden z-50 ring-1 ring-black/5"
            >
                <div className="p-10 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-50"
                    >
                        <Check size={40} strokeWidth={4} />
                    </motion.div>
                    
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Order Submitted!</h2>
                    
                    {paymentMethod === 'cashless' ? (
                        <div className="w-full my-4 bg-white p-4 rounded-2xl border-2 border-dashed border-indigo-200 flex flex-col items-center">
                            <p className="text-sm text-slate-500 mb-3 font-medium">Scan to Pay ₱{cartTotal.toFixed(2)}</p>
                            <div className="w-40 h-40 bg-slate-900 p-2 rounded-lg mb-3">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Order:${orderId}-Total:${cartTotal}`} 
                                    alt="Payment QR" 
                                    className="w-full h-full object-contain rounded bg-white"
                                />
                            </div>
                            <p className="text-xs text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-full">Ref: {orderId}</p>
                        </div>
                    ) : (
                        <div className="w-full my-6 bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center">
                            <p className="text-sm text-orange-800/60 mb-1 font-bold uppercase tracking-wide">Your Order Number</p>
                            <div className="text-5xl font-black text-orange-600 tracking-tighter mb-2">
                                #{orderId.slice(-4)}
                            </div>
                            <p className="text-xs text-slate-500 text-center leading-relaxed">
                                Please show this number at the counter to pay <span className="font-bold text-slate-800">₱{cartTotal.toFixed(2)}</span>
                            </p>
                        </div>
                    )}

                    <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm text-orange-500">
                             <div className="w-6 h-6 flex items-center justify-center">
                                <Clock size={20} />
                             </div>
                        </div>
                        <div className="text-left">
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Ready In</div>
                             <div className="text-sm font-bold text-slate-800">Approx. {totalPrepTime} - {Math.min(totalPrepTime + 5, 45)} Mins</div>
                        </div>
                    </div>

                    <button 
                        onClick={onCompleted}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base hover:bg-black transition-colors shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                    >
                        Start New Order
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};