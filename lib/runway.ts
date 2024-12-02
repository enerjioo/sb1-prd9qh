import { Runway } from 'runway-js';

export const createRunwayClient = (apiKey: string) => {
  return new Runway(apiKey);
};