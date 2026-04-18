import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // --- Synthetic Data Generator ---
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

    const data = [];
    const startDate = new Date('2024-01-01');

    for (let i = 0; i < n; i++) {
       const timestamp = new Date(startDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
       data.push({
         respondent_id: i + 1,
         timestamp: timestamp.toISOString(),
         age_group: ageGroups[Math.floor(Math.random() * ageGroups.length)],
         gender: genders[Math.floor(Math.random() * genders.length)],
         region: regions[Math.floor(Math.random() * regions.length)],
         // Using weights similar to the Python prompt
         preferred_tool: tools[weightedRandom([0.35, 0.20, 0.25, 0.12, 0.08])],
         satisfaction: weightedRandom([0.05, 0.10, 0.20, 0.40, 0.25]) + 1,
         feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)]
       });
    }
    return data;
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

  // --- API Routes ---
  app.get('/api/poll-data', (req, res) => {
    const rawData = generatePollData();
    
    // "Cleaning" Pipeline (as requested in the implementation plan)
    const cleanedData = rawData.map(item => ({
      ...item,
      preferred_tool: item.preferred_tool.trim(),
      region: item.region.trim(),
      satisfaction: Number(item.satisfaction),
      feedback: item.feedback || 'No feedback provided'
    }));

    res.json(cleanedData);
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
