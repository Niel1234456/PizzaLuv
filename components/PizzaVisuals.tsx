import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PizzaState, Topping, ToppingCoverage } from '../types';
import { TOPPINGS, TOPPING_POSITIONS } from '../constants';

interface PizzaVisualsProps {
  state: PizzaState;
  isThumbnail?: boolean;
  idPrefix?: string;
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

const ToppingShape: React.FC<{ type: string; color: string; iconUrl?: string; position: any; index: number; isThumbnail: boolean; idPrefix: string }> = ({ type, color, iconUrl, position, index, isThumbnail, idPrefix }) => {
  
  // Stable random values for animations to prevent re-render jitter
  const randomSeed = useMemo(() => Math.random(), []);
  const sId = (id: string) => `${idPrefix}${id}`;
  
  // Render different SVG paths based on topping type
  const renderShape = () => {
    switch(type) {
      case 'pepperoni':
        return (
          <g transform={`rotate(${randomSeed * 360})`}>
            {/* Main Slice Body with Gradient */}
            <circle cx="0" cy="0" r="9" fill={`url(#${sId("pepGradient")})`} stroke="#7F1D1D" strokeWidth="0.5" />
            
            {/* Fat Marbling (Simulated with semi-transparent shapes) */}
            <circle cx="-3" cy="-2" r="2" fill="#FFCCBC" opacity="0.3" />
            <circle cx="2" cy="3" r="1.5" fill="#FFCCBC" opacity="0.25" />
            <circle cx="4" cy="-2" r="1.8" fill="#FFCCBC" opacity="0.3" />
            
            {/* Small Spice/Texture Dots */}
            <circle cx="0" cy="4" r="0.6" fill="#3E0000" opacity="0.3" />
            <circle cx="-4" cy="1" r="0.5" fill="#3E0000" opacity="0.3" />
            <circle cx="3" cy="-4" r="0.5" fill="#3E0000" opacity="0.3" />

            {/* Oily Sheen / Specular Highlight */}
            <path d="M-4 -4 Q-2 -6 2 -5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" fill="none" />
          </g>
        );
      case 'mushroom':
        return (
          // Using the image icon as requested
          <image
            href="https://cdn-icons-png.flaticon.com/512/8775/8775340.png"
            x="-11"
            y="-11"
            width="22"
            height="22"
            opacity="0.95"
          />
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
          <g transform={`rotate(${randomSeed * 360})`}>
             {/* Drop Shadow for depth */}
             <path d="M-10 0 A 10 10 0 0 1 10 0" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="3" strokeLinecap="round" transform="translate(0.5, 0.5)" />
             
             {/* Outer Skin - Distinct Dark Purple */}
             <path d="M-10 0 A 10 10 0 0 1 10 0" fill="none" stroke="#7E22CE" strokeWidth="3.5" strokeLinecap="round" />
             
             {/* Flesh - Pale Purple/White - sitting inside the skin */}
             <path d="M-10 0 A 10 10 0 0 1 10 0" fill="none" stroke="#F3E8FF" strokeWidth="2.5" strokeLinecap="round" />
             
             {/* Inner Layer Separator - Thin line defining the layers */}
             <path d="M-10 0 A 10 10 0 0 1 10 0" fill="none" stroke="#A855F7" strokeWidth="0.5" strokeLinecap="round" transform="scale(0.95)" />
             
             {/* Occasional Inner Ring Segment (randomly visible) */}
             {randomSeed > 0.4 && (
                <g transform="translate(0, 4) scale(0.6)">
                    <path d="M-8 0 A 8 8 0 0 1 8 0" fill="none" stroke="#7E22CE" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
                    <path d="M-8 0 A 8 8 0 0 1 8 0" fill="none" stroke="#F3E8FF" strokeWidth="2.5" strokeLinecap="round" />
                </g>
             )}
          </g>
        );
      case 'pepper':
        return (
           <g transform={`rotate(${randomSeed * 360})`}>
                {/* Lobed Green Pepper Ring */}
                <path 
                    d="M-5 -7 Q0 -5 5 -7 Q7 -3 7 3 Q4 5 4 7 Q0 5 -4 7 Q-7 3 -7 -3 Q-4 -5 -5 -7" 
                    fill="none" 
                    stroke="#15803D" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
                {/* Inner Highlight for depth */}
                <path 
                    d="M-5 -7 Q0 -5 5 -7 Q7 -3 7 3 Q4 5 4 7 Q0 5 -4 7 Q-7 3 -7 -3 Q-4 -5 -5 -7" 
                    fill="none" 
                    stroke="#86EFAC" 
                    strokeWidth="0.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    transform="scale(0.8)"
                    opacity="0.6"
                />
                {/* Gloss */}
                <path d="M-5 -7 Q-2 -6 -1 -6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </g>
        );
      case 'pepper_red':
        return (
          <g transform={`rotate(${randomSeed * 360})`}>
            {/* Lobed Red Pepper Ring */}
            <path 
                d="M-5 -7 Q0 -5 5 -7 Q7 -3 7 3 Q4 5 4 7 Q0 5 -4 7 Q-7 3 -7 -3 Q-4 -5 -5 -7" 
                fill="none" 
                stroke="#B91C1C" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            {/* Inner Highlight */}
            <path 
                d="M-5 -7 Q0 -5 5 -7 Q7 -3 7 3 Q4 5 4 7 Q0 5 -4 7 Q-7 3 -7 -3 Q-4 -5 -5 -7" 
                fill="none" 
                stroke="#FCA5A5" 
                strokeWidth="0.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                transform="scale(0.8)"
                opacity="0.6"
            />
            {/* Gloss */}
            <path d="M-5 -7 Q-2 -6 -1 -6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          </g>
        );
      case 'pineapple':
        return (
          <g transform={`rotate(${randomSeed * 360})`}>
             {/* Irregular Chunk Body */}
             <path d="M-5 -3 L-2 -5 L5 -2 L4 4 L-1 5 L-5 2 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="0.5" strokeLinejoin="round" />
             
             {/* Caramelized/Browned Edge (Partial) - simulates oven bake */}
             <path d="M4 4 L-1 5 L-5 2" fill="none" stroke="#D97706" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
             
             {/* Fibrous Texture Details */}
             <path d="M-2 -1 L0 -3 M2 0 L3 -2" stroke="#A16207" strokeWidth="0.5" opacity="0.4" />
             
             {/* Juicy Highlight */}
             <ellipse cx="-1" cy="-1" rx="2" ry="1" fill="white" opacity="0.4" transform="rotate(-30)" />
          </g>
        );
      case 'spinach':
        return (
            <motion.g 
                 initial={isThumbnail ? undefined : { scale: 0.5, rotate: -20 * (randomSeed > 0.5 ? 1 : -1) }}
                 animate={isThumbnail ? undefined : { 
                     scale: 0.8 + randomSeed * 0.4, 
                     rotate: randomSeed * 360 
                 }}
                 transition={{ 
                     type: "spring",
                     stiffness: 200,
                 }}
            >
                {/* Dark, wilted leaf shape */}
                <path 
                    d="M0 10 C-4 8 -8 2 -6 -4 C-4 -8 0 -10 4 -6 C8 -4 8 4 5 8 C3 10 1 10 0 10 Z"
                    fill="#14532D" 
                    stroke="#052e16"
                    strokeWidth="0.5"
                />
                {/* Veins */}
                <path d="M0 10 Q 1 0 -2 -6" stroke="#22c55e" strokeWidth="0.5" fill="none" opacity="0.3" />
                <path d="M0 2 L 3 4 M 0 0 L -3 2" stroke="#22c55e" strokeWidth="0.5" fill="none" opacity="0.2" />
            </motion.g>
        );
      case 'basil':
         return (
             <motion.g 
                 initial={isThumbnail ? undefined : { scale: 0.5, rotate: -20 * (randomSeed > 0.5 ? 1 : -1) }}
                 animate={isThumbnail ? undefined : { 
                     scale: 1, 
                     rotate: randomSeed * 360,
                 }}
                 transition={{ 
                     type: "spring",
                     stiffness: 200,
                     damping: 12,
                 }}
             >
                 {/* Fresh, brighter green, smoother leaf */}
                 <path 
                     d="M0 12 Q4 8 6 0 Q6 -8 0 -12 Q-6 -8 -6 0 Q-4 8 0 12" 
                     fill="#4ADE80" 
                     stroke="#15803D" 
                     strokeWidth="0.5"
                 />
                 {/* Central Vein / Fold */}
                 <path d="M0 -11 Q 2 0 0 11" stroke="#166534" strokeWidth="0.5" fill="none" opacity="0.4" />
                 {/* Shine */}
                 <path d="M-2 -5 Q-1 -2 -2 2" stroke="white" strokeWidth="1" opacity="0.2" fill="none" />
             </motion.g>
         );
      case 'cheese_extra':
        // Realistic Melted Mozzarella
        return (
          <g transform={`rotate(${randomSeed * 360}) scale(${0.9 + randomSeed * 0.4})`}>
            {/* Organic Melted Shape (Blob) */}
            <path 
                d="M-8 -2 Q-10 -7 -3 -9 Q 4 -10 9 -4 Q 12 3 6 8 Q -1 10 -6 6 Q -9 2 -8 -2 Z"
                fill="#FFF7ED" 
                stroke="#FFE4B5"
                strokeWidth="0.5"
                filter={`url(#${sId("melted-glow")})`}
            />
            
            {/* Subtle Surface Texture/Browning */}
            {randomSeed > 0.6 && (
                <circle cx="2" cy="-2" r="1.5" fill="#FDE68A" opacity="0.5" filter="blur(0.5px)" />
            )}
            
            {/* Oily Sheen/Highlight (Melted look) */}
            <path 
                d="M-5 -4 Q -2 -7 2 -5" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                opacity="0.6" 
                fill="none" 
            />
             <path 
                d="M2 3 Q 5 1 6 -2" 
                stroke="white" 
                strokeWidth="1" 
                strokeLinecap="round" 
                opacity="0.4" 
                fill="none" 
            />
          </g>
        );
      case 'parmesan':
         // Scatter of fine granules
         return (
             <g transform={`rotate(${randomSeed * 360})`}>
                 {[...Array(8)].map((_, i) => {
                     const r = randomSeed * (i + 1) * 321 % 12; // pseudo-random radius within cluster
                     const angle = randomSeed * (i + 1) * 123;
                     const x = Math.cos(angle) * r;
                     const y = Math.sin(angle) * r;
                     const size = 0.5 + (randomSeed * i) % 0.8;
                     return (
                         <circle 
                            key={i} 
                            cx={x} 
                            cy={y} 
                            r={size} 
                            fill="#FFFFF0" 
                            opacity="0.9" 
                         />
                     );
                 })}
                 {/* One slightly larger flake */}
                 <path d="M-2 -2 L-1 -3 L1 -1 L-1 1 Z" fill="#FEF9C3" opacity="0.8" transform={`translate(${randomSeed*5}, ${randomSeed*-5})`} />
             </g>
         );
      case 'blue_cheese':
        // Crumbled texture
        return (
            <g transform={`rotate(${randomSeed * 360}) scale(${0.8 + randomSeed * 0.3})`}>
                {/* Main irregular crumb */}
                <path 
                    d="M-4 -2 L -2 -5 L 3 -3 L 5 1 L 2 4 L -3 3 Z" 
                    fill="#F1F5F9" 
                    stroke="#E2E8F0" 
                    strokeWidth="0.5" 
                    strokeLinejoin="round" 
                />
                {/* Blue veins */}
                <path d="M-2 -3 L 0 -1 M 2 0 L 1 2" stroke="#475569" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                <path d="M-1 1 L 1 0" stroke="#334155" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
                {/* Small satellite crumb */}
                <circle cx="5" cy="-3" r="1.5" fill="#F1F5F9" />
            </g>
        );
      case 'salted_egg':
        return (
            <g transform={`rotate(${randomSeed * 360}) scale(${0.9 + randomSeed * 0.2})`}>
                {/* Egg White Slice - slightly irregular circle */}
                <path
                    d="M-9 0 C-9 -5 -5 -8.5 0 -8.5 C 5 -8.5 9 -5 9 0 C 9 5 5 9 0 9 C -5 9 -9 5 -9 0"
                    fill="#FEFCF3" 
                    stroke="#E2E8F0" 
                    strokeWidth="0.5"
                />
                
                {/* Yolk - Salted eggs have a rich dark yellow/orange yolk */}
                <circle cx="1" cy="0.5" r="4.5" fill="#FBC02D" /> 
                
                {/* Yolk Texture/Highlight */}
                <ellipse cx="2.5" cy="-1" rx="1.5" ry="1" fill="#FFF176" opacity="0.5" transform="rotate(-45 2.5 -1)" />
                
                {/* Grainy texture dots on yolk (salted egg characteristic) */}
                <circle cx="0" cy="2" r="0.6" fill="#F57F17" opacity="0.3" />
                <circle cx="-1.5" cy="-0.5" r="0.5" fill="#F57F17" opacity="0.3" />
                <circle cx="2.5" cy="2.5" r="0.4" fill="#F57F17" opacity="0.3" />
            </g>
        );
      case 'sisig':
        return (
            <g transform={`rotate(${randomSeed * 360}) scale(${0.85 + randomSeed * 0.3})`}>
                {/* Main Chunk - Irregular meaty shape */}
                <path 
                    d="M-5 -2 L -3 -5 L 2 -4 L 5 -1 L 3 4 L -2 5 L -6 2 Z" 
                    fill="#795548" 
                    stroke="#5D4037" 
                    strokeWidth="0.5" 
                    strokeLinejoin="round"
                />
                
                {/* Fatty/Crispy Bits - Lighter and Darker spots */}
                <path d="M-2 -2 L 0 -3 L 2 -1" stroke="#D7CCC8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <circle cx="2" cy="2" r="1.2" fill="#3E2723" opacity="0.7" /> {/* Char */}
                
                {/* Tiny Onion bit (often mixed in) */}
                <rect x="-3" y="1" width="2" height="2" fill="#F5F5F5" rx="0.5" opacity="0.9" />
                
                {/* Greasy sheen */}
                <path d="M-1 0 Q 1 1 3 -1" stroke="white" strokeWidth="0.8" opacity="0.2" fill="none" />
            </g>
        );
      case 'tinapa':
         return (
             <g transform={`rotate(${randomSeed * 360}) scale(${0.9 + randomSeed * 0.3})`}>
                 {/* Fish Flake Body - Elongated, fibrous look */}
                 <path 
                    d="M-6 0 C-6 -4 0 -6 5 -2 C 7 1 4 5 0 4 C -4 3 -6 2 -6 0" 
                    fill="#A1887F" 
                    stroke="#8D6E63" 
                    strokeWidth="0.5"
                 />
                 
                 {/* Smoked Skin Texture (Dark Gold/Brown) */}
                 <path d="M-5 0 Q -2 -2 2 -1" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none" />
                 
                 {/* Muscle Fibers/Flake lines */}
                 <path d="M-2 2 L 1 1 M 0 3 L 3 2" stroke="#D7CCC8" strokeWidth="0.5" opacity="0.5" />
                 
                 {/* Golden Smoked Highlight */}
                 <path d="M-3 -1 Q 0 -3 3 -2" stroke="#FFCC80" strokeWidth="1" opacity="0.4" fill="none" />
             </g>
         );
      case 'ham':
         return (
             <g transform={`rotate(${randomSeed * 360}) scale(${0.9 + randomSeed * 0.2})`}>
                {/* Soft, irregular pink square */}
                <path 
                    d="M-7 -6 Q 0 -8 7 -5 Q 8 0 6 6 Q -1 8 -6 5 Q -8 0 -7 -6" 
                    fill="#F48FB1" 
                    stroke="#EC407A" 
                    strokeWidth="0.5" 
                />
                
                {/* Muscle grain/texture (faint white lines) */}
                <path d="M-5 -4 L 5 -3" stroke="white" opacity="0.4" strokeWidth="0.5" strokeLinecap="round" />
                <path d="M-4 2 L 4 3" stroke="white" opacity="0.3" strokeWidth="0.5" strokeLinecap="round" />
                
                {/* Slightly darker edge to simulate thickness/casing */}
                <path d="M-7 -6 Q -8 0 -6 5" stroke="#D81B60" strokeWidth="0.5" fill="none" opacity="0.3" />
             </g>
         );
      case 'meat':
         return (
             <g transform={`rotate(${randomSeed * 360}) scale(${0.85 + randomSeed * 0.3})`}>
                 {/* Irregular crumbly shape */}
                 <path 
                    d="M-4 -3 L -1 -5 L 4 -2 L 3 3 L -2 4 L -5 1 Z" 
                    fill="#8D6E63" 
                    stroke="#5D4037" 
                    strokeWidth="0.5" 
                    strokeLinejoin="round"
                 />
                 
                 {/* Highlights for cooked texture */}
                 <circle cx="-1" cy="-1" r="1.5" fill="#A1887F" opacity="0.5" />
                 <circle cx="2" cy="2" r="1" fill="#D7CCC8" opacity="0.4" />
                 
                 {/* Shadow for depth */}
                 <path d="M-2 4 L 3 3" stroke="#3E2723" strokeWidth="1" opacity="0.3" />
             </g>
         );
      case 'shrimp':
         return (
           <image
              href="https://cdn-icons-png.flaticon.com/512/1493/1493039.png"
              x="-12"
              y="-12"
              width="24"
              height="24"
              opacity="0.95"
              transform={`rotate(${randomSeed * 360})`}
           />
         );
      case 'chili':
         return (
            <g transform={`rotate(${randomSeed * 360}) scale(${0.7 + randomSeed * 0.2})`}>
                {/* Red Pepper Ring Skin */}
                <circle cx="0" cy="0" r="5" fill="#D32F2F" stroke="#B71C1C" strokeWidth="0.5" />
                
                {/* Pale inner pith/flesh */}
                <circle cx="0" cy="0" r="3.5" fill="#FFEBEE" />
                
                {/* Seeds (Yellow/Orange dots) */}
                <circle cx="-1.5" cy="-1.5" r="0.8" fill="#F59E0B" />
                <circle cx="1.5" cy="1.5" r="0.8" fill="#F59E0B" />
                <circle cx="1.5" cy="-1.5" r="0.7" fill="#F59E0B" />
                
                {/* Empty center/hole (darker background color to simulate hole) */}
                <circle cx="0" cy="0" r="1" fill="#EF9A9A" opacity="0.5" />
            </g>
         );
      default:
        // Generic rendering for image-based toppings 
        if (iconUrl) {
           return (
             <image
                href={iconUrl}
                x="-12"
                y="-12"
                width="24"
                height="24"
                opacity="0.95"
                transform={`rotate(${randomSeed * 360})`}
             />
           );
        }
        return <circle cx="0" cy="0" r="5" fill={color} />;
    }
  };
  return <g transform={`translate(${position.x}, ${position.y}) scale(${position.scale})`}>{renderShape()}</g>;
};

export const PizzaVisuals: React.FC<PizzaVisualsProps> = ({ state, isThumbnail = false, idPrefix = '' }) => {
  const sId = (id: string) => `${idPrefix}${id}`;
  
  const crustId = state.crust.id;
  const cutId = state.cut.id;

  const crustVisuals = useMemo(() => {
    switch (state.crust.id) {
        case 'thin': return { innerRadius: 92, gradientColors: ['#EBC79E', '#D4A373', '#CCA265'] };
        case 'stuffed': return { innerRadius: 82, gradientColors: ['#EBC79E', '#D4A373', '#CCA265'] }; // Thicker rim
        case 'pan': return { innerRadius: 85, gradientColors: ['#F3D0A3', '#E0B580', '#D6A66B'] }; // Golden
        case 'neapolitan': return { innerRadius: 85, gradientColors: ['#EBC79E', '#C89458', '#453018'] }; // Charred
        case 'whole_wheat': return { innerRadius: 88, gradientColors: ['#D6B690', '#A88560', '#856445'] }; // Brown
        case 'gluten_free': return { innerRadius: 90, gradientColors: ['#F2E4CF', '#E6D0B0', '#D1B894'] }; // Pale
        default: return { innerRadius: 88, gradientColors: ['#EBC79E', '#D4A373', '#CCA265'] }; // Classic
    }
  }, [state.crust.id]);

  const visuals = useMemo(() => {
    // Rely solely on state.toppings order for layering (User selection order)
    return state.toppings.map((selected) => {
        const toppingInfo = TOPPINGS.find(t => t.id === selected.id);
        if (!toppingInfo) return null;
        
        let validPositions = TOPPING_POSITIONS;
        // Filter based on coverage
        if (selected.coverage === 'left') {
            validPositions = TOPPING_POSITIONS.filter(p => p.x < 15);
        } else if (selected.coverage === 'right') {
            validPositions = TOPPING_POSITIONS.filter(p => p.x > -15);
        }
        
        return {
            ...toppingInfo,
            validPositions
        };
    }).filter((t): t is (Topping & { validPositions: typeof TOPPING_POSITIONS }) => !!t);
  }, [state.toppings]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      
      {/* Wooden Table & Paddle - Hide for thumbnails */}
      {!isThumbnail && (
        <>
            {/* REALISTIC WOODEN TABLE SURFACE */}
            <motion.div
                className="absolute z-0 w-[95vw] h-[80vh] md:w-[90vw] md:h-[80vh] max-w-[1200px] max-h-[800px]"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="w-full h-full rounded-[2.5rem] bg-[#2D1B15] shadow-2xl relative overflow-hidden border-b-[16px] border-r-[16px] border-[#1a0f0c]">
                    
                    {/* 1. Base Wood Gradient (Rich Mahogany/Walnut tone) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5D4037] via-[#3E2723] to-[#281815]" />

                    {/* 2. SVG Wood Grain Texture - Enhanced */}
                    <svg width="100%" height="100%" className="absolute inset-0 opacity-60 mix-blend-overlay">
                        <filter id={sId("woodGrainRealistic")}>
                            {/* Large scale grain flow */}
                            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.08" numOctaves="4" seed="5" result="noise" />
                            {/* Contrast for the grain */}
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.2 -0.2" in="noise" result="grain" />
                            {/* Displacement to warp it slightly */}
                            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="2" result="warp" />
                            <feDisplacementMap in="grain" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                        <rect width="100%" height="100%" filter={`url(#${sId("woodGrainRealistic")})`} />
                    </svg>
                    
                    {/* 3. Plank Grooves (Shadow + Highlight) */}
                    <div 
                        className="absolute inset-0" 
                        style={{ 
                            backgroundImage: `
                                linear-gradient(90deg, 
                                    rgba(0,0,0,0.6) 0px, 
                                    rgba(0,0,0,0.6) 2px, 
                                    rgba(255,255,255,0.05) 3px, 
                                    transparent 3px
                                )
                            `, 
                            backgroundSize: '140px 100%' 
                        }} 
                    />

                    {/* 4. Wood Knots (CSS Radial Gradients randomly placed) */}
                    <div className="absolute top-[20%] left-[15%] w-32 h-20 rounded-[50%] bg-[#1a0f0c] opacity-20 blur-sm transform rotate-12 mix-blend-multiply" />
                    <div className="absolute bottom-[30%] right-[25%] w-24 h-16 rounded-[50%] bg-[#1a0f0c] opacity-20 blur-sm transform -rotate-6 mix-blend-multiply" />
                    <div className="absolute top-[60%] left-[40%] w-20 h-12 rounded-[50%] bg-[#1a0f0c] opacity-15 blur-sm transform rotate-45 mix-blend-multiply" />

                    {/* 5. Surface Imperfections / Scratches */}
                     <svg width="100%" height="100%" className="absolute inset-0 opacity-20 mix-blend-color-burn">
                        <filter id={sId("scratches")}>
                             <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="10" />
                             <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" />
                        </filter>
                        <rect width="100%" height="100%" filter={`url(#${sId("scratches")})`} />
                     </svg>

                    {/* 6. Lighting / Specular Sheen (Simulate lamp/window reflection) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundSize: '200% 200%' }} />
                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none" />

                    {/* 7. Deep Vignette for focus */}
                    <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] rounded-[2.5rem]" />
                    
                    {/* 8. Table Edge Highlight (Top Bevel) */}
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-white opacity-20" />
                    <div className="absolute inset-y-0 left-0 w-[2px] bg-white opacity-10" />
                </div>
            </motion.div>

            {/* Wooden Paddle Background - Enhanced Drop Shadow */}
            <motion.div 
                className="absolute z-1"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Paddle Shadow on Table */}
                <svg 
                    width="600" 
                    height="600" 
                    viewBox="0 -100 400 600" 
                    className="absolute w-[140vw] h-[140vw] max-w-[900px] max-h-[900px] translate-y-4 translate-x-2 blur-md opacity-60 mix-blend-multiply pointer-events-none"
                    style={{ zIndex: -1 }}
                >
                     <path d="M180 380 L220 380 L220 480 C220 490 210 500 200 500 C190 500 180 490 180 480 Z" fill="#000" />
                     <circle cx="200" cy="200" r="190" fill="#000" />
                </svg>

                <svg 
                    width="600" 
                    height="600" 
                    viewBox="0 -100 400 600" 
                    className="w-[140vw] h-[140vw] max-w-[900px] max-h-[900px] drop-shadow-2xl"
                >
                    <defs>
                        <linearGradient id={sId("woodGradient")} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#8D5524' }} />
                            <stop offset="25%" style={{ stopColor: '#C68642' }} />
                            <stop offset="50%" style={{ stopColor: '#8D5524' }} />
                            <stop offset="75%" style={{ stopColor: '#C68642' }} />
                            <stop offset="100%" style={{ stopColor: '#8D5524' }} />
                        </linearGradient>
                        <filter id={sId("paddleGrain")}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.2" numOctaves="2" result="noise" />
                             <feComposite operator="in" in="noise" in2="SourceGraphic" result="composite"/>
                             <feBlend in="composite" in2="SourceGraphic" mode="multiply" opacity="0.4" />
                        </filter>
                    </defs>
                    
                    <g filter={`url(#${sId("paddleGrain")})`}>
                        {/* Paddle Handle */}
                        <path d="M180 380 L220 380 L220 480 C220 490 210 500 200 500 C190 500 180 490 180 480 Z" fill={`url(#${sId("woodGradient")})`} />
                        {/* Paddle Head */}
                        <circle cx="200" cy="200" r="190" fill={`url(#${sId("woodGradient")})`} />
                    </g>
                    
                    {/* Paddle Wear & Tear / Flour Dust */}
                    <circle cx="200" cy="200" r="160" fill="url(#flourDust)" opacity="0.3" filter="blur(20px)" />
                     <defs>
                         <radialGradient id="flourDust">
                             <stop offset="0%" stopColor="#fff" />
                             <stop offset="100%" stopColor="transparent" />
                         </radialGradient>
                     </defs>
                </svg>
            </motion.div>
        </>
      )}

