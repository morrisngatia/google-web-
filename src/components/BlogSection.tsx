import React, { useState } from "react";
import { BookOpen, ThumbsUp, MessageSquare, Clock, ArrowRight, X, Send, User, ChevronRight } from "lucide-react";
import { BlogPost } from "../data/blog";

interface BlogSectionProps {
  posts: BlogPost[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, author: string, text: string) => void;
  selectedPost: BlogPost | null;
  setSelectedPost: (p: BlogPost | null) => void;
}

export default function BlogSection({ posts, onLikePost, onAddComment, selectedPost, setSelectedPost }: BlogSectionProps) {
  const [filter, setFilter] = useState<"All" | "Fashion Tips" | "Nairobi Trends" | "Beauty Hacks">("All");
  
  // Comment writer inside detailed post
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  const filteredPosts = posts.filter((p) => filter === "All" || p.category === filter);

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!author.trim() || !commentText.trim()) return;

    onAddComment(postId, author.trim(), commentText.trim());
    setAuthor("");
    setCommentText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10">
      {/* Blog Section Header */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Nairobi Editorial</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">STYLE JOURNAL & BLOG</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0">
          <BookOpen className="h-4.5 w-4.5 text-amber-500" />
          <span>Fashion tips, Nairobi trends, and beauty hacks</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {(["All", "Fashion Tips", "Nairobi Trends", "Beauty Hacks"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === cat
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/10"
                : "bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Magazine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col justify-between bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900 hover:border-amber-500/20 transition-all duration-300 shadow-xl"
          >
            {/* Thumbnail */}
            <div
              onClick={() => setSelectedPost(post)}
              className="relative aspect-video bg-zinc-900 overflow-hidden cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
              <span className="absolute bottom-3 left-3 bg-black/80 border border-amber-500/20 px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-amber-400 font-semibold font-mono">
                {post.category}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3
                  onClick={() => setSelectedPost(post)}
                  className="text-md font-bold text-white hover:text-amber-400 cursor-pointer line-clamp-2 transition-colors font-display tracking-wide"
                >
                  {post.title}
                </h3>
                
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>

              {/* Footer specs */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
                <span>By {post.author}</span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-amber-400 font-semibold tracking-wider flex items-center space-x-1 group cursor-pointer"
                >
                  <span>Read Article</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* DETAILED ARTICLE READER DIALOG */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-850 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Article Top */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-amber-400 font-mono uppercase font-bold">
                <span>{selectedPost.category}</span>
                <span>•</span>
                <span className="text-zinc-500">{selectedPost.date}</span>
                <span>•</span>
                <span className="text-zinc-500">{selectedPost.readTime}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-wide leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center space-x-3 border-b border-zinc-900 pb-4 text-xs text-zinc-400">
                <span>By <strong className="text-zinc-200">{selectedPost.author}</strong></span>
                <span>•</span>
                <button
                  onClick={() => onLikePost(selectedPost.id)}
                  className="flex items-center space-x-1 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-850 hover:border-amber-500/30 text-amber-400 hover:scale-105 duration-200"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{selectedPost.likes} Likes</span>
                </button>
              </div>
            </div>

            {/* Article Image Banner */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-none prose prose-invert">
              {selectedPost.content.map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>

            {/* Comments Dialogue Section */}
            <div className="border-t border-zinc-900 pt-6 space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500 flex items-center space-x-2 font-display">
                <MessageSquare className="h-4 w-4" />
                <span>Article Comments ({selectedPost.comments.length})</span>
              </h4>

              {/* Comment submission form */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 space-y-3">
                <h5 className="text-[11px] font-semibold text-zinc-300">Add to the Conversation</h5>
                <form onSubmit={(e) => handleCommentSubmit(e, selectedPost.id)} className="space-y-3 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-zinc-500">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g., Shirleen W."
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500">Your Comment *</label>
                    <textarea
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts on this editorial..."
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded hover:scale-105 active:scale-95 duration-150 cursor-pointer"
                  >
                    Post Comment
                  </button>
                </form>
              </div>

              {/* Render existing comments */}
              <div className="space-y-4">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="p-4 bg-zinc-900/10 border border-zinc-900/60 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="font-semibold text-zinc-300 flex items-center">
                        <User className="h-3 w-3 mr-1 text-zinc-400" />
                        {comment.author}
                      </span>
                      <span className="text-[10px] font-mono">{comment.date}</span>
                    </div>
                    <p className="text-zinc-400 italic">"{comment.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
