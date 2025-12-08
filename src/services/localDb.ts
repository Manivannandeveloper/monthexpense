/*
  Generic localStorage mini-DB factory.
  Provides a createLocalDb<T>() that returns async CRUD methods for a given storage key.
  We also create and export `expenseDb` (default) and `incomeDb` instances below.
*/

export type EntityWithId = { id: string };

// function makeId() {
//   return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
// }

export function createApiDb<T extends EntityWithId>(
  resource: "expenses" | "incomes"
) {
  const API_BASE =
    (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";
  const base = `${API_BASE}/api/${resource}`;

  return {
    async getAll(): Promise<T[]> {
      const res = await fetch(base);
      if (!res.ok) throw new Error("Failed to fetch");
      return (await res.json()) as T[];
    },

    async getById(id: string): Promise<T | null> {
      const res = await fetch(`${base}/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch");
      return (await res.json()) as T;
    },

    async create(input: Omit<T, "id">): Promise<T> {
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create");
      return (await res.json()) as T;
    },

    async update(id: string, patch: Partial<T>): Promise<T | null> {
      const res = await fetch(`${base}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to update");
      return (await res.json()) as T;
    },

    async delete(id: string): Promise<boolean> {
      const res = await fetch(`${base}/${id}`, { method: "DELETE" });
      if (res.status === 404) return false;
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      return true;
    },

    async query(predicate: (e: T) => boolean): Promise<T[]> {
      const all = await this.getAll();
      return all.filter(predicate);
    },

    async clear(): Promise<void> {
      await fetch(base, { method: "DELETE" });
    },
  };
}

// Create and export default instances for expenses and incomes.
import type { Expense } from "../types/expense";
import type { Income } from "../types/income";

export const expenseDb = createApiDb<Expense>("expenses");
export const incomeDb = createApiDb<Income>("incomes");

export default expenseDb;
