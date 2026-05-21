import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();

const host = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "4000", 10);
app.use(express.json({ limit: "100kb" }));
app.use(cors());

const tasks = [
  {
    id: randomUUID(),
    title: "Ejemplo: comprar café",
    description: "Recoger 250g de café molido para la semana.",
  },
  {
    id: randomUUID(),
    title: "Ejemplo: estudiar Node.js",
    description: "Repasar Express y hacer una API sencilla.",
  },
];

app.get("/", (_req, res) => {
  res.json({ name: "Mini Tasks API", status: "ok" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";

  if (!title) {
    return res.status(400).json({ error: "title_required" });
  }

  if (!description) {
    return res.status(400).json({ error: "description_required" });
  }

  const task = { id: randomUUID(), title, description };
  tasks.unshift(task);
  return res.status(201).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((task) => task.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "not_found" });
  }

  tasks.splice(index, 1);
  return res.status(204).end();
});

app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});