      {/* Container for proper aspect ratio scaling */}
      <motion.div 
        className="relative z-10"
        style={{
            width: isThumbnail ? '100%' : '75vw',
            height: isThumbnail ? '100%' : '75vw',
            maxWidth: isThumbnail ? 'none' : '500px',
            maxHeight: isThumbnail ? 'none' : '500px'
        }}
        animate={{ scale: state.size.scale }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <svg viewBox="-110 -110 220 220" className={`w-full h-full ${!isThumbnail && 'drop-shadow-xl'}`}>
          <defs>
            {/* Dynamic Dough Gradient based on Crust Type */}
            <radialGradient id={sId("doughGradient")} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="70%" stopColor={crustVisuals.gradientColors[0]} /> 
                <stop offset="92%" stopColor={crustVisuals.gradientColors[1]} /> 
                <stop offset="100%" stopColor={crustVisuals.gradientColors[2]} /> 
            </radialGradient>
            
            {/* Crust 3D Highlight Gradient - Creates the puffy rim effect */}
            <radialGradient id={sId("crust-highlight")} cx="50%" cy="50%" r="50%">
                <stop offset="82%" stopColor="rgba(0,0,0,0)" />
                <stop offset="88%" stopColor="rgba(255,255,255,0.4)" /> {/* Specular highlight on rim top */}
                <stop offset="95%" stopColor="rgba(0,0,0,0.1)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.3)" /> {/* Shadow at edge */}
            </radialGradient>

            {/* Spoon Metallic Gradient */}
            <radialGradient id={sId("spoonGradient")} cx="30%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            {/* Pepperoni Realistic Gradient */}
            <radialGradient id={sId("pepGradient")} cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
                <stop offset="0%" stopColor="#EF5350" /> 
                <stop offset="60%" stopColor="#D32F2F" /> 
                <stop offset="100%" stopColor="#8E0000" /> 
            </radialGradient>

            {/* Sauce Edge Roughness Filter - Enhanced for organic flow */}
            <filter id={sId("sauce-edge")} x="-50%" y="-50%" width="200%" height="200%">
               {/* Smoother, larger waves for the liquid spread shape */}
               <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="85" result="turbulence" />
               <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="G" />
               {/* Slight blur to soften pixelation from displacement */}
               <feGaussianBlur stdDeviation="0.3" />
            </filter>

            {/* Dough Texture Filter - Realistic baked surface noise */}
            <filter id={sId("dough-texture")} x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
                {/* Adjust alpha to make it subtle */}
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0" in="noise" result="coloredNoise"/>
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
                <feBlend in="SourceGraphic" in2="composite" mode="multiply" />
            </filter>

            {/* Sauce Surface Texture Filter */}
            <filter id={sId("sauce-texture")} x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" seed="12" result="noise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise"/>
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
            </filter>
            
            {/* Melted Cheese Glow/Blur Filter */}
            <filter id={sId("melted-glow")} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
          </defs>

          {/* Crust Shadow */}
          <circle cx="0" cy="4" r="102" fill="rgba(0,0,0,0.2)" />

          {/* 1. Base Dough Layer with Texture */}
          <g filter={`url(#${sId("dough-texture")})`}>
             {/* Main Dough Shape */}
             <circle cx="0" cy="0" r="100" fill={`url(#${sId("doughGradient")})`} />
          </g>
          
          {/* 2. Puffed Crust Highlight Overlay */}
          <circle cx="0" cy="0" r="100" fill={`url(#${sId("crust-highlight")})`} />

          {/* Crust Imperfections/Burnt spots (Subtle) */}
          <g fill="#8B4513" opacity="0.15">
             <ellipse cx="-60" cy="-70" rx="4" ry="2" transform="rotate(45 -60 -70)" />
             <ellipse cx="50" cy="-80" rx="5" ry="3" transform="rotate(-20 50 -80)" />
             <ellipse cx="80" cy="20" rx="3" ry="5" transform="rotate(10 80 20)" />
             <ellipse cx="20" cy="90" rx="6" ry="2" transform="rotate(80 20 90)" />
             <ellipse cx="-80" cy="30" rx="4" ry="3" transform="rotate(-45 -80 30)" />
          </g>

          {/* Stuffed Crust Indicator: Subtle ring of cheese */}
          {crustId === 'stuffed' && (
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* The cheese filling glow inside the rim */}
                <circle 
                    cx="0" cy="0" r="88" 
                    fill="none" 
                    stroke="#FFF7ED" 
                    strokeWidth="12" 
                    strokeOpacity="0.4"
                    filter={`url(#${sId("melted-glow")})`}
                />
                {/* A slightly more defined inner edge to suggest the seam */}
                <circle 
                    cx="0" cy="0" r="82" 
                    fill="none" 
                    stroke="#FEF3C7" 
                    strokeWidth="2" 
                    strokeOpacity="0.6"
                    strokeDasharray="10 5"
                />
            </motion.g>
          )}

