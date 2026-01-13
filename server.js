import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const NEWS_API_BASE = 'https://newsapi.org/v2';
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve o front-end
app.use(express.static(path.join(__dirname, 'public')));

// Mensagem na raiz (opcional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Verifica key
app.use((req, res, next) => {
  if (!NEWS_API_KEY)
    return res.status(500).json({ error: 'NEWS_API_KEY não definida' });
  next();
});

// Proxy: top-headlines
app.get('/api/top-headlines', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const url = `${NEWS_API_BASE}/top-headlines?${params.toString()}`;
    const r = await fetch(url, { headers: { 'X-Api-Key': NEWS_API_KEY } });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Proxy: everything
app.get('/api/everything', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const url = `${NEWS_API_BASE}/everything?${params.toString()}`;
    const r = await fetch(url, { headers: { 'X-Api-Key': NEWS_API_KEY } });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
