import { NextResponse } from 'next/server';
import { auth, Client } from 'twitter-api-sdk';

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.TWITTER_CLIENT_ID as string;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET as string;
const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    // Create OAuth 2.0 client
    const authClient = new auth.OAuth2User({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      callback: CALLBACK_URL,
      scopes: ['tweet.read', 'tweet.write', 'users.read'],
    });

    // Exchange code for tokens
    const tokens = await authClient.requestAccessToken(code);
    
    // Create Twitter client
    const client = new Client(authClient);
    
    // Get user info
    const me = await client.users.findMyUser();

    return NextResponse.json({
      success: true,
      username: me.data.username,
      tokens: {
        accessToken: tokens.token.access_token,
        refreshToken: tokens.token.refresh_token,
        expiresAt: Date.now() + (tokens.token.expires_in * 1000)
      }
    });
  } catch (error: any) {
    console.error('Twitter callback error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process callback' },
      { status: 500 }
    );
  }
}