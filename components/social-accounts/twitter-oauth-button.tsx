"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Twitter } from "lucide-react";
import { toast } from "sonner";

interface TwitterOAuthButtonProps {
  onSuccess: (data: { username: string; tokens: any }) => void;
  disabled?: boolean;
}

export function TwitterOAuthButton({ onSuccess, disabled }: TwitterOAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);

      // Get auth URL
      const response = await fetch('/api/social/twitter/auth');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Open Twitter auth in popup
      const popup = window.open(
        data.url,
        'Twitter Auth',
        'width=600,height=600,status=yes,scrollbars=yes'
      );

      // Handle popup callback
      const handleCallback = async (event: MessageEvent) => {
        if (event.data?.type === 'TWITTER_CALLBACK') {
          const { code, state } = event.data;
          
          // Exchange code for tokens
          const tokenResponse = await fetch(`/api/social/twitter/callback?code=${code}&state=${state}`);
          const tokenData = await tokenResponse.json();

          if (tokenData.error) {
            throw new Error(tokenData.error);
          }

          onSuccess({
            username: tokenData.username,
            tokens: tokenData.tokens
          });

          toast.success('Successfully connected Twitter account!');
          popup?.close();
        }
      };

      window.addEventListener('message', handleCallback);

      // Cleanup
      return () => {
        window.removeEventListener('message', handleCallback);
      };
    } catch (error: any) {
      console.error('Twitter auth error:', error);
      toast.error(error.message || 'Failed to authenticate with Twitter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAuth}
      disabled={disabled || loading}
      className="w-full"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Twitter className="mr-2 h-4 w-4" />
      )}
      Connect Twitter Account
    </Button>
  );
}