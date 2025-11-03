'use server';

/**
 * @fileOverview Determines the validity of a product based on its expiration date.
 *
 * - determineProductValidity - A function that determines if a product is expired or not.
 * - DetermineProductValidityInput - The input type for the determineProductValidity function.
 * - DetermineProductValidityOutput - The return type for the determineProductValidity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineProductValidityInputSchema = z.object({
  currentDate: z.string().describe('The current date in ISO format (YYYY-MM-DD).'),
  expirationDate: z.string().describe('The expiration date in ISO format (YYYY-MM-DD).'),
});
export type DetermineProductValidityInput = z.infer<typeof DetermineProductValidityInputSchema>;

const DetermineProductValidityOutputSchema = z.object({
  isExpired: z.boolean().describe('Whether the product is expired.'),
  expiryStatus: z.string().describe('A human-readable status of the product expiry.'),
});
export type DetermineProductValidityOutput = z.infer<typeof DetermineProductValidityOutputSchema>;

export async function determineProductValidity(input: DetermineProductValidityInput): Promise<DetermineProductValidityOutput> {
  return determineProductValidityFlow(input);
}

const determineProductValidityPrompt = ai.definePrompt({
  name: 'determineProductValidityPrompt',
  input: {schema: DetermineProductValidityInputSchema},
  output: {schema: DetermineProductValidityOutputSchema},
  prompt: `You are an expert at determining product validity based on expiration dates.

Given the current date and the product's expiration date, determine if the product is expired or not.  If the product is expired, explain how long ago it expired in terms of years, months and days.

If the product is not expired, explain how long until it expires in terms of years, months and days.

Current Date: {{{currentDate}}}
Expiration Date: {{{expirationDate}}}

Respond in JSON format. Adhere to the schema descriptions closely. Be concise in your explanation.`, 
});

const determineProductValidityFlow = ai.defineFlow(
  {
    name: 'determineProductValidityFlow',
    inputSchema: DetermineProductValidityInputSchema,
    outputSchema: DetermineProductValidityOutputSchema,
  },
  async input => {
    const {output} = await determineProductValidityPrompt(input);
    return output!;
  }
);
