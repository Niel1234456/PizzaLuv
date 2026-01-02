import { Size, Sauce, Topping, RecommendedPizza } from './types';

export const SIZES: Size[] = [
  { id: 's', name: 'Small (10")', price: 10, scale: 0.85, toppingPriceMultiplier: 0.8 },
  { id: 'm', name: 'Medium (12")', price: 14, scale: 1, toppingPriceMultiplier: 1 },
  { id: 'l', name: 'Large (14")', price: 18, scale: 1.15, toppingPriceMultiplier: 1.2 },
];

export const SAUCES: Sauce[] = [
  { 
    id: 'tomato', 
    name: 'Tomato Basil', 
    price: 0, 
    color: '#EF4444', 
    type: 'tomato',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/904/904183.png'
  },
  { 
    id: 'white', 
    name: 'Garlic White', 
    price: 1.5, 
    color: '#FEF3C7', 
    type: 'white',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718421.png'
  },
  { 
    id: 'pesto', 
    name: 'Basil Pesto', 
    price: 2, 
    color: '#65A30D', 
    type: 'pesto',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718197.png'
  },
  { 
    id: 'bbq', 
    name: 'Smoky BBQ', 
    price: 1, 
    color: '#78350F', 
    type: 'bbq',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/15520/15520903.png'
  },
];

export const TOPPINGS: Topping[] = [
  { 
    id: 'cheese_extra', 
    name: 'Extra Cheese', 
    price: 1.5, 
    color: '#FCD34D',
    zIndex: 10,
    iconPath: 'M4 4h16v16H4z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7219/7219954.png'
  },
  { 
    id: 'pepperoni', 
    name: 'Pepperoni', 
    price: 2, 
    color: '#B91C1C',
    zIndex: 20,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M9 10a1 1 0 100 2 1 1 0 000-2z M15 10a1 1 0 100 2 1 1 0 000-2z M12 14a1 1 0 100 2 1 1 0 000-2z' ,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718144.png'
  },
  { 
    id: 'mushroom', 
    name: 'Mushrooms', 
    price: 1.5, 
    color: '#A8A29E',
    zIndex: 21,
    iconPath: 'M12 3c-4.4 0-8 3-8 6.5 0 2.2 1.5 4.2 3.8 5.4L7 19h10l-.8-4.1c2.3-1.2 3.8-3.2 3.8-5.4C20 6 16.4 3 12 3zm0 2c3.3 0 6 2.2 6 5h-12c0-2.8 2.7-5 6-5z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8775/8775340.png'
  },
  { 
    id: 'onion', 
    name: 'Red Onions', 
    price: 1, 
    color: '#C084FC',
    zIndex: 23,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/16148/16148294.png'
  },
  { 
    id: 'pepper', 
    name: 'Green Peppers', 
    price: 1.25, 
    color: '#16A34A',
    zIndex: 24,
    iconPath: 'M17 12c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-5 3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2909/2909814.png'
  },
  {
    id: 'pepper_red',
    name: 'Red Peppers',
    price: 1.25,
    color: '#EF4444',
    zIndex: 24,
    iconPath: 'M17 12c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-5 3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8782/8782037.png'
  },
  {
    id: 'spinach',
    name: 'Baby Spinach',
    price: 1.25,
    color: '#15803D',
    zIndex: 26,
    iconPath: 'M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8886/8886224.png'
  },
  { 
    id: 'olive', 
    name: 'Black Olives', 
    price: 1, 
    color: '#171717',
    zIndex: 22,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/16148/16148249.png'
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    price: 1.5,
    color: '#FDE047',
    zIndex: 25,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6974/6974079.png'
  },
  {
    id: 'basil',
    name: 'Fresh Basil',
    price: 1.25,
    color: '#4ADE80',
    zIndex: 25,
    iconPath: 'M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 2.48 0 4.73 1.01 6.36 2.64L12 12V21z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/12696/12696389.png'
  }
];

