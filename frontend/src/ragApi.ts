export async function fetchRagAnswer(question: string): Promise<string> {
  const response = await fetch('http://44.206.186.70:4000/api/rag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch answer');
  }

  const data = await response.json();
  return data.answer;
}
