import { createOpenAIClient } from '@/lib/openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, size, style, apiKey } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Image description is required' },
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

    const imagePrompt = `
      Create a professional image based on this description:
      ${prompt}
      
      Requirements:
      - High quality and visually appealing
      - Professional and polished look
      - Clear and well-composed
    `;

    // Generate image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: "standard",
      style: style as "vivid" | "natural",
    });

    if (!imageResponse.data[0].url) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: imageResponse.data[0].url });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate image',
        details: error.response?.data || error
      },
      { status: error.status || 500 }
    );
  }
}