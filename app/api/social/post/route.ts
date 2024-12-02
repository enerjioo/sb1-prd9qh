import { NextResponse } from 'next/server';
import { TwitterClient } from '@/lib/twitter';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { content, image, platform, credentials } = await req.json();

    if (!platform || !credentials?.[platform]) {
      return NextResponse.json(
        { error: 'Invalid platform or missing credentials' },
        { status: 400 }
      );
    }

    if (platform === 'twitter') {
      try {
        const { apiKey, apiSecret, accessToken, accessTokenSecret } = credentials.twitter;

        if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
          throw new Error('Missing required Twitter credentials');
        }

        const client = new TwitterClient({
          apiKey,
          apiSecret,
          accessToken,
          accessTokenSecret
        });

        const result = await client.postTweet(content, image);

        if (result.success) {
          return NextResponse.json({
            success: true,
            tweetId: result.tweetId
          });
        } else {
          throw new Error(result.error || 'Failed to post tweet');
        }
      } catch (error: any) {
        console.error('Twitter API error:', error);
        return NextResponse.json(
          { 
            success: false,
            error: error.message || 'Failed to post to Twitter',
            details: error
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: `Platform ${platform} is not supported yet` },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to post content',
        details: error
      },
      { status: 500 }
    );
  }
}