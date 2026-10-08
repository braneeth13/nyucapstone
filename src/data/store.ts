// Store facts gathered from public listings (Yelp, Washington Square News).
// Confirm with the shop before launch.
export const STORE = {
  name: 'Nata',
  tagline: 'Pastéis de nata, baked fresh in Greenwich Village',
  address: '11 Waverly Place',
  cityLine: 'New York, NY 10003',
  phone: '(646) 406-7110',
  phoneHref: 'tel:+16464067110',
  instagram: 'https://www.instagram.com/nata.nyc',
  website: 'https://www.nata.nyc',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nata+11+Waverly+Place+New+York+NY+10003',
  timeZone: 'America/New_York',
  taxRate: 0.08875,
};

/** Opening hours by weekday (0 = Sunday), in minutes after midnight, NY time. */
export const HOURS: Record<number, { open: number; close: number }> = {
  0: { open: 10 * 60, close: 18 * 60 },
  1: { open: 9 * 60, close: 19 * 60 },
  2: { open: 9 * 60, close: 19 * 60 },
  3: { open: 9 * 60, close: 19 * 60 },
  4: { open: 9 * 60, close: 19 * 60 },
  5: { open: 9 * 60, close: 19 * 60 },
  6: { open: 10 * 60, close: 18 * 60 },
};

export const STORY = [
  'Nata was started by Manuel Portugal Correia, a Lisbon native and NYU alum who missed the custard tarts he grew up with.',
  'In January 2026 we opened our first shop at 11 Waverly Place, a few steps from Washington Square Park.',
  'We bake one thing and try to get it exactly right: a crisp, laminated shell around a just-set egg custard, blistered in a very hot oven. Dust it with cinnamon, have it with a bica, and you get a taste of saudade, the Portuguese word for missing something you love.',
];
