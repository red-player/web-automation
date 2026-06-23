import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || '2000';
export const BASE_URL = process.env.URL || 'https://vividtranstech.in/tancem/#/';
export const BASE_PATH = process.env.envUrl || '/tancem-automation/v1';
export const DEFAULT_USER = process.env.DEFAULT_USER || 'subramani@gmail.com';
export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'test@123';
export const DEFAULT_HEADLESS = process.env.DEFAULT_HEADLESS !== 'false';