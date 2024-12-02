import { NextResponse } from 'next/server';
import { auth } from 'twitter-api-sdk';
import { generatePKCEChallenge } from '@/lib/pkce';

export const dynamic = 'force-dynamic';

// Twitter OAuth 2.0 settings
const CLIENT_ID = process.env.TWITTER_CLIENT_ID as string;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET as string;
const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL as string;

export async function GET() {
  try {
    // Generate PKCE challenge
    const { codeVerifier, codeChallenge } = await generatePKCEChallenge();

    // Create OAuth 2.0 client
    const authClient = new auth.OAuth2User({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      callback: CALLBACK_URL,
      scopes: ['tweet.read', 'tweet.write', 'users.read'],
    });

    // Generate auth URL with PKCE
    const authUrl = authClient.generateAuthURL({
      code_challenge: codeChallenge,
      code_challenge_method: 's256',
      state: codeVerifier, // Store verifier in state for verification
    });

    return NextResponse.json({ url: authUrl });
  } catch (error: any) {
    console.error('Twitter auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}