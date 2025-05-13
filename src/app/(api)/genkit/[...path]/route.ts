// src/app/(api)/genkit/[...path]/route.ts
import { genkitNextHandler } from '@genkit-ai/next';
import '@/ai/dev'; // This imports your flow definitions from src/ai/dev.ts

export const POST = genkitNextHandler();
export const GET = genkitNextHandler(); // Add GET if your flows might be invoked via GET, though POST is typical.
