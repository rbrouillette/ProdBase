import { Router, Request, Response } from 'express';
import { runRagPipeline } from '../controllers/ragController';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    const answer = await runRagPipeline(question);
    res.json({ answer });
  } catch (error) {
    console.error('RAG error:', error);
    res.status(500).json({ error: 'Failed to process RAG query' });
  }
});

export default router;
