import { useRef, useState } from "react";
import {
  exportMonthlyCSV,
  exportMonthlyJSON,
  importBackupJson,
} from "../utils/backup";

export default function ExportImport({
  onImported,
}: {
  onImported?: () => void;
}) {
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [merge, setMerge] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="card mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i + 1}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => {
              exportMonthlyJSON(year, month);
              setStatus("Exported JSON");
            }}
          >
            Export JSON
          </button>
          <button
            className="bg-emerald-600 text-white px-4 py-2 rounded"
            onClick={() => {
              exportMonthlyCSV(year, month);
              setStatus("Exported CSV");
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <hr className="my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Import JSON backup
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">
            <input
              type="radio"
              checked={merge}
              onChange={() => setMerge(true)}
            />{" "}
            Merge
          </label>
          <label className="text-sm">
            <input
              type="radio"
              checked={!merge}
              onChange={() => setMerge(false)}
            />{" "}
            Replace
          </label>
          <button
            className="bg-yellow-600 text-white px-3 py-2 rounded"
            onClick={async () => {
              const el = fileRef.current;
              if (!el || !el.files || !el.files[0]) {
                setStatus("No file selected");
                return;
              }
              try {
                const text = await el.files[0].text();
                importBackupJson(text, { merge });
                setStatus("Import completed");
                if (onImported) onImported();
                else window.location.reload();
              } catch (e: any) {
                setStatus("Import failed: " + (e?.message || String(e)));
              }
            }}
          >
            Import
          </button>
        </div>
      </div>

      {status && <div className="text-sm text-gray-600 mt-3">{status}</div>}
    </section>
  );
}
