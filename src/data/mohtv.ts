export interface MohTVVideo {
  id: string;
  title: string;
  duration: string;
  category: "Styling Masterclass" | "Behind The Brand" | "Beauty Tutorials";
  description: string;
  views: string;
  likes: number;
  thumbnail: string;
  videoPlaceholderUrl: string; // Used to simulate video playback using rich CSS & canvas/SVG elements
  comments: { author: string; text: string; date: string }[];
}

export const MOH_TV_VIDEOS: MohTVVideo[] = [
  {
    id: "v-1",
    title: "Mastering the Nairobi Silk Press: Pro Hair Styling Guide",
    duration: "12:45",
    category: "Styling Masterclass",
    description: "Moh Stylist takes you step-by-step through achieving a flawless, bouncy silk press that resists Nairobi humidity. Learn heat protection, tension blow-drying, and flat-ironing secrets using our signature nourishing hair oils.",
    views: "1.2K views",
    likes: 124,
    thumbnail: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600",
    videoPlaceholderUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-brushing-a-clients-long-brown-hair-41618-large.mp4",
    comments: [
      { author: "Zahra", text: "Finally, a silk press tutorial that accounts for our climate! The tension tip changed my life.", date: "July 08, 2026" },
      { author: "Kamau P.", text: "Outstanding quality, very professional setup.", date: "July 10, 2026" }
    ]
  },
  {
    id: "v-2",
    title: "Moh Stylist: The Story Behind the Black & Gold Aesthetic",
    duration: "08:15",
    category: "Behind The Brand",
    description: "Go behind the scenes at our Nairobi CBD workshop. Hear Moh discuss his design philosophy, his passion for combining traditional Maasai beads and brass with ultra-modern luxury silhouettes, and his vision for premium Kenyan fashion.",
    views: "3.4K views",
    likes: 412,
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    videoPlaceholderUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-designer-sketches-a-dress-41008-large.mp4",
    comments: [
      { author: "Morine N.", text: "So inspiring to see local luxury being built right in our CBD. Proudly Kenyan!", date: "July 02, 2026" },
      { author: "David", text: "This is the level of branding Kenyan fashion has been waiting for. Kudos!", date: "July 04, 2026" }
    ]
  },
  {
    id: "v-3",
    title: "Nairobi Dust-Proof Makeup Hacks with Grace Kemunto",
    duration: "10:30",
    category: "Beauty Tutorials",
    description: "Grace demonstrates how to lock in your foundation, concealer, and contour to survive a long day of walking in the CBD without cakeyness. Featuring Moh Beauty Lab's hydrating serum as a premium makeup primer.",
    views: "980 views",
    likes: 98,
    thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600",
    videoPlaceholderUrl: "https://assets.mixkit.co/videos/preview/mixkit-putting-on-makeup-in-front-of-a-mirror-41484-large.mp4",
    comments: [
      { author: "Wanjiku G.", text: "The powder sandwich technique is incredible! Literally stayed matte all through my meeting in Upper Hill.", date: "July 09, 2026" }
    ]
  }
];

export interface KenyaTVChannel {
  id: string;
  name: string;
  channelId: string; // YouTube Live stream channel ID
  fallbackVideoUrl: string; // Backup standard video if live channel block is private
  tagline: string;
  logoColor: string;
  viewsCount: string;
  streamUrl?: string; // High-quality native HLS live stream
}

