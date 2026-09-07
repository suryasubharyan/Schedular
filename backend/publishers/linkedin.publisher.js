import { createLinkedInPost } from '../services/linkedin.service.js';

export const linkedinPublisher = {
    publish: async ({ account, post }) => {
        const publishedUrl = await createLinkedInPost({
            accessToken: account.accessToken,
            linkedinId: account.linkedinId || account.platformUserId,
            content: post.content,
            imageUrls:  post.imageUrls || [],
            videoUrl: post.videoUrl,
        });

        return {
            publishedUrl, 
            linkedInUrl: publishedUrl,
        };
    }
}

