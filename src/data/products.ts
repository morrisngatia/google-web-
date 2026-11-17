export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Fashion" | "Beauty" | "Lifestyle" | "Local Brands";
  description: string;
  detailedDescription: string;
  priceKES: number;
  priceUSD: number;
  rating: number;
  reviews: Review[];
  image: string;
  inStock: boolean;
  isService?: boolean; // True for styling sessions, masterclasses, bookings
  specs: { [key: string]: string };
}

export const PRODUCTS: Product[] = [
  {
    id: "moh-1",
    name: "Nairobi Golden Hour Trench Coat",
    brand: "Moh Stylist Couture",
    category: "Fashion",
    description: "A tailored modern outerwear piece combining premium structured cotton with hand-stitched Maasai shuka linen accents.",
    detailedDescription: "The Nairobi Golden Hour Trench Coat is Moh Stylist's signature piece. Tailored in the heart of Nairobi, it brings structural elegance together with subtle, rich Maasai culture. It features a deep black gabardine body accented with genuine premium gold-and-red Maasai shuka fabric under the collar, cuffs, and belt lining. Crafted for the cosmopolitan citizen who wants to carry the warmth of Kenya everywhere.",
    priceKES: 14500,
    priceUSD: 112.00,
    rating: 4.9,
    reviews: [
      { author: "Zari M.", rating: 5, comment: "Incredible fit! The shuka accents are so subtle and elegant. Wore it to a gallery opening in Kilimani and got endless compliments.", date: "2026-06-12" },
      { author: "Kendi J.", rating: 5, comment: "Superior quality sewing. Definitely a premium product. Proud to support Moh Stylist!", date: "2026-07-01" }
    ],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "80% Gabardine Cotton, 20% Maasai Shuka Linen",
      "Colors Available": "Noir Black with Gold-Red Accents",
      "Tailoring Location": "Nairobi, CBD Workshop",
      "Care": "Dry clean recommended"
    }
  },
  {
    id: "moh-2",
    name: "CBD Glow-Up Hyaluronic Acid Face Serum",
    brand: "Moh Beauty Lab",
    category: "Beauty",
    description: "An ultra-hydrating daily facial serum formulated with local Kenyan Aloe Vera, Chamomile, and Hyaluronic Acid.",
    detailedDescription: "Crafted specifically to combat the dusty, high-altitude city climate of Nairobi, the CBD Glow-Up Serum hydrates deeply and shields your skin from everyday pollution. Infused with organic aloe vera gel harvested from drylands in Laikipia and fresh chamomile extracts from Naivasha, this lightweight formula absorbs instantly to give you a natural dewy glow that lasts from morning meetings in Upper Hill to night outs in Westlands.",
    priceKES: 3400,
    priceUSD: 26.50,
    rating: 4.8,
    reviews: [
      { author: "Shirleen W.", rating: 5, comment: "This serum literally saved my dry skin from the chilly June-July Nairobi cold. My skin is literally glowing!", date: "2026-06-28" },
      { author: "Abdi H.", rating: 4, comment: "Very hydrating, non-greasy. Works well under moisturizer.", date: "2026-07-05" }
    ],
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Key Ingredients": "Hyaluronic Acid (2%), Kenyan Aloe Vera, Chamomile Extract, Vitamin B5",
      "Volume": "30ml / 1.0 fl oz",
      "Skin Type": "Suitable for all skin types, especially dry/sensitive",
      "Cruelty Free": "Yes, 100% Vegan"
    }
  },
  {
    id: "moh-3",
    name: "Hand-Beaded Golden Brass Collar Choker",
    brand: "Sinya Artisans",
    category: "Local Brands",
    description: "A striking, hand-hammered Kenyan brass neckpiece embellished with elegant matte gold and black beadwork.",
    detailedDescription: "This bold statement neckpiece is forged by skilled Jua Kali brass-smiths in Nairobi, then meticulously beaded by hand by Maasai women artisans in Kajiado. It features a glowing, polished local brass collar structure that contours beautifully. The custom gold, white, and black beads are woven securely onto the piece to tell a modern story of ancient crafts.",
    priceKES: 6200,
    priceUSD: 48.00,
    rating: 4.7,
    reviews: [
      { author: "Maria S.", rating: 5, comment: "A work of absolute art! It's lightweight but makes such an impression. Fits beautifully.", date: "2026-05-19" }
    ],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "Reclaimed Local Kenyan Brass, Premium Glass Seed Beads",
      "Diameter": "14.5cm (flexible collar)",
      "Artisans": "Joint collaboration: Kariokor Brass & Sinya Weavers",
      "Weight": "120g"
    }
  },
  {
    id: "moh-4",
    name: "VIP Hair Styling & Makeover Booking",
    brand: "Moh Stylist Salon",
    category: "Beauty",
    description: "A premium hair makeover, deep conditioning, styling, and professional makeup session at our Nairobi CBD Studio.",
    detailedDescription: "Experience the ultimate VIP pampering session with Moh's elite team. This full-service booking includes a detailed personal hair consultation, moisturizing hot oil treatment with local avocado and macadamia extracts, customized styling (braids, silk press, or trim), and a gorgeous professional makeup session tailored for your skin tone and event. Relax with hot ginger tea or cappuccino in our luxury suite while we craft your look.",
    priceKES: 8500,
    priceUSD: 65.00,
    rating: 5.0,
    reviews: [
      { author: "Nelly K.", rating: 5, comment: "The service is outstanding. Moh himself checked on my hair! My makeup was completely flawless and lasted all night. Worth every single cent.", date: "2026-07-10" }
    ],
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    isService: true,
    specs: {
      "Duration": "3 - 4 Hours",
      "Location": "Moh Stylist Studio, Near Utawala Shopping Mall, Nairobi",
      "Includes": "Hair Wash, Treatment, Styling, Full Makeup, Complimentary Refreshments",
      "Advance Booking": "Required at least 24 hours prior"
    }
  },
  {
    id: "moh-5",
    name: "Luxury Black & Gold Woven Kiondo Bag",
    brand: "Kamba Weavers Guild",
    category: "Lifestyle",
    description: "An exquisite hand-woven sisal handbag featuring metallic gold thread, black dye, and supple genuine cowhide leather straps.",
    detailedDescription: "The traditional Kiondo receives a high-fashion, midnight-luxury upgrade. Handcrafted by master Taita and Kamba weavers over three weeks, this bag is woven from tough local sisal fibers dyed rich coal-black, intertwined with modern metallic gold threads. Finished in Nairobi with genuine, premium black cowhide leather straps, solid brass hardware, a full inner lining, and a secure zippered pocket.",
    priceKES: 7800,
    priceUSD: 60.00,
    rating: 4.9,
    reviews: [
      { author: "Fiona O.", rating: 5, comment: "I am in love! The subtle gold sparkle in the black weave is incredibly gorgeous. Sturdy and carries my MacBook easily.", date: "2026-06-15" },
      { author: "Joy A.", rating: 5, comment: "Pure luxury. This puts international designer brands to shame. Truly spectacular.", date: "2026-06-20" }
    ],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "Kenyan Sisal, Metallic Lurex Thread, Genuine Local Leather",
      "Closure": "Smooth YKK Zipper",
      "Interior": "Premium silk lining with phone pocket and zipper pocket",
      "Strap Drop": "28cm (perfect shoulder fit)"
    }
  },
  {
    id: "moh-6",
    name: "Maasai Bold-Print Modern Kimono",
    brand: "Moh Stylist Couture",
    category: "Fashion",
    description: "An elegant, unisex flowing kimono jacket crafted from premium silk-satin blend with striking tribal geometric patterns.",
    detailedDescription: "Designed for effortless city elegance, this flowing, mid-length kimono makes a striking statement. Made of lightweight, ultra-soft silk-satin that drapes beautifully, it features bold, custom-designed geometric patterns inspired by Maasai bead symbols, framed in a stark, stylish black, gold, and white colorway. Perfect for styling over a black dress, jeans, or swimwear.",
    priceKES: 9800,
    priceUSD: 75.00,
    rating: 4.8,
    reviews: [
      { author: "Mwangi G.", rating: 5, comment: "Fits so beautifully on men too! Wore it to a cultural festival and got endless nods. Extremely comfortable material.", date: "2026-05-30" }
    ],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "80% Silk, 20% Polyester Satin",
      "Size": "Unisex, One Size fits most",
      "Sleeve Style": "Classic wide kimono drape",
      "Care": "Hand wash cold or gentle machine wash"
    }
  },
  {
    id: "moh-7",
    name: "Nairobi Vibe Soy Wax Candle (Oudh & Myrrh)",
    brand: "Moh Lifestyle",
    category: "Lifestyle",
    description: "An exquisite hand-poured candle in a custom black and gold concrete jar, boasting notes of dark warm wood, amber, and spice.",
    detailedDescription: "Set the mood of sophisticated Nairobi evenings. This candle is hand-poured in Nairobi using 100% natural soy wax, local beeswax, and high-concentration essential oils. The scent captures the warmth of dry-season savannah breezes, luxury rooftop lounges in Kilimani, and sweet cedarwood smoke. It comes in a reusable, matte-black concrete vessel highlighted with metallic gold foil brushstrokes.",
    priceKES: 2800,
    priceUSD: 21.50,
    rating: 4.6,
    reviews: [
      { author: "Wanjira L.", rating: 4, comment: "The fragrance is complex, warm, and fills the whole room. Love the concrete jar!", date: "2026-07-02" }
    ],
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Wax Type": "90% Natural Soy, 10% Local Beeswax",
      "Burn Time": "55+ Hours",
      "Scent Notes": "Rich Oudh Wood, Frankincense, Somali Myrrh, Warm Amber, Clove",
      "Weight": "220g"
    }
  },
  {
    id: "moh-8",
    name: "Personal Styling & Wardrobe Audit Consultation",
    brand: "Moh Stylist",
    category: "Fashion",
    description: "A 1-on-1 fashion and image makeover consultation with Moh Stylist himself (or senior staff), virtually or in-studio.",
    detailedDescription: "Transform your style with expert guidance. This ultimate styling service includes a 1.5-hour deep dive into your body type, color palette, style archetype, and lifestyle needs. Moh will audit your current wardrobe, suggest what to keep or donate, draft a customized 'style blueprint' with 15 outfit recipes, and provide a private digital shopping catalog with local brand recommendations. Elevate your confidence and shine!",
    priceKES: 12000,
    priceUSD: 92.00,
    rating: 5.0,
    reviews: [
      { author: "Michael O.", rating: 5, comment: "This consultation changed how I dress for executive board meetings. Completely redefined my professional look. Moh is a true genius.", date: "2026-06-18" }
    ],
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    isService: true,
    specs: {
      "Duration": "2 Hours consultation",
      "Format": "In-Person (Utawala Studio) or Zoom Video Call",
      "Deliverables": "Customized Style Guide PDF, 15 Wardrobe Pairings, Personal Shopping list",
      "Scheduling": "Flexible booking options available"
    }
  },
  {
    id: "moh-9",
    name: "Artisan Hand-Beaded Safari Loafers",
    brand: "Moh Stylist x Sinya",
    category: "Fashion",
    description: "Handcrafted, genuine Kenyan leather loafers featuring gorgeous, subtle Maasai hand-beaded side detailing.",
    detailedDescription: "These loafers are made from premium local cowhide leather, double-soled for ultimate comfort and lifespan. Designed in collaboration with Jua Kali leather artisans in Nairobi and hand-beaded by Sinya women in Kajiado, these shoes boast delicate black, gold, and red seed-bead strips. A perfect blend of comfort, style, and authentic heritage.",
    priceKES: 12500,
    priceUSD: 95.00,
    rating: 4.9,
    reviews: [
      { author: "Dennis M.", rating: 5, comment: "Hands down the most comfortable loafers I have ever bought. The beadwork is amazing.", date: "2026-07-04" }
    ],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "100% Genuine Kenyan Leather, Glass Seed Beads",
      "Sole": "Durable layered rubber sole with memory-foam cushioning",
      "Craftsmanship": "Hand-lasted and hand-beaded",
      "Size range": "EU 38 - 45 (Unisex sizing available)"
    }
  },
  {
    id: "moh-10",
    name: "Premium Gold-Embroidery Swahili Kaftan",
    brand: "Moh Stylist Couture",
    category: "Fashion",
    description: "An exquisite, lightweight linen kaftan with gold embroidery along the placket, bringing modern Coastal luxury to Nairobi.",
    detailedDescription: "The Premium Gold-Embroidery Swahili Kaftan is designed for the modern gentleman who values sophistication and cultural pride. Tailored from high-grade breathable linen, it features rich, hand-guided metallic gold threading along the collar and front placket. Perfectly versatile for high-society events, weddings, or relaxed high-end loungewear.",
    priceKES: 14000,
    priceUSD: 108.00,
    rating: 4.8,
    reviews: [
      { author: "Omar A.", rating: 5, comment: "Stunning tailoring. The gold embroidery is very clean and elegant. Fits perfectly.", date: "2026-06-25" }
    ],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "90% Premium Linen, 10% Cotton blend",
      "Embroidery": "Hand-guided metallic gold thread work",
      "Fit": "Relaxed tailored fit with side slits",
      "Care": "Dry clean or hand wash only"
    }
  },
  {
    id: "moh-11",
    name: "Golden Hour Pleated Satin Runway Dress",
    brand: "Moh Stylist Couture",
    category: "Fashion",
    description: "A breathtaking pleated satin gown featuring a hand-draped silhouette and dramatic asymmetric shoulder styling.",
    detailedDescription: "Step onto the red carpet in our signature Golden Hour Pleated Satin Dress. Designed in our Nairobi studio, this gown features ultra-premium pleated satin that captures the Naivasha sunset glow beautifully. It features an exquisite hand-draped asymmetric bodice, a flowing high-slit skirt, and an adjustable waist belt. Made to turn heads and exude pure luxury.",
    priceKES: 16500,
    priceUSD: 126.00,
    rating: 5.0,
    reviews: [
      { author: "Nyambura K.", rating: 5, comment: "I wore this for my anniversary dinner and felt like absolute royalty. The satin feels incredibly rich.", date: "2026-07-08" }
    ],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "100% Premium Pleated Satin",
      "Style": "Asymmetrical one-shoulder drape with high side slit",
      "Lining": "Full soft silk lining",
      "Size range": "S, M, L, XL (Bespoke custom fitting available)"
    }
  },
  {
    id: "moh-12",
    name: "Oudh Safari Concentrated Extrait de Parfum",
    brand: "Moh Beauty Lab",
    category: "Beauty",
    description: "An intense, long-lasting unisex fragrance blending rare dark Oudh, warm amber, and Naivasha sweet rose.",
    detailedDescription: "Oudh Safari is the crown jewel of Moh Beauty Lab. Formulated as a high-concentration Extrait de Parfum, it opens with a stunning burst of Damascus rose, transitioning into deep, complex heart notes of frankincense and rich Naivasha woodsmoke. The dry-down is a warm, magnetic blanket of Cambodian Oudh, leather, and golden amber. Specially blended to linger all day in the crisp Nairobi air.",
    priceKES: 6800,
    priceUSD: 52.00,
    rating: 4.9,
    reviews: [
      { author: "Sasha N.", rating: 5, comment: "An absolute masterpiece. This perfume lasts for 12+ hours and smells like old-money luxury. I get asked about it constantly!", date: "2026-07-11" }
    ],
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Concentration": "Extrait de Parfum (30% pure fragrance oil)",
      "Scent Family": "Oriental Woody Floral",
      "Top Notes": "Damascus Rose, Cardamom, Pink Pepper",
      "Base Notes": "Cambodian Oudh, Sandalwood, Golden Amber, Leather"
    }
  },
  {
    id: "moh-13",
    name: "Premium Handcrafted Safari Veldskoen",
    brand: "Limuru Leather Co.",
    category: "Local Brands",
    description: "Rugged yet comfortable hand-stitched premium nubuck leather boots built for urban streets and safari trails alike.",
    detailedDescription: "Worn by explorers and styled by innovators, our Limuru-crafted Safari Veldskoen ('Vellies') are constructed with ultra-durable premium nubuck leather. Features a dual-stitch welt, memory foam leather insoles for exceptional local comfort, and a non-slip recycled rubber sole. A true representation of Kenyan heritage footwear that only gets better with age.",
    priceKES: 7500,
    priceUSD: 57.50,
    rating: 4.8,
    reviews: [
      { author: "Kariuki N.", rating: 5, comment: "Unbelievably sturdy and extremely comfortable. Easily matches with chinos or jeans.", date: "2026-07-02" },
      { author: "Nora P.", rating: 4, comment: "Excellent leather texture. Takes a few days to break in but absolutely worth it.", date: "2026-07-06" }
    ],
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Upper Material": "100% Genuine Nubuck Calf Leather",
      "Insole": "Ergonomic Memory Foam covered with breathable lining",
      "Sole": "Recycled Heavy-Duty Rubber",
      "Craftsmanship": "Hand-stitched in Limuru, Kenya"
    }
  },
  {
    id: "moh-14",
    name: "Maasai Beaded Heritage Summer Sandals",
    brand: "Moh Stylist Couture",
    category: "Local Brands",
    description: "Elegant open-toe leather sandals decorated with vibrant, hand-sewn Maasai glass beads.",
    detailedDescription: "Embrace the sunshine with our exquisite Maasai Beaded Sandals. Each bead is individually hand-threaded by female artisans in Narok onto premium locally sourced cowhide leather. Featuring a secure toe-loop design and a soft, padded footbed for daily wear around Nairobi's cozy spots.",
    priceKES: 3200,
    priceUSD: 24.50,
    rating: 5.0,
    reviews: [
      { author: "Asha L.", rating: 5, comment: "Beautiful bead patterns and very soft leather. These are my absolute go-to sandals now!", date: "2026-06-25" }
    ],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "Genuine Kenyan leather, high-grade glass seed beads",
      "Design": "Classic T-Strap with secure buckle closure",
      "Comfort": "Dual-layer cushion footbed",
      "Artisan Source": " Narok Women's Beading Guild"
    }
  },
  {
    id: "moh-15",
    name: "Mombasa Swahili Kikoy Summer Wrap",
    brand: "Pwani Weavers",
    category: "Local Brands",
    description: "Traditional vibrant hand-woven 100% cotton sarong-wrap featuring rich colors and knotted fringes.",
    detailedDescription: "The Kikoy is a traditional Swahili wrap woven with care on the beautiful Kenyan coast. Made from 100% long-staple combed cotton, it is incredibly soft, lightweight, and versatile. Use it as a stylish beach wrap, a cozy neck scarf, a lightweight throw, or even an elegant safari headwrap. Hand-knotted fringes add an authentic, high-quality touch.",
    priceKES: 1800,
    priceUSD: 13.80,
    rating: 4.7,
    reviews: [
      { author: "Fatma S.", rating: 5, comment: "Vibrant colors that don't fade at all. Soft cotton feels wonderful on the skin.", date: "2026-05-18" }
    ],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Fabric": "100% Combed Kenyan Cotton",
      "Dimensions": "170cm x 100cm",
      "Edges": "Traditional hand-twisted knotted fringes",
      "Origin": " Mombasa Coastal Artisans"
    }
  },
  {
    id: "moh-16",
    name: "Royal Kitenge Wax Bomber Jacket",
    brand: "Moh Stylist Couture",
    category: "Fashion",
    description: "A showstopping street-chic bomber jacket made with authentic African wax print patterns and high-comfort satin lining.",
    detailedDescription: "Redefine urban high-fashion with our signature Kitenge Bomber Jacket. Merging classic streetwear aesthetics with bold African heritage, this jacket features authentic wax-print fabrics imported from local markets and tailored by Moh's select team. Outfitted with high-quality brass zippers, elasticated cuffs, and a premium quilted gold-satin inner lining that is perfect for cool Nairobi evenings.",
    priceKES: 5500,
    priceUSD: 42.00,
    rating: 4.9,
    reviews: [
      { author: "Mugambi J.", rating: 5, comment: "An absolutely stunning statement piece. The wax print fabric is rich and firm. Fits perfectly!", date: "2026-07-09" }
    ],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Shell": "100% Authentic Cotton Ankara Wax Print",
      "Lining": "Premium quilted gold satin lining",
      "Hardware": "Heavy-duty YKK antique brass zipper",
      "Details": "Deep side welt pockets & interior utility pocket"
    }
  },
  {
    id: "moh-17",
    name: "Lamu Island Breeze Linen Shirt",
    brand: "Moh Stylist Couture",
    category: "Fashion",
    description: "An ultra-breathable, lightweight pure linen shirt with Swahili hand-stitched detailing on the cuffs.",
    detailedDescription: "Inspired by the slow, beautiful coastal winds of Lamu Island. This pure white linen shirt is designed to keep you cool and elegant under any sun. Features customized Mother of Pearl buttons and a refined mandarin collar with delicate coastal-motif embroidery. Perfect for sunset dhow cruises or weekend brunches.",
    priceKES: 6200,
    priceUSD: 48.00,
    rating: 4.9,
    reviews: [
      { author: "Khalid S.", rating: 5, comment: "Breathes incredibly well and doesn't cling. Elegant collar design.", date: "2026-07-01" }
    ],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "100% Pure Italian Linen",
      "Fit": "Modern Tailored Fit",
      "Collar": "Mandarin style with coastal embroidery details",
      "Care": "Cold hand wash or dry clean"
    }
  },
  {
    id: "moh-18",
    name: "Wild Ochre Whipped Shea Body Butter",
    brand: "Moh Beauty Lab",
    category: "Beauty",
    description: "An intensive moisturizing body butter whipped with wild East African Nilotica Shea, cocoa butter, and avocado oil.",
    detailedDescription: "Pamper your skin with our signature whipped Nilotica Shea body butter. Cultivated in local Northern regions, our premium Nilotica shea butter has a silky, melt-in-your-skin texture. Enhanced with Naivasha cold-pressed avocado oil and rich cocoa butter to nourish, fade stretch marks, and provide deep hydration to skin parched by sun or high-altitude dry air.",
    priceKES: 4200,
    priceUSD: 32.50,
    rating: 4.8,
    reviews: [
      { author: "Mercy T.", rating: 5, comment: "Unbelievable texture! It melts like oil onto the skin and keeps me hydrated all day. Smells like vanilla and cocoa.", date: "2026-07-10" }
    ],
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Key Ingredients": "East African Nilotica Shea Butter, Cocoa Butter, Naivasha Cold-Pressed Avocado Oil, Vanilla Bean extract",
      "Volume": "250ml / 8.4 fl oz",
      "Scent": "Natural Cocoa and Warm Vanilla",
      "Texture": "Whipped, light, fast-absorbing"
    }
  },
  {
    id: "moh-19",
    name: "Rift Valley Obsidian Teardrop Earrings",
    brand: "Sinya Artisans",
    category: "Local Brands",
    description: "Striking drop earrings featuring hand-polished black volcanic obsidian stone set in local hammered brass.",
    detailedDescription: "A glorious piece of the Great Rift Valley. These earrings feature genuine black obsidian, a natural volcanic glass polished to a glass-mirror finish, hand-set in dynamic hammered brass frames. Forged by local artists in Nakuru and completed in Nairobi, these lightweight drop earrings tell a story of volcanic soil and brilliant local metalwork.",
    priceKES: 3800,
    priceUSD: 29.00,
    rating: 5.0,
    reviews: [
      { author: "Naisula E.", rating: 5, comment: "Absolute stunning craftsmanship. Extremely lightweight despite the stone. I love the volcanic connection!", date: "2026-06-20" }
    ],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Stone": "Genuine Polished Volcanic Obsidian from Rift Valley",
      "Metal": "Reclaimed Local Hammered Brass",
      "Drop Length": "4.5cm",
      "Hypoallergenic": "Yes, lead and nickel free posts"
    }
  },
  {
    id: "moh-20",
    name: "Hand-Stitched Safari Travel Duffel Bag",
    brand: "Limuru Leather Co.",
    category: "Lifestyle",
    description: "A luxury overnight weekend travel duffel bag made of robust full-grain cowhide leather and solid brass fittings.",
    detailedDescription: "Designed for luxury safaris and executive travel. This premium duffel is handcrafted in Limuru, Kenya from full-grain thick cowhide leather that develops a gorgeous vintage patina over time. It features a spacious interior lined with heavy-duty cotton canvas, heavy-duty brass zippers, reinforced leather shoulder straps, and a separate shoe compartment.",
    priceKES: 18500,
    priceUSD: 142.00,
    rating: 5.0,
    reviews: [
      { author: "David K.", rating: 5, comment: "Incredibly thick leather, magnificent solid brass details, and outstanding stitching. Fits my clothes for a 4-day trip perfectly.", date: "2026-07-12" }
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=70&w=400",
    inStock: true,
    specs: {
      "Material": "100% Full-Grain Limuru Cowhide Leather",
      "Fittings": "Heavy-Duty Solid Antique Brass buckle and zippers",
      "Lining": "Premium heavy cotton duck canvas",
      "Dimensions": "52cm x 28cm x 26cm (Cabin approved)"
    }
  }
];
