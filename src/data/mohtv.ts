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
