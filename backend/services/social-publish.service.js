import { getPublisher } from "../publishers/publisher.factory.js";

export const publishSocialPost = ({ platform, account, post }) => getPublisher(platform).publish({account, post });