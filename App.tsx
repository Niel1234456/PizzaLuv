import React, { useState, useMemo } from 'react';
import { PizzaVisuals } from './components/PizzaVisuals';
import { Controls } from './components/Controls';
import { OrderModal } from './components/OrderModal';
import { RecommendedSidebar } from './components/RecommendedSidebar';
import { PizzaState, Size, Sauce, SelectedTopping, RecommendedPizza } from './types';
import { SIZES, SAUCES, TOPPINGS } from './constants';
import { ShoppingCart, RotateCcw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundEffects } from './utils/sound';

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

  // Calculate Total Price with Size Adjustments
  const totalPrice = useMemo(() => {
    let total = pizzaState.size.price + pizzaState.sauce.price;
    const toppingMultiplier = pizzaState.size.toppingPriceMultiplier;

    pizzaState.toppings.forEach((selected) => {
      const topping = TOPPINGS.find((t) => t.id === selected.id);
      if (topping) {
        let price = topping.price * toppingMultiplier;
        // Half price for half coverage
        if (selected.coverage !== 'whole') {
            price = price * 0.5;
        }
        total += price;
      }
    });
    return total;
  }, [pizzaState]);

  // Handlers
  const handleSetSize = (size: Size) => {
    setPizzaState((prev) => ({ ...prev, size }));
  };

  const handleSetSauce = (sauce: Sauce) => {
    setPizzaState((prev) => ({ ...prev, sauce }));
  };

  const handleToggleTopping = (toppingId: string) => {
    setPizzaState((prev) => {
      const existing = prev.toppings.find((t) => t.id === toppingId);
      let newToppings: SelectedTopping[] = [];

      // Cycle: None -> Whole -> Left -> Right -> None
      if (!existing) {
        soundEffects.toggleOn(); // Add Sound
        newToppings = [...prev.toppings, { id: toppingId, coverage: 'whole' }];
      } else if (existing.coverage === 'whole') {
        soundEffects.toggleMode(); // Change Mode Sound
        newToppings = prev.toppings.map(t => t.id === toppingId ? { ...t, coverage: 'left' } : t);
      } else if (existing.coverage === 'left') {
        soundEffects.toggleMode(); // Change Mode Sound
        newToppings = prev.toppings.map(t => t.id === toppingId ? { ...t, coverage: 'right' } : t);
      } else {
        soundEffects.toggleOff(); // Remove Sound
        newToppings = prev.toppings.filter((t) => t.id !== toppingId);
      }

      return { ...prev, toppings: newToppings };
    });
  };

  const handleApplyPreset = (preset: RecommendedPizza) => {
    // Find the objects
    const sauce = SAUCES.find(s => s.id === preset.sauceId) || SAUCES[0];
    const toppings: SelectedTopping[] = preset.toppings.map(tId => ({
        id: tId,
        coverage: 'whole'
    }));

    setPizzaState(prev => ({
        ...prev,
        sauce,
        toppings
    }));
    
    // Switch to toppings tab so they can see/edit what was added
    setActiveTab('toppings');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your pizza?')) {
      soundEffects.select();
      setPizzaState(INITIAL_STATE);
      setActiveTab('size');
    }
  };

  const handleNextStep = () => {
      soundEffects.select();
      if (activeTab === 'size') setActiveTab('sauce');
      else if (activeTab === 'sauce') setActiveTab('toppings');
      else handleConfirmOrder();
  };

  const handleConfirmOrder = () => {
    soundEffects.confirm();
    setIsOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setPizzaState(INITIAL_STATE);
    setActiveTab('size');
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row relative bg-[#FFF7ED]">
      
      {/* Mobile Header (Hidden on Desktop as it's in the sidebar) */}
      <div className="md:hidden absolute top-4 left-4 z-30 flex items-center gap-2">
         <div className="bg-orange-600 text-white p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
             <span className="font-bold text-xl">🍕</span>
         </div>
         <h1 className="text-2xl font-black tracking-tight text-gray-800">PizzaCraft</h1>
      </div>

      {/* Reset Button - Floating Top Right */}
      <button 
        onClick={handleReset}
        className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur text-gray-600 p-2.5 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-colors"
        title="Reset Pizza"
      >
        <RotateCcw size={20} />
      </button>

      {/* Left Sidebar - Recommended Pizzas */}
      <RecommendedSidebar onSelectPizza={handleApplyPreset} />

      {/* Main Content Area - Centered Visual */}
      <div className="flex-1 h-[55%] md:h-full relative flex items-center justify-center pt-8 md:pt-0 bg-transparent">
         {/* Shift center slightly right on desktop to balance the two sidebars */}
         <div className="md:pl-[320px] md:pr-[450px] w-full h-full flex items-center justify-center">
            <PizzaVisuals state={pizzaState} />
         </div>
      </div>

      {/* Floating Control Panel - Right Side */}
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
                 <motion.span 
                    key={totalPrice}
                    initial={{ scale: 1.2, color: "#f97316" }}
                    animate={{ scale: 1, color: "#1f2937" }}
                    className="text-3xl font-black text-gray-800"
                 >
                    ${totalPrice.toFixed(2)}
                 </motion.span>
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