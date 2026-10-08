// Prices other than the single nata ($4.50, per press coverage) are placeholders.
export type Category = 'natas' | 'drinks' | 'combos';

export interface OptionGroup {
  id: string;
  label: string;
  choices: { id: string; label: string; price?: number }[];
  default: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  /** Number of tarts in the item. Used for loyalty stamps and the club nata perk. */
  natas: number;
  /** Counts as a drink for the club drink perk. */
  isDrink: boolean;
  /** Short-menu drinks covered by the base club tier. */
  espressoBar?: boolean;
  emoji: string;
  seasonal?: boolean;
  options?: OptionGroup[];
}

const topping: OptionGroup = {
  id: 'topping',
  label: 'Topping',
  default: 'cinnamon',
  choices: [
    { id: 'cinnamon', label: 'Cinnamon' },
    { id: 'sugar', label: 'Powdered sugar' },
    { id: 'both', label: 'Both' },
    { id: 'plain', label: 'Plain' },
  ],
};

const temp: OptionGroup = {
  id: 'temp',
  label: 'Temperature',
  default: 'hot',
  choices: [
    { id: 'hot', label: 'Hot' },
    { id: 'iced', label: 'Iced' },
  ],
};

const milk: OptionGroup = {
  id: 'milk',
  label: 'Milk',
  default: 'whole',
  choices: [
    { id: 'whole', label: 'Whole' },
    { id: 'oat', label: 'Oat', price: 0.75 },
    { id: 'almond', label: 'Almond', price: 0.75 },
  ],
};

export const MENU: MenuItem[] = [
  {
    id: 'nata',
    name: 'Pastel de Nata',
    description: 'Our only pastry: a flaky, blistered shell around warm egg custard.',
    price: 4.5,
    category: 'natas',
    natas: 1,
    isDrink: false,
    emoji: '🥧',
    options: [topping],
  },
  {
    id: 'box-2',
    name: 'Box of 2',
    description: 'Because one is never enough.',
    price: 8.5,
    category: 'natas',
    natas: 2,
    isDrink: false,
    emoji: '📦',
    options: [topping],
  },
  {
    id: 'box-6',
    name: 'Box of 6',
    description: 'For the office, the dorm, or just you. We won’t judge.',
    price: 24,
    category: 'natas',
    natas: 6,
    isDrink: false,
    emoji: '🎁',
    options: [topping],
  },
  {
    id: 'bica',
    name: 'Bica',
    description: 'A short, strong Portuguese espresso.',
    price: 3.5,
    category: 'drinks',
    natas: 0,
    isDrink: true,
    espressoBar: true,
    emoji: '☕',
  },
  {
    id: 'galao',
    name: 'Galão',
    description: 'Lisbon’s milky espresso, served in a tall glass.',
    price: 5,
    category: 'drinks',
    natas: 0,
    isDrink: true,
    espressoBar: true,
    emoji: '🥛',
    options: [temp, milk],
  },
  {
    id: 'chai-cold-brew',
    name: 'Chai Cold Brew',
    description: 'Cold brew steeped with warm chai spices.',
    price: 6,
    category: 'drinks',
    natas: 0,
    isDrink: true,
    emoji: '🧋',
    options: [milk],
  },
  {
    id: 'matcha-lemonade',
    name: 'Matcha Lemonade',
    description: 'Ceremonial matcha over bright, fresh lemonade.',
    price: 6.5,
    category: 'drinks',
    natas: 0,
    isDrink: true,
    emoji: '🍵',
  },
  {
    id: 'seasonal',
    name: 'Seasonal Special',
    description: 'Ask what’s on this month. Rotates with the seasons.',
    price: 6.5,
    category: 'drinks',
    natas: 0,
    isDrink: true,
    emoji: '🍂',
    seasonal: true,
    options: [temp],
  },
  {
    id: 'lisboa-combo',
    name: 'Lisboa Combo',
    description: 'Two natas, cinnamon, and a Portuguese espresso. Our signature.',
    price: 11,
    category: 'combos',
    natas: 2,
    isDrink: false,
    emoji: '🇵🇹',
  },
];

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'natas', label: 'Natas' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'combos', label: 'Combos' },
];

export const NATA_PRICE = MENU.find((m) => m.id === 'nata')!.price;

export function getItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
