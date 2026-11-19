import { describe, expect, it } from 'vitest';
import { marketVerticals, researchLens } from '../../src/domain/market/market-data';

describe('source-backed market verticals', () => {
 it('has distinct, nonempty verticals with documented observations', () => {
  expect(new Set(marketVerticals.map(v=>v.id)).size).toBe(marketVerticals.length);
  expect(marketVerticals.length).toBeGreaterThanOrEqual(6);
  for (const vertical of marketVerticals) {
   expect(vertical.metric.url).toMatch(/^https:\/\//);
   expect(vertical.metric.period.length).toBeGreaterThan(2);
   expect(vertical.chartFootnote.length).toBeGreaterThan(35);
   expect(vertical.products.length).toBeGreaterThanOrEqual(2);
   expect(vertical.ideas.length).toBeGreaterThan(0);
   for (const product of vertical.products) {
    expect(product.homepage).toMatch(/^https:\/\//);
    expect(product.imageSource.length).toBeGreaterThan(12);
   }
  }
 });
 it('preserves a distinct description of Google Trends as relative interest', () => {
  expect(researchLens.find(v=>v.title==='Google Trends')?.description).toMatch(/relativo/);
 });
});