export const KENYA_TV_CHANNELS: KenyaTVChannel[] = [
  {
    id: "tv-citizen",
    name: "Citizen TV Kenya",
    channelId: "UC5M47YpTepS-YwFzYmQhY2Q",
    fallbackVideoUrl: "https://www.youtube.com/embed/YpS8VfS0-oU",
    tagline: "Kenya's Leading Television Station - Habari, Burudani na Michezo",
    logoColor: "from-red-600 to-red-800",
    viewsCount: "12.4K watching live",
    streamUrl: "https://live-onesignal.royalmedia.co.ke/live/T-MxRsFebq6zx7k2QFMbLw.m3u8"
  },
  {
    id: "tv-ntv",
    name: "NTV Kenya",
    channelId: "UC4gS_7L8D8Lsz2vL5aZfXqQ",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UC4gS_7L8D8Lsz2vL5aZfXqQ",
    tagline: "Turning on Your World - Unbiased News, Entertainment & Live Coverage",
    logoColor: "from-blue-600 to-sky-700",
    viewsCount: "8.9K watching live"
  },
  {
    id: "tv-ktn",
    name: "KTN News Kenya",
    channelId: "UC3K_U-D57S_sn5b596X7eSg",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UC3K_U-D57S_sn5b596X7eSg",
    tagline: "Get the Whole Story - 24-Hour Authoritative Local and Global News",
    logoColor: "from-emerald-600 to-teal-800",
    viewsCount: "6.2K watching live"
  },
  {
    id: "tv-kbc",
    name: "KBC Channel 1",
    channelId: "UCfXlH2MvWzB4B03CozvT6ng",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCfXlH2MvWzB4B03CozvT6ng",
    tagline: "Your National Broadcaster - Authentic Kenyan News & Cultural Heritage",
    logoColor: "from-amber-600 to-orange-850",
    viewsCount: "3.5K watching live",
    streamUrl: "https://kbcchannel1.b-cdn.net/kbc1/live.m3u8"
  },
  {
    id: "tv-k24",
    name: "K24 TV",
    channelId: "UCDzEun-tq-Y6fL6nle4lH0Q",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCDzEun-tq-Y6fL6nle4lH0Q",
    tagline: "K24 News - Interactive and Engaging Current Affairs & Premium Entertainment",
    logoColor: "from-red-500 to-zinc-900",
    viewsCount: "4.1K watching live"
  },
  {
    id: "tv-tv47",
    name: "TV47 Kenya",
    channelId: "UCj9X_S9S_f90XN_g_V_oYpQ",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCj9X_S9S_f90XN_g_V_oYpQ",
    tagline: "TV47 Kenya - Home of Untold Stories, Premium News, and Interactive Drama",
    logoColor: "from-rose-600 to-amber-700",
    viewsCount: "5.5K watching live"
  },
  {
    id: "tv-kameme",
    name: "Kameme TV",
    channelId: "UCkH8z6V_r8b6S9T_bH-8z9w",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCkH8z6V_r8b6S9T_bH-8z9w",
    tagline: "Kameme TV - Kenya's Premier Vernacular Station Celebrated Globally",
    logoColor: "from-indigo-600 to-indigo-900",
    viewsCount: "3.9K watching live"
  },
  {
    id: "tv-inooro",
    name: "Inooro TV",
    channelId: "UCvR_Y-M62V0X4oR8-K_rT9A",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCvR_Y-M62V0X4oR8-K_rT9A",
    tagline: "Inooro TV - Your Trusted Vernacular Source for News, Culture, and Gospel",
    logoColor: "from-violet-600 to-purple-800",
    viewsCount: "4.8K watching live",
    streamUrl: "https://jk3lz82elw79-hls-live.5centscdn.com/inoorotv/3b78e4a14d1e6a755d52a2f4a4e3d5b6a.smil/chunklist_b1200000.m3u8"
  },
  {
    id: "tv-switch",
    name: "Switch TV",
    channelId: "UC3S80L7_8gP4-A8fEa8K_8w",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UC3S80L7_8gP4-A8fEa8K_8w",
    tagline: "Switch TV - Empowering the Youth with Inspirational, Vibrant Content",
    logoColor: "from-teal-600 to-teal-900",
    viewsCount: "2.1K watching live"
  },
  {
    id: "tv-kass",
    name: "KASS TV",
    channelId: "UCy9K7W9gC69XF8O_I_w_8ww",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCy9K7W9gC69XF8O_I_w_8ww",
    tagline: "Kass TV - Bringing Communities Together with Rich Heritage and Live Sport",
    logoColor: "from-amber-500 to-emerald-800",
    viewsCount: "1.8K watching live"
  },
  {
    id: "tv-y254",
    name: "Y254 TV",
    channelId: "UCX_hJ6560i_3O02o08vF-gw",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCX_hJ6560i_3O02o08vF-gw",
    tagline: "Y254 TV - The Official Youth Voice of the National Broadcaster KBC",
    logoColor: "from-fuchsia-600 to-pink-800",
    viewsCount: "1.2K watching live"
  },
  {
    id: "tv-ebru",
    name: "Ebru TV Kenya",
    channelId: "UC_kX_9_v6m7g_V8X1o_K7_g",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UC_kX_9_v6m7g_V8X1o_K7_g",
    tagline: "Ebru TV - Fresh, Young, and Authentic Television Programming in Nairobi",
    logoColor: "from-sky-500 to-blue-800",
    viewsCount: "1.5K watching live"
  },
  {
    id: "tv-lookup",
    name: "Look Up TV",
    channelId: "UCk91hY_b_u_vV2CshvO0wQA",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCk91hY_b_u_vV2CshvO0wQA",
    tagline: "Look Up TV - Elevating Your Perspective on News, Economy, and Lifestyle",
    logoColor: "from-zinc-700 to-zinc-950",
    viewsCount: "2.3K watching live",
    streamUrl: "https://luzuki.vedge.infomaniak.com/livecast2/edge/lookup-tv/playlist.m3u8"
  },
  {
    id: "tv-akilikids",
    name: "Akili Kids",
    channelId: "",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCX_hJ6560i_3O02o08vF-gw",
    tagline: "Kenya's Premier Children & Family Learning Channel - Fun and Education Combined",
    logoColor: "from-pink-500 to-yellow-500",
    viewsCount: "5.1K watching live",
    streamUrl: "https://m6.livecdn.io/akilikids.co.ke/akilikids.smil/playlist.m3u8"
  },
  {
    id: "tv-familytv",
    name: "Family TV",
    channelId: "",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCX_hJ6560i_3O02o08vF-gw",
    tagline: "Keep It Clean - Premium Family Entertainment & Inspiring Spiritual Programming",
    logoColor: "from-blue-600 to-purple-600",
    viewsCount: "3.2K watching live",
    streamUrl: "https://5f77b7c2e9c75.streamlock.net/familymedia/familytv/playlist.m3u8"
  },
  {
    id: "tv-njata",
    name: "Njata TV",
    channelId: "UCvE8_XU3M_FwOq8o6_V9fyg",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UCvE8_XU3M_FwOq8o6_V9fyg",
    tagline: "Njata TV - Shining Star of Vernacular Heritage, Traditional Music & Values",
    logoColor: "from-purple-600 to-indigo-950",
    viewsCount: "1.0K watching live"
  },
  {
    id: "tv-metropol",
    name: "Metropol TV",
    channelId: "UC0V7VzQkG_tL7uA_P7xH05Q",
    fallbackVideoUrl: "https://www.youtube.com/embed/live_stream?channel=UC0V7VzQkG_tL7uA_P7xH05Q",
    tagline: "Metropol TV - Kenya's First Dedicated Business and Financial News Channel",
    logoColor: "from-emerald-500 to-zinc-900",
    viewsCount: "2.5K watching live"
  }
];

