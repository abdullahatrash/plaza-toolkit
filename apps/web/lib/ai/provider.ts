import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

// AI Provider configuration
// Make sure to set OPENAI_API_KEY in your .env file
export const aiProvider: LanguageModel = openai('gpt-4o-mini');
