import { createOpenAIClient } from '@/lib/openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const languageNames = {
  tr: "Turkish",
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
};

export async function POST(req: Request) {
  try {
    const { topic, keywords, tone, language = 'en', apiKey } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Blog topic is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      );
    }

    const openai = createOpenAIClient(apiKey);

    const blogPrompt = `
      Write a comprehensive blog post in ${languageNames[language as keyof typeof languageNames]} about:
      ${topic}

      ${keywords ? `Include these keywords: ${keywords}` : ''}

      Style: ${tone}

      Requirements:
      - Well-structured with clear sections
      - Engaging and informative
      - SEO-friendly
      - Include a compelling introduction
      - End with a strong conclusion
      - Approximately 800-1000 words
    `;

    const imagePrompt = `
      Create a professional featured image for a blog post about:
      ${topic}
      
      Style: ${tone}
      Requirements:
      - Visually striking and attention-grabbing
      - Professional and polished
      - Suitable for a blog header
      - Clear and well-composed
      - Any text in the image should be in ${languageNames[language as keyof typeof languageNames]}
    `;

    try {
      // Generate blog content
      const contentResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional blog writer. Create engaging and well-structured content in ${languageNames[language as keyof typeof languageNames]}.`
          },
          {
            role: "user",
            content: blogPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      // Generate featured image
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
      });

      const content = contentResponse.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Failed to generate blog content');
      }

      return NextResponse.json({
        content,
        image: imageResponse.data[0].url
      });

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate content' },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}