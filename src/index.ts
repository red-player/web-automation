// src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { PORT } from './config';
import { routes } from './routes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(json());

app.use(routes)


app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
