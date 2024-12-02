import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';

interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export class TwitterClient {
  private oauth: OAuth;
  private token: { key: string; secret: string };

  constructor(credentials: TwitterCredentials) {
    this.oauth = new OAuth({
      consumer: {
        key: credentials.apiKey,
        secret: credentials.apiSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString: string, key: string) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
      },
    });

    this.token = {
      key: credentials.accessToken,
      secret: credentials.accessTokenSecret,
    };
  }

  async verifyCredentials(): Promise<{ verified: boolean; username?: string }> {
    const request_data = {
      url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
      method: 'GET'
    };

    try {
      const response = await axios({
        url: request_data.url,
        method: request_data.method,
        headers: this.oauth.toHeader(this.oauth.authorize(request_data, this.token)),
      });

      return {
        verified: true,
        username: response.data.screen_name
      };
    } catch (error) {
      console.error('Twitter credentials verification failed:', error);
      return { verified: false };
    }
  }

  async postTweet(text: string, imageUrl?: string): Promise<{ success: boolean; error?: string }> {
    try {
      let mediaId: string | undefined;

      if (imageUrl) {
        try {
          // Download image
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(imageResponse.data, 'binary');

          // Upload media
          const uploadRequest = {
            url: 'https://upload.twitter.com/1.1/media/upload.json',
            method: 'POST',
          };

          const formData = new FormData();
          formData.append('media', new Blob([buffer]));

          const uploadResponse = await axios({
            url: uploadRequest.url,
            method: uploadRequest.method,
            headers: this.oauth.toHeader(this.oauth.authorize(uploadRequest, this.token)),
            data: formData,
          });

          mediaId = uploadResponse.data.media_id_string;
        } catch (imageError: any) {
          console.error('Failed to upload image:', imageError);
          return {
            success: false,
            error: 'Failed to upload image: ' + (imageError.message || 'Unknown error')
          };
        }
      }

      // Post tweet
      const tweetRequest = {
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        method: 'POST',
        data: {
          status: text,
          ...(mediaId && { media_ids: mediaId }),
        },
      };

      const response = await axios({
        url: tweetRequest.url,
        method: tweetRequest.method,
        headers: this.oauth.toHeader(this.oauth.authorize(tweetRequest, this.token)),
        params: tweetRequest.data,
      });

      return {
        success: true,
        tweetId: response.data.id_str
      };
    } catch (error: any) {
      console.error('Failed to post tweet:', error);
      return {
        success: false,
        error: error.message || 'Failed to post tweet'
      };
    }
  }
}