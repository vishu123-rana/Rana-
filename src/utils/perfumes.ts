/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Perfume } from '../types';
import { perfumes as initialPerfumes } from '../data/perfumes';

const PERFUMES_STORAGE_KEY = 'rana_perfumes';

/**
 * Initialize or retrieve perfume items from LocalStorage
 */
export function getStoredPerfumes(): Perfume[] {
  try {
    const raw = localStorage.getItem(PERFUMES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PERFUMES_STORAGE_KEY, JSON.stringify(initialPerfumes));
      return initialPerfumes;
    }
    const parsed: Perfume[] = JSON.parse(raw);
    // Sync initial catalog while preserving admin customized fields (images, prices, stock, discounts, active state)
    const merged = initialPerfumes.map((init) => {
      const existing = parsed.find((p) => p.id === init.id);
      if (existing) {
        return {
          ...init,
          ...existing,
          image: existing.image || init.image,
          isActive: existing.isActive !== undefined ? existing.isActive : true,
        };
      }
      return { ...init, isActive: true };
    });
    // Retain any custom products added via admin
    const customAdded = parsed.filter((p) => !initialPerfumes.some((init) => init.id === p.id));
    const fullList = [...merged, ...customAdded];
    localStorage.setItem(PERFUMES_STORAGE_KEY, JSON.stringify(fullList));
    return fullList;
  } catch (err) {
    console.error('Error reading perfumes from local storage', err);
    return initialPerfumes;
  }
}

/**
 * Save updated perfume collection
 */
export function saveStoredPerfumes(perfumes: Perfume[]): void {
  try {
    localStorage.setItem(PERFUMES_STORAGE_KEY, JSON.stringify(perfumes));
    window.dispatchEvent(new CustomEvent('rana_perfumes_updated', { detail: perfumes }));
  } catch (err) {
    console.error('Error saving perfumes to local storage', err);
  }
}

/**
 * Add a new perfume product
 */
export function addPerfumeProduct(newPerfume: Omit<Perfume, 'id'>): Perfume {
  const current = getStoredPerfumes();
  const id = `rana-${newPerfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
  const created: Perfume = {
    ...newPerfume,
    id,
    stock: newPerfume.stock ?? 25,
    rating: newPerfume.rating || 5.0,
  };
  const updated = [created, ...current];
  saveStoredPerfumes(updated);
  return created;
}

/**
 * Update existing perfume
 */
export function updatePerfumeProduct(id: string, updates: Partial<Perfume>): Perfume[] {
  const current = getStoredPerfumes();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveStoredPerfumes(updated);
  return updated;
}

/**
 * Delete a perfume product
 */
export function deletePerfumeProduct(id: string): Perfume[] {
  const current = getStoredPerfumes();
  const updated = current.filter((p) => p.id !== id);
  saveStoredPerfumes(updated);
  return updated;
}
