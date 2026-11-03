import { Product } from '../types.ts';

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const MIN_NEW_ARRIVALS_COUNT = 8;

/**
 * Gets a millisecond epoch timestamp for a product.
 * Prioritizes product.createdAt, falling back to a deterministic timestamp based on id/index.
 */
export function getProductTimestamp(product: Product, fallbackIndex: number = 0): number {
  if (product.createdAt) {
    const t = new Date(product.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  // If product ID has a numeric component (e.g. DWA-105 vs DWA-101)
  const numbers = product.id.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const num = parseInt(numbers[numbers.length - 1], 10);
    // Anchor against current time so higher IDs are more recent
    const daysOffset = Math.max(1, (150 - Math.min(150, num)));
    return Date.now() - daysOffset * 24 * 60 * 60 * 1000;
  }
  return Date.now() - (fallbackIndex + 1) * 24 * 60 * 60 * 1000;
}

/**
 * Formats how recently a product was added (e.g. 'Added today', '3 days ago')
 */
export function getRelativeTimeString(dateIso?: string): string {
  if (!dateIso) return 'Recently Added';
  const diff = Date.now() - new Date(dateIso).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'Added Today';
  if (days === 1) return 'Added Yesterday';
  if (days < 7) return `Added ${days} days ago`;
  if (days < 14) return 'Added 1 week ago';
  return `Added ${Math.floor(days / 7)} weeks ago`;
}

/**
 * Automatically computes products for the 'New Arrivals' section:
 * 1. Automatically refreshes every 7 days based on the rolling 7-day window.
 * 2. Filters the most recent additions uploaded within the last 7 days.
 * 3. If there are fewer than 8 new products in that 7-day window, it automatically
 *    fills the remaining slots with the most recently uploaded products from the catalog
 *    to ensure the section is always fully populated with at least 8 products.
 * 4. Deduplicates and orders by recency (newest first).
 */
export function getNewArrivalsProducts(
  products: Product[],
  targetCount: number = MIN_NEW_ARRIVALS_COUNT
): Product[] {
  if (!products || products.length === 0) return [];

  const now = Date.now();
  const sevenDaysAgo = now - SEVEN_DAYS_MS;

  // Sort all available active products by upload recency (most recent first)
  const sortedByRecent = [...products]
    .filter((p) => p.status !== 'Draft')
    .sort((a, b) => getProductTimestamp(b) - getProductTimestamp(a));

  const result: Product[] = [];
  const addedIds = new Set<string>();

  // Step 1: Add products added within the last 7 days (or marked with 'NEW' / 'New Arrivals')
  for (const prod of sortedByRecent) {
    const timestamp = getProductTimestamp(prod);
    const isWithin7Days = timestamp >= sevenDaysAgo;
    const isExplicitNewArrival =
      prod.badge?.toUpperCase() === 'NEW' ||
      prod.category?.toLowerCase() === 'new arrivals' ||
      (prod.categories && prod.categories.some((c) => c.toLowerCase() === 'new arrivals'));

    if (isWithin7Days || isExplicitNewArrival) {
      if (!addedIds.has(prod.id)) {
        addedIds.add(prod.id);
        result.push(prod);
      }
    }
  }

  // Step 2: If fewer than targetCount (8) products, fill the remaining slots
  // with the most recently uploaded products across the entire store
  if (result.length < targetCount) {
    for (const prod of sortedByRecent) {
      if (!addedIds.has(prod.id)) {
        addedIds.add(prod.id);
        result.push(prod);
      }
      if (result.length >= targetCount) {
        break;
      }
    }
  }

  return result;
}
