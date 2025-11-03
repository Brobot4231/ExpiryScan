'use server';

/**
 * @fileOverview This flow calculates the expiry date based on the manufacturing date and a "best before" duration.
 *
 * It takes the product image, manufacturing date, and "best before" duration as input.
 * If a valid expiry date is found in the image, it will return the expiry date.
 * If manufacturing date and "best before" duration are found, it calculates and returns the expiry date.
 *
 * @param {CalculateExpiryDateInput} input - The input data for calculating the expiry date.
 * @returns {Promise<CalculateExpiryDateOutput>} - A promise that resolves to the calculated expiry date or an error message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CalculateExpiryDateInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  manufactureDate: z.string().optional().describe('The manufacturing date of the product (e.g., YYYY-MM-DD).'),
  bestBeforeDuration: z.string().optional().describe('The "best before" duration (e.g., 18 months).'),
});

export type CalculateExpiryDateInput = z.infer<typeof CalculateExpiryDateInputSchema>;

const CalculateExpiryDateOutputSchema = z.object({
  expiryDate: z.string().optional().describe('The calculated expiry date (YYYY-MM-DD).'),
  manufactureDate: z.string().optional().describe('The manufacturing date of the product (YYYY-MM-DD).'),
  currentDate: z.string().describe('The current date (YYYY-MM-DD).'),
  status: z.string().describe('The expiry status of the product.'),
  message: z.string().optional().describe('Additional information about the product expiry status'),
});

export type CalculateExpiryDateOutput = z.infer<typeof CalculateExpiryDateOutputSchema>;

export async function calculateExpiryDate(
  input: CalculateExpiryDateInput
): Promise<CalculateExpiryDateOutput> {
  return calculateExpiryDateFlow(input);
}

const calculateExpiryDatePrompt = ai.definePrompt({
  name: 'calculateExpiryDatePrompt',
  input: {schema: CalculateExpiryDateInputSchema},
  output: {schema: CalculateExpiryDateOutputSchema},
  prompt: `You are an AI assistant specialized in determining product expiry dates.

  Current Date: {{{currentDate}}}

  Analyze the following information to determine the product's expiry status. If the photo contains an explicit expiry date, extract it. If a manufacturing date and a "best before" duration are provided, calculate the expiry date based on that. Return the manufacture date, expiry date, current date, and status of the product (expired or not expired) along with additional messages of explanation.

  Image: {{media url=photoDataUri}}
  Manufacturing Date: {{{manufactureDate}}}
  Best Before Duration: {{{bestBeforeDuration}}}

  If the product has a manufacture date and a best before duration, calculate the expiry date from it.  The status should clearly state whether the product is expired or not. If not expired, the status should display that product is not expired and how many days months and years is left in expiration of the product based on current date and expiry date. If the product is expired, the status should display that the product is expired and how many days months and years ago it has expired based on current date and expiry date.

  If you can not find the expiry date or can not calculate the expiry date, return an error message.
  `,
});

const calculateExpiryDateFlow = ai.defineFlow(
  {
    name: 'calculateExpiryDateFlow',
    inputSchema: CalculateExpiryDateInputSchema,
    outputSchema: CalculateExpiryDateOutputSchema,
  },
  async input => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const result = await calculateExpiryDatePrompt({
      ...input,
      currentDate,
    });
    return result.output!;
  }
);
