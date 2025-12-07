/*
  Generic localStorage mini-DB factory.
  Provides a createLocalDb<T>() that returns async CRUD methods for a given storage key.
  We also create and export `expenseDb` (default) and `incomeDb` instances below.
*/

export type EntityWithId = { id: string };

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function createLocalDb<T extends EntityWithId>(storageKey: string) {
  function readStorage(): T[] {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      return JSON.parse(raw) as T[];
    } catch (e) {
      console.error("Failed to read localStorage", e);
      return [];
    }
  }

  function writeStorage(items: T[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to write localStorage", e);
    }
  }

  return {
    async getAll(): Promise<T[]> {
      return readStorage();
    },

    async getById(id: string): Promise<T | null> {
      const items = readStorage();
      return items.find((i) => i.id === id) ?? null;
    },

    async create(input: Omit<T, "id">): Promise<T> {
      const items = readStorage();
      const newItem = { id: makeId(), ...input } as T;
      items.unshift(newItem);
      writeStorage(items);
      return newItem;
    },

    async update(id: string, patch: Partial<T>): Promise<T | null> {
      const items = readStorage();
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return null;
      const updated = { ...items[idx], ...patch } as T;
      items[idx] = updated;
      writeStorage(items);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const items = readStorage();
      const filtered = items.filter((i) => i.id !== id);
      if (filtered.length === items.length) return false;
      writeStorage(filtered);
      return true;
    },

    async query(predicate: (e: T) => boolean): Promise<T[]> {
      const items = readStorage();
      return items.filter(predicate);
    },

    async clear(): Promise<void> {
      localStorage.removeItem(storageKey);
    },
  };
}

// Create and export default instances for expenses and incomes.
import type { Expense } from "../types/expense";
import type { Income } from "../types/income";

export const expenseDb = createLocalDb<Expense>("expenses_v1");
export const incomeDb = createLocalDb<Income>("incomes_v1");

export default expenseDb;
