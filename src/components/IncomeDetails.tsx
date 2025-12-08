import React from "react";
import type { Income } from "../types/income";

export default function IncomeDetails({
  incomes,
  setEditingIncomeId,
  removeIncome,
  hideHeader,
}: {
  incomes: Income[];
  setEditingIncomeId: (id: string | null) => void;
  removeIncome: (id: string) => Promise<void> | void;
  hideHeader?: boolean;
}) {
  return (
    <section className="card">
      {!hideHeader && (
        <h3 className="bg-blue-100 text-black text-md font-semibold mb-3 p-2 rounded">
          Incomes
        </h3>
      )}
      {incomes.length === 0 ? (
        <p className="text-sm text-gray-500">No incomes yet.</p>
      ) : (
        <ul className="space-y-2">
          {incomes.map((i) => (
            <li
              key={i.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-gray-500">{i.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-emerald-600">
                  ₹{i.amount.toFixed(2)}
                </div>
                <button
                  className="text-sm text-indigo-600 hover:underline"
                  onClick={() => setEditingIncomeId(i.id)}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600"
                  onClick={() => removeIncome(i.id)}
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
