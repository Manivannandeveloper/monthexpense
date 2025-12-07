import React, { useState } from "react";
import FormField from "./FormField";
import type { NewExpense } from "../types/expense";

export default function ExpenseForm({
  onSave,
  initial,
}: {
  onSave: (e: NewExpense) => void;
  initial?: Partial<NewExpense>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  return (
    <form
      className="grid grid-cols-1 gap-3"
      onSubmit={(ev) => {
        ev.preventDefault();
        const nextErrors: typeof errors = {};
        if (!title.trim()) nextErrors.title = "Title is required";
        if (!(Number(amount) > 0))
          nextErrors.amount = "Amount must be greater than 0";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        onSave({ title: title.trim(), amount: Number(amount), date });
        setTitle("");
        setAmount(0);
        setDate(new Date().toISOString().slice(0, 10));
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField label="Title">
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>

        <FormField label="Amount">
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          {errors.amount && (
            <div className="text-xs text-red-500 mt-1">{errors.amount}</div>
          )}
        </FormField>

        <div>
          <FormField label="Date">
            <input
              className="border rounded px-3 py-2 w-full"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <div className="flex justify-end mt-2">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {errors.title && (
        <div className="text-xs text-red-500">{errors.title}</div>
      )}
    </form>
  );
}