          {/* 3. Inner "Bed" for Ingredients - Radius changes based on crust type */}
          <motion.circle 
              cx="0" cy="0" 
              animate={{ r: crustVisuals.innerRadius }}
              transition={{ duration: 0.4 }}
              fill="#EBC79E" 
              opacity="0.8" 
          />

          {/* Sauce Layer - Radius matches inner bed minus margin */}
          <g filter={`url(#${sId("sauce-edge")})`}>
            <AnimatePresence mode="wait">
                <motion.g key={state.sauce.id}>
                    {/* 1. Base Sauce Color */}
                    <motion.circle 
                        cx="0" 
                        cy="0" 
                        // Animate radius based on crust type
                        animate={isThumbnail ? { r: crustVisuals.innerRadius - 3 } : { r: [0, 20, crustVisuals.innerRadius - 3] }}
                        fill={state.sauce.color}
                        initial={isThumbnail ? { r: crustVisuals.innerRadius - 3 } : { r: 0 }}
                        exit={isThumbnail ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                        transition={isThumbnail ? { duration: 0.4 } : { 
                          duration: 1.5, 
                          times: [0, 0.2, 1], 
                          ease: "linear"
                        }}
                    />
                    
                    {/* 2. Texture Overlay */}
                    <motion.circle
                        cx="0"
                        cy="0"
                        animate={isThumbnail ? { r: crustVisuals.innerRadius - 3 } : { r: [0, 20, crustVisuals.innerRadius - 3] }}
                        fill={state.sauce.color}
                        filter={`url(#${sId("sauce-texture")})`}
                        initial={isThumbnail ? { r: crustVisuals.innerRadius - 3 } : { r: 0 }}
                        transition={isThumbnail ? { duration: 0.4 } : { 
                          duration: 1.5, 
                          times: [0, 0.2, 1],
                          ease: "linear"
                        }}
                        opacity="0.6"
                    />

                    {/* Spoon & Trail Animations - Disable for thumbnail */}
                    {!isThumbnail && (
                        <>
                            <motion.path 
                                d={SPIRAL_PATH_D}
                                fill="none"
                                stroke="rgba(0,0,0,0.15)"
                                strokeWidth="20"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 0, 1], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, times: [0, 0.2, 1], ease: "linear" }}
                            />
                             <motion.path 
                                d={SPIRAL_PATH_D}
                                fill="none"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 0, 1], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, times: [0, 0.2, 1], ease: "linear" }}
                                style={{ translateX: -2, translateY: -2 }}
                            />
                            <motion.g
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
                                transition={{ duration: 1.6, times: [0, 0.15, 0.9, 1] }}
                            >
                                <motion.line 
                                    x1="0" y1="0" x2="20" y2="-25"
                                    stroke="#94a3b8" strokeWidth="6" strokeLinecap="round"
                                    animate={{
                                        x1: SPIRAL_FRAMES.x, y1: SPIRAL_FRAMES.y,
                                        x2: SPIRAL_FRAMES.x.map(x => x + 20), y2: SPIRAL_FRAMES.y.map(y => y - 25),
                                    }}
                                    transition={{ duration: 1.3, delay: 0.2, ease: "linear" }}
                                />
                                <motion.circle
                                    r="12" fill={`url(#${sId("spoonGradient")})`}
                                    stroke="#cbd5e1" strokeWidth="1"
                                    animate={{ cx: SPIRAL_FRAMES.x, cy: SPIRAL_FRAMES.y }}
                                    transition={{ duration: 1.3, delay: 0.2, ease: "linear" }}
                                />
                                <motion.circle
                                    fill={state.sauce.color}
                                    initial={{ r: 10 }}
                                    animate={{ cx: SPIRAL_FRAMES.x, cy: SPIRAL_FRAMES.y, r: [10, 8, 2, 0] }}
                                    transition={{ duration: 1.3, delay: 0.2, ease: "linear" }}
                                />
                            </motion.g>
                            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                <motion.circle 
                                    key={`splat-${i}`}
                                    cx="0" cy="0" r={2 + Math.random() * 2}
                                    fill={state.sauce.color}
                                    initial={{ cx: 0, cy: 0, scale: 0, opacity: 1 }}
                                    animate={{ 
                                        cx: Math.cos(deg * Math.PI / 180) * (25 + Math.random() * 10),
                                        cy: Math.sin(deg * Math.PI / 180) * (25 + Math.random() * 10),
                                        scale: 1, opacity: 0
                                    }}
                                    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                                />
                            ))}
                        </>
                    )}
                </motion.g>
            </AnimatePresence>
          </g>

          {(state.sauce.type === 'tomato' || state.sauce.type === 'bbq') && (
            <AnimatePresence>
                <motion.g 
                    key={`${state.sauce.id}-herbs`}
                    initial={isThumbnail ? { opacity: 0.4 } : { opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={isThumbnail ? undefined : { delay: 1.4 }}
                >
                   <path d="M-20 -20 L20 20 M20 -20 L-20 20" stroke="#FEF3C7" strokeWidth="40" strokeLinecap="round" strokeDasharray="10 30" />
                </motion.g>
            </AnimatePresence>
          )}

          {/* Toppings Layer */}
          <AnimatePresence>
            {visuals.map((topping, layerIndex) => {
               const offsetX = Math.cos(layerIndex * 2.5) * 4;
               const offsetY = Math.sin(layerIndex * 2.5) * 4;

               return (
                <motion.g 
                    key={topping.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, x: offsetX, y: offsetY }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {topping.validPositions.map((pos, index) => (
                    <ToppingShape 
                        key={`${topping.id}-${index}`}
                        type={topping.id}
                        color={topping.color}
                        iconUrl={topping.iconUrl}
                        position={pos}
                        index={index}
                        isThumbnail={!!isThumbnail}
                        idPrefix={idPrefix}
                    />
                    ))}
                </motion.g>
               );
            })}
          </AnimatePresence>

          {/* Cut Overlay Layer */}
          {!isThumbnail && (
             <g stroke="rgba(0,0,0,0.4)" strokeWidth="1" strokeLinecap="round">
                 {cutId === 'classic' && (
                     <>
                         <line x1="0" y1="-100" x2="0" y2="100" />
                         <line x1="-100" y1="0" x2="100" y2="0" />
                         <line x1="-70" y1="-70" x2="70" y2="70" />
                         <line x1="70" y1="-70" x2="-70" y2="70" />
                     </>
                 )}
                 {cutId === 'square' && (
                     <>
                        <line x1="-33" y1="-95" x2="-33" y2="95" />
                        <line x1="33" y1="-95" x2="33" y2="95" />
                        <line x1="-95" y1="-33" x2="95" y2="-33" />
                        <line x1="-95" y1="33" x2="95" y2="33" />
                     </>
                 )}
                 {cutId === 'party' && (
                     <>
                        <line x1="-50" y1="-86" x2="-50" y2="86" />
                        <line x1="0" y1="-100" x2="0" y2="100" />
                        <line x1="50" y1="-86" x2="50" y2="86" />
                        
                        <line x1="-86" y1="-50" x2="86" y2="-50" />
                        <line x1="-100" y1="0" x2="100" y2="0" />
                        <line x1="-86" y1="50" x2="86" y2="50" />
                     </>
                 )}
             </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};