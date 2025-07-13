/**
 * @fileOverview Text utility functions for search normalization.
 */

export function normalizeForSearch(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ς/g, 'σ');
}
