import { config } from 'dotenv';
config();

import '@/ai/flows/generate-disease-summary.ts';
import '@/ai/flows/suggest-preventative-measures.ts';