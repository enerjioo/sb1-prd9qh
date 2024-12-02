import { NextResponse } from 'next/server';
import { TwitterClient } from '@/lib/twitter';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { credentials } = await req.json();

    if (!credentials?.apiKey || !credentials?.apiSecret || 
        !credentials?.accessToken || !credentials?.accessTokenSecret) {
      return NextResponse.json(
        { error: 'Missing required Twitter credentials' },
        { status: 400 }
      );
    }

    const client = new TwitterClient(credentials);
    const result = await client.verifyCredentials();

    if (result.verified) {
      return NextResponse.json({ 
        verified: true,
        username: result.username 
      });
    } else {
      return NextResponse.json(
        { 
          verified: false,
          error: 'Invalid Twitter credentials'
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify Twitter credentials' },
      { status: 500 }
    );
  }
}