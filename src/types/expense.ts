export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO date string
  category?: string;
  notes?: string;
}

export type NewExpense = Omit<Expense, "id">;
