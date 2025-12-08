const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "data.db");
const db = new Database(dbPath);

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      source TEXT,
      notes TEXT
    );
  `);
}

function tableFor(resource) {
  if (resource === "expenses") return "expenses";
  if (resource === "incomes") return "incomes";
  throw new Error("Invalid resource: " + resource);
}

function getAll(resource) {
  const table = tableFor(resource);
  const stmt = db.prepare(`SELECT * FROM ${table} ORDER BY rowid DESC`);
  return stmt.all();
}

function getById(resource, id) {
  const table = tableFor(resource);
  const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
  return stmt.get(id) || null;
}

function create(resource, item) {
  const table = tableFor(resource);
  const fields = Object.keys(item);
  const placeholders = fields.map(() => "?").join(",");
  const stmt = db.prepare(
    `INSERT INTO ${table} (${fields.join(",")}) VALUES (${placeholders})`
  );
  stmt.run(...fields.map((f) => item[f]));
  return getById(resource, item.id);
}

function update(resource, id, patch) {
  const table = tableFor(resource);
  const fields = Object.keys(patch);
  if (fields.length === 0) return getById(resource, id);
  const assignments = fields.map((f) => `${f} = ?`).join(", ");
  const stmt = db.prepare(`UPDATE ${table} SET ${assignments} WHERE id = ?`);
  stmt.run(...fields.map((f) => patch[f]), id);
  return getById(resource, id);
}

function del(resource, id) {
  const table = tableFor(resource);
  const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

function clear(resource) {
  const table = tableFor(resource);
  const stmt = db.prepare(`DELETE FROM ${table}`);
  stmt.run();
  return true;
}

init();

module.exports = {
  getAll,
  getById,
  create,
  update,
  del,
  clear,
};
