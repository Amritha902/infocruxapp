'use server';
/**
 * @fileOverview This file implements a Genkit flow to provide natural language explanations for ML-generated stock risk scores.
 *
 * - mlRiskScoreExplanation - A function that generates an explanation for a stock's ML risk score.
 * - MLRiskScoreExplanationInput - The input type for the mlRiskScoreExplanation function.
 * - MLRiskScoreExplanationOutput - The return type for the mlRiskScoreExplanation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MLRiskScoreExplanationInputSchema = z.object({
  symbol: z.string().describe('The stock symbol (e.g., RELIANCE.NS).'),
  timestamp: z.string().describe('The timestamp of the corporate announcement in ISO format.'),
  risk_score: z.number().min(0).max(100).describe('The ML-generated risk score (0-100).'),
  abnormal_return: z.number().describe('The abnormal return percentage observed.'),
  volume_spike_ratio: z.number().describe('The volume spike ratio observed.'),
  explanationContext: z.string().optional().describe('Optional additional context about the announcement or market conditions.'),
});
export type MLRiskScoreExplanationInput = z.infer<typeof MLRiskScoreExplanationInputSchema>;

const MLRiskScoreExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear, concise natural language explanation for the assigned risk score.'),
  category: z.enum(['Normal', 'Moderate', 'Statistically Abnormal']).describe('The classification of the market reaction based on the risk score.'),
});
export type MLRiskScoreExplanationOutput = z.infer<typeof MLRiskScoreExplanationOutputSchema>;

export async function mlRiskScoreExplanation(input: MLRiskScoreExplanationInput): Promise<MLRiskScoreExplanationOutput> {
  return mlRiskScoreExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mlRiskScoreExplanationPrompt',
  input: { schema: MLRiskScoreExplanationInputSchema },
  output: { schema: MLRiskScoreExplanationOutputSchema },
  prompt: `You are a financial analyst specializing in market reaction to corporate announcements.

Your task is to provide a clear and concise explanation for the ML-generated risk score for stock '{{{symbol}}}' at the announcement timestamp '{{{timestamp}}}'.

The risk score is '{{{risk_score}}}' (on a scale of 0-100). Interpret this score into one of the following categories:
- 0-30: Normal reaction
- 30-60: Moderate reaction
- 60-100: Statistically Abnormal reaction

Use the following market metrics to support your explanation:
- Abnormal Return: '{{{abnormal_return}}}%' (A positive value means the stock outperformed its expected return, a negative value means it underperformed).
- Volume Spike Ratio: '{{{volume_spike_ratio}}}x' (A value greater than 1 indicates higher than average trading volume).

If available, consider this additional context: "{{{explanationContext}}}"

Based on these details, explain why this risk score was assigned and what it signifies about the market's reaction. The 'explanation' field should be a short paragraph. Also, provide the determined 'category'.`,
});

const mlRiskScoreExplanationFlow = ai.defineFlow(
  {
    name: 'mlRiskScoreExplanationFlow',
    inputSchema: MLRiskScoreExplanationInputSchema,
    outputSchema: MLRiskScoreExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
