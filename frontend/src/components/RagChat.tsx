import React, { useState } from 'react';
import { fetchRagAnswer } from '../ragApi';  // adjust path if needed

function RagChat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer('');
    try {
      const result = await fetchRagAnswer(question);
      setAnswer(result);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-2 rounded bg-gray-700 w-full border border-gray-600"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {answer && (
        <p className="mt-4 text-gray-300">
          <strong>Answer:</strong> {answer}
        </p>
      )}
    </div>
  );
}

export default RagChat;
