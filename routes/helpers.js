import db from "../Database/db.js";

export const listTables = [
  { name: "categorias", table: "categoria" },
  { name: "articulos", table: "articulo" },
  { name: "roles", table: "rol" },
  { name: "usuarios", table: "usuario" },
  { name: "personas", table: "persona" },
  { name: "ingresos", table: "ingreso" },
  { name: "detalle-ingresos", table: "detalle_ingreso" },
  { name: "ventas", table: "venta" },
  { name: "detalle-ventas", table: "detalle_venta" },
];

export const getIdParam = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "id invalido" });
    return null;
  }
  return id;
};

export const fetchAll = (table) => db.prepare(`SELECT * FROM ${table}`).all();
export const fetchById = (table, id) =>
  db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
export const deleteById = (table, id) =>
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);

export const createRecord = (table, payload) => {
  const columns = Object.keys(payload);
  if (columns.length === 0) {
    return null;
  }
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;
  const stmt = db.prepare(sql);
  return stmt.run(columns.map((column) => payload[column]));
};

export const updateRecord = (table, id, payload) => {
  const columns = Object.keys(payload);
  if (columns.length === 0) {
    return null;
  }
  const assignments = columns.map((column) => `${column} = ?`).join(", ");
  const sql = `UPDATE ${table} SET ${assignments} WHERE id = ?`;
  const stmt = db.prepare(sql);
  return stmt.run([...columns.map((column) => payload[column]), id]);
};
