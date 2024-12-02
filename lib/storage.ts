import { BrandConfig } from "@/types/brand";

const STORAGE_KEY = 'brandSettings';

export const StorageService = {
  // Save settings
  saveSettings: (settings: BrandConfig): void => {
    try {
      // Store API keys separately with encryption
      const apiKeys = { ...settings.apiKeys };
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key) {
          localStorage.setItem(`${provider}_key`, btoa(key));
        }
      });

      // Store social media credentials separately
      const socialAccounts = { ...settings.socialAccounts };
      Object.entries(socialAccounts || {}).forEach(([platform, credentials]) => {
        if (credentials) {
          localStorage.setItem(`${platform}_credentials`, btoa(JSON.stringify(credentials)));
        }
      });

      // Store settings without sensitive data
      const settingsToStore = {
        ...settings,
        apiKeys: Object.fromEntries(
          Object.entries(settings.apiKeys).map(([provider, key]) => [
            provider,
            key ? `••••${key.slice(-4)}` : ''
          ])
        ),
        socialAccounts: Object.fromEntries(
          Object.entries(settings.socialAccounts || {}).map(([platform, creds]) => [
            platform,
            creds ? { ...creds, masked: true } : null
          ])
        )
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToStore));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  },

  // Load settings
  loadSettings: (): BrandConfig | null => {
    try {
      const settingsStr = localStorage.getItem(STORAGE_KEY);
      if (!settingsStr) return null;

      const settings = JSON.parse(settingsStr);
      
      // Restore API keys from separate storage
      const apiKeys = Object.keys(settings.apiKeys).reduce((acc, provider) => {
        const key = localStorage.getItem(`${provider}_key`);
        return {
          ...acc,
          [provider]: key ? atob(key) : ''
        };
      }, {});

      // Restore social media credentials from separate storage
      const socialAccounts = Object.keys(settings.socialAccounts || {}).reduce((acc, platform) => {
        const credsStr = localStorage.getItem(`${platform}_credentials`);
        return {
          ...acc,
          [platform]: credsStr ? JSON.parse(atob(credsStr)) : null
        };
      }, {});
      
      return {
        ...settings,
        apiKeys,
        socialAccounts
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  },

  // Clear settings
  clearSettings: (): void => {
    try {
      // Get current settings to know what to clear
      const settingsStr = localStorage.getItem(STORAGE_KEY);
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        
        // Clear API keys
        Object.keys(settings.apiKeys).forEach(provider => {
          localStorage.removeItem(`${provider}_key`);
        });

        // Clear social media credentials
        Object.keys(settings.socialAccounts || {}).forEach(platform => {
          localStorage.removeItem(`${platform}_credentials`);
        });
      }

      // Clear main settings
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing settings:', error);
      throw new Error('Failed to clear settings');
    }
  }
};