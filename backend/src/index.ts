import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import ragRoutes from './routes/ragRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Project routes example
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', async (req: Request, res: Response) => {
  const { title, status } = req.body;
  try {
    const project = await prisma.project.create({
      data: { title, status },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Mount RAG routes
app.use('/api/rag', ragRoutes);

// Optional catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Fix: Convert port to number explicitly
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is running 🚀 on http://localhost:${PORT}`);
});
