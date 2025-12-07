import type { Expense } from "../types/expense";
import type { Income } from "../types/income";

export default function AllStoredData({
  incomes,
  expenses,
  setEditingId,
  setEditingIncomeId,
  removeExpense,
  removeIncome,
  formatCurrency,
  hideHeader,
}: {
  incomes: Income[];
  expenses: Expense[];
  setEditingId: (id: string | null) => void;
  setEditingIncomeId: (id: string | null) => void;
  removeExpense: (id: string) => Promise<void> | void;
  removeIncome: (id: string) => Promise<void> | void;
  formatCurrency: (n: number) => string;
  hideHeader?: boolean;
}) {
  const combined = [
    ...incomes.map((i) => ({
      kind: "Income" as const,
      id: i.id,
      title: i.title,
      amount: i.amount,
      date: i.date,
    })),
    ...expenses.map((e) => ({
      kind: "Expense" as const,
      id: e.id,
      title: e.title,
      amount: e.amount,
      date: e.date,
    })),
  ];
  combined.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="card mb-6">
      {!hideHeader && (
        <div className="bg-blue-100 p-3 rounded -mt-4 -mx-4 mb-4">
          <h2 className="text-lg font-semibold text-black">All Stored Data</h2>
        </div>
      )}
      {combined.length === 0 ? (
        <p className="text-black">No stored data.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 items-center border-b">
              <div className="col-span-2 px-4 py-2 bg-blue-100 text-black font-medium uppercase tracking-wide text-sm">
                Date
              </div>
              <div className="col-span-2 px-4 py-2 bg-blue-100 text-black font-medium uppercase tracking-wide text-sm">
                Type
              </div>
              <div className="col-span-5 px-4 py-2 bg-blue-100 text-black font-medium uppercase tracking-wide text-sm">
                Title
              </div>
              <div className="col-span-2 px-4 py-2 bg-blue-100 text-black font-medium uppercase tracking-wide text-sm text-right">
                Amount
              </div>
              <div className="col-span-1 px-4 py-2 bg-blue-100 text-black font-medium uppercase tracking-wide text-sm">
                Actions
              </div>
            </div>

            {/* Rows */}
            <div>
              {combined.map((it) => (
                <div
                  key={it.id}
                  className="grid grid-cols-12 gap-2 items-center border-b hover:bg-gray-50"
                >
                  <div className="col-span-2 px-4 py-3 text-sm text-black">
                    {it.date}
                  </div>
                  <div className="col-span-2 px-4 py-3 text-sm text-black">
                    {it.kind}
                  </div>
                  <div className="col-span-5 px-4 py-3 text-sm text-black">
                    {it.title}
                  </div>
                  <div className="col-span-2 px-4 py-3 text-sm text-black text-right">
                    <span
                      className={
                        it.kind === "Income"
                          ? "text-emerald-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {it.kind === "Income" ? "+" : "-"}
                      {formatCurrency(Number(it.amount))}
                    </span>
                  </div>
                  <div className="col-span-1 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => {
                          if (it.kind === "Income") setEditingIncomeId(it.id);
                          else setEditingId(it.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => {
                          if (it.kind === "Income") removeIncome(it.id);
                          else removeExpense(it.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
