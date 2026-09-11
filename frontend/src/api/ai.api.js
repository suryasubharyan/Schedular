import axios from "./axios";

export const generateCaptionAPI = ({ platform, topic }) => {
    return axios.post("/api/ai/caption", { platform, topic });
}

export const generateImageAPI = ({ prompt }) => {
    return axios.post("/api/ai/image", { prompt });
}