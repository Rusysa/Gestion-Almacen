import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 3000;

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API Gestion Almacen" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
