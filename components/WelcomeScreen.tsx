import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { soundEffects } from '../utils/sound';

interface WelcomeScreenProps {
  onStart: (option: 'dine-in' | 'takeout') => void;
  initialStep?: 'intro' | 'choice';
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, initialStep = 'intro' }) => {
  const [step, setStep] = useState<'intro' | 'choice'>(initialStep);

  const handleStartClick = () => {
    soundEffects.select();
    setStep('choice');
  };

  const handleOptionClick = (option: 'dine-in' | 'takeout') => {
    soundEffects.confirm();
    onStart(option);
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center font-sans text-white">
      
      {/* BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Delicious Pizza" 
          className="w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 backdrop-blur-[2px]" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: INTRO */}
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl"
            >
               <img src="https://cdn-icons-png.flaticon.com/512/3513/3513759.png" alt="Pizza Luv Icon" className="w-4 h-4 object-contain" />
               <span className="text-xs font-bold tracking-widest uppercase text-white/90">Made with Luv. Built Like a Lab.</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-6xl md:text-9xl font-pizza-logo mb-6 drop-shadow-lg">
              <span className="block">PizzaLuv</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 font-medium leading-relaxed drop-shadow-md">
              Unleash your culinary creativity. Build, customize, and visualize your dream pizza in real-time with our interactive 3D studio.
            </p>

            {/* Main CTA Button */}
            <motion.button
              onClick={handleStartClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            
            {/* Footer Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-white/40 text-xs tracking-widest uppercase font-semibold"
            >
              Hand-tossed • Fresh Ingredients • Wood Fired
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: DINING CHOICE */}
        {step === 'choice' && (
          <motion.div 
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-20"
          >
             {/* Back Button */}
             <button 
                onClick={() => setStep('intro')}
                className="absolute top-8 left-8 md:top-12 md:left-12 text-white/50 hover:text-white flex items-center gap-3 transition-colors z-50 group"
             >
                <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/20 backdrop-blur-md transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-bold tracking-widest text-xs uppercase opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">Back</span>
             </button>

             <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-6xl font-black text-white mb-10 drop-shadow-2xl text-center"
            >
                How are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">eating today?</span>
             </motion.h2>
             
             {/* Interactive Split Cards - Maintained Size */}
             <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl h-[400px] md:h-[350px]">
                
                {/* DINE IN OPTION - Solid White */}
                <div
                    onClick={() => handleOptionClick('dine-in')}
                    className="flex-1 relative rounded-[2rem] overflow-hidden cursor-pointer bg-white shadow-xl transition-all duration-300 border-4 border-transparent hover:border-red-500 group"
                >
                     {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-red-50/50 to-transparent group-hover:from-orange-100 group-hover:via-red-100/50 transition-colors duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        {/* ICON - Increased Size */}
                        <div className="w-32 h-32 md:w-40 md:h-40 mb-3 relative flex items-center justify-center">
                             <img 
                                src="https://cdn-icons-gif.flaticon.com/18970/18970899.gif" 
                                alt="Dine In" 
                                className="relative z-10 w-full h-full object-contain mix-blend-multiply" 
                             />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-red-600 transition-colors">Dine In</h3>
                            <p className="text-slate-500 font-medium text-sm md:text-base max-w-[240px] mx-auto leading-relaxed group-hover:text-slate-800 transition-colors">
                                Experience the ambiance. Served hot at your table.
                            </p>
                        </div>

                        {/* Button reveals on hover */}
                        <div className="absolute bottom-4 md:bottom-5 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-sm shadow-xl shadow-orange-500/30 flex items-center gap-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Start Crafting <ArrowRight size={16} />
                        </div>
                    </div>
                </div>

                {/* TAKE OUT OPTION - Solid White */}
                <div
                    onClick={() => handleOptionClick('takeout')}
                    className="flex-1 relative rounded-[2rem] overflow-hidden cursor-pointer bg-white shadow-xl transition-all duration-300 border-4 border-transparent hover:border-yellow-400 group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-amber-50/50 to-transparent group-hover:from-yellow-100 group-hover:via-amber-100/50 transition-colors duration-500" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        {/* ICON - Increased Size */}
                        <div className="w-32 h-32 md:w-40 md:h-40 mb-3 relative flex items-center justify-center">
                            <img 
                                src="https://cdn-icons-gif.flaticon.com/11933/11933494.gif" 
                                alt="Take Out" 
                                className="relative z-10 w-full h-full object-contain mix-blend-multiply" 
                            />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-yellow-600 transition-colors">Take Out</h3>
                            <p className="text-slate-500 font-medium text-sm md:text-base max-w-[240px] mx-auto leading-relaxed group-hover:text-slate-800 transition-colors">
                                Packaged with care. Ready when you arrive.
                            </p>
                        </div>

                        <div className="absolute bottom-4 md:bottom-5 px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold text-sm shadow-xl shadow-yellow-500/30 flex items-center gap-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Start Crafting <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};