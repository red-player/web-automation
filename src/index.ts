// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import path from 'path';
import { PORT } from './config';
import { routes } from './routes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(json());

// Serve captured screenshots statically
app.use('/screenshots', express.static(path.join(process.cwd(), 'screenshots')));

// Serve the QA Dashboard UI
app.get('/dashboard', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'public', 'dashboard.html'));
});

app.use(routes);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Global Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});


