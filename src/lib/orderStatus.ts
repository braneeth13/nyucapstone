// Simulated progress so the demo shows the full flow; a real build would poll the POS.
export const ORDER_STEPS = [
  { label: 'Received', after: 0 },
  { label: 'Baking', after: 15_000 },
  { label: 'Ready', after: 45_000 },
];

export function orderStep(createdAt: number, now: number): number {
  return ORDER_STEPS.filter((s) => now - createdAt >= s.after).length - 1;
}

/** Short pickup number called out at the counter. */
export function pickupNumber(id: string): string {
  const n = parseInt(id.slice(1), 36) % 9000;
  return String(1000 + n);
}
