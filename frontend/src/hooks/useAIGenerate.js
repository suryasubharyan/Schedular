import { useState } from "react";
import { generateCaptionAPI, generateImageAPI } from "../api/ai.api";
import { useNotification } from "./useNotification";

export function useAIGenerate(){
    const [generatingCaption, setGeneratingCaption] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const { showError } = useNotification();

    const generateCaption = async ({ platform, topic }) => {
        setGeneratingCaption(true);
        try {
            const { data } = await generateCaptionAPI({ platform, topic });
            return data;
        } catch (err) {
            showError(err?.response?.data?.error || "Couldn't generate a caption.Try again.");
            return null;
        } finally {
            setGeneratingCaption(false);
        }
    };

    const generateImage = async ({ prompt }) => {
        setGeneratingImage(true);
        try {
            const { data } = await generateImageAPI({ prompt });
            return data;
        } catch (err) {
            showError(err?.response?.data?.error || "Couldn't generate an image. Try again.");
            return null;
        } finally {
            setGeneratingImage(false);
        }
    };
    
    return { generateCaption, generatingCaption, generateImage, generatingImage }; 
}

export default useAIGenerate;