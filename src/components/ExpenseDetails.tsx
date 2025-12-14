import type { Expense } from "../types/expense";

export default function ExpenseDetails({
  expenses,
  setEditingId,
  removeExpense,
  hideHeader,
}: {
  expenses: Expense[];
  setEditingId: (id: string | null) => void;
  removeExpense: (id: string) => Promise<void> | void;
  hideHeader?: boolean;
}) {
  return (
    <section className="card">
      {!hideHeader && (
        <h3 className="bg-blue-100 text-black text-md font-semibold mb-3 p-2 rounded">
          Expenses
        </h3>
      )}
      {expenses.length === 0 ? (
        <p className="text-sm text-gray-500">No expenses yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-sm text-gray-500">{e.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-red-600">
                  ₹{e.amount.toFixed(2)}
                </div>
                <button
                  className="text-sm text-indigo-600 hover:underline"
                  onClick={() => setEditingId(e.id)}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600"
                  onClick={() => removeExpense(e.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
