import LinkedInCard from "./postPreview/LinkedInCard";
import InstagramCard from "./postPreview/InstagramCard";
import FacebookCard from "./postPreview/FacebookCard";
import XCard from "./postPreview/XCard";

// Strategy + Factory: each platform owns its own preview card, and this
// registry picks the right one — the same pattern used on the backend for
// social publishing (see backend/publishers/publisher.factory.js).
const PLATFORM_CARDS = {
  linkedin: LinkedInCard,
  instagram: InstagramCard,
  facebook: FacebookCard,
  x: XCard,
};

export default function PostPreview({ post, profile, platform = "linkedin" }) {
  if (!post) return null;

  const Card = PLATFORM_CARDS[platform] || LinkedInCard;
  return <Card post={post} profile={profile} />;
}
