import { config } from 'dotenv';
config(); // Loads .env file variables into process.env

import '@/ai/genkit'; // Ensures the global 'ai' object from genkit.ts is initialized

// When you create Genkit flows in the src/ai/flows/ directory,
// you'll need to import them here so Genkit can discover them.
// For example:
// import './flows/your-flow-name';
