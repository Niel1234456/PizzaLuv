import { Size, Sauce, Topping, RecommendedPizza, Crust, Cut } from './types';

export const SIZES: Size[] = [
  { id: 's', name: 'Small (10")', price: 150, calories: 600, scale: 0.85, toppingPriceMultiplier: 0.8 },
  { id: 'm', name: 'Medium (12")', price: 220, calories: 900, scale: 1, toppingPriceMultiplier: 1 },
  { id: 'l', name: 'Large (14")', price: 290, calories: 1200, scale: 1.15, toppingPriceMultiplier: 1.2 },
  { id: 'xl', name: 'Extra Large (16")', price: 350, calories: 1500, scale: 1.3, toppingPriceMultiplier: 1.4 },
];

export const CRUSTS: Crust[] = [
  { id: 'hand_tossed', name: 'Classic Hand-Tossed', price: 0, calories: 0, description: 'Traditional garlic-buttered crust' },
  { id: 'thin', name: 'Thin Crust', price: 0, calories: -150, description: 'Crispy and light' },
  { id: 'stuffed', name: 'Cheese-Stuffed Crust', price: 99, calories: 350, description: 'Ring of melted mozzarella inside' },
  { id: 'pan', name: 'Pan-Style Thick', price: 59, calories: 250, description: 'Deep dish, golden and buttery' },
  { id: 'neapolitan', name: 'Neapolitan Artisan', price: 79, calories: -50, description: 'Thin center, puffy charred rim' },
  { id: 'ny_foldable', name: 'NY Foldable', price: 49, calories: 50, description: 'Large, wide, and foldable' },
  { id: 'whole_wheat', name: 'Whole Wheat', price: 49, calories: -20, description: 'Nutty flavor, heartier texture' },
  { id: 'gluten_free', name: 'Gluten-Free', price: 99, calories: 0, description: 'Rice and potato flour blend' },
];

export const CUTS: Cut[] = [
  { id: 'classic', name: 'Classic Slice', description: '8 triangular slices' },
  { id: 'six_slice', name: 'Big 6 Slices', description: '6 large folded slices' },
  { id: 'strips', name: 'Strips', description: 'Vertical finger slices' },
  { id: 'square', name: 'Square Cut', description: 'Tavern-style grid cut' },
  { id: 'party', name: 'Party Cut', description: 'Smaller bite-sized squares' },
  { id: 'uncut', name: 'Uncut', description: 'Keep it whole' },
];

export const SAUCES: Sauce[] = [
  { 
    id: 'tomato', 
    name: 'Tomato Basil', 
    price: 0, 
    calories: 40,
    color: '#EF4444', 
    type: 'tomato',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/904/904183.png'
  },
  { 
    id: 'white', 
    name: 'Garlic White', 
    price: 35, 
    calories: 140,
    color: '#FEF3C7', 
    type: 'white',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718421.png'
  },
  {
    id: 'cheese_sauce',
    name: 'Cheddar Sauce',
    price: 40, 
    calories: 180,
    color: '#FDBA74', // Orange-ish cheddar color
    type: 'white',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2732/2732093.png'
  },
  { 
    id: 'pesto', 
    name: 'Basil Pesto', 
    price: 40, 
    calories: 160,
    color: '#65A30D', 
    type: 'pesto',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718197.png'
  },
  { 
    id: 'bbq', 
    name: 'Smoky BBQ', 
    price: 25, 
    calories: 90,
    color: '#78350F', 
    type: 'bbq',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/15520/15520903.png'
  },
];

