"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface TwitterSettingsProps {
  credentials: {
    username?: string;
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    accessTokenSecret?: string;
  };
  onChange: (credentials: any) => void;
  disabled?: boolean;
}

export function TwitterSettings({ credentials, onChange, disabled }: TwitterSettingsProps) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (!credentials?.apiKey || !credentials?.apiSecret || 
        !credentials?.accessToken || !credentials?.accessTokenSecret) {
      toast.error("Please fill in all Twitter credentials");
      return;
    }

    setVerifying(true);

    try {
      const response = await fetch('/api/social/twitter/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentials }),
      });

      const data = await response.json();

      if (data.verified) {
        setVerified(true);
        onChange({
          ...credentials,
          username: data.username,
        });
        toast.success("Twitter credentials verified successfully!");
      } else {
        setVerified(false);
        toast.error(data.error || "Failed to verify Twitter credentials");
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error("Failed to verify Twitter credentials");
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleDisconnect = () => {
    onChange({
      username: '',
      apiKey: '',
      apiSecret: '',
      accessToken: '',
      accessTokenSecret: '',
    });
    setVerified(false);
    toast.success("Twitter account disconnected");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold">Twitter Account</h4>
          {credentials?.username && (
            <p className="text-sm text-muted-foreground">@{credentials.username}</p>
          )}
        </div>
        {verified ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            disabled={disabled}
          >
            Disconnect Account
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerify}
            disabled={disabled || verifying || !credentials?.apiKey || !credentials?.apiSecret || !credentials?.accessToken || !credentials?.accessTokenSecret}
          >
            {verifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                {verified ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Verify Credentials
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="twitter-api-key">API Key</Label>
          <Input
            id="twitter-api-key"
            value={credentials?.apiKey || ''}
            onChange={(e) => onChange({ ...credentials, apiKey: e.target.value })}
            placeholder="Enter your Twitter API Key"
            disabled={disabled || verified}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter-api-secret">API Secret</Label>
          <Input
            id="twitter-api-secret"
            type="password"
            value={credentials?.apiSecret || ''}
            onChange={(e) => onChange({ ...credentials, apiSecret: e.target.value })}
            placeholder="Enter your Twitter API Secret"
            disabled={disabled || verified}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter-access-token">Access Token</Label>
          <Input
            id="twitter-access-token"
            value={credentials?.accessToken || ''}
            onChange={(e) => onChange({ ...credentials, accessToken: e.target.value })}
            placeholder="Enter your Twitter Access Token"
            disabled={disabled || verified}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter-access-token-secret">Access Token Secret</Label>
          <Input
            id="twitter-access-token-secret"
            type="password"
            value={credentials?.accessTokenSecret || ''}
            onChange={(e) => onChange({ ...credentials, accessTokenSecret: e.target.value })}
            placeholder="Enter your Twitter Access Token Secret"
            disabled={disabled || verified}
          />
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h5 className="font-semibold mb-2">Twitter Developer Setup</h5>
          <p className="text-sm text-muted-foreground mb-2">
            To use Twitter integration:
          </p>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Create a project in the Twitter Developer Portal</li>
            <li>Create an app with OAuth 1.0a</li>
            <li>Generate API Key and API Secret</li>
            <li>Generate Access Token and Access Token Secret</li>
            <li>Enable Read and Write permissions</li>
          </ol>
        </div>
      </div>
    </div>
  );
}