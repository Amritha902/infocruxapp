'use server';

import { intelligenceChat, IntelligenceChatOutput } from '@/ai/flows/chat-flow';
import { announcementsData } from '@/lib/data';
import { Message } from '@/lib/types';

// Regex to find stock symbols like 'RELIANCE.NS' or 'TCS.NS'
const SYMBOL_REGEX = /[A-Z\d\-.&]{3,}\.NS\b/i;

export async function getAiChatResponse(
  chatHistory: Message[]
): Promise<IntelligenceChatOutput> {

  const userQuery = chatHistory.findLast(m => m.role === 'user')?.content;
  if (!userQuery) {
    throw new Error('No user query found');
  }

  const symbolMatch = userQuery.match(SYMBOL_REGEX);
  const symbol = symbolMatch ? symbolMatch[0].toUpperCase() : null;

  if (symbol) {
    const announcement = announcementsData.find(a => a.symbol === symbol);

    if (announcement) {
        const response = await intelligenceChat({
            userQuery,
            stockContext: {
                symbol: announcement.symbol,
                companyName: announcement.companyName,
                announcement: {
                    fullText: announcement.fullText,
                    timestamp: announcement.timestamp,
                    riskScore: announcement.riskScore,
                    abnormalReturn: announcement.abnormalReturn,
                    volumeSpikeRatio: announcement.volumeSpikeRatio
                }
            }
        });
        return response;
    }
  }

  // If no symbol or no data, call the flow without context
  const response = await intelligenceChat({ userQuery });
  return response;
}
