'use server';
/**
 * @fileOverview This file implements the main Genkit flow for the Intelligence Chat.
 *
 * - intelligenceChat - A function that generates a structured response for a user's chat query.
 * - IntelligenceChatInput - The input type for the intelligenceChat function.
 * - IntelligenceChatOutput - The return type for the intelligenceChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketAnalysisSchema = z.object({
  marketSummary: z.string().describe("A brief, one-sentence summary of the stock's current situation based on the provided context."),
  riskScore: z.number().optional().describe("The numerical risk score (0-100), if available."),
  riskCategory: z.string().optional().describe("The risk category (e.g., 'Normal', 'Moderate', 'Statistically Abnormal'), if available."),
  abnormalReturn: z.number().optional().describe("The abnormal return percentage."),
  volumeSpikeRatio: z.number().optional().describe("The volume spike ratio (e.g., 1.5, 2.3)."),
  explanation: z.string().optional().describe("The detailed, natural language explanation for the market reaction and risk score."),
});

const AnnouncementAnalysisSchema = z.object({
  summary: z.string().describe("A concise summary of the corporate announcement."),
  extractedEntities: z.array(z.object({
    name: z.string().describe('The name of the extracted entity.'),
    type: z.string().describe('The type of entity.'),
  })).optional().describe("A list of key entities identified in the announcement."),
});

const IntelligenceChatOutputSchema = z.object({
  marketAnalysis: MarketAnalysisSchema.optional(),
  announcementAnalysis: AnnouncementAnalysisSchema.optional(),
  followUpSuggestions: z.array(z.string()).describe("A list of 3-4 relevant follow-up questions the user might have."),
});

export type IntelligenceChatOutput = z.infer<typeof IntelligenceChatOutputSchema>;

const IntelligenceChatInputSchema = z.object({
  userQuery: z.string(),
  stockContext: z.object({
    symbol: z.string(),
    companyName: z.string(),
    announcement: z.object({
      fullText: z.string(),
      timestamp: z.string(),
      riskScore: z.number(),
      abnormalReturn: z.number(),
      volumeSpikeRatio: z.number(),
    }).optional(),
  }).optional(),
});
export type IntelligenceChatInput = z.infer<typeof IntelligenceChatInputSchema>;


export async function intelligenceChat(input: IntelligenceChatInput): Promise<IntelligenceChatOutput> {
  return intelligenceChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligenceChatPrompt',
  input: { schema: IntelligenceChatInputSchema },
  output: { schema: IntelligenceChatOutputSchema },
  prompt: `You are "Infocrux AI", an expert financial analyst chat assistant for a trading intelligence app. Your responses must be structured, data-driven, and strictly neutral. Never provide investment advice or use speculative language.

User's Query: "{{{userQuery}}}"

{{#if stockContext}}
You have the following context for the stock: {{{stockContext.companyName}}} ({{{stockContext.symbol}}}).
{{#if stockContext.announcement}}
- A corporate announcement was made on {{{stockContext.announcement.timestamp}}}.
- Announcement Text: "{{{stockContext.announcement.fullText}}}"
- Market Reaction Metrics:
  - Abnormal Return: {{{stockContext.announcement.abnormalReturn}}}%
  - Volume Spike Ratio: {{{stockContext.announcement.volumeSpikeRatio}}}x
  - Resulting Risk Score: {{{stockContext.announcement.riskScore}}}/100
{{else}}
- No specific recent announcement is in context for this query.
{{/if}}
{{else}}
- No stock symbol was detected in the user's query.
{{/if}}

Your Task:
Based on the user's query and the available context, generate a structured response.

1.  **If a stock context is provided:**
    a.  **Market Analysis:** Create a 'marketAnalysis' object.
        - Summarize the stock's current situation in one sentence.
        - Determine the 'riskCategory' from the 'riskScore' (0-30: Normal, 30-60: Moderate, 60-100: Statistically Abnormal).
        - Provide a concise 'explanation' for the market reaction using the metrics.
    b.  **If the query is about the announcement and announcement context exists:** Create an 'announcementAnalysis' object by summarizing the announcement text.
    c.  **Follow-up Suggestions:** Provide a list of 3-4 relevant follow-up questions.

2.  **If no stock context is provided:**
    - Do not generate 'marketAnalysis' or 'announcementAnalysis'.
    - Your response should politely inform the user that you need a stock symbol (e.g., "RELIANCE.NS", "TCS.NS") to provide analysis.
    - Provide a list of example questions as 'followUpSuggestions'.
`,
});


const intelligenceChatFlow = ai.defineFlow(
  {
    name: 'intelligenceChatFlow',
    inputSchema: IntelligenceChatInputSchema,
    outputSchema: IntelligenceChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate chat response.");
    }
    return output;
  }
);
