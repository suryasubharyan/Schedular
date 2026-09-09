import PostCard from "./PostCard";

export default function PostList({ posts, activeTab, search, onPostClick }) {
  if (!posts.length) {
    return (
      <div className="py-10 text-center text-slate-500 dark:text-slate-400">
        No {activeTab} posts found{search ? " for your search" : ""}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post._id} post={post} index={index} onClick={() => onPostClick(post)} />
      ))}
    </div>
  );
}
