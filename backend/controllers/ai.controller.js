import { generateCaption as generateCaptionService, generateImage as generateImagesService } from "../services/ai.service.js";

export const generateCaption = async (req, res) => {
    try {
        const { platform = "linkedin" , topic } = req.body;
        const result = await generateCaptionService({ platform, topic });
        res.json({ success: true, ...result });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, error: error.message });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await generateImagesService({ prompt });
        res.json({ success: true, ...result});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, error: error.message });
    }
};