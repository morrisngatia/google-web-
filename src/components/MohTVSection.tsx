import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { 
  Play, Pause, ThumbsUp, MessageSquare, Flame, CheckCircle, 
  Clock, Volume2, User, Send, Heart, Radio, Tv, Instagram, 
  ExternalLink, Globe, Music, VolumeX, Sparkles, AlertCircle 
} from "lucide-react";
import { 
  MohTVVideo, KENYA_TV_CHANNELS, KENYA_RADIO_STATIONS, 
  MOH_INSTAGRAM_PROFILE, KenyaTVChannel, KenyaRadioStation 
} from "../data/mohtv";

interface MohTVSectionProps {
  videos: MohTVVideo[];
  onLikeVideo: (videoId: string) => void;
  onAddVideoComment: (videoId: string, author: string, comment: string) => void;
}

export default function MohTVSection({ videos, onLikeVideo, onAddVideoComment }: MohTVSectionProps) {
  // --- TAB 1: MOH ORIGINALS STATES ---
  const [selectedVideo, setSelectedVideo] = useState<MohTVVideo>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // starts at 30%
  const [videoCategory, setVideoCategory] = useState<"All" | "Styling Masterclass" | "Behind The Brand" | "Beauty Tutorials">("All");

  // --- TAB 2: KENYA LIVE TV STATES ---
  const [selectedTv, setSelectedTv] = useState<KenyaTVChannel>(KENYA_TV_CHANNELS[0]);
  const [tvError, setTvError] = useState(false);

  // --- TAB 3: KENYA LIVE RADIO STATES ---
  const [selectedRadio, setSelectedRadio] = useState<KenyaRadioStation>(KENYA_RADIO_STATIONS[0]);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [isRadioMuted, setIsRadioMuted] = useState(false);
  const [radioVolume, setRadioVolume] = useState(0.5);
  const [isTuning, setIsTuning] = useState(false);

  // Comment Form state
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  // --- TAB 4: GLOBAL IPTV STATES ---
  const [activeTab, setActiveTab] = useState<"originals" | "tv" | "radio" | "iptv">("originals");
  const [iptvStreams, setIptvStreams] = useState<any[]>([]);
  const [selectedIptv, setSelectedIptv] = useState<any>(null);
  const [iptvSearch, setIptvSearch] = useState("");
  const [selectedIptvCountry, setSelectedIptvCountry] = useState("");
  const [selectedIptvCategory, setSelectedIptvCategory] = useState("");
  const [iptvLoading, setIptvLoading] = useState(false);
  const [iptvStatus, setIptvStatus] = useState<any>(null);
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [iptvErrorStr, setIptvErrorStr] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const tvVideoRef = useRef<HTMLVideoElement | null>(null);
  const tvHlsRef = useRef<Hls | null>(null);

  const fetchIptvFilters = async () => {
    try {
      const [countriesRes, categoriesRes] = await Promise.all([
        fetch("/api/iptv/countries").then(r => r.json()),
        fetch("/api/iptv/categories").then(r => r.json())
      ]);
      setAvailableCountries(countriesRes || []);
      setAvailableCategories(categoriesRes || []);
    } catch (e) {
      console.error("Failed to load IPTV filters", e);
    }
  };

  const fetchIptvSearch = async (query = "", country = "", category = "") => {
    setIptvLoading(true);
    setIptvErrorStr(null);
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (country) params.append("country", country);
      if (category) params.append("category", category);
      params.append("limit", "150");

      const res = await fetch(`/api/iptv/search?${params.toString()}`).then(r => r.json());
      setIptvStreams(res.results || []);
      if (res.results && res.results.length > 0) {
        setSelectedIptv(res.results[0]);
      } else {
        setSelectedIptv(null);
      }
    } catch (e: any) {
      console.error("Failed to search IPTV channels", e);
      setIptvErrorStr("Failed to load IPTV channels. Please check connection.");
    } finally {
      setIptvLoading(false);
    }
  };

  // Poll IPTV status on mount/tab switch
  useEffect(() => {
    let interval: any;
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/iptv/status").then(r => r.json());
        setIptvStatus(res);
        if (res.loaded) {
          clearInterval(interval);
          fetchIptvFilters();
          fetchIptvSearch(iptvSearch, selectedIptvCountry, selectedIptvCategory);
        }
      } catch (e) {
        console.error("Failed to get IPTV status", e);
      }
    };

    if (activeTab === "iptv") {
      checkStatus();
      interval = setInterval(checkStatus, 3000);
    }

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "iptv" && iptvStatus?.loaded) {
      const delayDebounceFn = setTimeout(() => {
        fetchIptvSearch(iptvSearch, selectedIptvCountry, selectedIptvCategory);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [iptvSearch, selectedIptvCountry, selectedIptvCategory, activeTab]);

  useEffect(() => {
    if (!selectedIptv || activeTab !== "iptv") {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let isUsingProxy = false;

    const playStream = (url: string, useProxy: boolean = false) => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const finalUrl = useProxy ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = finalUrl;
        video.play().catch(err => console.warn("Native HLS play prevented:", err));
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          liveSyncDurationCount: 2,
          enableWorker: true
        });
        hlsRef.current = hls;
        hls.loadSource(finalUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => console.warn("HLS Play prevented:", err));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (!useProxy && !isUsingProxy) {
              console.log("Direct load failed, trying proxy fallback for IPTV:", url);
              isUsingProxy = true;
              playStream(url, true);
            } else {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  hlsRef.current = null;
                  break;
              }
            }
          }
        });
      }
    };

    playStream(selectedIptv.url, false);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedIptv, activeTab]);

  useEffect(() => {
    if (!selectedTv || !selectedTv.streamUrl || activeTab !== "tv") {
      if (tvHlsRef.current) {
        tvHlsRef.current.destroy();
        tvHlsRef.current = null;
      }
      return;
    }

    const video = tvVideoRef.current;
    if (!video) return;

    if (tvHlsRef.current) {
      tvHlsRef.current.destroy();
      tvHlsRef.current = null;
    }

    let isUsingProxy = false;

    const playStream = (url: string, useProxy: boolean = false) => {
      if (tvHlsRef.current) {
        tvHlsRef.current.destroy();
        tvHlsRef.current = null;
      }

      const finalUrl = useProxy ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = finalUrl;
        video.play().catch(err => console.warn("Native TV HLS play prevented:", err));
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          liveSyncDurationCount: 2,
          enableWorker: true
        });
        tvHlsRef.current = hls;
        hls.loadSource(finalUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => console.warn("TV HLS Play prevented:", err));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (!useProxy && !isUsingProxy) {
              console.log("Direct load failed, trying proxy fallback for Kenya TV:", url);
              isUsingProxy = true;
              playStream(url, true);
            } else {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  tvHlsRef.current = null;
                  break;
              }
            }
          }
        });
      }
    };

    playStream(selectedTv.streamUrl, false);

    return () => {
      if (tvHlsRef.current) {
        tvHlsRef.current.destroy();
        tvHlsRef.current = null;
      }
    };
  }, [selectedTv, activeTab]);

  // --- REAL LIVE ONLINE RADIO STREAMING WITH SYNTH FALLBACK ---
  const [isRadioLoading, setIsRadioLoading] = useState(false);
  const [radioError, setRadioError] = useState<string | null>(null);
  const [isSynthFallback, setIsSynthFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synthesizer Audio Context Refs for Live Radio simulation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const staticOscRef = useRef<OscillatorNode | null>(null);
  const melodyIntervalRef = useRef<any>(null);

  // Video progress bar simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying && activeTab === "originals") {
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
  }, [isPlaying, activeTab]);

  // Handle Web Audio events & streaming lifecycle
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsRadioLoading(true);
      setRadioError(null);
    };

    const handleCanPlay = () => {
      setIsRadioLoading(false);
    };

    const handleWaiting = () => {
      setIsRadioLoading(true);
    };

    const handlePlaying = () => {
      setIsRadioLoading(false);
      setRadioError(null);
    };

    const handleError = (e: any) => {
      setIsRadioLoading(false);
      console.warn("Radio stream direct playback issue:", e);
      // Automatically switch to beautiful synthesized backup so it never fails!
      setIsSynthFallback(true);
      setRadioError(null);
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);

    // Set initial configuration
    audio.preload = "none";

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const startSynth = () => {
    try {
      stopSynth(); // clean up any running instances
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isRadioMuted ? 0 : radioVolume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Filter for warm retro analog feel
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(1000, ctx.currentTime);
      lowpass.connect(masterGain);

      // Main Melody Oscillator
      const osc = ctx.createOscillator();
      osc.type = "sine";
      
      // Parse numeric frequency value to create unique tone frequency
      const freqNum = parseFloat(selectedRadio.frequency) || 90.0;
      const baseFreq = 90 + (freqNum - 80) * 4;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.connect(lowpass);
      osc.start();
      oscRef.current = osc;

      // Soft radio static/crackle (soft triangle at low gain)
      const staticOsc = ctx.createOscillator();
      staticOsc.type = "triangle";
      staticOsc.frequency.setValueAtTime(75, ctx.currentTime);
      
      const staticGain = ctx.createGain();
      staticGain.gain.setValueAtTime(isRadioMuted ? 0 : 0.012, ctx.currentTime);
      staticOsc.connect(staticGain);
      staticGain.connect(masterGain);
      staticOsc.start();
      staticOscRef.current = staticOsc;

      // Rhythmic retro scale sequence
      let noteIndex = 0;
      const scale = [1, 1.2, 1.25, 1.5, 1.6, 1.875, 2];
      melodyIntervalRef.current = setInterval(() => {
        if (!osc || ctx.state === "closed") return;
        const multiplier = scale[noteIndex % scale.length];
        const nextFreq = baseFreq * multiplier;
        
        // Glide frequency beautifully
        osc.frequency.exponentialRampToValueAtTime(nextFreq, ctx.currentTime + 0.35);
        noteIndex++;
      }, 1500);

    } catch (e) {
      console.warn("Web Audio API not fully initialized or supported:", e);
    }
  };

  const stopSynth = () => {
    if (melodyIntervalRef.current) {
      clearInterval(melodyIntervalRef.current);
      melodyIntervalRef.current = null;
    }
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch (e) {}
      oscRef.current = null;
    }
    if (staticOscRef.current) {
      try { staticOscRef.current.stop(); } catch (e) {}
      staticOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // Sync Audio source, playback state, volume & muting
  useEffect(() => {
    const audio = audioRef.current;

    if (activeTab !== "radio") {
      if (isRadioPlaying) {
        setIsRadioPlaying(false);
      }
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      stopSynth();
      return;
    }

    if (isRadioPlaying && !isTuning) {
      if (isSynthFallback) {
        // Stop audio stream to preserve connections/bandwidth
        if (audio) {
          audio.pause();
          audio.src = "";
        }
        // Run synthesizer audio
        startSynth();
      } else {
        // Stop synthesizer
        stopSynth();

        if (audio) {
          const currentSrc = audio.src;
          // Compare src to make sure we don't reload if the URL matches
          if (!currentSrc || !currentSrc.includes(selectedRadio.streamUrl)) {
            setIsRadioLoading(true);
            audio.src = selectedRadio.streamUrl;
            audio.load();
          }
          
          audio.volume = isRadioMuted ? 0 : radioVolume;
          
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Playback prevented or failed, auto-triggering synth fallback:", err);
              setIsSynthFallback(true);
            });
          }
        }
      }
    } else {
      if (audio) {
        audio.pause();
        // Nullify source to release connection resources & buffer memory
        audio.src = "";
      }
      stopSynth();
    }
  }, [isRadioPlaying, isRadioMuted, radioVolume, selectedRadio, activeTab, isTuning, isSynthFallback]);

  // Adjust volume dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isRadioMuted ? 0 : radioVolume;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isRadioMuted ? 0 : radioVolume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [radioVolume, isRadioMuted]);

  const handleTuningStation = (radio: KenyaRadioStation) => {
    setIsTuning(true);
    setRadioError(null);
    setIsSynthFallback(false); // Try to connect to live stream on new station select
    setSelectedRadio(radio);
    
    // Simulate mechanical dial spin & antenna sync
    setTimeout(() => {
      setIsTuning(false);
    }, 700);
  };

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

  const filteredVideos = videos.filter((v) => videoCategory === "All" || v.category === videoCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-[40px] py-[40px] space-y-[40px] bg-black text-white">
      {/* Moh TV Title Header */}
      <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase block mb-1">Styling & Storytelling</span>
          <h2 className="text-[32px] font-bold font-display text-white leading-normal uppercase">MOH TV HUB</h2>
        </div>

        {/* Navigation Tabs - Modern Gold Accent */}
        <div className="flex bg-zinc-950 p-1.5 border border-zinc-900 self-start md:self-auto font-sans">
          <button
            onClick={() => { setActiveTab("originals"); setIsRadioPlaying(false); }}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "originals"
                ? "bg-[#D4AF37] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Moh Originals</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("tv"); setIsRadioPlaying(false); }}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "tv"
                ? "bg-[#D4AF37] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tv className="h-3.5 w-3.5" />
            <span>Live Kenya TV</span>
          </button>

          <button
            onClick={() => { setActiveTab("radio"); }}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "radio"
                ? "bg-[#D4AF37] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Kenya Radio</span>
          </button>

          <button
            onClick={() => { setActiveTab("iptv"); setIsRadioPlaying(false); }}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "iptv"
                ? "bg-[#D4AF37] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Global IPTV Live</span>
          </button>
        </div>
      </div>

      {/* Main Theatre Player Layout inside 12-column template */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* ================= LEFT MAIN PLAYER AREA (8 Columns) ================= */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* TAB 1: MOH ORIGINALS PLAYER */}
          {activeTab === "originals" && (
            <div className="space-y-6">
              {/* Simulated Screen */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-850 group shadow-2xl">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-[1.01] transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

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
                      className="h-16 w-16 rounded-full bg-black/80 text-amber-400 border border-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    >
                      <Pause className="h-8 w-8" />
                    </button>
                  </div>
                )}

                {/* Control Bar */}
                <div className="absolute bottom-0 inset-x-0 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="relative h-1 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

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
          )}

          {/* TAB 2: KENYA LIVE TV PLAYER */}
          {activeTab === "tv" && (
            <div className="space-y-6">
              {/* Stream container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-850 shadow-2xl">
                {selectedTv.streamUrl ? (
                  <video
                    ref={tvVideoRef}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                    controls
                    playsInline
                    autoPlay
                  />
                ) : !tvError ? (
                  <iframe
                    src={`https://www.youtube.com/embed/live_stream?channel=${selectedTv.channelId}`}
                    title={selectedTv.name}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onError={() => setTvError(true)}
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-red-500 animate-bounce" />
                    <h4 className="font-bold text-white text-sm">Direct Iframe Loading Restricted</h4>
                    <p className="text-xs text-zinc-400 max-w-sm">Some networks limit third-party embeds in preview sandboxes. You can stream this channel live directly in an optimized external window.</p>
                  </div>
                )}

                {/* Simulated Overlays */}
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 border border-red-500 px-3 py-1 rounded-full text-[10px] text-white tracking-wider font-extrabold uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                  <span>LIVE BROADCAST</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/85 px-3 py-1 rounded text-[10px] text-zinc-300 font-semibold font-mono">
                  {selectedTv.viewsCount}
                </div>
              </div>

              {/* Channel Detail */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${selectedTv.logoColor} flex items-center justify-center font-bold text-white text-xs shadow-md`}>
                      {selectedTv.name.substring(0, 2)}
                    </div>
                    <div>
                      <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold font-mono flex items-center space-x-1">
                        <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                        <span>Kenya National Feed</span>
                      </span>
                      <h3 className="text-xl font-bold text-white tracking-wide mt-0.5">{selectedTv.name}</h3>
                    </div>
                  </div>

                  {/* YouTube Live Action Button or Premium HLS Player badge */}
                  {selectedTv.streamUrl ? (
                    <div className="flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2.5 rounded-xl text-xs text-[#D4AF37] font-semibold">
                      <Sparkles className="h-4 w-4 animate-pulse text-[#D4AF37]" />
                      <span>Ultra HD Native Player Active</span>
                    </div>
                  ) : (
                    <a
                      href={`https://www.youtube.com/channel/${selectedTv.channelId}/live`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105 active:scale-95 text-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Watch on YouTube Live</span>
                    </a>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{selectedTv.tagline}</p>
                
                {/* Station Selection helper for all screens */}
                <div className="pt-4 border-t border-zinc-900 space-y-3">
                  <span className="block text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Change TV Station (Kenyan Live Streams)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {KENYA_TV_CHANNELS.map((tv) => (
                      <button
                        key={tv.id}
                        onClick={() => { setSelectedTv(tv); setTvError(false); }}
                        className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                          selectedTv.id === tv.id
                            ? "bg-zinc-900 border-amber-500/50 text-amber-400"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold text-[11px] truncate">{tv.name}</div>
                        <div className="text-[8px] text-zinc-500 truncate font-mono">{tv.viewsCount}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KENYA LIVE RADIO TUNER */}
          {activeTab === "radio" && (
            <div className="space-y-6">
              {/* Premium Retro Radio Tuner Dashboard */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-2xl relative overflow-hidden space-y-6">
                {/* Ambient glow in background matching current station */}
                <div 
                  className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
                  style={{ backgroundColor: selectedRadio.accentColor }}
                ></div>

                {/* Radio Header */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center space-x-2">
                    <Radio className="h-5 w-5 text-amber-500 animate-pulse" />
                    <span className="text-xs font-bold font-mono tracking-widest text-zinc-300 uppercase">KENYA DIGITAL FM RECEIVER</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full text-[9px] text-emerald-400 font-bold uppercase tracking-widest font-mono">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>Antenna Locked</span>
                  </div>
                </div>

                {/* LCD Screen Display */}
                <div className="bg-black/95 p-6 rounded-xl border-2 border-zinc-850 font-mono text-center relative overflow-hidden shadow-inner">
                  {/* Grid background lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none"></div>

                  {isTuning ? (
                    <div className="h-32 flex flex-col items-center justify-center space-y-2">
                      <div className="text-amber-500 animate-pulse text-sm tracking-widest font-bold uppercase">TUNING FREQUENCY...</div>
                      <div className="text-[10px] text-zinc-500 font-mono">LOCKING CARRIER WAVE...</div>
                      <div className="w-48 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                        <div className="bg-amber-500 h-full w-full animate-pulse origin-left"></div>
                      </div>
                    </div>
                  ) : radioError ? (
                    <div className="h-32 flex flex-col items-center justify-center space-y-2 text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 animate-bounce" />
                      <div className="text-red-500 text-xs font-bold uppercase">{radioError}</div>
                      <div className="text-[9px] text-zinc-500 max-w-xs font-mono">Try switching presets or check your internet link.</div>
                    </div>
                  ) : isRadioLoading ? (
                    <div className="h-32 flex flex-col items-center justify-center space-y-2">
                      <div className="text-amber-400 animate-pulse text-xs tracking-widest font-bold uppercase">BUFFERING DIGITAL FEED...</div>
                      <div className="text-[10px] text-zinc-500 font-mono">ESTABLISHING HTTPS HANDSHAKE</div>
                      <div className="w-32 bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-full animate-pulse origin-left"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Live station information */}
                      <div className="flex justify-between items-center text-zinc-500 text-[10px]">
                        <span className="flex items-center space-x-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${isRadioPlaying && !isRadioMuted ? (isSynthFallback ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-ping") : "bg-zinc-600"}`}></span>
                          <span>{isRadioPlaying && !isRadioMuted ? (isSynthFallback ? "ANALOG SYNTH FALLBACK ACTIVE" : "LIVE STREAM ACTIVE") : "RECEIVER READY"}</span>
                        </span>
                        <span style={{ color: selectedRadio.accentColor }} className="font-bold">STATION ID: {selectedRadio.id.toUpperCase()}</span>
                      </div>
 
                       {/* Giant Frequency readout */}
                       <div className="py-1.5 flex items-baseline justify-center space-x-2">
                         <span 
                           className="text-4xl md:text-5xl font-extrabold tracking-tight transition-all duration-300 drop-shadow"
                           style={{ color: selectedRadio.accentColor }}
                         >
                           {selectedRadio.frequency.split(" ")[0]}
                         </span>
                         <span className="text-zinc-400 text-xs font-semibold">{selectedRadio.frequency.split(" ")[1]}</span>
                       </div>
 
                       {/* Moving marquee for current show */}
                       <div className="bg-zinc-950 p-2 rounded border border-zinc-900 overflow-hidden text-center text-xs">
                         <span className="text-emerald-400 font-bold block animate-pulse">
                           📻 NOW ON-AIR: "{selectedRadio.currentShow}"
                         </span>
                         <span className="text-zinc-400 text-[10px] block mt-1">
                           Hosted by: {selectedRadio.presenters}
                         </span>
                       </div>

                       {isSynthFallback && (
                         <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 py-1.5 px-3 rounded-lg text-[10px] text-center font-mono leading-tight">
                           ⚠️ Secure Connection Blocked / Live Feed Offline. Synthesizing gorgeous retro analogue audio.
                         </div>
                       )}
 
                       {/* Equalizer Visualizer Bars */}
                       <div className="h-8 flex items-end justify-center space-x-1 pt-2">
                         {Array.from({ length: 24 }).map((_, index) => {
                           const animationDuration = 0.4 + Math.random() * 0.6;
                           const isActive = isRadioPlaying && !isRadioMuted && !isRadioLoading && !radioError;
                           return (
                             <div
                               key={index}
                               className="w-1.5 rounded-t transition-all duration-200"
                               style={{
                                 backgroundColor: isActive ? selectedRadio.accentColor : "#27272a",
                                 height: isActive ? `${15 + Math.random() * 85}%` : "15%",
                                 animation: isActive ? `pulse-bar ${animationDuration}s ease-in-out infinite alternate` : "none"
                               }}
                             ></div>
                           );
                         })}
                       </div>
                     </div>
                   )}
                 </div>
 
                 {/* Receiver Tuner Controls */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                   {/* Synthesis / Audio activation button */}
                   <div className="flex flex-col space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] text-zinc-400 font-semibold font-mono">RECEIVER HEADPHONES FEED</span>
                       <span className={`text-[9px] px-2 py-0.5 rounded font-mono border ${
                         isSynthFallback 
                           ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                           : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                       }`}>
                         {isSynthFallback ? "Analog Synthesizer Fallback" : "Live Digital Feed"}
                       </span>
                     </div>
 
                     <div className="flex items-center space-x-3">
                       <button
                         onClick={() => setIsRadioPlaying(!isRadioPlaying)}
                         className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                           isRadioPlaying
                             ? "bg-red-500 hover:bg-red-400 text-white"
                             : "bg-amber-400 hover:bg-amber-350 text-black shadow-lg shadow-amber-400/10"
                         }`}
                       >
                         {isRadioPlaying ? (
                           <>
                             <Pause className="h-4 w-4" />
                             <span>Stop Receiver Audio</span>
                           </>
                         ) : (
                           <>
                             <Play className="h-4 w-4 fill-current" />
                             <span>Start Receiver Audio</span>
                           </>
                         )}
                       </button>

                       {isRadioPlaying && (
                         <button
                           onClick={() => setIsSynthFallback(!isSynthFallback)}
                           title="Toggle between Live Stream and Retro Synthesizer"
                           className="px-3 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                         >
                           <Music className="h-4 w-4 text-amber-500" />
                           <span className="hidden sm:inline font-mono">{isSynthFallback ? "Use Live Stream" : "Use Retro Synth"}</span>
                         </button>
                       )}
 
                       <button
                         onClick={() => setIsRadioMuted(!isRadioMuted)}
                         disabled={!isRadioPlaying}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          !isRadioPlaying 
                            ? "border-zinc-900 bg-zinc-950 text-zinc-700 cursor-not-allowed"
                            : isRadioMuted 
                              ? "bg-red-500/15 border-red-500/30 text-red-400" 
                              : "bg-zinc-900 border-zinc-850 text-zinc-300 hover:text-white"
                        }`}
                      >
                        {isRadioMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Volume Knob Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span>AUDIO GAIN LEVEL</span>
                      <span>{Math.round(radioVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-900">
                      <Volume2 className="h-4 w-4 text-zinc-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={radioVolume}
                        onChange={(e) => setRadioVolume(parseFloat(e.target.value))}
                        disabled={!isRadioPlaying}
                        className="flex-1 accent-amber-500 h-1 bg-zinc-800 rounded-full cursor-pointer disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>

                {/* Fine tuning stations at the bottom */}
                <div className="pt-2 border-t border-zinc-900 space-y-3">
                  <span className="block text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Fast-Dial Radio Presets (Kenyan Market)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {KENYA_RADIO_STATIONS.map((radio) => {
                      const isSelected = selectedRadio.id === radio.id;
                      return (
                        <button
                          key={radio.id}
                          onClick={() => handleTuningStation(radio)}
                          className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-900/30 border-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                          }`}
                          style={{
                            borderColor: isSelected ? radio.accentColor + "50" : ""
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs">{radio.name}</span>
                            <span 
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold"
                              style={{
                                backgroundColor: isSelected ? radio.accentColor + "20" : "rgba(39,39,42,0.6)",
                                color: isSelected ? radio.accentColor : "#a1a1aa"
                              }}
                            >
                              {radio.frequency}
                            </span>
                          </div>
                          <span className="text-[8px] text-zinc-500 truncate block mt-1">{radio.tagline}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLOBAL IPTV PLAYER */}
          {activeTab === "iptv" && (
            <div className="space-y-6">
              {/* LCD-style Live Screen */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-2xl">
                {selectedIptv ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                    controls
                    playsInline
                    autoPlay
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-zinc-950">
                    <Tv className="h-12 w-12 text-zinc-700 animate-pulse" />
                    <h4 className="font-bold text-zinc-400 text-sm">No Stream Selected</h4>
                    <p className="text-xs text-zinc-600 max-w-sm">Select any live channel from the sidebar guide to tune in.</p>
                  </div>
                )}

                {/* Simulated Overlay Badge */}
                {selectedIptv && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-[#D4AF37] border border-amber-400 px-3 py-1 rounded-full text-[10px] text-black tracking-wider font-extrabold uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                    <span>LIVE IPTV FEED</span>
                  </div>
                )}

                {/* Quality badge */}
                {selectedIptv && selectedIptv.quality && (
                  <div className="absolute bottom-4 right-4 bg-black/85 px-3 py-1 rounded text-[10px] text-[#D4AF37] font-bold font-mono">
                    {selectedIptv.quality}
                  </div>
                )}
              </div>

              {/* Selected Channel Metadata */}
              {selectedIptv && (
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 space-y-4 shadow-xl animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      {selectedIptv.logo ? (
                        <img 
                          src={selectedIptv.logo} 
                          alt={selectedIptv.name} 
                          className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 object-contain p-1 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold font-mono bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                            {selectedIptv.country || "Global"}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-mono capitalize">
                            {selectedIptv.categories.join(", ")}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide mt-1.5">{selectedIptv.name}</h3>
                      </div>
                    </div>

                    {selectedIptv.website && (
                      <a
                        href={selectedIptv.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold text-xs rounded-xl flex items-center space-x-2 transition-all duration-200 shrink-0 cursor-pointer justify-center"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-mono break-all">
                    Stream URL: <span className="text-zinc-500">{selectedIptv.url}</span>
                  </p>

                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-[10px] text-amber-400 leading-relaxed">
                    ⚠️ <strong>Streaming Note:</strong> IPTV streams are external and hosted by respective television networks. If a stream fails, it might be due to geo-restriction, mixed content rules, or temporarily offline status. Try selecting another channel or country filter from the search interface.
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ================= RIGHT SIDEBAR AREA (INSTAGRAM & DISCOURSE / IPTV GUIDE) (4 Columns) ================= */}
        <div className="col-span-12 lg:col-span-4 space-y-8">

          {activeTab === "iptv" ? (
            /* IPTV Sidebar: Channel Guide, Search, Country/Category Filters */
            <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 space-y-4 shadow-xl flex flex-col h-[600px]">
              {/* Sidebar Header */}
              <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-widest flex items-center space-x-2">
                  <Globe className="h-4.5 w-4.5 text-[#D4AF37]" />
                  <span>IPTV Channel Guide</span>
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                  ONLINE
                </span>
              </div>

              {/* Status Indicator for Loading */}
              {(!iptvStatus || !iptvStatus.loaded) && (
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center space-y-3 my-auto">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
                  <h4 className="font-bold text-xs text-zinc-300">Initializing IPTV Catalog</h4>
                  <p className="text-[10px] text-zinc-500">Downloading and mapping 50,000+ live television feeds from the Global IPTV Database. Please wait...</p>
                </div>
              )}

              {iptvStatus?.loaded && (
                <>
                  {/* Search bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search channels, genres..."
                      value={iptvSearch}
                      onChange={(e) => setIptvSearch(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                    />
                    {iptvSearch && (
                      <button 
                        onClick={() => setIptvSearch("")}
                        className="absolute right-3 top-2.5 text-zinc-500 hover:text-white text-xs cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Filter Selects */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Country Filter */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-mono uppercase">Country</label>
                      <select
                        value={selectedIptvCountry}
                        onChange={(e) => setSelectedIptvCountry(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] rounded-lg px-2 py-1.5 text-[11px] text-white outline-none transition-all"
                      >
                        <option value="">All Countries</option>
                        {availableCountries.slice(0, 100).map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-mono uppercase">Category</label>
                      <select
                        value={selectedIptvCategory}
                        onChange={(e) => setSelectedIptvCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] rounded-lg px-2 py-1.5 text-[11px] text-white outline-none transition-all"
                      >
                        <option value="">All Categories</option>
                        {availableCategories.slice(0, 60).map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name} ({cat.count})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Channel List Container */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {iptvLoading ? (
                      <div className="flex flex-col items-center justify-center h-48 space-y-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37]"></div>
                        <span className="text-[10px] text-zinc-500 font-mono">Filtering streams...</span>
                      </div>
                    ) : iptvStreams.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                        <AlertCircle className="h-6 w-6 text-zinc-700 mb-2" />
                        <span className="text-xs font-bold text-zinc-400">No Channels Found</span>
                        <p className="text-[10px] text-zinc-600 mt-1 max-w-xs">No channels match your filters.</p>
                      </div>
                    ) : (
                      iptvStreams.map((stream) => {
                        const isSelected = selectedIptv && selectedIptv.url === stream.url;
                        return (
                          <button
                            key={stream.id}
                            onClick={() => setSelectedIptv(stream)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center space-x-2.5 group cursor-pointer ${
                              isSelected
                                ? "bg-zinc-900 border-[#D4AF37] text-white"
                                : "bg-zinc-900/30 border-zinc-900/80 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-[10px] font-mono font-bold text-[#D4AF37] shrink-0 group-hover:scale-105 transition-transform">
                              {stream.country ? stream.country.slice(0, 2) : "GL"}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">
                                  {stream.categories && stream.categories[0]}
                                </span>
                                {stream.quality && (
                                  <span className="text-[8px] font-mono px-1 bg-zinc-950 text-zinc-400 rounded">
                                    {stream.quality}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold truncate mt-0.5 group-hover:text-white transition-colors">
                                {stream.name}
                              </h4>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Guide Footer */}
                  <div className="border-t border-zinc-900 pt-3 text-[9px] text-zinc-500 font-mono flex justify-between items-center">
                    <span>Active streams: {iptvStreams.length}</span>
                    <span>Total indexed: {iptvStatus?.count || 0}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Original Sidebar: Instagram Profile Preview & Video Comments widgets */
            <>
              {/* INSTAGRAM PROFILE PREVIEW WIDGET */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-5 space-y-4 shadow-xl">
                {/* Widget Title Header */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-widest flex items-center space-x-2">
                    <Instagram className="h-4.5 w-4.5 text-pink-500" />
                    <span>OFFICIAL INSTAGRAM</span>
                  </h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>

                {/* Profile Detail Row */}
                <div className="flex items-start space-x-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-black p-[2px]">
                        <img 
                          src={MOH_INSTAGRAM_PROFILE.profilePic} 
                          alt="Moh Profile Pic" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 h-4.5 w-4.5 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                      <CheckCircle className="h-2.5 w-2.5 text-white" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-white text-sm">@{MOH_INSTAGRAM_PROFILE.username}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono block">Follower network verified</span>
                    <div className="flex space-x-4 text-[11px] pt-1">
                      <div>
                        <span className="font-bold text-zinc-200">{MOH_INSTAGRAM_PROFILE.followers}</span>
                        <span className="text-zinc-500 text-[9px] ml-0.5">followers</span>
                      </div>
                      <div>
                        <span className="font-bold text-zinc-200">{MOH_INSTAGRAM_PROFILE.postsCount}</span>
                        <span className="text-zinc-500 text-[9px] ml-0.5">posts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 text-xs">
                  <div className="font-bold text-white text-[11px] mb-1">{MOH_INSTAGRAM_PROFILE.fullName}</div>
                  <p className="text-zinc-400 text-[10px] leading-relaxed whitespace-pre-line">{MOH_INSTAGRAM_PROFILE.bio}</p>
                </div>

                {/* Instagram Posts Grid Preview */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {MOH_INSTAGRAM_PROFILE.posts.map((post) => (
                    <a
                      key={post.id}
                      href={`https://www.instagram.com/${MOH_INSTAGRAM_PROFILE.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850 cursor-pointer block"
                    >
                      <img src={post.imageUrl} alt={post.id} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white p-2 text-center space-y-1">
                        <div className="flex items-center space-x-1 font-bold">
                          <Heart className="h-3 w-3 text-red-500 fill-current" />
                          <span>{post.likes}</span>
                        </div>
                        <p className="line-clamp-2 text-[8px] text-zinc-300 italic">"{post.caption}"</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* CTA Link Button */}
                <a
                  href={`https://www.instagram.com/${MOH_INSTAGRAM_PROFILE.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>Open Instagram Profile</span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                </a>
              </div>

              {/* ORIGINAL COMMENTS SECTION (AUDIENCE DISCOURSE) */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-6 flex flex-col h-[320px] sm:h-[360px] shadow-xl">
                <h3 className="text-xs font-bold font-mono text-zinc-300 border-b border-zinc-900 pb-3 flex items-center space-x-2">
                  <MessageSquare className="h-4.5 w-4.5 text-amber-500" />
                  <span>AUDIENCE DISCOURSE ({selectedVideo.comments.length})</span>
                </h3>

                {/* List of Comments */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
                  {selectedVideo.comments.map((comment, index) => (
                    <div key={index} className="space-y-1 text-[11px] bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="font-semibold text-zinc-300 flex items-center">
                          <User className="h-3 w-3 mr-1 text-zinc-500" />
                          {comment.author}
                        </span>
                        <span className="text-[8px] font-mono">{comment.date}</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Post comment form */}
                <form onSubmit={handleCommentSubmit} className="border-t border-zinc-900 pt-3 space-y-2 text-[10px]">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your Name..."
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white focus:outline-none text-[11px]"
                    />
                    <button
                      type="submit"
                      className="py-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-350 transition-colors flex items-center justify-center space-x-1 cursor-pointer text-[11px]"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Join the discussion..."
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white focus:outline-none text-[11px]"
                  />
                </form>
              </div>
            </>
          )}

        </div>

      </div>

      {/* Playlist Grid (Only shown when browsing original videos to stay tidy) */}
      {activeTab === "originals" && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold font-display text-white">UP NEXT</h3>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1.5">
            {(["All", "Styling Masterclass", "Behind The Brand", "Beauty Tutorials"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setVideoCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  videoCategory === cat
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
      )}
    </div>
  );
}
