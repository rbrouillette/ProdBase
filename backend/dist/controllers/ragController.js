"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRagPipeline = runRagPipeline;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function runRagPipeline(question) {
    return new Promise((resolve, reject) => {
        const scriptPath = path_1.default.join(__dirname, '../../rag_full_pipeline.py');
        const process = (0, child_process_1.execFile)('python3', [scriptPath, question], (error, stdout, stderr) => {
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
