import pkceChallenge from 'pkce-challenge';

export async function generatePKCEChallenge() {
  const challenge = pkceChallenge();
  return {
    codeVerifier: challenge.code_verifier,
    codeChallenge: challenge.code_challenge
  };
}