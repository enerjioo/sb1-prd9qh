"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2Icon, Play, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StorageService } from "@/lib/storage";

interface TextToSpeechProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function TextToSpeech({ loading, setLoading }: TextToSpeechProps) {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<{
    text: string;
    voice: string;
    speed: number;
  } | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const settings = StorageService.loadSettings();
    setHasApiKey(!!settings?.apiKeys?.openai);
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const voices = [
    { value: "alloy", label: "Alloy" },
    { value: "echo", label: "Echo" },
    { value: "fable", label: "Fable" },
    { value: "onyx", label: "Onyx" },
    { value: "nova", label: "Nova" },
    { value: "shimmer", label: "Shimmer" },
  ];

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    if (!hasApiKey) {
      toast.error("Please configure OpenAI API key in settings");
      return;
    }

    try {
      setLoading(true);
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      const settings = StorageService.loadSettings();
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text, 
          voice, 
          speed,
          apiKey: settings?.apiKeys?.openai 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate speech');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setLastRequest({ text, voice, speed });
      toast.success("Speech generated successfully!");
    } catch (error) {
      console.error("Speech generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate speech");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!lastRequest) {
      toast.error("No previous generation to refresh");
      return;
    }

    setText(lastRequest.text);
    setVoice(lastRequest.voice);
    setSpeed(lastRequest.speed);
    await handleGenerate();
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "speech.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!hasApiKey) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Please configure your OpenAI API key in settings to use text-to-speech functionality.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/settings'}>
          Go to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Text</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="min-h-[100px]"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Voice</Label>
          <Select value={voice} onValueChange={setVoice} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Speed ({speed}x)</Label>
          <Slider
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            min={0.25}
            max={4}
            step={0.25}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={!text.trim() || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Generate Speech
            </>
          )}
        </Button>

        {lastRequest && (
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}

        {audioUrl && (
          <Button variant="outline" onClick={handleDownload} disabled={loading}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {audioUrl && (
        <audio 
          controls 
          className="w-full mt-4"
          key={audioUrl}
        >
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}