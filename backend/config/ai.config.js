import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export const textAi = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_API_KEY,
    baseURL: process.env.AI_BASE_URL || undefined,
});

export const TEXT_MODEL = process.env.AI_MODEL || "llma-3.3-70b-versatile";

export const imageAi = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export const IMAGE_MODEL = process.env.GENAI_IMAGE_MODEL || "gemini-2.5-flash-image";
