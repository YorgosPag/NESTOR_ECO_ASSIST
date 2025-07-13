import {genkit} from 'genkit';
import {googleAI, geminiPro} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: geminiPro,
});
