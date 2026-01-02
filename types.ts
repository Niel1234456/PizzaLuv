export interface PriceItem {
  id: string;
  name: string;
  price: number;
}

export interface Size extends PriceItem {
  scale: number; // For visual scaling
}

export interface Sauce extends PriceItem {
  color: string;
  type: 'tomato' | 'white' | 'pesto' | 'bbq';
}

export interface Topping extends PriceItem {
  color: string;
  iconPath: string; // SVG path data
  zIndex: number;
}

export interface PizzaState {
  size: Size;
  sauce: Sauce;
  toppings: string[]; // Array of topping IDs
}

export interface OrderSummary {
  items: { name: string; price: number }[];
  total: number;
}