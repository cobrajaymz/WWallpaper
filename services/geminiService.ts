import { GoogleGenAI, Type } from '@google/genai';
import type { Wallpaper, AspectRatio } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the expected schema for a single wallpaper object from the API
const wallpaperSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the wallpaper.' },
    tags: { type: Type.STRING, description: 'A space-separated list of relevant tags for the image.' },
    fileUrl: { type: Type.STRING, description: 'The direct URL to the high-resolution image.' },
    sampleUrl: { type: Type.STRING, description: 'The URL to a medium-sized version of the image, suitable for previews.' },
    previewUrl: { type: Type.STRING, description: 'The URL to a small thumbnail of the image.' },
  },
  required: ['id', 'tags', 'fileUrl', 'sampleUrl', 'previewUrl'],
};

// Define the schema for the entire API response, which is an array of wallpapers
const responseSchema = {
  type: Type.ARRAY,
  items: wallpaperSchema,
};

/**
 * Searches for wallpapers using the Gemini API.
 * @param query The user's search query.
 * @param aspectRatio The desired aspect ratio for the wallpapers.
 * @param count The number of wallpapers to request.
 * @returns A promise that resolves to an array of Wallpaper objects.
 */
export const searchWallpapers = async (query: string, aspectRatio: AspectRatio = '16:9', count: number = 20): Promise<Wallpaper[]> => {
  const aspectRatioPrompt = aspectRatio !== 'any' ? ` with a ${aspectRatio} aspect ratio` : '';

  // Construct a detailed prompt for the Gemini model
  const prompt = `Find ${count} wallpapers related to "${query}"${aspectRatioPrompt}. 
  Prioritize images of the highest possible resolution, suitable for desktop backgrounds (e.g., 4K, 1920x1080).
  The wallpapers should be high-quality and safe for work. 
  For each wallpaper, provide a unique ID, relevant tags, and URLs for the full-resolution file, a sample-size image, and a small preview thumbnail. 
  It is crucial that the 'fileUrl' links to the original, uncompressed, highest-resolution version of the image available.
  If you can only find one URL, use it for all three URL fields (fileUrl, sampleUrl, previewUrl). 
  Ensure the URLs are direct links to an image file (e.g., ending in .jpg, .png).`;

  try {
    // Call the Gemini API to generate content based on the prompt and schema
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Use a powerful model for better search and reasoning
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    // Extract and parse the JSON response text
    const jsonText = response.text.trim();
    if (!jsonText) {
      console.warn('Gemini returned an empty response.');
      return [];
    }
    
    const wallpapers: Wallpaper[] = JSON.parse(jsonText);
    return wallpapers;

  } catch (error) {
    console.error(`Failed to fetch wallpapers with Gemini for query: "${query}"`, error);
    if (error instanceof SyntaxError) {
      console.error("Gemini returned invalid JSON, despite the schema. Response text might have been empty or malformed.");
    }
    // Throw a user-friendly error to be caught by the UI
    throw new Error('Failed to get wallpapers from the AI. Please try a different search or try again later.');
  }
};