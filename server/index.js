const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

function validResource(resource) {
  return resource === "expenses" || resource === "incomes";
}

app.get("/api/:resource", (req, res) => {
  const { resource } = req.params;
  if (!validResource(resource))
    return res.status(400).json({ error: "Invalid resource" });
  const items = db.getAll(resource);
  res.json(items);
});

app.get("/api/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  if (!validResource(resource))
    return res.status(400).json({ error: "Invalid resource" });
  const item = db.getById(resource, id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.post("/api/:resource", (req, res) => {
  const { resource } = req.params;
  const payload = req.body;
  if (!validResource(resource))
    return res.status(400).json({ error: "Invalid resource" });
  if (!payload || typeof payload !== "object")
    return res.status(400).json({ error: "Invalid payload" });
  const id = payload.id || uuidv4();
  const item = { id, ...payload };
  try {
    const created = db.create(resource, item);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create" });
  }
});

app.put("/api/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  const patch = req.body;
  if (!validResource(resource))
    return res.status(400).json({ error: "Invalid resource" });
  try {
    const updated = db.update(resource, id, patch);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update" });
  }
});

app.delete("/api/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  if (!validResource(resource))
    return res.status(400).json({ error: "Invalid resource" });
  try {
    const ok = db.del(resource, id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Clear endpoint - deletes all items in a resource
app.delete("/api/:resource", (req, res) => {
  const { resource } = req.params;
  if (!validResource(resource))
    return res.status(400).json({ error: "Invalid resource" });
  try {
    db.clear(resource);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to clear" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
