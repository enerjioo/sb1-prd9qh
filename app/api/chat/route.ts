import { createOpenAIClient } from '@/lib/openai';
import { createGeminiClient } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_HISTORY_LENGTH = 20;

export async function POST(req: Request) {
  try {
    const { message, history, provider = 'openai', apiKey } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const recentHistory = history?.slice(-MAX_HISTORY_LENGTH) || [];
    let reply: string;

    if (provider === 'gemini') {
      const genAI = createGeminiClient(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const formattedHistory = recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      const prompt = `${formattedHistory}\nuser: ${message}`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        reply = response.text();

        if (!reply) {
          throw new Error('Empty response from Gemini API');
        }
      } catch (error: any) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to get response from Gemini: ' + (error.message || 'Unknown error'));
      }
    } else {
      const openai = createOpenAIClient(apiKey);
      
      const conversationHistory = recentHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      }));

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant focused on social media and content creation. Provide concise, practical advice."
            },
            ...conversationHistory,
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        reply = response.choices[0]?.message?.content || '';

        if (!reply) {
          throw new Error('Empty response from OpenAI API');
        }
      } catch (error: any) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to get response from OpenAI: ' + (error.message || 'Unknown error'));
      }
    }

    return NextResponse.json({ message: reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get response' },
      { status: 500 }
    );
  }
}