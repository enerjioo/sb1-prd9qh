import { GoogleGenerativeAI } from "@google/generative-ai";

export const createGeminiClient = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};