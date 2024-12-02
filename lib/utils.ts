import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPlatformContent(content: string): Record<string, string> {
  const contentByPlatform: Record<string, string> = {};
  const platforms = ['twitter', 'instagram', 'facebook', 'linkedin'];
  
  // Split content by platform headers
  let currentPlatform = '';
  let currentContent = '';
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const platformMatch = line.match(/^(Twitter|Instagram|Facebook|LinkedIn):/i);
    
    if (platformMatch) {
      // If we were collecting content for a previous platform, save it
      if (currentPlatform && currentContent) {
        contentByPlatform[currentPlatform.toLowerCase()] = currentContent.trim();
      }
      
      // Start collecting content for new platform
      currentPlatform = platformMatch[1];
      currentContent = '';
    } else if (currentPlatform && line.trim()) {
      // Add line to current platform's content
      currentContent += (currentContent ? '\n' : '') + line.trim();
    }
  }
  
  // Save the last platform's content
  if (currentPlatform && currentContent) {
    contentByPlatform[currentPlatform.toLowerCase()] = currentContent.trim();
  }
  
  // Ensure all platforms have a value
  platforms.forEach(platform => {
    if (!contentByPlatform[platform]) {
      contentByPlatform[platform] = '';
    }
  });
  
  return contentByPlatform;
}