export const TOPPINGS: Topping[] = [
  { 
    id: 'cheese_extra', 
    name: 'Mozzarella', 
    price: 45, 
    calories: 180,
    color: '#FFF7ED',
    zIndex: 10,
    iconPath: 'M4 4h16v16H4z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4976/4976737.png'
  },
  {
    id: 'parmesan',
    name: 'Parmesan Sprinkle',
    price: 20, 
    calories: 60,
    color: '#FFFFF0',
    zIndex: 50, // On top of everything
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1303/1303926.png'
  },
  {
    id: 'blue_cheese',
    name: 'Blue Cheese',
    price: 60, 
    calories: 140,
    color: '#E0F2FE',
    zIndex: 11,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/13830/13830672.png'
  },
  { 
    id: 'pepperoni', 
    name: 'Pepperoni', 
    price: 50, 
    calories: 120,
    color: '#B91C1C',
    zIndex: 20,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M9 10a1 1 0 100 2 1 1 0 000-2z M15 10a1 1 0 100 2 1 1 0 000-2z M12 14a1 1 0 100 2 1 1 0 000-2z' ,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718144.png'
  },
  { 
    id: 'mushroom', 
    name: 'Mushrooms', 
    price: 30, 
    calories: 15,
    color: '#A8A29E',
    zIndex: 21,
    iconPath: 'M12 3c-4.4 0-8 3-8 6.5 0 2.2 1.5 4.2 3.8 5.4L7 19h10l-.8-4.1c2.3-1.2 3.8-3.2 3.8-5.4C20 6 16.4 3 12 3zm0 2c3.3 0 6 2.2 6 5h-12c0-2.8 2.7-5 6-5z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8775/8775340.png'
  },
  { 
    id: 'onion', 
    name: 'Red Onions', 
    price: 20, 
    calories: 15,
    color: '#C084FC',
    zIndex: 23,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8 8-3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/16148/16148294.png'
  },
  { 
    id: 'pepper', 
    name: 'Green Peppers', 
    price: 25, 
    calories: 10,
    color: '#16A34A',
    zIndex: 24,
    iconPath: 'M17 12c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-5 3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2909/2909814.png'
  },
  {
    id: 'pepper_red',
    name: 'Red Peppers',
    price: 25, 
    calories: 15,
    color: '#EF4444',
    zIndex: 24,
    iconPath: 'M17 12c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-5 3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8782/8782037.png'
  },
  {
    id: 'spinach',
    name: 'Baby Spinach',
    price: 30, 
    calories: 5,
    color: '#15803D',
    zIndex: 26,
    iconPath: 'M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8886/8886224.png'
  },
  { 
    id: 'olive', 
    name: 'Black Olives', 
    price: 30, 
    calories: 35,
    color: '#171717',
    zIndex: 22,
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/16148/16148249.png'
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    price: 40, 
    calories: 50,
    color: '#FDE047',
    zIndex: 25,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6974/6974079.png'
  },
  {
    id: 'basil',
    name: 'Fresh Basil',
    price: 20, 
    calories: 2,
    color: '#4ADE80',
    zIndex: 25,
    iconPath: 'M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 2.48 0 4.73 1.01 6.36 2.64L12 12V21z',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/12696/12696389.png'
  },
  
  // --- Filipino Flavor Toppings ---
  {
    id: 'sisig',
    name: 'Crispy Sisig',
    price: 85,
    calories: 150,
    color: '#795548', // Brown
    zIndex: 22,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9447/9447970.png'
  },
  {
    id: 'salted_egg',
    name: 'Salted Egg',
    price: 50, 
    calories: 80,
    color: '#FBC02D', // Golden Yellow
    zIndex: 24,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/837/837560.png'
  },
  {
    id: 'chili',
    name: 'Siling Labuyo',
    price: 20, 
    calories: 5,
    color: '#D32F2F', // Bright Red
    zIndex: 51,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5371/5371600.png'
  },

  // --- New Toppings ---
  {
    id: 'ham',
    name: 'Sweet Ham',
    price: 50,
    calories: 90,
    color: '#F48FB1', // Pinkish
    zIndex: 21,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/10851/10851763.png'
  },
  {
    id: 'meat',
    name: 'Ground Pork',
    price: 75,
    calories: 200,
    color: '#8D6E63', // Brown
    zIndex: 21,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/17852/17852080.png'
  },
  {
    id: 'shrimp',
    name: 'Shrimp',
    price: 99,
    calories: 80,
    color: '#FFAB91', // Coral/Pink
    zIndex: 22,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1493/1493039.png'
  },
  {
    id: 'tinapa',
    name: 'Smoked Tinapa',
    price: 60, 
    calories: 120,
    color: '#A1887F', // Grayish Brown
    zIndex: 23,
    iconPath: 'M0 0',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3005/3005150.png'
  }
];

