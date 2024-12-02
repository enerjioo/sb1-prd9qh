"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { StorageService } from "@/lib/storage";

interface AINodeFormProps {
  type?: string;
  nodeId?: string;
  onClose: () => void;
}

export function AINodeForm({ type, nodeId = "", onClose }: AINodeFormProps) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("vivid");
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(3);
  const addResult = useNotificationStore((state) => state.addResult);
  const { getNodeConnections, propagateData } = useWorkflowStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    accept: {
      'audio/*': type === 'speech-to-text' ? ['.mp3', '.wav', '.m4a'] : [],
      'image/*': type === 'image-to-video' ? ['.jpg', '.jpeg', '.png'] : [],
    },
    maxFiles: 1,
  });

  // Get input data from connected source nodes
  useEffect(() => {
    if (nodeId) {
      const { sources } = getNodeConnections(nodeId);
      const textToTextSource = sources.find(node => 
        node.type === 'ai' && node.data.aiType === 'text-to-text'
      );
      if (textToTextSource?.data?.inputData?.text) {
        setPrompt(textToTextSource.data.inputData.text);
      }
    }
  }, [nodeId, getNodeConnections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt && !file) {
      toast.error("Please provide input");
      return;
    }

    const settings = StorageService.loadSettings();
    if (!settings?.apiKeys?.openai) {
      toast.error("Please configure OpenAI API key in settings");
      return;
    }

    setLoading(true);

    try {
      if (type === 'text-to-text') {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: prompt,
            provider: 'openai',
            apiKey: settings.apiKeys.openai,
            history: []
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate text');
        }

        const data = await response.json();
        
        addResult({
          nodeId,
          nodeType: "Text to Text",
          result: `Prompt: ${prompt}\n\nResponse: ${data.message}`,
        });

        propagateData(nodeId, {
          text: data.message,
          prompt,
          includeEmojis,
          includeHashtags,
          hashtagCount: includeHashtags ? hashtagCount : 0
        });
        
        toast.success("Text generated successfully!");
        onClose();
      }

      if (type === 'text-to-image') {
        const inputData = useWorkflowStore.getState().getNodeById(nodeId)?.data?.inputData;
        const imagePrompt = inputData?.text || prompt;

        const response = await fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: imagePrompt,
            size,
            style,
            apiKey: settings.apiKeys.openai
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

        const data = await response.json();
        
        addResult({
          nodeId,
          nodeType: "Text to Image",
          result: `Prompt: ${imagePrompt}\n\nImage URL: ${data.image}`,
        });

        // Combine text and image data for social media nodes
        const combinedData = {
          ...inputData,
          image: data.image,
          prompt: imagePrompt
        };

        propagateData(nodeId, combinedData);
        
        toast.success("Image generated successfully!");
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {type?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'speech-to-text' || type === 'image-to-video' ? (
          <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
            </p>
            {file && (
              <p className="mt-2 text-sm font-medium">{file.name}</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Enter your ${type} prompt...`}
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>

            {type === 'text-to-image' && (
              <>
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={size} onValueChange={setSize} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">Square (1:1)</SelectItem>
                      <SelectItem value="1792x1024">Landscape (16:9)</SelectItem>
                      <SelectItem value="1024x1792">Portrait (9:16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select value={style} onValueChange={setStyle} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivid">Vivid</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {type === 'text-to-text' && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeEmojis">Include Emojis</Label>
                  <Switch
                    id="includeEmojis"
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeHashtags">Include Hashtags</Label>
                    <Switch
                      id="includeHashtags"
                      checked={includeHashtags}
                      onCheckedChange={setIncludeHashtags}
                      disabled={loading}
                    />
                  </div>
                  {includeHashtags && (
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={hashtagCount}
                      onChange={(e) => setHashtagCount(parseInt(e.target.value, 10))}
                      disabled={loading}
                      className="w-20"
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}