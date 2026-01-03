import React, { useState, useMemo } from 'react';
import { PizzaVisuals } from './components/PizzaVisuals';
import { Controls } from './components/Controls';
import { CrustSidebar } from './components/CrustSidebar';
import { OrderModal } from './components/OrderModal';
import { RecommendedSidebar } from './components/RecommendedSidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PizzaState, Size, Sauce, SelectedTopping, RecommendedPizza, Crust, Cut } from './types';
import { SIZES, SAUCES, TOPPINGS, CRUSTS, CUTS } from './constants';
import { ShoppingCart, RotateCcw, ArrowRight, Flame, Utensils, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffects } from './utils/sound';

const INITIAL_STATE: PizzaState = {
  size: SIZES[1], // Medium
  sauce: SAUCES[0], // Tomato
  toppings: [],
  crust: CRUSTS[0], // Hand Tossed
  cut: CUTS[3], // Uncut (Default)
};

type Tab = 'size' | 'sauce' | 'toppings';
type AppMode = 'welcome' | 'builder';
type DiningOption = 'dine-in' | 'takeout' | null;

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('welcome');
  const [diningOption, setDiningOption] = useState<DiningOption>(null);
  
  const [pizzaState, setPizzaState] = useState<PizzaState>(INITIAL_STATE);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('size');

  // Calculate Total Price with Size Adjustments
  const totalPrice = useMemo(() => {
    let total = pizzaState.size.price + pizzaState.sauce.price + pizzaState.crust.price;
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

  // Calculate Total Calories
  const totalCalories = useMemo(() => {
    let calories = pizzaState.size.calories + pizzaState.sauce.calories + pizzaState.crust.calories;
    const toppingMultiplier = pizzaState.size.toppingPriceMultiplier; // Use same multiplier for calories as a proxy for quantity

    pizzaState.toppings.forEach((selected) => {
        const topping = TOPPINGS.find((t) => t.id === selected.id);
        if (topping) {
            let itemCal = topping.calories * toppingMultiplier;
            // Half calories for half coverage
            if (selected.coverage !== 'whole') {
                itemCal = itemCal * 0.5;
            }
            calories += itemCal;
        }
    });
    return Math.round(calories);
  }, [pizzaState]);

  // Handlers
  const handleStartApp = (option: 'dine-in' | 'takeout') => {
      setDiningOption(option);
      setAppMode('builder');
  };

  const handleSetSize = (size: Size) => {
    setPizzaState((prev) => ({ ...prev, size }));
  };

  const handleSetSauce = (sauce: Sauce) => {
    setPizzaState((prev) => ({ ...prev, sauce }));
  };

  const handleSetCrust = (crust: Crust) => {
    setPizzaState((prev) => ({ ...prev, crust }));
  };

  const handleSetCut = (cut: Cut) => {
    setPizzaState((prev) => ({ ...prev, cut }));
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
    // Optionally go back to welcome screen? keeping at builder for now for easier re-ordering
  };

  // Render Welcome Screen if not started
  if (appMode === 'welcome') {
      return <WelcomeScreen onStart={handleStartApp} />;
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full flex flex-col md:flex-row relative overflow-hidden"
    >
      
      {/* Mobile Header */}
      <div className="md:hidden absolute top-4 left-4 z-30 flex items-center gap-2">
         <div className="bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
             <span className="font-bold text-xl">🍕</span>
         </div>
         <h1 className="text-xl font-bold tracking-tight text-slate-800">PizzaCraft</h1>
      </div>

      {/* Header Info (Dining Option) */}
      <div className="absolute top-4 left-4 md:left-[320px] z-30 hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
          {diningOption === 'dine-in' ? (
              <>
                <Utensils size={14} className="text-orange-600" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Dine In</span>
              </>
          ) : (
              <>
                <ShoppingBag size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Take Out</span>
              </>
          )}
      </div>

      {/* Reset Button - Floating Top Right */}
      <button 
        onClick={handleReset}
        className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-md text-slate-600 p-3 rounded-full shadow-sm hover:shadow-md hover:bg-white hover:text-red-500 transition-all border border-white/50"
        title="Reset Pizza"
      >
        <RotateCcw size={18} strokeWidth={2.5} />
      </button>

      {/* Left Sidebar - Recommended Pizzas */}
      <RecommendedSidebar onSelectPizza={handleApplyPreset} />

      {/* Main Content Area - Centered Visual */}
      <div className="flex-1 h-[55%] md:h-full relative flex items-center justify-center pt-8 md:pt-0 bg-transparent">
         {/* Shift center slightly right on desktop to balance the sidebars */}
         {/* Left sidebar: 280px + 20px gap. Right sidebars: 300px + 240px + gap */}
         <div className="md:pl-[300px] md:pr-[580px] w-full h-full flex items-center justify-center">
            <PizzaVisuals state={pizzaState} />
         </div>
      </div>

      {/* Right Sidebar 1: Crust & Cut Options (Moved to Inner Right) */}
      <motion.div 
        className="hidden md:flex flex-col h-[92vh] w-[240px] absolute right-[320px] top-[4vh] bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/40 ring-1 ring-black/5 z-10"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, type: "spring", damping: 20 }}
      >
         <CrustSidebar 
            currentCrust={pizzaState.crust}
            currentCut={pizzaState.cut}
            onSetCrust={handleSetCrust}
            onSetCut={handleSetCut}
         />
      </motion.div>

      {/* Right Sidebar 2: Main Controls (Moved to Outer Right) */}
      <motion.div 
        className="h-[45%] md:h-[92vh] md:w-[300px] md:absolute md:right-4 md:top-[4vh] w-full bg-white/70 backdrop-blur-xl md:rounded-[2rem] rounded-t-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex flex-col border border-white/40 ring-1 ring-black/5 z-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", damping: 20 }}
      >
        {/* Handle for mobile visual cue */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 md:hidden" />

        <div className="flex-1 overflow-hidden pt-4 flex flex-col">
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
        <div className="p-4 bg-white/60 border-t border-slate-100/50 backdrop-blur-xl md:rounded-b-[2rem]">
           <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total</span>
                 <motion.span 
                    key={totalPrice}
                    initial={{ scale: 1.1, color: "#f97316" }}
                    animate={{ scale: 1, color: "#0f172a" }}
                    className="text-xl font-extrabold text-slate-900 leading-none"
                 >
                    ${totalPrice.toFixed(2)}
                 </motion.span>
                 <motion.div 
                    key={totalCalories}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 mt-1 text-slate-500"
                 >
                     <Flame size={12} className="text-orange-400 fill-orange-400" />
                     <span className="text-xs font-semibold">{totalCalories} cal</span>
                 </motion.div>
              </div>
              
              <button 
                onClick={handleNextStep}
                className="flex-1 bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-2xl font-bold text-xs shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {activeTab === 'toppings' ? (
                    <>
                        <span>Finish Order</span>
                        <div className="bg-white/20 rounded-full p-1">
                          <ShoppingCart size={14} />
                        </div>
                    </>
                ) : (
                    <>
                        <span>Next</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
    </motion.div>
  );
};

export default App;