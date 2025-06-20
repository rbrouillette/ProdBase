import { useEffect, useState } from "react";
import RagChat from './components/RagChat';

interface Project {
  id: number;
  title: string;
  status: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  const backend = "http://44.206.186.70:4000";

  useEffect(() => {
    fetch(`${backend}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !status) return;

    const response = await fetch(`${backend}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });

    const newProject = await response.json();
    setProjects((prev) => [...prev, newProject]);
    setTitle("");
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🎬 Projects</h1>

      {/* Add the RAG chat component here */}
      <RagChat />

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 w-full border border-gray-600"
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 rounded bg-gray-800 w-full border border-gray-600"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Add Project
        </button>
      </form>

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-400">Status: {project.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
