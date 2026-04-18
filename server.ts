import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const DATA_PATH = path.join(__dirname, 'data', 'poll_data.csv');

  // Ensure data directory exists
  const dataDir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // --- Synthetic Data Generator (Fallback if CSV missing) ---
  const generatePollData = () => {
    const n = 400;
    const tools = ['Python', 'R', 'Excel', 'Power BI', 'Tableau'];
    const regions = ['North', 'South', 'East', 'West'];
    const ageGroups = ['18-24', '25-34', '35-44', '45+'];
    const genders = ['Male', 'Female', 'Non-binary'];
    const feedbacks = [
      'Very helpful tool', 'Could be improved', 'Excellent experience',
      'Needs more features', 'Easy to use', 'Highly recommend',
      'Interface is confusing', 'Great for beginners', 'Too complex'
    ];

    let csvContent = 'respondent_id,timestamp,age_group,gender,region,preferred_tool,satisfaction,feedback\n';
    const startDate = new Date('2024-01-01');

    for (let i = 0; i < n; i++) {
       const timestamp = new Date(startDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
       const row = [
         i + 1,
         timestamp.toISOString(),
         ` ${ageGroups[Math.floor(Math.random() * ageGroups.length)]} `, // Add spaces for cleaning proof
         genders[Math.floor(Math.random() * genders.length)],
         ` ${regions[Math.floor(Math.random() * regions.length)]} `.toLowerCase(), // Lowercase + spaces
         tools[weightedRandom([0.35, 0.20, 0.25, 0.12, 0.08])].toLowerCase(), // Lowercase tool
         weightedRandom([0.05, 0.10, 0.20, 0.40, 0.25]) + 1,
         Math.random() > 0.1 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : '' // Some empty feedback
       ].join(',');
       csvContent += row + '\n';
    }
    fs.writeFileSync(DATA_PATH, csvContent);
    return csvContent;
  };

  function weightedRandom(probabilities: number[]) {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < probabilities.length; i++) {
      sum += probabilities[i];
      if (r < sum) return i;
    }
    return probabilities.length - 1;
  }

  // Initial data check
  if (!fs.existsSync(DATA_PATH)) {
    console.log('Generating initial survey data CSV...');
    generatePollData();
  }

  const parseAndCleanCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        let val = values[index] || '';
        
        // --- CLEANING LOGIC ---
        if (['region', 'preferred_tool', 'age_group'].includes(header)) {
          val = val.trim();
          if (header !== 'age_group') {
             // Title Case cleaning
             val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
             // Special case for Power BI
             if (val.toLowerCase() === 'power bi') val = 'Power BI';
          }
        }
        
        if (header === 'satisfaction') obj[header] = Number(val);
        else if (header === 'feedback' && !val) obj[header] = 'No feedback provided';
        else obj[header] = val;
      });
      return obj;
    });
  };

  // --- API Routes ---
  app.get('/api/poll-data', (req, res) => {
    const content = fs.readFileSync(DATA_PATH, 'utf-8');
    const cleanedData = parseAndCleanCSV(content);
    res.json(cleanedData);
  });

  app.get('/api/pipeline-preview', (req, res) => {
    const content = fs.readFileSync(DATA_PATH, 'utf-8');
    const lines = content.trim().split('\n');
    const rawSample = lines.slice(0, 6); // Header + 5 rows
    const cleanedSample = parseAndCleanCSV(lines.slice(0, 6).join('\n'));
    
    res.json({
      raw: rawSample,
      cleaned: cleanedSample
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
