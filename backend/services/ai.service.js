import { textAi, TEXT_MODEL, imageAi, IMAGE_MODEL } from "../config/ai.config.js";
import { AppError } from "../errors/AppError.js";

const CAPTION_INSTRUCTIONS = {
    linkedin: 
          "Proffessional but human tone, 2-3 short paragraphs. End with a light call-to-action. " + "5-7 relevant hashtags.",
    instagram:
          "Warm, engaging, casual tone. 2-3 short paragraphs with room for emojis. " + 
          "End with a call-to-action. 5-10 relevant hashtags.",
    facebook:
         "Conversational tone, punnchy opening line (Facebook truncates after ~2 lines in feed)." +
         "3-5 relevant hashtags.",

    x: "Punchy, direct tone. 280 characters MAX including hastags - this is a hard limit. " +
        "1-2 hastags only.",
};

const buildCaptionPrompt = (platform, topic) => {
    const instructions = CAPTION_INSTRUCTIONS[platform] || CAPTION_INSTRUCTIONS.linkedin;

    return (
        `You are a special media copywriter. Write a ${platform} post caption. \n\n` + 
        `Topic / draft from the user: ${topic}\n\n` +
        `Requirements:\n-${instructions}\n\n` +
        `Respond with ONLY this JSON object - no markdown, no code fences, no extra text:\n` +
        `{"caption": "the caption text", "hashtags": ["tag1", "tag2"]}`
    );
};

const parseCaptionResponse = (raw) => {
    const cleaned = raw 
      .trim()
      .replace(/^```(?:json)?s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

      try {
        const parsed = JSON.parse(cleaned);
        return {
            caption: String(parsed.caption ?? "").trim(),
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [],
        };
      } catch {

      }

const captionMatch = cleaned.match(/"caption"\s*:\s*"([\s\S]*?)"\s*,?\s*"hashtags"/);
const hashtagsMatch = cleaned.match(/"hashtags"\s*:\s*\[([\s\S]*?)\]/);

if (captionMatch) {
    return {
        caption: captionMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').trim(),
        hashtags: hashtagsMatch ? (hashtagsMatch[1].match(/"([^"]+)"/g) || []).map((t) => t.replace(/"/g, "")) : [],
    };
}

return { caption: cleaned, hashtags: []};
};

export const generateCaption = async ({ platform, topic}) => {
    if (!topic?.trim()){
        throw new AppError("Tell me what the post is about first", 400);
    }

    let response;
    try {
        response = await textAi.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: buildCaptionPrompt(platform, topic.trim()) }],
            max_tokens: 500,
            temperature: 0.75,
        });
    } catch (err) {
        throw new AppError(`AI caption generation failed: ${err.message}`, 502);
    }

    const raw = response.choices?.[0]?.message?.content ?? "";
    const result = parseCaptionResponse(raw);

    if(!result.caption){
        throw new AppError("AI returned an empty caption - try again", 502);
    }
    return result;
}


const IMAGE_SYSTEM_INSTRUCTIONS =
  "You are a commercial social-media graphic designer. Generate one ultra-realistic, " +
  "ready-to-publish image exactly as described in the prompt. If the prompt asks for any text " +
  "(headline, caption text, brand name), render it clearly, legibly, and spelled exactly as given — " +
  "never invent, omit, or duplicate text. Keep any text short — a few words per line. " +
  "Never render a product or subject floating or tilted unstably.";

export const generateImage = async ({ prompt }) => {
    if (!prompt?.trim()){
        throw new AppError("Describe the image you want first", 400);
    }

    let response;
    try {
        response = await imageAi.models.generateContent({
            model: IMAGE_MODEL,
            contents: [{ role: "user", parts: [{ text: prompt.trim() }] }],
            config: {
                responseModalities: ["TEXT", "IMAGE"],
                systemInstruction: IMAGE_SYSTEM_INSTRUCTIONS,
            },
        });
    } catch (err) {
        throw new AppError(`AI image generation failed: ${err.message}`, 502);
    }

    const imagePart = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

    if (!imagePart) {
        const finishReason = response.candidates?.[0]?.finishReason ?? "unknown";
        throw new AppError(`AI did not return an image (reason : ${finishReason})`, 502);
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const base64 = imagePart.inlineData.data;

    return { imageUrl: `data:${mimeType};base64,${base64}`};
};
