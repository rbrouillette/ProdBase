import { execFile } from 'child_process';
import path from 'path';

export function runRagPipeline(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../rag_full_pipeline.py');
    const process = execFile('python3', [scriptPath, question], (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      // Assuming your Python script prints the answer last line
      const lines = stdout.trim().split('\n');
      const answer = lines[lines.length - 1];
      resolve(answer);
    });
    // Optionally, you can write question to stdin of the python script
  });
}
