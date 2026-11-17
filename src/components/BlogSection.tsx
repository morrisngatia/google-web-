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
    <div className="max-w-7xl mx-auto px-6 lg:px-[40px] py-[40px] space-y-[40px] bg-black text-white">
      
      {/* Blog Section Header */}
      <div className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase block mb-1">Nairobi Columns</span>
          <h2 className="text-[32px] font-bold font-display text-white leading-normal uppercase">THE STYLE JOURNAL</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0 font-sans">
          <BookOpen className="h-4 w-4 text-[#D4AF37]" />
          <span>Curated trends, artisan chronicles, and style guides.</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 border-b border-zinc-900">
        {(["All", "Fashion Tips", "Nairobi Trends", "Beauty Hacks"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap ${
              filter === cat
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 12-Column Magazine Grid with editorial-style blocks */}
      <div className="grid grid-cols-12 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="col-span-12 md:col-span-4 group flex flex-col justify-between bg-zinc-950 border border-zinc-900 hover:border-[#D4AF37]/20 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div
              onClick={() => setSelectedPost(post)}
              className="relative aspect-[3/2] bg-zinc-900 overflow-hidden cursor-pointer border-b border-zinc-900"
            >
              <img
                src={post.image}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15"></div>
              <span className="absolute top-3 left-3 bg-black/95 border border-[#D4AF37]/20 px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                {post.category}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono font-medium">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                {/* 20px Subheading */}
                <h3
                  onClick={() => setSelectedPost(post)}
                  className="text-[20px] font-semibold text-white hover:text-[#D4AF37] cursor-pointer line-clamp-2 transition-colors font-sans leading-normal"
                >
                  {post.title}
                </h3>
                
                {/* 16px Body with 24px line height */}
                <p className="font-sans text-[16px] font-normal leading-[24px] text-zinc-400 line-clamp-3">{post.excerpt}</p>
              </div>

              {/* clean dividers & author info */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">
                <span>By {post.author}</span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-[#D4AF37] font-bold tracking-widest flex items-center space-x-1 group cursor-pointer uppercase"
                >
                  <span>Read Post</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-[#D4AF37]" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* DETAILED ARTICLE READER DIALOG */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-900 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Article Top */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-[#D4AF37] font-mono uppercase font-bold">
                <span>{selectedPost.category}</span>
                <span>•</span>
                <span className="text-zinc-500">{selectedPost.date}</span>
                <span>•</span>
                <span className="text-zinc-500">{selectedPost.readTime}</span>
              </div>

              {/* 32px Main Headline in Article Reader */}
              <h2 className="text-[32px] font-bold font-display text-white tracking-tight leading-tight uppercase">
                {selectedPost.title}
              </h2>

              <div className="flex items-center space-x-3 border-b border-zinc-900 pb-4 text-xs text-zinc-400">
                <span>By <strong className="text-zinc-200">{selectedPost.author}</strong></span>
                <span>•</span>
                <button
                  onClick={() => onLikePost(selectedPost.id)}
                  className="flex items-center space-x-1.5 bg-zinc-900 px-3 py-1 border border-zinc-850 hover:border-[#D4AF37]/50 text-[#D4AF37]"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{selectedPost.likes} Likes</span>
                </button>
              </div>
            </div>

            {/* Article Image Banner */}
            <div className="aspect-[2/1] w-full overflow-hidden bg-zinc-900 border border-zinc-900">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Paragraphs (16px and 24px line height) */}
            <div className="space-y-5 text-[16px] font-normal leading-[24px] text-zinc-300 font-sans">
              {selectedPost.content.map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>

            {/* Comments Dialogue Section */}
            <div className="border-t border-zinc-900 pt-6 space-y-6">
              <h4 className="text-[20px] font-semibold text-white flex items-center space-x-2 font-sans">
                <MessageSquare className="h-5 w-5 text-[#D4AF37]" />
                <span>Comments ({selectedPost.comments.length})</span>
              </h4>

              {/* Comment submission form */}
              <div className="bg-zinc-950 p-6 border border-zinc-900 space-y-4">
                <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Add to the Conversation</h5>
                <form onSubmit={(e) => handleCommentSubmit(e, selectedPost.id)} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Shirleen W."
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-none p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Your Comment *</label>
                    <textarea
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts on this editorial..."
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-none p-2.5 text-white focus:outline-none resize-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-[#D4AF37] transition-all cursor-pointer"
                  >
                    Post Comment
                  </button>
                </form>
              </div>

              {/* Render existing comments */}
              <div className="space-y-4">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="p-5 bg-zinc-900/10 border border-zinc-900/60 rounded-none space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-500 font-mono">
                      <span className="font-bold text-zinc-300 flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                        {comment.author}
                      </span>
                      <span className="text-[10px]">{comment.date}</span>
                    </div>
                    <p className="font-sans text-[14px] text-zinc-400 italic">"{comment.text}"</p>
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
