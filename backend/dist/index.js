"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const ragRoutes_1 = __importDefault(require("./routes/ragRoutes")); // Import the new RAG routes
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Existing project routes
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});
app.post("/api/projects", async (req, res) => {
    const { title, status } = req.body;
    try {
        const project = await prisma.project.create({
            data: { title, status },
        });
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create project" });
    }
});
app.post('/api/rag/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});
// New RAG route mounted at /api/rag
app.use('/api/rag', ragRoutes_1.default);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Backend is running 🚀 on http://localhost:${PORT}`);
});