export interface KenyaRadioStation {
  id: string;
  name: string;
  frequency: string;
  tagline: string;
  currentShow: string;
  presenters: string;
  accentColor: string;
  streamUrl: string; // Live HTTP/HTTPS audio broadcast stream URL
}

export const KENYA_RADIO_STATIONS: KenyaRadioStation[] = [
  {
    id: "radio-classic",
    name: "Classic 105",
    frequency: "105.2 FM",
    tagline: "Kenya's Soul Food - Unforgettable Old School & Lively Conversations",
    currentShow: "Maina & King'ang'i in the Morning",
    presenters: "Maina Kageni & Mwalimu King'ang'i",
    accentColor: "#F59E0B",
    streamUrl: "https://atlasshrug2001.live.3gv6a8h2s.com/live/Classic105"
  },
  {
    id: "radio-maisha",
    name: "Radio Maisha",
    frequency: "102.7 FM",
    tagline: "Tukuza Maisha - Elimu, Burudani na Habari Moto Moto",
    currentShow: "Maisha Asubuhi",
    presenters: "Billy Miya & Mbaruk Mwalimu",
    accentColor: "#EF4444",
    streamUrl: "https://s3.radio.co/s97f38d0ea/listen"
  },
  {
    id: "radio-kiss",
    name: "Kiss FM",
    frequency: "100.3 FM",
    tagline: "The Beat of Nairobi - Non-stop Hits & Vibrant Street Talk",
    currentShow: "The Morning Kiss",
    presenters: "Chito & Kwambox",
    accentColor: "#EC4899",
    streamUrl: "https://kiss100-atunwadigital.streamguys1.com/kiss100"
  },
  {
    id: "radio-milele",
    name: "Milele FM",
    frequency: "93.6 FM",
    tagline: "Kazi Mpango - Kwaya za Kiswahili na Ucheshi wa Kweli",
    currentShow: "Milele Asubuhi",
    presenters: "Alex Mwakideu & MCA Tricky",
    accentColor: "#10B981",
    streamUrl: "https://stream.zeno.fm/3g286v062zuv"
  },
  {
    id: "radio-hot96",
    name: "Hot 96",
    frequency: "96.0 FM",
    tagline: "Keep It Hot - Nairobi's Ultimate Youth Urban & Reggae Vibes",
    currentShow: "Hot Drive",
    presenters: "Patrick Igunza",
    accentColor: "#F43F5E",
    streamUrl: "https://stream.zeno.fm/unb80v062zuv"
  },
  {
    id: "radio-jambo",
    name: "Radio Jambo",
    frequency: "97.5 FM",
    tagline: "Patanisho na Burudani - The Ultimate Swahili Talk Radio",
    currentShow: "Gidi na Ghost Asubuhi",
    presenters: "Gidi Ogidi & Ghost Mulee",
    accentColor: "#F59E0B",
    streamUrl: "https://stream.radiojar.com/6h2y2p0k8f9uv"
  },
  {
    id: "radio-ghetto",
    name: "Ghetto Radio",
    frequency: "89.5 FM",
    tagline: "The Sheng Station - Nairobi Street Vibes & Pure Dancehall Reggae",
    currentShow: "Goteana",
    presenters: "Dj Double Trouble & Maji Maji",
    accentColor: "#10B981",
    streamUrl: "https://stream.zeno.fm/v39v91u02zuv"
  },
  {
    id: "radio-spice",
    name: "Spice FM",
    frequency: "94.4 FM",
    tagline: "Nairobi's Best Soul & RnB Station - Intelligent Talk & Nostalgic Hits",
    currentShow: "The Situation Room",
    presenters: "Eric Latiff & CT Muga",
    accentColor: "#8B5CF6",
    streamUrl: "https://stream.zeno.fm/4m8u8v062zuv"
  }
];

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: string;
  comments: string;
  caption: string;
}

