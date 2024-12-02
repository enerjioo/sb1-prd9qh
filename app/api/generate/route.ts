import { createOpenAIClient } from '@/lib/openai';
import { createGeminiClient } from '@/lib/gemini';
import { NextResponse } from 'next/server';
import { BrandConfig } from '@/types/brand';

export const dynamic = 'force-dynamic';

const languageNames = {
  tr: "Turkish",
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
};

function cleanGeneratedContent(content: string): string {
  return content
    .replace(/^\*+|\*+$/g, '') // Remove asterisks from start and end
    .replace(/^["']|["']$/g, '') // Remove quotes from start and end
    .replace(/#NoEmojis\b/g, '') // Remove #NoEmojis
    .replace(/#NoHashtags\b/g, '') // Remove #NoHashtags
    .replace(/---+/g, '') // Remove horizontal rules
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .trim(); // Remove extra whitespace
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      prompt, 
      platforms, 
      characterLimits, 
      tone, 
      language = 'en', 
      brandConfig,
      generateImage = true,
      includeEmojis = false,
      includeHashtags = false,
      hashtagCount = 0
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Content idea is required' },
        { status: 400 }
      );
    }

    const apiKey = brandConfig?.textProvider === 'gemini' 
      ? brandConfig.apiKeys.gemini 
      : brandConfig.apiKeys.openai;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    let brandContext = "";
    if (brandConfig) {
      brandContext = `
        Brand Context:
        - Name: ${brandConfig.name}
        - Industry: ${brandConfig.industry}
        - Brand Voice: ${brandConfig.brandVoice}
        - Target Audience: ${brandConfig.targetAudience.join(", ")}
        - Brand Values: ${brandConfig.values.join(", ")}
        - Key Keywords: ${brandConfig.keywords.join(", ")}
        - Description: ${brandConfig.description}

        Please ensure the content aligns with the brand's voice, values, and target audience.
        Use brand-specific keywords where appropriate.
      `;
    }

    const emojiInstructions = includeEmojis 
      ? `
        Emoji Guidelines:
        - Include relevant emojis naturally throughout the content
        - Use 2-3 emojis per post, placed strategically
        - Ensure emojis match the tone and context
        - Adapt emoji usage to each platform's style (more casual on Instagram/Twitter, more professional on LinkedIn)
      `
      : 'Do not use any emojis in the content.';

    const hashtagInstructions = includeHashtags
      ? `
        Hashtag Guidelines:
        - Add exactly ${hashtagCount} relevant hashtags at the end of each post
        - Make hashtags specific to the content and industry
        - Use trending hashtags when relevant
        - Format hashtags properly with # symbol
        - Adapt hashtag style to each platform:
          * Twitter: fewer, more concise hashtags
          * Instagram: mix of specific and general hashtags
          * LinkedIn: industry-specific, professional hashtags
          * Facebook: minimal, strategic hashtags
      `
      : 'Do not include any hashtags in the content.';

    const contentPrompt = `
      Create unique social media content in ${languageNames[language as keyof typeof languageNames]} for these platforms:
      ${platforms.map(platform => `${platform} (${characterLimits[platform]} character limit)`).join("\n")}

      Content Topic: ${prompt}
      Tone: ${tone}

      ${brandContext}

      ${emojiInstructions}

      ${hashtagInstructions}

      Platform-Specific Requirements:
      - Twitter: Short, punchy content with high engagement potential
      - Instagram: Visual-focused description with engaging narrative
      - LinkedIn: Professional tone with industry insights
      - Facebook: Conversational and engaging community-focused content

      Format Requirements:
      - Start each platform's content with the platform name as a header (e.g., "Twitter:", "Instagram:")
      - Include all emojis and hashtags within the character limit
      - Ensure each post is complete and can stand alone
      - Maintain consistent brand voice across platforms while adapting to each platform's style
      - Do not use asterisks, quotes, or decorative characters
      - Do not add "no emoji" or "no hashtag" text when those features are disabled

      CRITICAL: Strictly adhere to these character limits:
      ${platforms.map(platform => `- ${platform}: Maximum ${characterLimits[platform]} characters (including spaces, emojis, and hashtags)`).join("\n")}
    `;

    let content: string;
    let imageUrl: string | undefined;

    try {
      if (brandConfig?.textProvider === 'gemini') {
        const genAI = createGeminiClient(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const contentResult = await model.generateContent(contentPrompt);
        const contentResponse = await contentResult.response;
        content = cleanGeneratedContent(contentResponse.text());

        if (!content) {
          throw new Error('Empty response from Gemini API');
        }
      } else {
        const openai = createOpenAIClient(apiKey);

        const contentResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an expert social media content creator who creates engaging, platform-optimized content in ${languageNames[language as keyof typeof languageNames]}. You understand the unique characteristics and best practices of each platform. Never use asterisks, quotes, or decorative characters in your responses.`
            },
            {
              role: "user",
              content: contentPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });

        content = cleanGeneratedContent(contentResponse.choices[0]?.message?.content || '');

        if (!content) {
          throw new Error('Empty response from OpenAI API');
        }
      }

      if (generateImage) {
        const imagePrompt = `
          Create a professional social media image for:
          ${prompt}
          
          Style: ${tone}
          ${brandConfig ? `
            Brand Requirements:
            - Use brand colors: Primary (${brandConfig.primaryColor}), Secondary (${brandConfig.secondaryColor})
            - Match brand voice: ${brandConfig.brandVoice}
            - Appeal to: ${brandConfig.targetAudience.join(", ")}
            - Incorporate brand values: ${brandConfig.values.join(", ")}
          ` : ''}

          Requirements:
          - Visually striking and attention-grabbing
          - Suitable for social media
          - Professional and polished
          - Clear and well-composed
          - Any text in the image should be in ${languageNames[language as keyof typeof languageNames]}
        `;

        const openai = createOpenAIClient(brandConfig?.apiKeys?.openai || apiKey);
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        imageUrl = imageResponse.data[0].url;
      }

      return NextResponse.json({
        content,
        image: imageUrl
      });

    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json(
        { 
          error: error.message || 'Failed to generate content',
          details: error.response?.data || error
        },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process request',
        details: error
      },
      { status: 500 }
    );
  }
}