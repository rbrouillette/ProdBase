import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/projects", async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/projects", async (req: Request, res: Response) => {
  const { title, status } = req.body;
  try {
    const project = await prisma.project.create({
      data: { title, status },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend is running 🚀 on http://localhost:${PORT}`);
});