export const RECOMMENDED_PIZZAS: RecommendedPizza[] = [
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'Classic tomato & basil',
    sauceId: 'tomato',
    toppings: ['basil', 'cheese_extra']
  },
  {
    id: 'hawaiian',
    name: 'Tropical Hawaiian',
    description: 'Ham (using pepperoni visual), Pineapple & Cheese',
    sauceId: 'tomato',
    toppings: ['pepperoni', 'pineapple', 'cheese_extra']
  },
  {
    id: 'veggie',
    name: 'Veggie Delight',
    description: 'Onions, peppers, olives & mushrooms',
    sauceId: 'tomato',
    toppings: ['onion', 'pepper', 'olive', 'mushroom']
  },
  {
    id: 'pepperoni_feast',
    name: 'Pepperoni Feast',
    description: 'Classic pepperoni & extra cheese',
    sauceId: 'tomato',
    toppings: ['pepperoni', 'cheese_extra']
  },
  {
    id: 'snow_white',
    name: 'Snow White',
    description: 'Garlic white sauce, mushroom & basil',
    sauceId: 'white',
    toppings: ['mushroom', 'basil', 'cheese_extra']
  },
  {
    id: 'bbq_smokehouse',
    name: 'BBQ Smokehouse',
    description: 'Smoky BBQ sauce, onions, and crisp peppers',
    sauceId: 'bbq',
    toppings: ['onion', 'pepper', 'cheese_extra']
  },
  {
    id: 'pesto_verde',
    name: 'Pesto Verde',
    description: 'Basil pesto, fresh basil, spinach, and peppers',
    sauceId: 'pesto',
    toppings: ['basil', 'pepper', 'spinach']
  },
  {
    id: 'creamy_shroom',
    name: 'Creamy Mushroom',
    description: 'Garlic white sauce with mushrooms and onions',
    sauceId: 'white',
    toppings: ['mushroom', 'onion', 'cheese_extra']
  },
  {
    id: 'picante',
    name: 'Picante',
    description: 'Tomato sauce, pepperoni, red peppers, and onions',
    sauceId: 'tomato',
    toppings: ['pepperoni', 'pepper_red', 'onion']
  },
  {
    id: 'super_green',
    name: 'Super Green',
    description: 'Pesto, Spinach, Green Peppers, Basil',
    sauceId: 'pesto',
    toppings: ['spinach', 'pepper', 'basil']
  }
];

// Pre-calculate balanced positions using concentric rings for even coverage across the dough
// Adjusted counts to maintain consistent density (circumference ~ linear spacing)
export const TOPPING_POSITIONS = (() => {
  const positions = [];
  
  // 1. Center Item (1 item)
  positions.push({ 
    x: 0, 
    y: 0, 
    rotation: Math.random() * 360, 
    scale: 0.9 + Math.random() * 0.2 
  });

  // 2. Inner Ring: Radius ~26 (6 items)
  const innerCount = 6;
  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2; 
    const angleOffset = (Math.random() - 0.5) * 0.5; // Slight jitter
    const r = 26 + Math.random() * 5; 
    
    positions.push({
        x: Math.cos(angle + angleOffset) * r,
        y: Math.sin(angle + angleOffset) * r,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3
    });
  }

  // 3. Middle Ring: Radius ~51 (11 items)
  const midCount = 11;
  for (let i = 0; i < midCount; i++) {
    const angle = (i / midCount) * Math.PI * 2;
    const angleOffset = (Math.random() - 0.5) * 0.5;
    const r = 51 + Math.random() * 6;

    positions.push({
        x: Math.cos(angle + angleOffset) * r,
        y: Math.sin(angle + angleOffset) * r,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3
    });
  }
  
  // 4. Outer Ring: Radius ~76 (16 items)
  const outerCount = 16;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2;
    const angleOffset = (Math.random() - 0.5) * 0.5;
    const r = 76 + Math.random() * 7;

    positions.push({
        x: Math.cos(angle + angleOffset) * r,
        y: Math.sin(angle + angleOffset) * r,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.3
    });
  }

  return positions;
})();