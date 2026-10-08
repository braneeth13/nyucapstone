import { HOURS, STORE } from '../data/store';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface NyParts {
  weekday: number;
  minutes: number;
  /** YYYY-MM-DD in store time, used to reset daily club perks. */
  dateKey: string;
}

export function nyParts(date: Date): NyParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return {
    weekday,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return min === 0 ? `${h12}${suffix}` : `${h12}:${String(min).padStart(2, '0')}${suffix}`;
}

export function dayName(weekday: number): string {
  return DAY_NAMES[weekday];
}

export interface OpenStatus {
  open: boolean;
  label: string;
}

export function openStatus(date: Date): OpenStatus {
  const { weekday, minutes } = nyParts(date);
  const today = HOURS[weekday];
  if (minutes >= today.open && minutes < today.close) {
    return { open: true, label: `Open now · until ${formatMinutes(today.close)}` };
  }
  if (minutes < today.open) {
    return { open: false, label: `Closed · opens ${formatMinutes(today.open)} today` };
  }
  const next = (weekday + 1) % 7;
  return { open: false, label: `Closed · opens ${formatMinutes(HOURS[next].open)} tomorrow` };
}

export interface PickupSlot {
  id: string;
  label: string;
}

const PREP_MINUTES = 10;
const LAST_ORDER_BUFFER = 10;
const SLOT_STEP = 15;

/** Pickup windows for today, or for the next opening if the shop is closing or closed. */
export function pickupSlots(date: Date): PickupSlot[] {
  const { weekday, minutes } = nyParts(date);
  const today = HOURS[weekday];
  const lastToday = today.close - LAST_ORDER_BUFFER;
  const isOpen = minutes >= today.open && minutes < today.close;
  const slots: PickupSlot[] = [];

  if (minutes + PREP_MINUTES <= lastToday) {
    if (isOpen) slots.push({ id: 'asap', label: `ASAP (about ${PREP_MINUTES} min)` });
    const from = Math.max(minutes + 2 * PREP_MINUTES, today.open + PREP_MINUTES);
    for (let t = roundUp(from); t <= lastToday; t += SLOT_STEP) {
      slots.push({ id: `today-${t}`, label: `Today, ${formatMinutes(t)}` });
    }
    if (slots.length > 0) return slots;
  }

  const next = HOURS[(weekday + 1) % 7];
  for (let t = roundUp(next.open + PREP_MINUTES); t <= next.close - LAST_ORDER_BUFFER; t += SLOT_STEP) {
    slots.push({ id: `tomorrow-${t}`, label: `Tomorrow, ${formatMinutes(t)}` });
  }
  return slots;
}

function roundUp(m: number): number {
  return Math.ceil(m / SLOT_STEP) * SLOT_STEP;
}
