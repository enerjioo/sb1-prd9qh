import { createOpenAIClient } from '@/lib/openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { text, voice, speed, apiKey } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
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

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy",
      input: text,
      speed: speed || 1.0,
    });

    const audioData = await response.arrayBuffer();

    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
      },
    });

  } catch (error: any) {
    console.error('Speech API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}