import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PizzaState, Topping } from '../types';
import { TOPPINGS, TOPPING_POSITIONS } from '../constants';

interface PizzaVisualsProps {
  state: PizzaState;
}

// Generate spiral points for the spoon animation frames
const SPIRAL_FRAMES = (() => {
  const x = [];
  const y = [];
  const revs = 3.5;
  const steps = 80;
  const maxR = 80;
  
  // Start at center
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Ease the spiral slightly for natural hand movement
    const angle = t * Math.PI * 2 * revs; 
    const r = t * maxR;
    x.push(Math.cos(angle) * r);
    y.push(Math.sin(angle) * r);
  }
  return { x, y };
})();

// Generate the SVG path data for the swirl trail
const SPIRAL_PATH_D = (() => {
    const points = SPIRAL_FRAMES.x.map((x, i) => `${x} ${SPIRAL_FRAMES.y[i]}`);
    return `M 0 0 L ${points.join(' L ')}`;
})();

const ToppingShape: React.FC<{ type: string; color: string; position: any; index: number }> = ({ type, color, position, index }) => {
  
  // Stable random values for animations to prevent re-render jitter
  const randomSeed = useMemo(() => Math.random(), []);
  
  // Render different SVG paths based on topping type
  const renderShape = () => {
    switch(type) {
      case 'pepperoni':
        return (
          <circle cx="0" cy="0" r="8" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1" opacity="0.95" />
        );
      case 'mushroom':
        return (
          <path d="M0 -6 C-5 -6 -8 -3 -8 1 C-8 4 -5 5 -2 5 L-2 8 L2 8 L2 5 C5 5 8 4 8 1 C8 -3 5 -6 0 -6 Z" fill="#D6D3D1" stroke="#78716C" strokeWidth="1" />
        );
      case 'olive':
        return (
          <g>
            <circle cx="0" cy="0" r="6" fill="#171717" />
            <circle cx="0" cy="0" r="3" fill="#D1D5DB" fillOpacity="0.2" />
          </g>
        );
      case 'onion':
        return (
          <g>
             <path d="M-8 0 A 8 8 0 0 1 8 0" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
             <path d="M-5 0 A 5 5 0 0 1 5 0" fill="none" stroke="#E9D5FF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
      case 'pepper':
        return (
          <path d="M-8 0 Q-4 -8 0 0 Q4 8 8 0" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        );
      case 'basil':
         // "Freshness" animation: Flash bright green and settle with a slight curl (scaleY)
         return (
             <motion.path 
                 d="M0 8 Q4 0 8 -4 Q0 -2 -8 -4 Q-4 0 0 8" 
                 fill="#4ADE80" 
                 stroke="#15803D" 
                 strokeWidth="0.5"
                 initial={{ scale: 0.5, rotate: -20 * (randomSeed > 0.5 ? 1 : -1) }}
                 animate={{ 
                     scale: 1, 
                     rotate: 0,
                     fill: ["#86EFAC", "#4ADE80"], // Flash light green
                 }}
                 transition={{ 
                     type: "spring",
                     stiffness: 200,
                     damping: 12,
                     fill: { duration: 0.8, ease: "easeOut" }
                 }}
             />
         );
      case 'cheese_extra':
        // Scattered lines/dots with Shimmer Effect
        return (
          <g>
            <rect x="-4" y="-2" width="8" height="2" rx="1" fill="#FEF08A" opacity="0.8" />
            <rect x="-2" y="2" width="6" height="2" rx="1" fill="#FEF08A" opacity="0.8" />
            
            {/* Shimmer Overlay: White rects that fade in and out randomly */}
            <motion.rect 
                x="-4" y="-2" width="8" height="2" rx="1" fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: randomSeed * 2 + 1,
                    delay: randomSeed
                }}
            />
             <motion.rect 
                x="-2" y="2" width="6" height="2" rx="1" fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: randomSeed * 2 + 1,
                    delay: randomSeed + 0.5
                }}
            />
          </g>
        );
      default:
        return <circle cx="0" cy="0" r="5" fill={color} />;
    }
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0, y: -40 }}
      animate={{ 
        opacity: 1, 
        scale: position.scale, 
        y: 0,
        rotate: position.rotation
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.02, 
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      style={{
        translateX: position.x,
        translateY: position.y,
      }}
    >
      {renderShape()}
    </motion.g>
  );
};

