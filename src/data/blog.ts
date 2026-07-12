export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: "Fashion Tips" | "Nairobi Trends" | "Beauty Hacks";
  date: string;
  readTime: string;
  author: string;
  image: string;
  likes: number;
  comments: { author: string; text: string; date: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "5 Nairobi Streetwear Trends Taking Over the CBD in 2026",
    excerpt: "From oversized thrifted cargo pants to neon beaded accessories, here is how Nairobi's creative youth are redefining urban style.",
    content: [
      "Walk down Kimathi Street or Moi Avenue on any given Saturday afternoon, and you'll be treated to a masterclass in urban fashion. Nairobi's youth are no longer just absorbing global trends—they are active tastemakers, merging thrifted retro silhouettes with vibrant local accents.",
      "The first trend taking over is the rise of 'Luxury Thrift' or 'Mtumba Re-imagined.' Creative Gen-Zs are sourcing oversized, structural blazers and vintage cargo pants from Toi and Gikomba markets, then custom-tailoring them or adding bold, structural block-prints and gold embroidery. It is high-low styling at its absolute finest.",
      "Secondly, beaded jewelry is making an elegant return. Rather than traditional multi-colored Maasai necklaces, we are seeing monochrome glass bead collars (in stark blacks, whites, and metallic golds) paired with modern streetwear like cropped hoodies and wide-leg denim.",
      "Finally, local streetwear brands like Moh Stylist Couture are pushing unisex flowing kimonos and heavy gabardine trench coats that bear subtle local accents. The message is simple: Nairobi style is bold, proud, and unapologetically distinct."
    ],
    category: "Nairobi Trends",
    date: "July 10, 2026",
    readTime: "5 min read",
    author: "Moh Stylist",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    likes: 245,
    comments: [
      { author: "Kendi", text: "Spot on! Gikomba finding a new life in CBD boutiques is the best thing about 2026.", date: "July 11, 2026" },
      { author: "Amos W.", text: "This article makes me want to immediately go shopping. Moh's trench coats are indeed fire!", date: "July 12, 2026" }
    ]
  },
  {
    id: "blog-2",
    title: "The Ultimate CBD Glow-Up: Defeating Nairobi Dust & Chilly Mornings",
    excerpt: "A simple skincare and beauty routine designed specifically for Nairobi's high-altitude climate and urban environment.",
    content: [
      "Nairobi is beautiful, but its high-altitude location (1,795m above sea level) combined with dust during the sunny seasons and freezing dry winds in June and July can wreak complete havoc on your skin barrier.",
      "To survive and maintain a fresh, radiant complexion, you need a routine focused on double hydration, barrier defense, and lightweight sealing. Here is the daily CBD Glow-Up Routine recommended by Moh Beauty Lab:",
      "Step 1: Hydrating Cleanse. Avoid heavy foaming cleansers that strip your natural oils. Instead, use a gentle cream or gel cleanser that keeps your skin's pH balanced.",
      "Step 2: Hyaluronic Acid & Local Aloe Vera. Apply a damp layer of our CBD Glow-Up Serum. Hyaluronic Acid binds water to your skin, while the soothing properties of local Laikipia aloe vera calm any redness from high-altitude exposure.",
      "Step 3: Seal with Local Macadamia Oil. Don't skip a light face oil! Local cold-pressed macadamia or avocado oil mimics your skin's natural sebum, locking in hydration without clogging pores, and protecting you from dry afternoon city winds."
    ],
    category: "Beauty Hacks",
    date: "July 05, 2026",
    readTime: "4 min read",
    author: "Grace Kemunto",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    likes: 189,
    comments: [
      { author: "Wanjiku", text: "I have been using the Macadamia oil tip and my skin barrier is finally healing. Thank you so much!", date: "July 06, 2026" }
    ]
  },
  {
    id: "blog-3",
    title: "How to Style Your Maasai Shuka Like a Modern Runway Icon",
    excerpt: "Three creative ways to fold, drape, and accent your everyday wardrobe with Kenya's iconic checkered fabric.",
    content: [
      "The Maasai Shuka is a beautiful representation of Kenyan identity. While it is traditionally worn wrapped around the body, modern fashionistas are finding innovative ways to style it for high-fashion urban wear.",
      "Method 1: The Asymmetrical Shoulder Drape. Fold your Shuka into a thick, structured sash. Drape it over one shoulder of a fitted, solid black turtleneck or dress, and secure it at your waist with a wide, gold-buckled leather belt. This creates a striking silhouette that works for high-end corporate events or evening parties.",
      "Method 2: The Statement Shawl-Coat. Wear it loosely as a blanket scarf over a structured gabardine coat. Let the vibrant reds, blues, and blacks peek out from beneath your collar. This adds a powerful splash of color and cultural richness to standard grey or black winter outerwear.",
      "Method 3: The Kimono Accent. If you are feeling extra creative, sew strips of Shuka fabric along the lapels or sleeve-edges of your favorite denim jacket or kimono. This subtle touch instantly elevates a simple casual item into a bespoke, custom craft statement."
    ],
    category: "Fashion Tips",
    date: "June 28, 2026",
    readTime: "6 min read",
    author: "Moh Stylist",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=600",
    likes: 312,
    comments: [
      { author: "Sonia G.", text: "Method 1 is a game changer. I wore a red shuka over a black jumpsuit with a gold belt and literally everyone asked where I got it!", date: "June 30, 2026" }
    ]
  }
];
