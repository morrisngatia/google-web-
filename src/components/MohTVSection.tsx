import React, { useState, useEffect } from "react";
import { Play, Pause, ThumbsUp, MessageSquare, Flame, CheckCircle, Clock, Volume2, User, Send, Heart } from "lucide-react";
import { MohTVVideo } from "../data/mohtv";

interface MohTVSectionProps {
  videos: MohTVVideo[];
  onLikeVideo: (videoId: string) => void;
  onAddVideoComment: (videoId: string, author: string, comment: string) => void;
}

export default function MohTVSection({ videos, onLikeVideo, onAddVideoComment }: MohTVSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<MohTVVideo>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // starts at 30%
  const [category, setCategory] = useState<"All" | "Styling Masterclass" | "Behind The Brand" | "Beauty Tutorials">("All");

  // Comment Form state
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  // Video progress bar simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0; // restarts
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleVideoSelect = (v: MohTVVideo) => {
    setSelectedVideo(v);
    setIsPlaying(false);
    setProgress(0);
  };

  const handleLike = () => {
    onLikeVideo(selectedVideo.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    onAddVideoComment(selectedVideo.id, authorName.trim(), commentText.trim());
    setAuthorName("");
    setCommentText("");
  };

  const filteredVideos = videos.filter((v) => category === "All" || v.category === category);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10">
      {/* Moh TV Title Header */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Styling & Storytelling</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">MOH TV HUB</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0">
          <Flame className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
          <span>Learn styling tricks from Nairobi’s top artists</span>
        </div>
      </div>

      {/* Main Theatre Player Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Video Player & Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulated Screen */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-850 group shadow-2xl">
            {/* Visual Screen background */}
            <img
              src={selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-[1.01] transition-transform duration-700"
            />

            {/* Video overlay glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

            {/* Simulated Live status */}
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/80 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] text-amber-400 tracking-wider font-semibold uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Moh TV Tutorial</span>
            </div>

            <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-black/80 px-2.5 py-1 rounded-md text-[10px] text-zinc-400 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>{selectedVideo.duration}</span>
            </div>

            {/* Middle Play Button */}
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black flex items-center justify-center shadow-lg shadow-amber-400/20 hover:scale-110 active:scale-90 transition-transform duration-200 cursor-pointer"
              >
                <Play className="h-8 w-8 fill-current ml-1" />
              </button>
            )}

            {/* Play overlay controls */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 duration-300">
                <button
                  onClick={() => setIsPlaying(false)}
                  className="h-16 w-16 rounded-full bg-black/80 text-amber-400 border border-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
                >
                  <Pause className="h-8 w-8" />
                </button>
              </div>
            )}

            {/* Control Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
              {/* Progress timeline */}
              <div className="relative h-1 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Controls detail */}
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center space-x-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-amber-400 transition-colors cursor-pointer">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <Volume2 className="h-4 w-4 text-zinc-400" />
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {isPlaying ? `Streaming... ${Math.round(progress)}%` : "Paused"}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">{selectedVideo.views}</span>
              </div>
            </div>
          </div>

          {/* Video Description & Likes */}
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold font-mono">
                  {selectedVideo.category}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide mt-1">{selectedVideo.title}</h3>
              </div>
              <button
                onClick={handleLike}
                className="px-4 py-2 bg-zinc-900 hover:bg-amber-500/10 border border-zinc-850 hover:border-amber-500/30 text-zinc-300 hover:text-amber-400 font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all duration-200 shrink-0 cursor-pointer"
              >
                <ThumbsUp className="h-4 w-4 text-amber-400" />
                <span>{selectedVideo.likes} Likes</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">{selectedVideo.description}</p>
          </div>
        </div>

        {/* Interactive Comments & Discussions */}
        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-6 flex flex-col h-[400px] sm:h-[480px] lg:h-[35rem] shadow-xl">
            <h3 className="text-sm font-semibold font-display text-white border-b border-zinc-900 pb-3 flex items-center space-x-2">
              <MessageSquare className="h-4.5 w-4.5 text-amber-500" />
              <span>Audience Discourse ({selectedVideo.comments.length})</span>
            </h3>

            {/* List of Comments */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
              {selectedVideo.comments.map((comment, index) => (
                <div key={index} className="space-y-1.5 text-xs bg-zinc-900/30 p-3 rounded-xl border border-zinc-900">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-semibold text-zinc-300 flex items-center">
                      <User className="h-3 w-3 mr-1 text-zinc-500" />
                      {comment.author}
                    </span>
                    <span className="text-[9px] font-mono">{comment.date}</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Post comment form */}
            <form onSubmit={handleCommentSubmit} className="border-t border-zinc-900 pt-3 space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name..."
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white focus:outline-none text-xs"
                />
                <button
                  type="submit"
                  className="py-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-350 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Comment</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Join the discussion..."
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white focus:outline-none text-xs"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-display text-white">UP NEXT</h3>
        {/* Playlists filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5">
          {(["All", "Styling Masterclass", "Behind The Brand", "Beauty Tutorials"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                category === cat
                  ? "bg-amber-400 text-black"
                  : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((v) => (
            <div
              key={v.id}
              onClick={() => handleVideoSelect(v)}
              className={`group flex items-start space-x-4 p-4 rounded-2xl border bg-zinc-950 hover:bg-zinc-900/60 cursor-pointer transition-all ${
                selectedVideo.id === v.id
                  ? "border-amber-500/40 bg-zinc-900/40"
                  : "border-zinc-900 hover:border-zinc-800"
              }`}
            >
              <div className="relative aspect-video w-28 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-900">
                <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="h-5 w-5 text-amber-400 fill-current opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
                <span className="absolute bottom-1 right-1 bg-black/90 px-1 py-0.5 rounded text-[8px] text-zinc-400 font-mono">
                  {v.duration}
                </span>
              </div>

              <div className="space-y-1 overflow-hidden">
                <span className="text-[8px] text-amber-500 font-mono uppercase tracking-widest">{v.category}</span>
                <h4 className="font-semibold text-xs text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                  {v.title}
                </h4>
                <span className="text-[10px] text-zinc-500 block font-mono">{v.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
