
'use server';

import { calculateExpiryDate, type CalculateExpiryDateInput } from '@/ai/flows/calculate-expiry-date';

export async function getExpiryDateAction(input: CalculateExpiryDateInput) {
  try {
    const result = await calculateExpiryDate(input);
    return result;
  } catch (error) {
    console.error('Error in getExpiryDateAction:', error);
    // It's better to throw the error and let the client handle it.
    // This allows for more specific error messages in the UI.
    throw new Error('Failed to process the product image. The AI model may be unavailable or the input is invalid.');
  }
}
