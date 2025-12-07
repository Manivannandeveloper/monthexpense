import { useEffect, useState } from "react";
import "./App.css";
import expenseDb, { incomeDb } from "./services/localDb";
import type { Expense, NewExpense } from "./types/expense";
import type { Income, NewIncome } from "./types/income";

import ExpenseForm from "./components/ExpenseForm";
import IncomeForm from "./components/IncomeForm";
import AllStoredData from "./components/AllStoredData";
import IncomeDetails from "./components/IncomeDetails";
import ExpenseDetails from "./components/ExpenseDetails";
import CollapsibleSection from "./components/CollapsibleSection";
import ExportImport from "./components/ExportImport";
import AmountReferencePanel from "./components/AmountReferencePanel";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);

  console.log(editingId, editingIncomeId);

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "INR" });

  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const net = totalIncome - totalExpense;

  useEffect(() => {
    let mounted = true;
    expenseDb.getAll().then((data) => {
      if (mounted) setExpenses(data);
    });
    incomeDb.getAll().then((data) => {
      if (mounted) setIncomes(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function addExpense(input: NewExpense) {
    const created = await expenseDb.create(input);
    setExpenses((s) => [created, ...s]);
  }

  async function addIncome(input: NewIncome) {
    const created = await incomeDb.create(input);
    setIncomes((s) => [created, ...s]);
  }

  async function removeExpense(id: string) {
    await expenseDb.delete(id);
    setExpenses((s) => s.filter((e) => e.id !== id));
  }

  async function removeIncome(id: string) {
    await incomeDb.delete(id);
    setIncomes((s) => s.filter((i) => i.id !== id));
  }

  // async function updateExpense(id: string, patch: Partial<Expense>) {
  //   const updated = await expenseDb.update(id, patch);
  //   if (!updated) return;
  //   setExpenses((s) => s.map((it) => (it.id === id ? updated : it)));
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
  const [amountRefOpen, setAmountRefOpen] = useState<boolean>(true);

  return (
    <div className="w-full flex justify-center">
      <div
        className="mx-auto p-6 transition-all duration-300"
        style={{ width: amountRefOpen ? "70%" : "100%" }}
      >
        {/* Dashboard header: summary cards */}
        <header className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4 flex flex-col">
            <div className="text-sm text-gray-500">Total Income</div>
            <div className="text-2xl font-semibold text-emerald-600 mt-2">
              {formatCurrency(totalIncome)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {incomes.length} entries
            </div>
          </div>
          <div className="bg-white shadow rounded p-4 flex flex-col">
            <div className="text-sm text-gray-500">Total Expense</div>
            <div className="text-2xl font-semibold text-red-600 mt-2">
              {formatCurrency(totalExpense)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {expenses.length} entries
            </div>
          </div>
          <div className="bg-white shadow rounded p-4 flex flex-col">
            <div className="text-sm text-gray-500">Net</div>
            <div
              className={`text-2xl font-semibold mt-2 ${
                net >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatCurrency(net)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Income − Expense</div>
          </div>
        </header>
        <button
          onClick={() => setAmountRefOpen((v) => !v)}
          className="fixed right-0 top-5 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded shadow"
          aria-label="Toggle Amount Reference"
        >
          <div
            className={`text-white text-md ${
              amountRefOpen ? "-rotate-90" : ""
            }`}
          >
            ▾
          </div>
        </button>

        <div className="mt-6">
          <div className="flex gap-6" style={{ alignItems: "flex-start" }}>
            <div
              className="transition-all duration-300"
              style={{ width: "100%" }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                <div>
                  <CollapsibleSection
                    title={"Add Income"}
                    defaultOpen={true}
                    className="mb-4"
                  >
                    <IncomeForm onSave={addIncome} />
                  </CollapsibleSection>
                  <CollapsibleSection
                    title={"Incomes"}
                    defaultOpen={true}
                    className="mb-4"
                  >
                    <IncomeDetails
                      incomes={incomes}
                      setEditingIncomeId={setEditingIncomeId}
                      removeIncome={removeIncome}
                      hideHeader
                    />
                  </CollapsibleSection>
                </div>

                <div>
                  <CollapsibleSection
                    title={"Add Expense"}
                    defaultOpen={true}
                    className="mb-4"
                  >
                    <ExpenseForm onSave={addExpense} />
                  </CollapsibleSection>
                  <CollapsibleSection
                    title={"Expenses"}
                    defaultOpen={true}
                    className="mb-4"
                  >
                    <ExpenseDetails
                      expenses={expenses}
                      setEditingId={setEditingId}
                      removeExpense={removeExpense}
                      hideHeader
                    />
                  </CollapsibleSection>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CollapsibleSection
          title={"All Stored Data"}
          defaultOpen={false}
          className="mb-4"
        >
          <AllStoredData
            incomes={incomes}
            expenses={expenses}
            setEditingId={setEditingId}
            setEditingIncomeId={setEditingIncomeId}
            removeExpense={removeExpense}
            removeIncome={removeIncome}
            formatCurrency={formatCurrency}
            hideHeader
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={"Export / Import"}
          defaultOpen={false}
          className="mb-4"
        >
          <ExportImport
            onImported={() => {
              // reload local state after import
              expenseDb.getAll().then((d) => setExpenses(d));
              incomeDb.getAll().then((d) => setIncomes(d));
            }}
          />
        </CollapsibleSection>
      </div>
      <div
        className="transition-all duration-300 overflow-hidden mt-5"
        style={{ width: amountRefOpen ? "30%" : "0" }}
        aria-hidden={!amountRefOpen}
      >
        <div style={{ width: "100%" }}>
          <AmountReferencePanel
            open={amountRefOpen}
            onToggle={() => setAmountRefOpen((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