export const RECOMMENDED_PIZZAS: RecommendedPizza[] = [
  // --- Filipino Flavors ---
  {
    id: 'sisig_overload',
    name: 'Sisig Kapampangan',
    description: 'Crispy pork sisig, red onions, spicy chilies, and creamy mayo drizzle',
    sauceId: 'white',
    toppings: ['cheese_extra', 'sisig', 'onion', 'chili', 'pepper']
  },
  {
    id: 'tinapa_gourmet',
    name: 'Tinapa & Salted Egg',
    description: 'Smoked fish flakes paired with golden salted egg and fresh tomato',
    sauceId: 'tomato',
    toppings: ['cheese_extra', 'salted_egg', 'tinapa', 'basil'] 
  },
  {
    id: 'bicol_express',
    name: 'Spicy Bicol Express',
    description: 'Coconut-style white sauce, fiery chilies, shrimp and pork',
    sauceId: 'white',
    toppings: ['cheese_extra', 'chili', 'pepper', 'onion', 'sisig']
  },
  {
    id: 'pinoy_aloha',
    name: 'Pinoy Aloha',
    description: 'The classic Filipino favorite: Sweet ham, bacon, and lots of pineapple',
    sauceId: 'tomato',
    toppings: ['cheese_extra', 'pineapple', 'ham', 'pepper_red']
  },

  // --- Classics ---
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'Classic tomato & basil with plenty of mozzarella',
    sauceId: 'tomato',
    toppings: ['cheese_extra', 'basil']
  },
  {
    id: 'four_cheese',
    name: 'Quattro Formaggi',
    description: 'Cheddar sauce base, mozzarella, blue cheese, and parmesan',
    sauceId: 'cheese_sauce',
    toppings: ['cheese_extra', 'blue_cheese', 'parmesan']
  },
  {
    id: 'hawaiian',
    name: 'Tropical Hawaiian',
    description: 'Ham, Pineapple & Cheese',
    sauceId: 'tomato',
    toppings: ['cheese_extra', 'ham', 'pineapple']
  },
  {
    id: 'veggie',
    name: 'Veggie Delight',
    description: 'Onions, peppers, olives & mushrooms',
    sauceId: 'tomato',
    toppings: ['onion', 'pepper', 'olive', 'mushroom', 'parmesan']
  },
  {
    id: 'pepperoni_feast',
    name: 'Pepperoni Feast',
    description: 'Classic pepperoni & extra cheese',
    sauceId: 'tomato',
    toppings: ['cheese_extra', 'pepperoni']
  },
  {
    id: 'snow_white',
    name: 'Snow White',
    description: 'Garlic white sauce, mushroom & basil',
    sauceId: 'white',
    toppings: ['cheese_extra', 'mushroom', 'basil']
  },
  {
    id: 'bbq_smokehouse',
    name: 'BBQ Smokehouse',
    description: 'Smoky BBQ sauce, onions, and crisp peppers',
    sauceId: 'bbq',
    toppings: ['cheese_extra', 'onion', 'pepper', 'meat']
  },
  {
    id: 'pesto_verde',
    name: 'Pesto Verde',
    description: 'Basil pesto, fresh basil, spinach, and peppers',
    sauceId: 'pesto',
    toppings: ['spinach', 'pepper', 'basil', 'parmesan']
  },
  {
    id: 'creamy_shroom',
    name: 'Creamy Mushroom',
    description: 'Garlic white sauce with mushrooms and onions',
    sauceId: 'white',
    toppings: ['cheese_extra', 'onion', 'mushroom']
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
  },
  {
    id: 'seafood_special',
    name: 'Seafood Special',
    description: 'Shrimp, Tinapa, and white sauce',
    sauceId: 'white',
    toppings: ['shrimp', 'tinapa', 'pepper']
  }
];

// Pre-calculate balanced positions using a Golden Spiral (Phyllotaxis)
// This ensures natural, even distribution without distinct rings and filling empty spaces better.
export const TOPPING_POSITIONS = (() => {
  const positions = [];
  const count = 50; // Increased density from ~34 to 50 for fuller look
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.3999 radians
  const maxRadius = 88; // Slightly larger spread to cover edge gaps
  
  // 1. Center Item (Explicitly add to ensure center coverage)
  positions.push({ 
    x: 0, 
    y: 0, 
    rotation: Math.random() * 360, 
    scale: 0.9 + Math.random() * 0.2 
  });

  // 2. Spiral Generation
  for (let i = 1; i < count; i++) {
     // Radius based on index for even area distribution (r proportional to sqrt(i))
     const t = i / (count - 1);
     const r = maxRadius * Math.sqrt(t);
     const theta = i * goldenAngle;
     
     // Add organic jitter
     const rJitter = (Math.random() - 0.5) * 8; 
     const thetaJitter = (Math.random() - 0.5) * 0.4;
     
     const finalR = r + rJitter;
     const finalTheta = theta + thetaJitter;

     positions.push({
        x: Math.cos(finalTheta) * finalR,
        y: Math.sin(finalTheta) * finalR,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.3 // Varied sizes
     });
  }

  // Shuffle the positions array using Fisher-Yates
  // This ensures that when iterating through a subset (e.g., for Left/Right half),
  // we don't just get the center-most items but a random scatter.
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
})();