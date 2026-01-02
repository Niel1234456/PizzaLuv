export interface PriceItem {
  id: string;
  name: string;
  price: number;
}

export interface Size extends PriceItem {
  scale: number; // For visual scaling
  toppingPriceMultiplier: number; // Large pizzas make toppings more expensive
}

export interface Sauce extends PriceItem {
  color: string;
  type: 'tomato' | 'white' | 'pesto' | 'bbq';
  iconUrl?: string;
}

export interface Topping extends PriceItem {
  color: string;
  iconPath: string; // SVG path data
  iconUrl?: string; // URL for the UI icon
  zIndex: number;
}

export type ToppingCoverage = 'whole' | 'left' | 'right';

export interface SelectedTopping {
  id: string;
  coverage: ToppingCoverage;
}

export interface PizzaState {
  size: Size;
  sauce: Sauce;
  toppings: SelectedTopping[]; // Changed from string[] to support coverage
}

export interface OrderSummary {
  items: { name: string; price: number }[];
  total: number;
}

export interface RecommendedPizza {
  id: string;
  name: string;
  description: string;
  sauceId: string;
  toppings: string[]; // List of topping IDs
}