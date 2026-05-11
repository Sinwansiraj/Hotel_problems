import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format currency (INR default) */
export function formatCurrency(value: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

/** Format compact number (1.2K, 3.4M) */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/** Format percentage */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** Generate a random ID */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/** Delay helper for mock APIs */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
