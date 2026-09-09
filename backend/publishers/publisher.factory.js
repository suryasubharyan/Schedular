import { linkedinPublisher } from "./linkedin.publisher.js";
import { demoPublisher } from "./demo.publisher.js";

const registry = {
  linkedin: linkedinPublisher,
};

export const getPublisher = (platform) => registry[platform] ?? demoPublisher;
