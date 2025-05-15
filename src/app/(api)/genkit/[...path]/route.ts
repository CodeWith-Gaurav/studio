// src/app/(api)/genkit/[...path]/route.ts
import { genkitNextHandler } from '@genkit-ai/next';
import '@/ai/dev'; // This imports your flow definitions (or at least initializes Genkit via dev.ts)

export const POST = genkitNextHandler();
export const GET = genkitNextHandler(); // Add GET if your flows might be invoked via GET
