import React, { useState, useMemo } from 'react';
import { PizzaVisuals } from './components/PizzaVisuals';
import { Controls } from './components/Controls';
import { CrustSidebar } from './components/CrustSidebar';
import { OrderModal } from './components/OrderModal';
import { RecommendedSidebar } from './components/RecommendedSidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConfirmModal } from './components/ConfirmModal';
import { PizzaState, Size, Sauce, SelectedTopping, RecommendedPizza, Crust, Cut, CartItem } from './types';
import { SIZES, SAUCES, TOPPINGS, CRUSTS, CUTS } from './constants';
import { ShoppingCart, RotateCcw, ArrowRight, Flame, Utensils, ShoppingBag, Plus, Layers, Grid, Maximize2, Droplet, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffects } from './utils/sound';

// Use a factory function to ensure we always get a fresh state object
const getInitialState = (): PizzaState => ({
  size: SIZES[1], // Medium
  sauce: SAUCES[0], // Tomato
  toppings: [],
  crust: CRUSTS[0], // Hand Tossed
  cut: CUTS.find(c => c.id === 'uncut') || CUTS[5], // Uncut (Default)
});

type Tab = 'size' | 'sauce' | 'toppings';
type AppMode = 'welcome' | 'builder';
type DiningOption = 'dine-in' | 'takeout' | null;
type MobileTab = 'size' | 'crust' | 'sauce' | 'toppings' | null;

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('welcome');
  const [diningOption, setDiningOption] = useState<DiningOption>(null);
  const [initialWelcomeStep, setInitialWelcomeStep] = useState<'intro' | 'choice'>('intro');
  
  const [pizzaState, setPizzaState] = useState<PizzaState>(getInitialState());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('size');
  const [mobileTab, setMobileTab] = useState<MobileTab>(null);

  // Calculate Price for Current Builder
  const currentPrice = useMemo(() => {
    let total = pizzaState.size.price + pizzaState.sauce.price + pizzaState.crust.price;
    const toppingMultiplier = pizzaState.size.toppingPriceMultiplier;

    pizzaState.toppings.forEach((selected) => {
      const topping = TOPPINGS.find((t) => t.id === selected.id);
      if (topping) {
        let price = topping.price * toppingMultiplier;
        if (selected.coverage !== 'whole') price = price * 0.5;
        total += price;
      }
    });
    return total;
  }, [pizzaState]);

  // Calculate Prep Time for Current Builder (Helper)
  const calculatePrepTime = (state: PizzaState) => {
    let minutes = 10;
    if (state.size.id === 'm') minutes += 2;
    if (state.size.id === 'l') minutes += 3;
    if (state.size.id === 'xl') minutes += 5;
    if (state.crust.id === 'pan' || state.crust.id === 'stuffed') minutes += 3;
    if (state.crust.id === 'thin') minutes -= 1;
    const toppingCount = state.toppings.length;
    if (toppingCount > 3) minutes += 1;
    if (toppingCount > 6) minutes += 2;
    return Math.min(Math.max(minutes, 10), 20);
  };

  // Calculate Total Calories
  const totalCalories = useMemo(() => {
    let calories = pizzaState.size.calories + pizzaState.sauce.calories + pizzaState.crust.calories;
    const toppingMultiplier = pizzaState.size.toppingPriceMultiplier; 

    pizzaState.toppings.forEach((selected) => {
        const topping = TOPPINGS.find((t) => t.id === selected.id);
        if (topping) {
            let itemCal = topping.calories * toppingMultiplier;
            if (selected.coverage !== 'whole') itemCal = itemCal * 0.5;
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

  const handleSetSize = (size: Size) => setPizzaState((prev) => ({ ...prev, size }));
  const handleSetSauce = (sauce: Sauce) => setPizzaState((prev) => ({ ...prev, sauce }));
  const handleSetCrust = (crust: Crust) => setPizzaState((prev) => ({ ...prev, crust }));
  const handleSetCut = (cut: Cut) => setPizzaState((prev) => ({ ...prev, cut }));

  const handleToggleTopping = (toppingId: string) => {
    setPizzaState((prev) => {
      const existing = prev.toppings.find((t) => t.id === toppingId);
      let newToppings: SelectedTopping[] = [];

      if (!existing) {
        soundEffects.toggleOn();
        newToppings = [...prev.toppings, { id: toppingId, coverage: 'whole' }];
      } else if (existing.coverage === 'whole') {
        soundEffects.toggleMode();
        newToppings = prev.toppings.map(t => t.id === toppingId ? { ...t, coverage: 'left' } : t);
      } else if (existing.coverage === 'left') {
        soundEffects.toggleMode();
        newToppings = prev.toppings.map(t => t.id === toppingId ? { ...t, coverage: 'right' } : t);
      } else {
        soundEffects.toggleOff();
        newToppings = prev.toppings.filter((t) => t.id !== toppingId);
      }
      return { ...prev, toppings: newToppings };
    });
  };

  const handleApplyPreset = (preset: RecommendedPizza) => {
    const sauce = SAUCES.find(s => s.id === preset.sauceId) || SAUCES[0];
    const toppings: SelectedTopping[] = preset.toppings.map(tId => ({ id: tId, coverage: 'whole' }));
    setPizzaState(prev => ({ ...prev, sauce, toppings }));
    setActiveTab('toppings');
    setMobileTab('toppings'); // Also open tab on mobile
  };

  const handleStartOver = () => {
    soundEffects.select();
    setIsConfirmOpen(true);
  };

  const confirmStartOver = () => {
    setPizzaState(getInitialState());
    setCart([]);
    setInitialWelcomeStep('choice'); // Skip intro
    setAppMode('welcome');
    setDiningOption(null);
    setActiveTab('size');
    setMobileTab(null);
    setIsConfirmOpen(false);
  };

  const handleAddToCart = () => {
    soundEffects.confirm();
    
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      pizzaState: { ...pizzaState },
      price: currentPrice,
      prepTime: calculatePrepTime(pizzaState),
      name: `Custom ${pizzaState.size.name.split(' ')[0]} Pizza`,
      description: `${pizzaState.crust.name}, ${pizzaState.sauce.name}, ${pizzaState.toppings.length} Toppings`
    };

    setCart([...cart, newItem]);
    
    // Reset builder for next pizza
    setPizzaState(getInitialState());
    setActiveTab('size');
    setMobileTab(null);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleOpenCart = () => {
    soundEffects.select();
    setIsOrderModalOpen(true);
  };

  const handleNextStep = () => {
      soundEffects.select();
      if (activeTab === 'size') setActiveTab('sauce');
      else if (activeTab === 'sauce') setActiveTab('toppings');
      else {
          // If in toppings and clicks "Add to Order"
          handleAddToCart();
      }
  };

  const handleMobileTabClick = (tab: MobileTab) => {
      soundEffects.select();
      setMobileTab(mobileTab === tab ? null : tab);
  };

  // Called when user finishes the success screen
  const handleOrderCompleted = () => {
    setIsOrderModalOpen(false);
    setPizzaState(getInitialState());
    setCart([]);
    setActiveTab('size');
    setMobileTab(null);
    setInitialWelcomeStep('choice'); // Skip intro
    setAppMode('welcome'); 
    setDiningOption(null);
  };

  // Render Welcome Screen if not started
  if (appMode === 'welcome') {
      return <WelcomeScreen onStart={handleStartApp} initialStep={initialWelcomeStep} />;
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full flex flex-col md:flex-row relative overflow-hidden"
    >
      
      {/* Mobile Header - Increased Z-Index to 40 */}
      <div className="md:hidden absolute top-4 left-4 z-40 flex items-center gap-3">
         <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-orange-100">
             <img src="https://cdn-icons-png.flaticon.com/512/3513/3513759.png" alt="Logo" className="w-8 h-8 object-contain" />
         </div>
         <h1 className="text-3xl font-pizza-logo tracking-wide drop-shadow-sm">PizzaLuv</h1>
      </div>

      {/* Mobile Start Again & Cart - Increased Z-Index to 40 */}
      <div className="md:hidden absolute top-4 right-4 z-40 flex gap-2">
        <button 
            onClick={handleOpenCart}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-orange-100 text-orange-600 relative"
        >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cart.length}
                </div>
            )}
        </button>
        <button 
            onClick={handleStartOver}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-orange-100 text-orange-900"
        >
            <RotateCcw size={20} />
        </button>
      </div>

      {/* Desktop Header Info & Controls Container - Increased Z-Index to 40 */}
      <div className="absolute top-4 left-4 md:left-[320px] z-40 hidden md:flex items-center gap-3">
          
          {/* Dining Option Indicator */}
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm ring-1 ring-orange-500/10 h-9">
              {diningOption === 'dine-in' ? (
                  <>
                    <Utensils size={14} className="text-orange-600" />
                    <span className="text-xs font-bold text-orange-900 uppercase tracking-wide">Dine In</span>
                  </>
              ) : (
                  <>
                    <ShoppingBag size={14} className="text-red-600" />
                    <span className="text-xs font-bold text-red-900 uppercase tracking-wide">Take Out</span>
                  </>
              )}
          </div>

          {/* Start Again Button */}
          <button 
            onClick={handleStartOver}
            className="bg-white/80 backdrop-blur-md text-orange-900 px-4 py-1.5 rounded-full shadow-sm hover:shadow-md hover:bg-white hover:text-red-600 transition-all border border-orange-100 ring-1 ring-orange-500/10 flex items-center gap-2 h-9 cursor-pointer"
            title="Start Again"
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">Start Again</span>
          </button>

          {/* Desktop Cart Button */}
          <button
            onClick={handleOpenCart}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all border border-orange-400 ring-1 ring-orange-500/20 flex items-center gap-2 h-9 cursor-pointer group"
          >
             <ShoppingCart size={14} strokeWidth={2.5} />
             <span className="text-xs font-bold uppercase tracking-wide">Cart</span>
             {cart.length > 0 && (
                 <span className="bg-white text-orange-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ml-1">
                     {cart.length}
                 </span>
             )}
          </button>
      </div>

      {/* Left Sidebar - Recommended Pizzas */}
      <RecommendedSidebar onSelectPizza={handleApplyPreset} />

      {/* Main Content Area - Centered Visual */}
      <div className="flex-1 h-full md:h-full relative flex items-center justify-center pt-8 md:pt-0 bg-transparent pb-[80px] md:pb-0">
         {/* Shift center slightly right on desktop to balance the sidebars */}
         <div className="md:pl-[300px] md:pr-[580px] w-full h-full flex items-center justify-center">
            <PizzaVisuals state={pizzaState} />
         </div>
      </div>

      {/* Right Sidebar 1: Crust & Cut Options (Desktop Only) */}
      <motion.div 
        className="hidden md:flex flex-col h-[92vh] w-[240px] absolute right-[320px] top-[4vh] bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(251,146,60,0.15)] border border-white/60 ring-1 ring-orange-100 z-10"
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

      {/* Right Sidebar 2: Main Controls (Desktop Only) */}
      <motion.div 
        className="hidden md:flex h-[92vh] w-[300px] absolute right-4 top-[4vh] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(251,146,60,0.2)] flex-col border border-white/60 ring-1 ring-orange-100 z-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", damping: 20 }}
      >
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

        {/* Bottom Action Bar (Desktop) */}
        <div className="p-4 bg-white/60 border-t border-orange-100/50 backdrop-blur-xl rounded-b-[2rem]">
           <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                 <span className="text-[9px] text-orange-700/60 font-bold uppercase tracking-wider mb-0.5">Current</span>
                 <motion.span 
                    key={currentPrice}
                    initial={{ scale: 1.1, color: "#f97316" }}
                    animate={{ scale: 1, color: "#c2410c" }}
                    className="text-2xl font-black text-orange-700 leading-none"
                 >
                    ₱{currentPrice.toFixed(2)}
                 </motion.span>
                 <motion.div 
                    key={totalCalories}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 mt-1 text-slate-500"
                 >
                     <Flame size={12} className="text-orange-500 fill-orange-500" />
                     <span className="text-xs font-bold text-orange-600/80">{totalCalories} cal</span>
                 </motion.div>
              </div>
              
              <button 
                onClick={handleNextStep}
                className="flex-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-700 hover:via-orange-600 hover:to-yellow-600 text-white px-4 py-3 rounded-2xl font-bold text-xs shadow-xl shadow-orange-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group border border-white/20"
              >
                {activeTab === 'toppings' ? (
                    <>
                        <span>Add to Order</span>
                        <div className="bg-white/20 rounded-full p-1">
                          <Plus size={14} strokeWidth={3} />
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
      
      {/* --- MOBILE BOTTOM NAVIGATION & PANELS --- */}
      
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-orange-100 px-2 py-2 flex justify-between items-end z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {(['size', 'crust', 'sauce', 'toppings'] as const).map((tab) => {
            const isActive = mobileTab === tab;
            let Icon = Maximize2;
            let label = 'Size';
            
            if (tab === 'crust') { Icon = Layers; label = 'Crust'; }
            if (tab === 'sauce') { Icon = Droplet; label = 'Sauce'; }
            if (tab === 'toppings') { Icon = Grid; label = 'Toppings'; }

            return (
                <button
                    key={tab}
                    onClick={() => handleMobileTabClick(tab)}
                    className={`flex-1 flex flex-col items-center justify-end pb-2 pt-3 transition-all duration-300 relative ${
                        isActive ? 'text-orange-600 -translate-y-2' : 'text-slate-400'
                    }`}
                >
                    <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-orange-100 shadow-lg shadow-orange-500/20 ring-2 ring-white mb-1' : 'bg-transparent'}`}>
                        <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] font-bold tracking-wide transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 h-0 overflow-hidden'}`}>
                        {label}
                    </span>
                </button>
            );
        })}
      </div>

      {/* Mobile Expandable Panel */}
      <AnimatePresence>
        {mobileTab && (
            <motion.div 
                initial={{ y: "110%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "110%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed bottom-[85px] left-2 right-2 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.2)] border border-orange-100 z-40 h-[55vh] flex flex-col overflow-hidden"
            >
                {/* Drag Handle / Header */}
                <div 
                    className="flex items-center justify-between px-5 py-3 border-b border-orange-50 bg-white/50 cursor-pointer"
                    onClick={() => setMobileTab(null)}
                >
                    <div className="flex-1" />
                    <div className="w-10 h-1 bg-slate-200 rounded-full" />
                    <div className="flex-1 flex justify-end">
                        <button className="bg-slate-100 rounded-full p-1 text-slate-400">
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative">
                    {mobileTab === 'crust' ? (
                        <div className="h-full w-full">
                            <CrustSidebar 
                                currentCrust={pizzaState.crust}
                                currentCut={pizzaState.cut}
                                onSetCrust={handleSetCrust}
                                onSetCut={handleSetCut}
                            />
                        </div>
                    ) : (
                        <Controls 
                            currentSize={pizzaState.size}
                            currentSauce={pizzaState.sauce}
                            selectedToppings={pizzaState.toppings}
                            activeTab={mobileTab as 'size' | 'sauce' | 'toppings'} // Safe cast as we handle 'crust' separately
                            onSetSize={handleSetSize}
                            onSetSauce={handleSetSauce}
                            onToggleTopping={handleToggleTopping}
                            onTabChange={() => {}} // No-op for mobile internal nav
                            hideTabs={true}
                        />
                    )}
                </div>

                {/* Mobile Panel Action Bar */}
                <div className="p-3 bg-white border-t border-orange-100">
                     <button 
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-between px-5"
                    >
                        <div className="flex flex-col items-start">
                             <span className="text-[10px] opacity-80 font-medium">Add to Order</span>
                             <span className="text-lg leading-none">₱{currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Plus size={18} strokeWidth={3} />
                        </div>
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      
      <OrderModal 
        isOpen={isOrderModalOpen}
        onEdit={() => setIsOrderModalOpen(false)}
        onCompleted={handleOrderCompleted}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
      />
      
      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Start Fresh?"
        message="Are you sure you want to discard your current order and start over? This cannot be undone."
        onConfirm={confirmStartOver}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </motion.div>
  );
};

export default App;