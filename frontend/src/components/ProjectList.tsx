import { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  status: string;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pre-production");

  useEffect(() => {
    fetch("http://localhost:4000/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    const res = await fetch("http://localhost:4000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });
    const newProject = await res.json();
    setProjects([...projects, newProject]);
    setTitle("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong> – {p.status}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "1rem" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pre-production</option>
          <option>In Production</option>
          <option>Post</option>
        </select>
        <button onClick={handleAdd}>Add Project</button>
      </div>
    </div>
  );
}
