import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// We will load products directly on the server to pass to Gemini
import { PRODUCTS } from "./src/data/products.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get Product List
  app.get("/api/products", (req, res) => {
    res.json(PRODUCTS);
  });

  // API Route: AI Shopping Assistant
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid messages format" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Graceful fallback when API key is missing
      console.warn("GEMINI_API_KEY is not configured. Using friendly simulated response.");
      
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      const lower = lastUserMessage.toLowerCase();
      
      let answer = "Jambo! I'm your Moh Stylist AI Personal Concierge. I am running in local offline demo mode, but I can guide you through our premium Nairobi collection! For instance, our signature Nairobi Golden Hour Trench Coat is tailored with genuine Maasai Shuka lining and is a true showstopper. What can I help you find today?";
      
      if (lower.includes("trench") || lower.includes("coat") || lower.includes("jacket")) {
        answer = "The **Nairobi Golden Hour Trench Coat** is Moh Stylist's absolute masterpiece. Locally tailored with deep black water-resistant cotton, it features vibrant red and gold Maasai Shuka lining. It's the ultimate statement of Nairobi sophistication. Would you like me to help you add it to your cart?";
      } else if (lower.includes("serum") || lower.includes("glow") || lower.includes("beauty") || lower.includes("skin")) {
        answer = "Our **CBD Glow-Up Serum** is designed by Moh Beauty Lab to combat dry Nairobi weather and dust. It uses local chamomile from Naivasha and organic aloe vera from Laikipia paired with 2% Hyaluronic Acid. Perfect as a daily booster or a premium makeup primer!";
      } else if (lower.includes("book") || lower.includes("salon") || lower.includes("makeup") || lower.includes("hair") || lower.includes("styling")) {
        answer = "We have two premium booking services: the **VIP Hair Styling & Makeover Booking** (KES 8,500) and the **Personal Styling & Wardrobe Audit Consultation** (KES 12,000) directly with Moh. You can book them under the 'Shop Marketplace' category or contact us at 0708063447.";
      } else if (lower.includes("bag") || lower.includes("kiondo")) {
        answer = "Our **Luxury Black & Gold Woven Kiondo Bag** is handcrafted from local sisal fibers by master weavers in Machakos County. We've woven in metallic gold threads to create a midnight luxury look, complete with premium local black cowhide leather straps. It is sturdy enough for your laptop and chic enough for any event!";
      } else if (lower.includes("mpesa") || lower.includes("pay") || lower.includes("buy")) {
        answer = "To checkout, click on your shopping cart, select Checkout, choose 'M-Pesa Mobile Money', and enter your Kenyan phone number (e.g., 0712345678). You'll see a live STK push simulator right here in our Moh Stylist portal!";
      } else if (lower.includes("kimono")) {
        answer = "The **Maasai Bold-Print Modern Kimono** is a unisex, flowing satin outerwear piece inspired by traditional Maasai geometric beadwork. It utilizes a striking black, gold, and white palette, making it extremely easy to style for any Nairobi party or casual day out!";
      }

      res.json({
        content: answer,
        simulated: true,
      });
      return;
    }

    try {
      // Lazy initialization of Gemini client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Format conversation history for Gemini Chat
      // Gemini chats.create expects clean parameters
      const systemInstruction = `
You are "Moh Stylist AI Personal Concierge" - an exceptionally stylish, cultured, and friendly personal stylist and shopping assistant for a premium luxury marketplace in Nairobi called "Moh Stylist" (tagline: "Style. Shop. Shine.").
Your style is professional, warm, fashion-forward, and highly encouraging.

Here is our current product and service catalog for reference:
${JSON.stringify(PRODUCTS, null, 2)}

Instructions:
1. Always greet visitors with a warm, elegant Swahili welcome such as "Jambo!", "Habari, darling!", or "Karibu sana to Moh Stylist!"
2. Share the design philosophy behind our items: we combine modern, premium, black-and-gold aesthetic silhouettes with authentic, hand-stitched Kenyan crafts (like Maasai shukas, hammered brass from Jua Kali artisans, and hand-woven sisal Kiondos).
3. If users ask about services (VIP Hair makeover, personal styling sessions), encourage them to book, explaining that they take place in our luxury studio located near Utawala Shopping Mall, 1st Floor Suite, Utawala, Nairobi.
4. If users ask about prices, mention them in Kenyan Shillings (KES) and/or USD.
5. Keep your responses highly scannable, formatted with elegant markdown, and brief (2-3 short paragraphs max).
6. Do not manufacture products that are not in the catalog, but suggest styling combinations (e.g., pairing the Maasai Bold-Print Kimono with the Hand-Beaded Brass Collar for a stunning red-carpet ready ensemble).
`;

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      // Send the entire conversation or just the messages
      // chat has state, but since we are doing a stateless server-side endpoint, we can send messages sequentially or send the last user message with history.
      // Let's feed history to the chat
      let responseText = "Habari! Let me help you find the best of Kenya.";
      
      // Let's send messages to chat. If we have multiple messages, we can feed previous messages to build context
      // To keep it clean and robust without manual loops, let's send the last message but prepend a brief summary of history if available, or feed them sequentially.
      // Feeding sequentially:
      if (messages.length > 1) {
        // Feed previous messages
        for (let i = 0; i < messages.length - 1; i++) {
          const msg = messages[i];
          if (msg.role === "user") {
            await chat.sendMessage({ message: msg.content });
          }
        }
      }
      
      const lastMessage = messages[messages.length - 1]?.content || "Hello";
      const response = await chat.sendMessage({ message: lastMessage });
      responseText = response.text || responseText;

      res.json({
        content: responseText,
        simulated: false,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "Failed to communicate with AI Assistant. Please check if your Gemini API key is valid.",
        details: error.message,
      });
    }
  });

  // API Route: Simulate M-Pesa STK Push Payment
  app.post("/api/payment/mpesa", (req, res) => {
    const { phoneNumber, amount } = req.body;
    
    if (!phoneNumber) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    // Format check for +254 or 07/01...
    const cleanPhone = phoneNumber.trim();
    
    // Send simulated transaction steps
    res.json({
      success: true,
      checkoutRequestId: "ws_CO_120720261002348574",
      merchantRequestID: "29182-938173-1",
      customerMessage: "Simulated M-Pesa STK Push initiated successfully.",
      steps: [
        { status: "initiated", message: `Initiating Safaricom M-Pesa STK Push for KES ${amount.toLocaleString()}...` },
        { status: "sent", message: `STK Push prompt sent successfully to handset ${cleanPhone}.` },
        { status: "pending", message: "Awaiting customer to enter M-Pesa PIN on handset..." },
        { status: "processing", message: "PIN entered. Processing transaction on Safaricom network..." },
        { status: "completed", message: "Transaction completed! KES " + amount.toLocaleString() + " received. Receipt No. TKD98H28S2." }
      ]
    });
  });

  // API Route: Simulate Airtel Money Payment
  app.post("/api/payment/airtel", (req, res) => {
    const { phoneNumber, amount } = req.body;
    
    if (!phoneNumber) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    const cleanPhone = phoneNumber.trim();
    
    res.json({
      success: true,
      checkoutRequestId: "ws_CO_120720261102348599",
      merchantRequestID: "38291-102938-2",
      customerMessage: "Simulated Airtel Money Payment initiated successfully.",
      steps: [
        { status: "initiated", message: `Initiating Airtel Money STK Push for KES ${amount.toLocaleString()}...` },
        { status: "sent", message: `Airtel Money payment prompt sent successfully to handset ${cleanPhone}.` },
        { status: "pending", message: "Awaiting customer to enter Airtel Money PIN on handset..." },
        { status: "processing", message: "PIN entered. Processing transaction on Airtel secure gateway..." },
        { status: "completed", message: "Transaction completed! KES " + amount.toLocaleString() + " received. Reference No. ART39102X." }
      ]
    });
  });

  // Serve static assets in production, fall back to Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Moh Stylist Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Moh Stylist server:", err);
});
