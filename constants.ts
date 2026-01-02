import { Size, Sauce, Topping } from './types';

export const SIZES: Size[] = [
  { id: 's', name: 'Small (10")', price: 10, scale: 0.85 },
  { id: 'm', name: 'Medium (12")', price: 14, scale: 1 },
  { id: 'l', name: 'Large (14")', price: 18, scale: 1.15 },
];

export const SAUCES: Sauce[] = [
  { id: 'tomato', name: 'Tomato Basil', price: 0, color: '#EF4444', type: 'tomato' },
  { id: 'white', name: 'Garlic White', price: 1.5, color: '#FEF3C7', type: 'white' },
  { id: 'pesto', name: 'Basil Pesto', price: 2, color: '#65A30D', type: 'pesto' },
  { id: 'bbq', name: 'Smoky BBQ', price: 1, color: '#78350F', type: 'bbq' },
];

export const TOPPINGS: Topping[] = [
  { 
    id: 'cheese_extra', 
    name: 'Extra Cheese', 
    price: 1.5, 
    color: '#FCD34D',
    zIndex: 10,
    iconPath: 'M4 4h16v16H4z' // Placeholder, visual component handles texture
  },
  { 
    id: 'pepperoni', 
    name: 'Pepperoni', 
    price: 2, 
    color: '#B91C1C',
    zIndex: 20,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M9 10a1 1 0 100 2 1 1 0 000-2z M15 10a1 1 0 100 2 1 1 0 000-2z M12 14a1 1 0 100 2 1 1 0 000-2z' 
  },
  { 
    id: 'mushroom', 
    name: 'Mushrooms', 
    price: 1.5, 
    color: '#A8A29E',
    zIndex: 21,
    iconPath: 'M12 3c-4.4 0-8 3-8 6.5 0 2.2 1.5 4.2 3.8 5.4L7 19h10l-.8-4.1c2.3-1.2 3.8-3.2 3.8-5.4C20 6 16.4 3 12 3zm0 2c3.3 0 6 2.2 6 5h-12c0-2.8 2.7-5 6-5z'
  },
  { 
    id: 'olive', 
    name: 'Black Olives', 
    price: 1, 
    color: '#171717',
    zIndex: 22,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z' 
  },
  { 
    id: 'onion', 
    name: 'Red Onions', 
    price: 1, 
    color: '#C084FC',
    zIndex: 23,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z' 
  },
  { 
    id: 'pepper', 
    name: 'Green Peppers', 
    price: 1.25, 
    color: '#16A34A',
    zIndex: 24,
    iconPath: 'M17 12c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-5 3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z' 
  },
  {
    id: 'basil',
    name: 'Fresh Basil',
    price: 1.25,
    color: '#4ADE80',
    zIndex: 25,
    iconPath: 'M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 2.48 0 4.73 1.01 6.36 2.64L12 12V21z'
  }
];

// Pre-calculate balanced positions using concentric rings for even coverage across the dough
export const TOPPING_POSITIONS = (() => {
  const positions = [];
  
  // 1. Center Item (1 item)
  positions.push({ 
    x: 0, 
    y: 0, 
    rotation: Math.random() * 360, 
    scale: 0.9 + Math.random() * 0.2 
  });

  // 2. Inner Ring: Radius ~28 (6 items)
  const innerCount = 6;
  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2; 
    const angleOffset = (Math.random() - 0.5) * 0.5; // Slight jitter
    const r = 28 + Math.random() * 5; 
    
    positions.push({
        x: Math.cos(angle + angleOffset) * r,
        y: Math.sin(angle + angleOffset) * r,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3
    });
  }

  // 3. Middle Ring: Radius ~52 (9 items)
  const midCount = 9;
  for (let i = 0; i < midCount; i++) {
    const angle = (i / midCount) * Math.PI * 2;
    const angleOffset = (Math.random() - 0.5) * 0.5;
    const r = 52 + Math.random() * 5;

    positions.push({
        x: Math.cos(angle + angleOffset) * r,
        y: Math.sin(angle + angleOffset) * r,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3
    });
  }
  
  // 4. Outer Ring: Radius ~76 (12 items)
  const outerCount = 12;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2;
    const angleOffset = (Math.random() - 0.5) * 0.5;
    const r = 76 + Math.random() * 5;

    positions.push({
        x: Math.cos(angle + angleOffset) * r,
        y: Math.sin(angle + angleOffset) * r,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3
    });
  }

  return positions;
})();