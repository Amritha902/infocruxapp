'use server';
/**
 * @fileOverview This file implements a Genkit flow for processing corporate announcements.
 * It summarizes the announcement text and extracts key entities mentioned within it.
 *
 * - announcementSummaryAndEntities - A function that processes the announcement.
 * - AnnouncementSummaryAndEntitiesInput - The input type for the announcementSummaryAndEntities function.
 * - AnnouncementSummaryAndEntitiesOutput - The return type for the announcementSummaryAndEntities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// 1. Define Input Schema
const AnnouncementSummaryAndEntitiesInputSchema = z.object({
  fullText: z.string().describe('The full text of the corporate announcement.'),
});
export type AnnouncementSummaryAndEntitiesInput = z.infer<
  typeof AnnouncementSummaryAndEntitiesInputSchema
>;

// 2. Define Output Schema
const ExtractedEntitySchema = z.object({
  name: z.string().describe('The name of the extracted entity.'),
  type: z
    .string()
    .describe(
      'The type of entity (e.g., Company, Subsidiary, Individual, Bank, Investment Firm, Government Body, Counterparty, Financial Backer, etc.).'
    ),
});

const AnnouncementSummaryAndEntitiesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the corporate announcement.'),
  extractedEntities: z
    .array(ExtractedEntitySchema)
    .describe('A list of key entities identified in the announcement with their types.'),
});
export type AnnouncementSummaryAndEntitiesOutput = z.infer<
  typeof AnnouncementSummaryAndEntitiesOutputSchema
>;

// 3. Define the prompt
const announcementPrompt = ai.definePrompt({
  name: 'announcementSummaryAndEntitiesPrompt',
  input: {schema: AnnouncementSummaryAndEntitiesInputSchema},
  output: {schema: AnnouncementSummaryAndEntitiesOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to process a corporate announcement.

First, provide a concise summary of the announcement, highlighting its main points and potential implications.
Second, identify and extract all relevant entities mentioned in the announcement. For each entity, determine its type.
Relevant entity types include:
- Company: A general company mentioned.
- Subsidiary: A subsidiary company.
- Acquiring entity: A company that is acquiring another.
- Target entity: A company being acquired.
- Counterparty: Another party involved in an agreement or transaction.
- Financial Backer: An entity providing financial support or investment.
- Bank: A financial institution.
- Investment Firm: A company that invests funds.
- Government Body: A governmental organization.
- Individual: A person (e.g., director, executive).
- Other: Any other significant entity not covered by the above categories.

Provide the summary and extracted entities in the specified JSON format.

Corporate Announcement:
{{{fullText}}}`,
});

// 4. Define the flow
const announcementSummaryAndEntitiesFlow = ai.defineFlow(
  {
    name: 'announcementSummaryAndEntitiesFlow',
    inputSchema: AnnouncementSummaryAndEntitiesInputSchema,
    outputSchema: AnnouncementSummaryAndEntitiesOutputSchema,
  },
  async input => {
    const {output} = await announcementPrompt(input);
    if (!output) {
      throw new Error('Failed to generate summary and entities.');
    }
    return output;
  }
);

// 5. Export the wrapper function
export async function announcementSummaryAndEntities(
  input: AnnouncementSummaryAndEntitiesInput
): Promise<AnnouncementSummaryAndEntitiesOutput> {
  return announcementSummaryAndEntitiesFlow(input);
}
