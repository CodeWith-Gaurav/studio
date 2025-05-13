// 'use server';

/**
 * @fileOverview Suggest preventative measures for healthy potato plants.
 *
 * - suggestPreventativeMeasures - A function that provides suggestions for maintaining potato plant health.
 * - SuggestPreventativeMeasuresInput - The input type for the suggestPreventativeMeasures function.
 * - SuggestPreventativeMeasuresOutput - The return type for the suggestPreventativeMeasures function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPreventativeMeasuresInputSchema = z.object({
  plantType: z.string().describe('The type of plant, should be potato.'),
});
export type SuggestPreventativeMeasuresInput = z.infer<typeof SuggestPreventativeMeasuresInputSchema>;

const SuggestPreventativeMeasuresOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of suggestions to keep potato plants healthy and prevent diseases.'),
});
export type SuggestPreventativeMeasuresOutput = z.infer<typeof SuggestPreventativeMeasuresOutputSchema>;

export async function suggestPreventativeMeasures(input: SuggestPreventativeMeasuresInput): Promise<SuggestPreventativeMeasuresOutput> {
  return suggestPreventativeMeasuresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPreventativeMeasuresPrompt',
  input: {schema: SuggestPreventativeMeasuresInputSchema},
  output: {schema: SuggestPreventativeMeasuresOutputSchema},
  prompt: `You are an expert in plant care, specializing in disease prevention for potato plants.

  Based on the fact that the plant is a potato plant, provide a list of preventative measures to keep the plant healthy and avoid diseases.
  Do not mention any specific disease, but provide suggestions that would make the plant healthier and less susceptible to diseases.
  Give a detailed list of suggestions.`,
});

const suggestPreventativeMeasuresFlow = ai.defineFlow(
  {
    name: 'suggestPreventativeMeasuresFlow',
    inputSchema: SuggestPreventativeMeasuresInputSchema,
    outputSchema: SuggestPreventativeMeasuresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
