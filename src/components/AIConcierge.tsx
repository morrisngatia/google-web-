import React, { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, X, Send, User, Bot, HelpCircle, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Jambo! I am your **Moh Stylist AI Personal Concierge**. ✨\n\nI am here to guide you through our premium Nairobi collection, recommend bespoke fashion pieces, or help you book a luxury styling session in our Utawala Studio. \n\nHow can I elevate your style today? 🖤"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend?.trim() || input.trim();
    if (!text) return;

    if (!textToSend) setInput("");
    
    // Add user message
    const updatedMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with concierge");
      }

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant" as const, content: data.content }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sincere apologies, darling. I had a slight connection hitch on my Nairobi network. Let me simulate a personal stylist response for you: \n\nOur **Golden Hour Trench Coat** is highly recommended for Nairobi's cool mornings. Would you like me to tell you more about its custom Maasai Shuka lining?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Tell me about the Golden Hour Trench Coat",
    "How do I book a styling session?",
    "What are the latest Nairobi trends?",
    "How can I pay with M-Pesa?"
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        id="ai-concierge-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:scale-110 active:scale-95 transition-all duration-300 group border border-yellow-400"
        title="Chat with Moh AI Concierge"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-black border border-amber-400 text-[9px] font-bold text-amber-400 items-center justify-center">AI</span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-concierge-drawer"
          className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] rounded-2xl bg-[#0d0d0d] border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-black via-[#1a1a1a] to-black border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1.5px] flex items-center justify-center">
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">MOH CONCIERGE</h3>
                <span className="text-[10px] text-zinc-400 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  Personal Stylist • Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start space-x-2`}
              >
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-amber-400" />
                  </div>
                )}
                
                <div
                  className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500 text-black font-medium rounded-tr-none"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-1 whitespace-pre-line prose prose-invert prose-xs">
                      {msg.content.split("\n\n").map((paragraph, pIdx) => {
                        // Very simple bold formatting replacement
                        let formattedText = paragraph;
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const parts = [];
                        let lastIndex = 0;
                        let match;

                        while ((match = boldRegex.exec(paragraph)) !== null) {
                          // Add text before match
                          if (match.index > lastIndex) {
                            parts.push(paragraph.substring(lastIndex, match.index));
                          }
                          // Add bolded text
                          parts.push(<strong key={match.index} className="text-amber-400 font-bold">{match[1]}</strong>);
                          lastIndex = boldRegex.lastIndex;
                        }

                        if (lastIndex < paragraph.length) {
                          parts.push(paragraph.substring(lastIndex));
                        }

                        return (
                          <p key={pIdx}>
                            {parts.length > 0 ? parts : paragraph}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-zinc-400" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-start space-x-2">
                <div className="h-7 w-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-amber-400" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none p-3 max-w-[78%] flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 bg-black border-t border-zinc-900">
              <span className="text-[10px] text-zinc-500 flex items-center mb-1.5 font-medium uppercase tracking-wider">
                <HelpCircle className="h-3 w-3 mr-1 text-amber-400/70" /> Suggested styling questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="text-[10px] bg-zinc-900 hover:bg-amber-500/10 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/30 text-zinc-300 rounded-lg px-2.5 py-1 text-left transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-black border-t border-zinc-900 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Moh AI Concierge..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black flex items-center justify-center shadow-md shadow-amber-500/10 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
