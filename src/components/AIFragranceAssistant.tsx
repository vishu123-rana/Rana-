/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  X,
  RotateCcw,
  ShoppingBag,
  Eye,
  Star,
  ChevronRight,
  Bot,
  User as UserIcon,
  Filter,
  Check,
  Flame,
  Clock,
  Sparkle,
  Gift,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { perfumes } from '../data/perfumes';
import { Perfume } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedProducts?: Perfume[];
  timestamp: string;
}

interface AIFragranceAssistantProps {
  onSelectProduct: (product: Perfume) => void;
  onAddToCart: (product: Perfume) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const QUICK_PROMPTS = [
  { label: 'Under ₹2,000', query: 'Suggest perfumes under ₹2,000 with rich scent profiles.' },
  { label: 'Men\'s Luxury', query: 'Recommend a luxury perfume for men.' },
  { label: 'Wedding Scent', query: 'What is the best perfume for a wedding?' },
  { label: 'Summer Fresh', query: 'Suggest fresh summer fragrances.' },
  { label: 'Oud & Vanilla', query: 'Recommend perfumes with oud, vanilla, or floral notes.' },
  { label: 'Date Night', query: 'What fragrance should I wear on a date night?' },
  { label: 'Office Wear', query: 'Which perfume is best for office wear?' },
  { label: 'Similar to Sauvage / Aventus', query: 'Find perfumes similar to Dior Sauvage or Creed Aventus.' },
  { label: 'Gift Sets & Body Mists', query: 'Recommend matching body mist, deodorant, or luxury gift sets.' },
];

const COMPLEMENTARY_ITEMS: Perfume[] = [
  {
    id: 'rana-body-spray',
    name: 'RANA Velvet Oud Luxury Body Spray',
    price: 499,
    gender: 'men' as const,
    category: 'Men' as const,
    rating: 4.8,
    image: perfumes[1].image,
    notes: { top: ['Oud', 'Saffron'], heart: ['Rose'], base: ['Amber'] },
    ingredients: ['Oud', 'Saffron'],
    description: 'Refreshing post-shower body spray infused with precious oud and warm saffron notes.',
  },
  {
    id: 'rana-travel-atomizer',
    name: 'RANA Gold Essence Travel Atomizer (10ml)',
    price: 399,
    gender: 'women' as const,
    category: 'Women' as const,
    rating: 4.9,
    image: perfumes[7].image,
    notes: { top: ['Bergamot'], heart: ['Jasmine'], base: ['Sandalwood', 'Vanilla'] },
    ingredients: ['Sandalwood', 'Vanilla'],
    description: 'Pocket luxury brass travel spray pre-filled with Gold Essence Extrait.',
  },
  {
    id: 'rana-heritage-gift-set',
    name: 'RANA Royal Heritage Gift Box',
    price: 3499,
    gender: 'men' as const,
    category: 'Gift Sets' as const,
    rating: 5.0,
    image: perfumes[1].image,
    notes: { top: ['Oud', 'Rose'], heart: ['Patchouli'], base: ['Musk', 'Amber'] },
    ingredients: ['Oud', 'Rose', 'Patchouli'],
    description: 'Collector gift set featuring 100ml EDP, 50ml Body Lotion and a brass Travel Atomizer.',
    bestSeller: true,
  }
];

export default function AIFragranceAssistant({
  onSelectProduct,
  onAddToCart,
  isOpenExternal,
  onCloseExternal,
}: AIFragranceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to **RANA Luxury Fragrances**. I am your personal **AI Scent Concierge & Master Perfumer** powered by Google Gemini AI.

How may I guide your olfactory journey today? I can help you discover perfumes based on your budget, notes, occasion, or compare luxury scents.`,
      recommendedProducts: [perfumes[1], perfumes[7]],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [addedMessageId, setAddedMessageId] = useState<string | null>(null);

  // Preference filters state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    gender: 'Any',
    budget: 'Any',
    occasion: 'Any',
    notes: 'Any',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync external open state if controlled from navbar or footer
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Voice Input Recognition Setup
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Please type your message.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build conversation payload for server API
      const conversationPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/fragrance-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationPayload,
          userPreferences,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      // Find recommended products from catalog or complementary list
      const recommended: Perfume[] = [];
      const allSearchable = [...perfumes, ...COMPLEMENTARY_ITEMS];

      if (data.recommendedProductIds && Array.isArray(data.recommendedProductIds)) {
        data.recommendedProductIds.forEach((id: string) => {
          const found = allSearchable.find((p) => p.id === id);
          if (found && !recommended.some((r) => r.id === found.id)) {
            recommended.push(found);
          }
        });
      }

      // Fallback keyword matching if server response mentioned perfume names
      if (recommended.length === 0) {
        allSearchable.forEach((p) => {
          if (data.reply.toLowerCase().includes(p.name.toLowerCase())) {
            if (!recommended.some((r) => r.id === p.id)) {
              recommended.push(p);
            }
          }
        });
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        recommendedProducts: recommended.length > 0 ? recommended : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error fetching fragrance advice:', err);
      const errorMessage: Message = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `I apologize for the disturbance. I am currently refreshing my scent archives. 

In the meantime, you can explore our bestsellers like **RANA Royal Oud** or **RANA Gold Essence** in the catalog.`,
        recommendedProducts: [perfumes[1], perfumes[7]],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Your scent consultation history has been reset. How may I assist you with RANA Luxury Fragrances?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to format response text with bold and linebreaks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-neutral-200">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Process bold markers **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-[#173B5C]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-[#173B5C] mt-1 text-[10px]">♦</span>
                <span>{formattedLine.slice(0)}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON IN BOTTOM-RIGHT CORNER */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#0D263D] backdrop-blur-md border border-[#BFD9E8] text-white p-3.5 sm:p-4 rounded-full shadow-[0_10px_30px_rgba(13,38,61,0.25)] hover:bg-[#173B5C] transition-all duration-300 cursor-pointer"
            aria-label="Open AI Fragrance Assistant"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0D263D] shadow-inner">
              <Sparkles className="w-5 h-5 text-[#0D263D]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#BFD9E8] rounded-full border-2 border-[#0D263D] animate-ping" />
            </div>
            <div className="hidden sm:block text-left pr-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#BFD9E8]">Google Gemini AI</p>
              <p className="text-xs font-serif font-light text-white tracking-widest">Scent Concierge</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* FLOATING CHAT WINDOW / DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] md:w-[480px] h-[85vh] max-h-[680px] flex flex-col bg-[#0A0A0A] border border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden font-sans text-[#F5F5F5]"
          >
            {/* CHAT HEADER */}
            <div className="relative bg-[#0E0E0E] px-4 py-3.5 border-b border-[#1E1E1E] flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white flex items-center justify-center text-black">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-light text-sm tracking-widest text-white">RANA Scent Concierge</h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#1A1A1A] text-[#888888] border border-[#2A2A2A]">
                      Atelier AI
                    </span>
                  </div>
                  <p className="text-[10px] text-[#737373] flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Master Perfumer • Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`p-2 transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer border ${
                    showFilterPanel ? 'bg-white text-black border-white' : 'text-[#888888] hover:text-white border-transparent'
                  }`}
                  title="Preferences Filter"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px] uppercase">Preferences</span>
                </button>

                <button
                  onClick={handleClearHistory}
                  className="p-2 text-[#888888] hover:text-white transition-colors cursor-pointer"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleClose}
                  className="p-2 text-[#888888] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PREFERENCE FILTER PANEL (EXPANDABLE) */}
            <AnimatePresence>
              {showFilterPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#111111] border-b border-[#222222] p-3.5 text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white font-medium">
                      Personal Consultation Preferences
                    </span>
                    <button
                      onClick={() =>
                        setUserPreferences({ gender: 'Any', budget: 'Any', occasion: 'Any', notes: 'Any' })
                      }
                      className="text-[10px] text-[#737373] hover:text-white underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-[#888888] block mb-1 font-mono">Target Gender</label>
                      <select
                        value={userPreferences.gender}
                        onChange={(e) => setUserPreferences({ ...userPreferences, gender: e.target.value })}
                        className="w-full bg-[#181818] border border-[#282828] px-2 py-1.5 text-xs text-white focus:border-white outline-none"
                      >
                        <option value="Any">Any Gender</option>
                        <option value="Men">Men (Pour Homme)</option>
                        <option value="Women">Women (Pour Femme)</option>
                        <option value="Unisex">Unisex / Royalty</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#888888] block mb-1 font-mono">Budget Range</label>
                      <select
                        value={userPreferences.budget}
                        onChange={(e) => setUserPreferences({ ...userPreferences, budget: e.target.value })}
                        className="w-full bg-[#181818] border border-[#282828] px-2 py-1.5 text-xs text-white focus:border-white outline-none"
                      >
                        <option value="Any">Any Budget</option>
                        <option value="Under ₹1,500">Under ₹1,500</option>
                        <option value="₹1,500 - ₹2,500">₹1,500 - ₹2,500</option>
                        <option value="Luxury Above ₹2,500">Luxury Above ₹2,500</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#888888] block mb-1 font-mono">Occasion / Vibe</label>
                      <select
                        value={userPreferences.occasion}
                        onChange={(e) => setUserPreferences({ ...userPreferences, occasion: e.target.value })}
                        className="w-full bg-[#181818] border border-[#282828] px-2 py-1.5 text-xs text-white focus:border-white outline-none"
                      >
                        <option value="Any">Any Occasion</option>
                        <option value="Wedding / Grand Event">Wedding / Grand Event</option>
                        <option value="Date Night / Romantic">Date Night / Romantic</option>
                        <option value="Office / Business">Office / Business</option>
                        <option value="Casual / Summer Fresh">Casual / Summer Fresh</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#888888] block mb-1 font-mono">Preferred Scent Note</label>
                      <select
                        value={userPreferences.notes}
                        onChange={(e) => setUserPreferences({ ...userPreferences, notes: e.target.value })}
                        className="w-full bg-[#181818] border border-[#282828] px-2 py-1.5 text-xs text-white focus:border-white outline-none"
                      >
                        <option value="Any">Any Note</option>
                        <option value="Oud & Spices">Oud & Spices</option>
                        <option value="Vanilla & Tonka">Vanilla & Tonka</option>
                        <option value="Rose & Floral">Rose & Floral</option>
                        <option value="Sea Salt & Citrus">Sea Salt & Citrus</option>
                        <option value="Tobacco & Leather">Tobacco & Leather</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MESSAGES LIST AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080808]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-[#141414] border border-[#242424] flex items-center justify-center shrink-0 text-white mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3.5 ${
                        msg.role === 'user'
                          ? 'bg-white text-black font-normal rounded-none shadow-md'
                          : 'bg-[#121212] border border-[#222222] text-[#F5F5F5] rounded-none shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-xs sm:text-sm">{msg.content}</p>
                      ) : (
                        renderFormattedText(msg.content)
                      )}

                      <span
                        className={`text-[9px] font-mono mt-1.5 block text-right ${
                          msg.role === 'user' ? 'text-[#737373]' : 'text-[#666666]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* INTERACTIVE PRODUCT CARDS EMBEDDED IN CHAT */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#888888] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-white" /> Recommended Fragrances:
                        </p>

                        <div className="grid grid-cols-1 gap-2.5">
                          {msg.recommendedProducts.map((perfume) => (
                            <motion.div
                              key={perfume.id}
                              whileHover={{ y: -2 }}
                              className="bg-[#121212] border border-[#242424] hover:border-white p-2.5 flex items-center gap-3 transition-all group"
                            >
                              <img
                                src={perfume.image}
                                alt={perfume.name}
                                className="w-16 h-16 object-contain bg-[#070707] border border-[#1E1E1E] shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-serif font-light text-xs text-white truncate">
                                    {perfume.name}
                                  </h4>
                                  <span className="font-mono text-xs text-white">
                                    ₹{perfume.price.toLocaleString('en-IN')}
                                  </span>
                                </div>

                                <p className="text-[10px] text-[#737373] capitalize font-mono mt-0.5">
                                  {perfume.gender} • {perfume.notes.top.slice(0, 2).join(', ')}
                                </p>

                                <div className="flex items-center gap-1 mt-1 text-white text-[10px]">
                                  <Star className="w-3 h-3 fill-current text-white" />
                                  <span className="text-[#A3A3A3]">{perfume.rating}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => onSelectProduct(perfume)}
                                    className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#262626] text-[#A3A3A3] hover:text-white border border-[#2E2E2E] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Eye className="w-3 h-3 text-white" />
                                    <span>Details</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      onAddToCart(perfume);
                                      setAddedMessageId(perfume.id);
                                      setTimeout(() => setAddedMessageId(null), 1500);
                                    }}
                                    className="px-2.5 py-1 bg-white hover:bg-[#E5E5E5] text-black font-semibold text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    {addedMessageId === perfume.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-black" />
                                        <span>Added!</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-3 h-3 text-black" />
                                        <span>Add</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-white text-black flex items-center justify-center shrink-0 mt-1">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* TYPING / LOADING INDICATOR */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 bg-[#141414] border border-[#242424] flex items-center justify-center shrink-0 text-white">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
                  </div>
                  <div className="bg-[#121212] border border-[#242424] text-[#A3A3A3] p-3.5 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-150" />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-300" />
                    <span className="font-mono text-[10px] text-[#888888] ml-1">Consulting scent records...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SUGGESTIONS CAROUSEL CHIPS */}
            <div className="bg-[#0C0C0C] border-t border-[#1E1E1E] p-2 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 bg-[#141414] hover:bg-white text-[#888888] hover:text-black border border-[#242424] hover:border-white text-[11px] font-mono transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* CHAT INPUT FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0A0A0A] border-t border-[#1E1E1E] flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse'
                    : 'bg-[#141414] border-[#242424] text-[#737373] hover:text-white'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about notes, budget, occasions, or recommendations..."
                disabled={isLoading}
                className="flex-1 bg-[#121212] border border-[#242424] focus:border-white text-xs sm:text-sm text-white placeholder-[#555555] px-3.5 py-2.5 outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 bg-white hover:bg-[#E5E5E5] disabled:bg-[#222222] disabled:text-[#555555] text-black font-bold transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
