import { Router } from "express";
import {
  listTables,
  getIdParam,
  fetchAll,
  fetchById,
  createRecord,
  updateRecord,
  deleteById,
  traducirError,
} from "./helpers.js";

const router = Router();

listTables.forEach(({ name, table }) => {
  router.get(`/${name}`, (req, res) => {
    try {
      res.json(fetchAll(table));
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: traducirError(error) });
    }
  });

  router.get(`/${name}/:id`, (req, res) => {
    try {
      const id = getIdParam(req, res);
      if (!id) return;
      const row = fetchById(table, id);
      if (!row) {
        res.status(404).json({ error: "no encontrado" });
        return;
      }
      res.json(row);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: traducirError(error) });
    }
  });

  router.post(`/${name}`, (req, res) => {
    try {
      const result = createRecord(table, req.body ?? {});
      if (!result) {
        res.status(400).json({ error: "cuerpo vacio" });
        return;
      }
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: traducirError(error) });
    }
  });

  router.put(`/${name}/:id`, (req, res) => {
    try {
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
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: traducirError(error) });
    }
  });

  router.delete(`/${name}/:id`, (req, res) => {
    try {
      const id = getIdParam(req, res);
      if (!id) return;
      const result = deleteById(table, id);
      if (result.changes === 0) {
        res.status(404).json({ error: "no encontrado" });
        return;
      }
      res.json({ eliminado: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: traducirError(error) });
    }
  });
});

export default router;
