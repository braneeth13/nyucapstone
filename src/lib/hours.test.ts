import { describe, expect, it } from 'vitest';
import { nyParts, openStatus, pickupSlots } from './hours';

// 2026-10-07 is a Wednesday. EDT is UTC-4.
const ny = (hhmm: string, day = '2026-10-07') => new Date(`${day}T${hhmm}:00-04:00`);

describe('hours', () => {
  it('reads store-local time', () => {
    expect(nyParts(ny('08:30'))).toEqual({ weekday: 3, minutes: 510, dateKey: '2026-10-07' });
  });

  it('reports open and closed status', () => {
    expect(openStatus(ny('12:00')).open).toBe(true);
    expect(openStatus(ny('08:00')).label).toBe('Closed · opens 9am today');
    expect(openStatus(ny('19:30')).label).toBe('Closed · opens 9am tomorrow');
  });

  it('offers ASAP plus later slots while open', () => {
    const slots = pickupSlots(ny('12:02'));
    expect(slots[0].id).toBe('asap');
    expect(slots[1].label).toBe('Today, 12:30pm');
    expect(slots.at(-1)!.label).toBe('Today, 6:45pm');
  });

  it('starts at opening before the shop opens', () => {
    const slots = pickupSlots(ny('07:00'));
    expect(slots[0].label).toBe('Today, 9:15am');
  });

  it('rolls to tomorrow after closing', () => {
    const slots = pickupSlots(ny('18:55', '2026-10-09')); // Friday evening; Saturday opens at 10
    expect(slots[0].label).toBe('Tomorrow, 10:15am');
    expect(slots.at(-1)!.label).toBe('Tomorrow, 5:45pm');
  });
});
