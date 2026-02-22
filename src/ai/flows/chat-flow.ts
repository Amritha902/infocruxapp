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

// Tool for web search
const searchTheWeb = ai.defineTool(
    {
      name: 'searchTheWeb',
      description: 'Searches the web for information on a given query. Use this for general financial questions or to find information about companies or topics not present in the provided context.',
      inputSchema: z.object({ query: z.string() }),
      outputSchema: z.string().describe('A summary of the web search results.'),
    },
    async ({ query }) => {
      // In a real implementation, this would call a search API (e.g., Google Search API).
      // For this prototype, we'll return a mock result.
      console.log(`Searching web for: ${query}`);
      return `According to web sources, ${query} is a complex topic. For instance, a P/E ratio (price-to-earnings ratio) is the ratio for valuing a company that measures its current share price relative to its per-share earnings. A high P/E ratio could mean that a company's stock is overvalued, or else that investors are expecting high growth rates in the future. You can find more at https://www.investopedia.com/terms/p/price-earningsratio.asp.`;
    }
  );


const MarketAnalysisSchema = z.object({
  marketSummary: z.string().describe("A brief, one-sentence summary of the stock's current situation based on the provided context."),
  riskScore: z.number().optional().describe("The numerical risk score (0-100), if available."),
  riskCategory: z.string().optional().describe("The risk category (e.g., 'Normal', 'Moderate', 'Statistically Abnormal'), if available."),
  abnormalReturn: z.number().optional().describe("The abnormal return percentage."),
  volumeSpikeRatio: z.number().optional().describe("The volume spike ratio (e.g., 1.5, 2.3)."),
  explanation: z.string().optional().describe("The detailed, natural language explanation for the market reaction and risk score."),
});

const ExtractedEntitySchema = z.object({
    name: z.string().describe('The name of the extracted entity.'),
    type: z.string().describe('The type of entity (e.g., Company, Individual, Bank, etc.).'),
});

const AnnouncementAnalysisSchema = z.object({
  summary: z.string().describe("A concise summary of the corporate announcement."),
  extractedEntities: z.array(ExtractedEntitySchema).optional().describe("A list of key entities identified in the announcement."),
});

const GeneralResponseSchema = z.object({
    summary: z.string().describe("A direct and concise answer to the user's query based on general knowledge or web search results."),
    sources: z.array(z.string().url()).optional().describe("A list of URLs for any web sources used to formulate the response."),
});

const IntelligenceChatOutputSchema = z.object({
  marketAnalysis: MarketAnalysisSchema.optional(),
  announcementAnalysis: AnnouncementAnalysisSchema.optional(),
  generalResponse: GeneralResponseSchema.optional(),
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
  tools: [searchTheWeb],
  input: { schema: IntelligenceChatInputSchema },
  output: { schema: IntelligenceChatOutputSchema },
  prompt: `You are "Infocrux AI", an expert financial analyst chat assistant. Your responses must be structured, data-driven, and strictly neutral. Never provide investment advice.

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
    b.  **If the query is about the announcement and announcement context exists:** Create an 'announcementAnalysis' object by summarizing the announcement text and extracting all relevant entities (companies, individuals, etc.).
    c.  **Follow-up Suggestions:** Provide a list of 3-4 relevant follow-up questions.

2.  **If no stock context is provided:**
    a.  Analyze the user's query. If it's a general question (e.g., "what is a P/E ratio?", "who is the CEO of Microsoft?"), use the 'searchTheWeb' tool to find the answer.
    b.  Create a 'generalResponse' object containing the summary of the information and any source URLs you found.
    c.  If you cannot answer and a stock symbol is needed, politely inform the user that you need a stock symbol (e.g., "RELIANCE.NS", "TCS.NS") to provide analysis.
    d.  Provide a list of example questions as 'followUpSuggestions'.

Always prioritize providing a structured response in the defined output format.`,
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
