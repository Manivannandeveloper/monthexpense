import React, { useEffect, useState } from "react";

type RefItem = { id: string; title: string; amount: number };

const STORAGE_KEY = "amount_refs_v1";

function loadAll(): RefItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(items: RefItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function AmountReferencePanel({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [items, setItems] = useState<RefItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadAll());
  }, []);

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    const t = title.trim();
    const a = Number(amount);
    if (!t) return setError("Title is required");
    if (!(Number.isFinite(a) && a > 0)) return setError("Amount must be > 0");
    const next: RefItem = { id: Date.now().toString(36), title: t, amount: a };
    const updated = [next, ...items];
    setItems(updated);
    saveAll(updated);
    setTitle("");
    setAmount("");
  }

  function remove(id: string) {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    saveAll(updated);
  }

  return (
    <div
      className={`h-full bg-white shadow-lg transition-all duration-300 overflow-hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-semibold text-lg">Amount Reference</h4>
        <div className="flex items-center gap-2">
          <button
            className="text-sm text-gray-600 p-1"
            onClick={() => onToggle()}
            aria-label={
              open ? "Collapse amount reference" : "Open amount reference"
            }
          >
            {/* small triangle indicating state */}
            <span
              className={`inline-block transform transition-transform ${
                open ? "" : "rotate-180"
              }`}
            >
              ▸
            </span>
          </button>
        </div>
      </div>

      <div
        className="p-4 overflow-auto"
        style={{ height: "calc(100% - 64px)" }}
      >
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h5 className="font-medium mb-2">Saved References</h5>
          {items.length === 0 ? (
            <div className="text-sm text-gray-500">No references yet.</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b">
                      <td className="py-2">{it.title}</td>
                      <td className="py-2 text-right">
                        {it.amount.toFixed(2)}
                      </td>
                      <td className="py-2">
                        <button
                          className="text-sm text-red-600"
                          onClick={() => remove(it.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
