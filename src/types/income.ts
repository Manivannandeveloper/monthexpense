export interface Income {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO date string
  source?: string;
  notes?: string;
}

export type NewIncome = Omit<Income, "id">;
