import React, { useState, useMemo } from 'react';
import { PizzaVisuals } from './components/PizzaVisuals';
import { Controls } from './components/Controls';
import { OrderModal } from './components/OrderModal';
import { PizzaState, Size, Sauce } from './types';
import { SIZES, SAUCES, TOPPINGS } from './constants';
import { ShoppingCart, RotateCcw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL_STATE: PizzaState = {
  size: SIZES[1], // Medium
  sauce: SAUCES[0], // Tomato
  toppings: [],
};

type Tab = 'size' | 'sauce' | 'toppings';

const App: React.FC = () => {
  const [pizzaState, setPizzaState] = useState<PizzaState>(INITIAL_STATE);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('size');

  // Calculate Total Price
  const totalPrice = useMemo(() => {
    let total = pizzaState.size.price + pizzaState.sauce.price;
    pizzaState.toppings.forEach((toppingId) => {
      const topping = TOPPINGS.find((t) => t.id === toppingId);
      if (topping) {
        total += topping.price;
      }
    });
    return total;
  }, [pizzaState]);

  // Handlers
  const handleSetSize = (size: Size) => {
    setPizzaState((prev) => ({ ...prev, size }));
    // Auto advance hint could be placed here, but manual is often better for exploration
  };

  const handleSetSauce = (sauce: Sauce) => {
    setPizzaState((prev) => ({ ...prev, sauce }));
  };

  const handleToggleTopping = (toppingId: string) => {
    setPizzaState((prev) => {
      const isSelected = prev.toppings.includes(toppingId);
      if (isSelected) {
        return { ...prev, toppings: prev.toppings.filter((id) => id !== toppingId) };
      } else {
        return { ...prev, toppings: [...prev.toppings, toppingId] };
      }
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your pizza?')) {
      setPizzaState(INITIAL_STATE);
      setActiveTab('size');
    }
  };

  const handleNextStep = () => {
      if (activeTab === 'size') setActiveTab('sauce');
      else if (activeTab === 'sauce') setActiveTab('toppings');
      else handleConfirmOrder();
  };

  const handleConfirmOrder = () => {
    setIsOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setPizzaState(INITIAL_STATE);
    setActiveTab('size');
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row relative">
      
      {/* Header / Brand - Floating Top Left */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
         <div className="bg-orange-600 text-white p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
             <span className="font-bold text-xl">🍕</span>
         </div>
         <h1 className="text-2xl font-black tracking-tight text-gray-800 hidden sm:block">PizzaCraft</h1>
      </div>

      {/* Reset Button - Floating Top Right */}
      <button 
        onClick={handleReset}
        className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur text-gray-600 p-2.5 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-colors"
        title="Reset Pizza"
      >
        <RotateCcw size={20} />
      </button>

      {/* Main Content Area */}
      <div className="flex-1 h-[55%] md:h-full relative flex items-center justify-center pt-8 md:pt-0 bg-transparent">
         <PizzaVisuals state={pizzaState} />
      </div>

      {/* Floating Control Panel */}
      <motion.div 
        className="h-[45%] md:h-[90vh] md:w-[450px] md:absolute md:right-4 md:top-[5vh] w-full bg-white/80 backdrop-blur-xl md:rounded-3xl rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl flex flex-col border border-white/50 z-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Handle for mobile visual cue */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1 md:hidden" />

        <div className="flex-1 overflow-hidden pt-2 flex flex-col">
            <Controls 
                currentSize={pizzaState.size}
                currentSauce={pizzaState.sauce}
                selectedToppings={pizzaState.toppings}
                activeTab={activeTab}
                onSetSize={handleSetSize}
                onSetSauce={handleSetSauce}
                onToggleTopping={handleToggleTopping}
                onTabChange={setActiveTab}
            />
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4 md:p-6 bg-white/50 border-t border-gray-100 backdrop-blur-md md:rounded-b-3xl">
           <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                 <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total</span>
                 <span className="text-3xl font-black text-gray-800">${totalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleNextStep}
                className="flex-1 bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-gray-400/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
              >
                {activeTab === 'toppings' ? (
                    <>
                        <span>Finish Order</span>
                        <ShoppingCart size={20} />
                    </>
                ) : (
                    <>
                        <span>Next Step</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
           </div>
        </div>
      </motion.div>

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={handleCloseModal}
        state={pizzaState}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default App;