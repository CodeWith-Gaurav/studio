// src/ai/flows/generate-disease-summary.ts
'use server';

/**
 * @fileOverview Generates a summary of the detected potato leaf disease, including causes and recommended actions.
 *
 * - generateDiseaseSummary - A function that generates the disease summary.
 * - GenerateDiseaseSummaryInput - The input type for the generateDiseaseSummary function.
 * - GenerateDiseaseSummaryOutput - The return type for the generateDiseaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiseaseSummaryInputSchema = z.object({
  diseaseName: z
    .string()
    .describe('The name of the detected potato leaf disease (Early Blight or Late Blight).'),
});
export type GenerateDiseaseSummaryInput = z.infer<typeof GenerateDiseaseSummaryInputSchema>;

const GenerateDiseaseSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A brief summary of the disease, including potential causes and recommended actions.'),
});
export type GenerateDiseaseSummaryOutput = z.infer<typeof GenerateDiseaseSummaryOutputSchema>;

export async function generateDiseaseSummary(input: GenerateDiseaseSummaryInput): Promise<GenerateDiseaseSummaryOutput> {
  return generateDiseaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiseaseSummaryPrompt',
  input: {schema: GenerateDiseaseSummaryInputSchema},
  output: {schema: GenerateDiseaseSummaryOutputSchema},
  prompt: `You are an expert in potato plant diseases. Generate a brief summary of the disease, including potential causes and recommended actions.

Disease Name: {{{diseaseName}}}`,
});

const generateDiseaseSummaryFlow = ai.defineFlow(
  {
    name: 'generateDiseaseSummaryFlow',
    inputSchema: GenerateDiseaseSummaryInputSchema,
    outputSchema: GenerateDiseaseSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