export const MOH_INSTAGRAM_PROFILE = {
  username: "its_lamoh",
  fullName: "MOH STYLIST",
  bio: "👑 Nairobi's Premium Custom Couture & Luxury Stylist\n📍 Utawala Shopping Mall, Nairobi, Kenya\n🎨 Hand-stitched elegance, bespoke fittings & VIP beauty labs\n📩 DM for styling bookings & priority courier delivery!",
  followers: "28.5K",
  following: "412",
  postsCount: "1,142",
  profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  posts: [
    {
      id: "ig-1",
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=70&w=300",
      likes: "1.2K",
      comments: "142",
      caption: "Gold-Stitched Velvet Dinner Suit. Tailored with perfection for Nairobi's high society. #MohStylist"
    },
    {
      id: "ig-2",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=70&w=300",
      likes: "892",
      comments: "78",
      caption: "Silk press & bespoke styling for the beautiful bride. Absolute luxury! 💍✨"
    },
    {
      id: "ig-3",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=70&w=300",
      likes: "1.5K",
      comments: "210",
      caption: "Maasai Brass & Gold Embellished Evening Gown. Redefining modern Kenyan heritage. 🇰🇪👑"
    },
    {
      id: "ig-4",
      imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=70&w=300",
      likes: "2.1K",
      comments: "318",
      caption: "Ready for the runway! Our autumn luxury collection is officially live. #CoutureDrive"
    }
  ]
};
