
export interface PriceItem {
  id: string;
  name: string;
  price: number;
  calories: number;
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

export interface Crust extends PriceItem {
  description: string;
}

export interface Cut {
  id: string;
  name: string;
  description: string;
}

export type ToppingCoverage = 'whole' | 'left' | 'right';

export interface SelectedTopping {
  id: string;
  coverage: ToppingCoverage;
}

export interface PizzaState {
  size: Size;
  crust: Crust;
  cut: Cut;
  sauce: Sauce;
  toppings: SelectedTopping[];
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