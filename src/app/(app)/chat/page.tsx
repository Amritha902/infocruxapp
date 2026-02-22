'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, CornerDownLeft, BarChart, AlertTriangle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { getAiChatResponse } from './actions';
import { ChatMessage } from '@/components/chat-message';
import { Message } from '@/lib/types';
import Balancer from 'react-wrap-balancer';

const suggestionChips = [
  'Why is RELIANCE.NS moving?',
  'Any announcements for TCS.NS?',
  'Review RELIANCE.NS for past abnormal activity',
  'What is a P/E ratio?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: nanoid(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    scrollToBottom();

    startTransition(async () => {
      const assistantMessage: Message = { id: nanoid(), role: 'assistant', content: 'Thinking...' };
      setMessages(prev => [...prev, assistantMessage]);
      scrollToBottom();

      try {
        const aiResponse = await getAiChatResponse(newMessages);
        
        const finalAssistantMessage: Message = {
            id: assistantMessage.id,
            role: 'assistant',
            content: '',
            ui: aiResponse
        };

        setMessages(prev =>
            prev.map(msg => (msg.id === assistantMessage.id ? finalAssistantMessage : msg))
        );
        scrollToBottom();

      } catch (error) {
        const errorMessage: Message = {
          id: assistantMessage.id,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        setMessages(prev => prev.map(msg => (msg.id === assistantMessage.id ? errorMessage : msg)));
        scrollToBottom();
      }
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
    }
  };

  useEffect(scrollToBottom, [messages]);


  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-6rem)]">
      {messages.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-full text-center">
            <BarChart className="w-16 h-16 mb-4 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Intelligence Chat</h2>
            <p className="max-w-md text-muted-foreground">
                <Balancer>
                Ask about market movements, announcements, or risk events. I can analyze stocks like RELIANCE.NS, TCS.NS, etc.
                </Balancer>
            </p>
         </div>
      ) : (
        <ScrollArea className="flex-1 -mx-6" ref={scrollAreaRef}>
             <div className="px-6 space-y-6">
                {messages.map((m) => <ChatMessage key={m.id} message={m} isLoading={isPending && m.content === 'Thinking...'} />)}
            </div>
        </ScrollArea>
      )}
      
      <div className="pt-4 mt-auto">
        <div className="flex items-center gap-2 flex-wrap mb-2">
            {suggestionChips.map(suggestion => (
                <Button key={suggestion} variant="outline" size="sm" className="text-xs" onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                </Button>
            ))}
        </div>
        <form onSubmit={handleSubmit} ref={formRef} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a stock or paste a news link..."
            className="pr-12 min-h-12 h-12 text-base"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2"
            disabled={isPending || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
         <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5"/>
            <span>Infocrux AI can make mistakes. Information is not investment advice.</span>
        </div>
      </div>
    </div>
  );
}

    