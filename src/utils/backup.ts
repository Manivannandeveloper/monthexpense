import type { Expense } from "../types/expense";
import type { Income } from "../types/income";

export function filterByMonth<T extends { date?: string }>(
  items: T[],
  year: number,
  month: number
) {
  return items.filter((it) => {
    if (!it?.date) return false;
    const [y, m] = it.date.split("-").map(Number);
    return y === year && m === month;
  });
}

export function downloadFile(
  filename: string,
  content: string,
  mime = "application/json"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportMonthlyJSON(year: number, month: number) {
  const expenses: Expense[] = JSON.parse(
    localStorage.getItem("expenses_v1") || "[]"
  );
  const incomes: Income[] = JSON.parse(
    localStorage.getItem("incomes_v1") || "[]"
  );

  const filteredExpenses = filterByMonth(expenses, year, month);
  const filteredIncomes = filterByMonth(incomes, year, month);

  const payload = {
    version: 1,
    year,
    month,
    exportedAt: new Date().toISOString(),
    expenses: filteredExpenses,
    incomes: filteredIncomes,
  };

  downloadFile(
    `backup-${year}-${String(month).padStart(2, "0")}.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  );
}

function toCSV(rows: Array<Record<string, any>>) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const lines = [keys.join(",")];
  for (const r of rows) {
    lines.push(
      keys
        .map((k) => {
          const v = r[k] == null ? "" : String(r[k]).replace(/"/g, '""');
          return `"${v}"`;
        })
        .join(",")
    );
  }
  return lines.join("\n");
}

export function exportMonthlyCSV(year: number, month: number) {
  const expenses: Expense[] = JSON.parse(
    localStorage.getItem("expenses_v1") || "[]"
  );
  const incomes: Income[] = JSON.parse(
    localStorage.getItem("incomes_v1") || "[]"
  );

  const rows = [
    ...filterByMonth(incomes, year, month).map((i) => ({
      kind: "Income",
      date: i.date,
      title: i.title,
      amount: i.amount,
    })),
    ...filterByMonth(expenses, year, month).map((e) => ({
      kind: "Expense",
      date: e.date,
      title: e.title,
      amount: e.amount,
    })),
  ];

  const csv = toCSV(rows.sort((a, b) => b.date.localeCompare(a.date)));
  downloadFile(
    `backup-${year}-${String(month).padStart(2, "0")}.csv`,
    csv,
    "text/csv"
  );
}

export function importBackupJson(
  raw: string,
  options: { merge?: boolean } = { merge: true }
) {
  const data = JSON.parse(raw);
  const expenses: Expense[] = data.expenses ?? [];
  const incomes: Income[] = data.incomes ?? [];

  if (options.merge) {
    const existingExp: Expense[] = JSON.parse(
      localStorage.getItem("expenses_v1") || "[]"
    );
    const existingInc: Income[] = JSON.parse(
      localStorage.getItem("incomes_v1") || "[]"
    );

    const combinedExp = [...expenses, ...existingExp];
    // keep first occurrence for each id
    const mapExp = new Map<string, Expense>();
    for (const it of combinedExp) mapExp.set(it.id, it);
    const dedupExp = Array.from(mapExp.values());

    const combinedInc = [...incomes, ...existingInc];
    const mapInc = new Map<string, Income>();
    for (const it of combinedInc) mapInc.set(it.id, it);
    const dedupInc = Array.from(mapInc.values());

    localStorage.setItem("expenses_v1", JSON.stringify(dedupExp));
    localStorage.setItem("incomes_v1", JSON.stringify(dedupInc));
  } else {
    localStorage.setItem("expenses_v1", JSON.stringify(expenses));
    localStorage.setItem("incomes_v1", JSON.stringify(incomes));
  }
}

export default {};
