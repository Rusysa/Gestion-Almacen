import express from "express";
import Database from "better-sqlite3";

const app = express();
const db = new Database("app.db");

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hola mundo");
});
