import { Router } from "express";
import {
  listTables,
  getIdParam,
  fetchAll,
  fetchById,
  createRecord,
  updateRecord,
  deleteById,
} from "./helpers.js";

const router = Router();

listTables.forEach(({ name, table }) => {
  router.get(`/${name}`, (req, res) => {
    res.json(fetchAll(table));
  });

  router.get(`/${name}/:id`, (req, res) => {
    const id = getIdParam(req, res);
    if (!id) return;
    const row = fetchById(table, id);
    if (!row) {
      res.status(404).json({ error: "no encontrado" });
      return;
    }
    res.json(row);
  });

  router.post(`/${name}`, (req, res) => {
    const result = createRecord(table, req.body ?? {});
    if (!result) {
      res.status(400).json({ error: "cuerpo vacio" });
      return;
    }
    res.status(201).json({ id: result.lastInsertRowid });
  });

  router.put(`/${name}/:id`, (req, res) => {
    const id = getIdParam(req, res);
    if (!id) return;
    const result = updateRecord(table, id, req.body ?? {});
    if (!result) {
      res.status(400).json({ error: "cuerpo vacio" });
      return;
    }
    if (result.changes === 0) {
      res.status(404).json({ error: "no encontrado" });
      return;
    }
    res.json({ actualizado: true });
  });

  router.delete(`/${name}/:id`, (req, res) => {
    const id = getIdParam(req, res);
    if (!id) return;
    const result = deleteById(table, id);
    if (result.changes === 0) {
      res.status(404).json({ error: "no encontrado" });
      return;
    }
    res.json({ eliminado: true });
  });
});

export default router;
