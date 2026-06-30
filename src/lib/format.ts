import type { Payment } from '../types';

export const PAGE_SIZE = 10;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const int = new Intl.NumberFormat('en-US');

/** "$307.00", "$1,003.00" — full USD with thousands separators. */
export function formatUSD(n: number): string {
  return usd.format(n);
}

/** "1,480" — integer with thousands separators. */
export function formatInt(n: number): string {
  return int.format(n);
}

/** Compact money: ≥1e6 → "$4.7M", ≥1e3 → "$55.9K", else "$N". */
export function compactMoney(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}

/** Whole-dollar money with separators: "$1,284". */
export function formatMoney(n: number): string {
  return `$${int.format(Math.round(n))}`;
}

/** Percentage with one decimal; accepts either a 0–1 fraction or a 0–100 value. */
export function formatPct(n: number): string {
  const value = n > 0 && n <= 1 ? n * 100 : n;
  return `${value.toFixed(1)}%`;
}

/** Total number of pages for a list (min 1 so an empty list still has page 0). */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** Clamp a page index into the valid range for a list of `total` items. */
export function clampPage(page: number, total: number): number {
  return Math.min(Math.max(0, page), pageCount(total) - 1);
}

/** Slice a list down to the items shown on `page` (10 per page). */
export function pageSlice<T>(items: T[], page: number): T[] {
  const p = clampPage(page, items.length);
  return items.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
}

/** "USDT · Tron" on one line (mobile), or a dash when not completed. */
export function assetNetworkLabel(payment: Payment): string {
  return payment.status === 'completed' && payment.asset && payment.network
    ? `${payment.asset} · ${payment.network}`
    : '—';
}

/** "showing {from}–{to} of {total}" numbers. */
export function pageInfo(
  page: number,
  total: number,
): { from: number; to: number; total: number } {
  const p = clampPage(page, total);
  const from = total === 0 ? 0 : p * PAGE_SIZE + 1;
  const to = Math.min(total, (p + 1) * PAGE_SIZE);
  return { from, to, total };
}
