import { NextResponse } from 'next/server';
import { createOpenAIClient } from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { type, input, options, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const openai = createOpenAIClient(apiKey);

    switch (type) {
      case 'audio-cleaner':
        // Simulate audio cleaning process
        await new Promise(resolve => setTimeout(resolve, 2000));
        return NextResponse.json({
          output: input, // In a real implementation, this would be the cleaned audio URL
          message: "Audio cleaned successfully"
        });

      case 'background-remover':
        try {
          // Use DALL-E's edit capability to remove background
          const response = await openai.images.edit({
            image: await fetch(input).then(res => res.blob()),
            prompt: "Remove the background, keep only the main subject on a transparent background",
            n: 1,
            size: "1024x1024",
          });

          return NextResponse.json({
            output: response.data[0].url,
            message: "Background removed successfully"
          });
        } catch (error) {
          console.error('Background removal error:', error);
          throw new Error('Failed to remove background');
        }

      case 'image-resizer':
        const { width, height, format } = options;
        // Simulate image resizing process
        await new Promise(resolve => setTimeout(resolve, 1000));
        return NextResponse.json({
          output: input, // In a real implementation, this would be the resized image URL
          message: `Image resized to ${width}x${height} (${format})`
        });

      default:
        return NextResponse.json(
          { error: 'Unsupported media processing type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Media processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process media' },
      { status: 500 }
    );
  }
}