export const PizzaVisuals: React.FC<PizzaVisualsProps> = ({ state }) => {
  const selectedToppingsData = state.toppings
    .map(id => TOPPINGS.find(t => t.id === id))
    .filter((t): t is Topping => !!t)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Wooden Paddle Background */}
      <motion.div 
        className="absolute z-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <svg 
            width="600" 
            height="600" 
            viewBox="0 -100 400 600" 
            className="w-[140vw] h-[140vw] max-w-[900px] max-h-[900px] drop-shadow-2xl opacity-90"
        >
             <defs>
                <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#8B4513' }} /> 
                    <stop offset="10%" style={{ stopColor: '#A0522D' }} />
                    <stop offset="20%" style={{ stopColor: '#8B4513' }} />
                    <stop offset="30%" style={{ stopColor: '#A0522D' }} />
                    <stop offset="40%" style={{ stopColor: '#8B4513' }} />
                    <stop offset="60%" style={{ stopColor: '#A0522D' }} />
                    <stop offset="80%" style={{ stopColor: '#8B4513' }} />
                    <stop offset="100%" style={{ stopColor: '#A0522D' }} />
                </linearGradient>
            </defs>
            {/* Paddle Handle */}
            <path d="M180 380 L220 380 L220 480 C220 490 210 500 200 500 C190 500 180 490 180 480 Z" fill="url(#woodGradient)" />
            {/* Paddle Head */}
            <circle cx="200" cy="200" r="190" fill="url(#woodGradient)" />
            <circle cx="200" cy="200" r="180" fill="#CD853F" opacity="0.1" />
        </svg>
      </motion.div>

      {/* Container for proper aspect ratio scaling */}
      <motion.div 
        className="relative z-10 w-[75vw] h-[75vw] max-w-[500px] max-h-[500px]"
        animate={{ scale: state.size.scale }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <svg viewBox="-110 -110 220 220" className="w-full h-full drop-shadow-xl">
          <defs>
            <radialGradient id="doughGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="70%" stopColor="#FFE4B5" /> 
                <stop offset="95%" stopColor="#DEB887" /> 
                <stop offset="100%" stopColor="#CD853F" /> 
            </radialGradient>
            
            {/* Spoon Metallic Gradient */}
            <radialGradient id="spoonGradient" cx="30%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            {/* Sauce Edge Roughness Filter */}
            <filter id="sauce-edge">
               <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
               <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* Sauce Surface Texture Filter */}
            <filter id="sauce-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise"/>
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
            </filter>
          </defs>

          {/* Crust Shadow */}
          <circle cx="0" cy="4" r="102" fill="rgba(0,0,0,0.2)" />

          {/* Dough Base - Cartoon Style */}
          {/* Main puff */}
          <circle cx="0" cy="0" r="100" fill="url(#doughGradient)" stroke="#8B4513" strokeWidth="2" />
          
          {/* Crust Texture/Imperfections (Burnt spots/Bubbles) */}
          <g fill="#B8860B" opacity="0.3">
             <ellipse cx="-60" cy="-70" rx="4" ry="2" transform="rotate(45 -60 -70)" />
             <ellipse cx="50" cy="-80" rx="5" ry="3" transform="rotate(-20 50 -80)" />
             <ellipse cx="80" cy="20" rx="3" ry="5" transform="rotate(10 80 20)" />
             <ellipse cx="20" cy="90" rx="6" ry="2" transform="rotate(80 20 90)" />
             <ellipse cx="-80" cy="30" rx="4" ry="3" transform="rotate(-45 -80 30)" />
          </g>

          {/* Inner indented area for sauce (Lighter dough color) */}
          <circle cx="0" cy="0" r="85" fill="#FFF8DC" stroke="#DEB887" strokeWidth="1" opacity="0.9" />

          {/* Sauce Layer */}
          <g filter="url(#sauce-edge)">
            <AnimatePresence mode="wait">
                <motion.g key={state.sauce.id}>
                    {/* 1. Base Sauce Color with "Drop then Spread" Animation */}
                    <motion.circle 
                        cx="0" 
                        cy="0" 
                        r="85" 
                        fill={state.sauce.color}
                        initial={{ r: 0 }}
                        animate={{ r: [0, 20, 85] }}
                        exit={{ opacity: 0, duration: 0.2 }}
                        transition={{ 
                          duration: 1.5, 
                          times: [0, 0.2, 1], // 0-0.2s: Drop (0->20), 0.2-1.5s: Spread (20->85)
                          ease: "linear"
                        }}
                    />
                    
                    {/* 2. Texture Overlay (animates with base) */}
                    <motion.circle
                        cx="0"
                        cy="0"
                        r="85"
                        fill={state.sauce.color}
                        filter="url(#sauce-texture)"
                        initial={{ r: 0 }}
                        animate={{ r: [0, 20, 85] }}
                        transition={{ 
                          duration: 1.5, 
                          times: [0, 0.2, 1],
                          ease: "linear"
                        }}
                        opacity="0.6"
                    />

                    {/* 3. Ladle "Swirl" Trail - Visible track of spreading */}
                    <motion.path 
                       d={SPIRAL_PATH_D}
                       fill="none"
                       stroke="rgba(0,0,0,0.15)"
                       strokeWidth="20"
                       strokeLinecap="round"
                       initial={{ pathLength: 0, opacity: 0 }}
                       animate={{ 
                         pathLength: [0, 0, 1], 
                         opacity: [0, 1, 0] 
                       }}
                       transition={{ duration: 1.5, times: [0, 0.2, 1], ease: "linear" }}
                    />
                     <motion.path 
                       d={SPIRAL_PATH_D}
                       fill="none"
                       stroke="rgba(255,255,255,0.15)"
                       strokeWidth="10"
                       strokeLinecap="round"
                       initial={{ pathLength: 0, opacity: 0 }}
                       animate={{ 
                         pathLength: [0, 0, 1], 
                         opacity: [0, 1, 0] 
                       }}
                       transition={{ duration: 1.5, times: [0, 0.2, 1], ease: "linear" }}
                       style={{ translateX: -2, translateY: -2 }}
                    />

                    {/* 4. The Magic Spoon - Animates on top of the sauce */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1, 1, 0.5] 
                        }}
                        transition={{ 
                            duration: 1.6, 
                            times: [0, 0.15, 0.9, 1] 
                        }}
                    >
                         {/* Spoon Handle (Subtle hint) */}
                         <motion.line 
                             x1="0" y1="0" x2="20" y2="-25"
                             stroke="#94a3b8"
                             strokeWidth="6"
                             strokeLinecap="round"
                             animate={{
                                 x1: SPIRAL_FRAMES.x,
                                 y1: SPIRAL_FRAMES.y,
                                 x2: SPIRAL_FRAMES.x.map(x => x + 20),
                                 y2: SPIRAL_FRAMES.y.map(y => y - 25),
                             }}
                             transition={{ duration: 1.3, delay: 0.2, ease: "linear" }}
                         />
                         
                         {/* Spoon Head */}
                         <motion.circle
                            r="12"
                            fill="url(#spoonGradient)"
                            stroke="#cbd5e1"
                            strokeWidth="1"
                            shadow="0px 4px 4px rgba(0,0,0,0.2)"
                            animate={{
                                cx: SPIRAL_FRAMES.x,
                                cy: SPIRAL_FRAMES.y
                            }}
                            transition={{ duration: 1.3, delay: 0.2, ease: "linear" }}
                         />
                         
                         {/* Sauce in Spoon (diminishing) */}
                         <motion.circle
                            fill={state.sauce.color}
                            initial={{ r: 10 }}
                            animate={{ 
                                cx: SPIRAL_FRAMES.x,
                                cy: SPIRAL_FRAMES.y,
                                r: [10, 8, 2, 0]
                            }}
                            transition={{ duration: 1.3, delay: 0.2, ease: "linear" }}
                         />
                    </motion.g>

                    {/* 5. Splatter Particles - Fly out from center on initial drop */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                         <motion.circle 
                            key={`splat-${i}`}
                            cx="0" cy="0" r={2 + Math.random() * 2}
                            fill={state.sauce.color}
                            initial={{ cx: 0, cy: 0, scale: 0, opacity: 1 }}
                            animate={{ 
                                cx: Math.cos(deg * Math.PI / 180) * (25 + Math.random() * 10),
                                cy: Math.sin(deg * Math.PI / 180) * (25 + Math.random() * 10),
                                scale: 1,
                                opacity: 0
                            }}
                            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                         />
                    ))}
                </motion.g>
            </AnimatePresence>
          </g>

          {(state.sauce.type === 'tomato' || state.sauce.type === 'bbq') && (
            <AnimatePresence>
                <motion.g 
                    key={`${state.sauce.id}-herbs`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.4 }}
                >
                   <path d="M-20 -20 L20 20 M20 -20 L-20 20" stroke="#FEF3C7" strokeWidth="40" strokeLinecap="round" strokeDasharray="10 30" />
                </motion.g>
            </AnimatePresence>
          )}

          {/* Toppings Layer */}
          <AnimatePresence>
            {selectedToppingsData.map((topping, layerIndex) => (
              <g 
                key={topping.id}
                // Rotate each layer slightly so toppings don't stack directly on top of each other
                // Use a prime-ish number to distribute overlaps
                transform={`rotate(${layerIndex * 67})`}
              >
                {TOPPING_POSITIONS.map((pos, index) => (
                  <ToppingShape 
                    key={`${topping.id}-${index}`}
                    type={topping.id}
                    color={topping.color}
                    position={pos}
                    index={index}
                  />
                ))}
              </g>
            ))}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
};