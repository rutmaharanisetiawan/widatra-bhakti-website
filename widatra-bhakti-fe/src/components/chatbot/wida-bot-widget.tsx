import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-client";
import mascotImg from "@/assets/mascot-widabot-peeking.png";
import mascotAvatar from "@/assets/mascot-widabot-avatar.png";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isGuardrail?: boolean;
}

const INITIAL_SUGGESTIONS = [
  "Profil PT Widatra Bhakti & Otsuka",
  "Produk Infus Dasar (NaCl, RL, Dextrose)",
  "Fasilitas Pabrik Pandaan",
  "Info Karier & Lowongan Kerja",
  "Cara Kerja Sama Rumah Sakit",
];

function cleanNaturalProse(text: string): string {
  return text
    // Remove markdown heading hashes: ### Title -> Title
    .replace(/^#{1,6}\s*/gm, "")
    // Remove bold/italic asterisks: **text** -> text, *text* -> text
    .replace(/\*{1,3}(.*?)\*{1,3}/gs, "$1")
    .replace(/\*/g, "")
    // Remove backticks: `code` -> code
    .replace(/`{1,3}(.*?)`{1,3}/gs, "$1")
    .replace(/`/g, "")
    // Convert markdown list dashes or asterisks at start of lines into clean round bullet •
    .replace(/^\s*[-•]\s+/gm, "• ")
    // Remove horizontal rule dividers (---, ***, ___)
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Normalize triple newlines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function NaturalChatText({ text }: { text: string }) {
  const cleanedText = cleanNaturalProse(text);
  const lines = cleanedText.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      elements.push(<div key={`spacer-${i}`} className="h-2" />);
      continue;
    }

    // Bullet point line
    if (trimmed.startsWith("• ")) {
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 pl-1.5 my-1 text-[12px] sm:text-[12.5px] leading-relaxed">
          <span className="text-[#0284c7] font-bold select-none text-base leading-none mt-0.5">•</span>
          <span className="flex-1 text-slate-800 dark:text-slate-100">{trimmed.slice(2)}</span>
        </div>
      );
      continue;
    }

    // Numbered line: 1. atau 2.
    const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 pl-1.5 my-1 text-[12px] sm:text-[12.5px] leading-relaxed">
          <span className="text-[#0284c7] font-bold select-none text-[12px] sm:text-[12.5px] leading-relaxed min-w-[16px]">
            {numMatch[1]}
          </span>
          <span className="flex-1 text-slate-800 dark:text-slate-100">{numMatch[2]}</span>
        </div>
      );
      continue;
    }

    // Heading / Section Title detection (short capitalized lines or lines ending with colon)
    const isSectionHeader =
      (trimmed.endsWith(":") && trimmed.length < 80) ||
      (trimmed.length < 60 && !trimmed.endsWith(".") && i < lines.length - 1 && lines[i + 1].trim().startsWith("• "));

    if (isSectionHeader) {
      elements.push(
        <div
          key={`header-${i}`}
          className="font-bold text-[12.5px] sm:text-[13px] text-[#0284c7] dark:text-sky-300 mt-2.5 mb-1"
        >
          {trimmed}
        </div>
      );
      continue;
    }

    // Regular natural paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1 text-[12px] sm:text-[12.5px] leading-relaxed text-slate-800 dark:text-slate-100">
        {trimmed}
      </p>
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
}

/**
 * Coby Interactive Peeking Mascot & Gemini Chatbot Widget
 * Fixed at bottom-right (bottom: 24px, right: 24px, z-index: 999).
 */
export function WidaBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wida-bot-docked") === "true";
    }
    return false;
  });
  const [isPeekingHovered, setIsPeekingHovered] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Halo! Saya Coby, maskot dan asisten virtual resmi PT Widatra Bhakti (anggota Otsuka Group Indonesia). Ada yang bisa Coby bantu seputar profil perusahaan, produk cairan infus medis, fasilitas pabrik Pandaan, info karier, atau kerja sama faskes?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

  // Send message to backend Gemini API
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history for backend API
      const history = messages.slice(-8).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }],
      }));

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await res.json();
      const botReply =
        data.reply ||
        "Mohon maaf, saat ini sistem sedang memproses antrean. Silakan coba beberapa saat lagi atau hubungi layanan pelanggan kami di info@widatra.com.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isGuardrail: data.model === "guardrail-local",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Mohon maaf, terjadi gangguan koneksi ke server asisten virtual. Silakan periksa jaringan internet Anda atau hubungi email info@widatra.com.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Percakapan telah direset. Silakan tanyakan hal baru yang ingin Anda ketahui seputar PT Widatra Bhakti bersama Coby!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* =========================================================
          DOCKED VERTICAL SIDE TAB + PEEKING MASCOT (MENGINTIP DI TEPI KANAN LAYAR)
          Tampil vertikal ringkas & mundur ke kanan agar tidak mengganggu bacaan di mobile/desktop
      ========================================================= */}
      <div
        className={cn(
          "wida-bot-launcher fixed bottom-20 sm:bottom-24 right-0 z-[999] select-none transition-all duration-300 ease-out",
          isOpen || !isDocked
            ? "pointer-events-none opacity-0 translate-x-full"
            : "pointer-events-auto opacity-95 hover:opacity-100 translate-x-0"
        )}
      >
        <div
          onClick={() => {
            setIsDocked(false);
            localStorage.setItem("wida-bot-docked", "false");
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsDocked(false);
              localStorage.setItem("wida-bot-docked", "false");
            }
          }}
          aria-label="Tampilkan Chatbot Coby"
          title="Tampilkan Asisten Coby"
          className="relative group flex items-center cursor-pointer"
        >
          {/* LAYER 1 (z-10): Mascot Coby Mengintip Ringkas dari Balik Sisi Kiri Tab Vertikal */}
          <div
            className="absolute -left-[20px] sm:-left-[28px] top-1/2 -translate-y-1/2 z-10 w-[38px] sm:w-[50px] -rotate-[22deg] group-hover:-translate-x-1.5 group-hover:-rotate-[28deg] group-hover:scale-105 transition-all duration-300 ease-out pointer-events-none"
            style={{ willChange: "transform" }}
          >
            <img
              src={mascotImg}
              alt="Coby Maskot Mengintip di Samping"
              className="w-full h-auto object-contain drop-shadow-[-4px_6px_10px_rgba(2,132,199,0.32)]"
              draggable={false}
            />
          </div>

          {/* LAYER 2 (z-20): Slim Vertical Pill Bar Docked Flush on Right Edge */}
          <div className="relative z-20 flex flex-col items-center justify-between py-2 sm:py-2.5 px-1 sm:px-1.5 min-h-[125px] sm:min-h-[155px] rounded-l-[14px] sm:rounded-l-[18px] bg-gradient-to-b from-[#0E3192] via-[#0284c7] to-[#0E3192] text-white shadow-[-6px_8px_20px_-4px_rgba(14,49,146,0.45)] border-y border-l border-white/25 translate-x-0 group-hover:pr-2 transition-all duration-300">
            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6] text-white/90 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />

            <span
              className="my-1.5 sm:my-2 text-[9px] sm:text-[10.5px] font-extrabold tracking-[0.03em] text-white whitespace-nowrap leading-none"
              style={{ writingMode: "vertical-rl" }}
            >
              Coby AI Assistant
            </span>

            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6] text-white/90 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* =========================================================
          WIDGET TRIGGER: PEEKING MASCOT (MENGINTIP DI SUDUT KANAN BAWAH)
          Position: Fixed bottom: 24px; right: 24px; z-index: 999
      ========================================================= */}
      <div
        className={cn(
          "wida-bot-launcher fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-[999] select-none transition-all duration-300 ease-out",
          isOpen || isDocked
            ? "pointer-events-none opacity-0 translate-y-6 scale-90"
            : "pointer-events-auto opacity-100 translate-y-0 scale-100"
        )}
      >
        <div
          onMouseEnter={() => setIsPeekingHovered(true)}
          onMouseLeave={() => setIsPeekingHovered(false)}
          className="relative group flex items-end justify-end"
        >
          {/* 
            LAYER 1 (z-index: 10): MASCOT BOTOL INFUS WIDATRA
            Bagian kaki tersembunyi di balik kapsul, hanya kepala botol,
            mata ceria, dan tangan melambai yang tampak mengintip keluar.
          */}
          <div
            onClick={() => setIsOpen(true)}
            className={cn(
              "absolute -top-[76px] sm:-top-[82px] right-12 sm:right-14 z-10 w-[90px] sm:w-[102px] cursor-pointer transition-transform duration-300 ease-out",
              isPeekingHovered
                ? "-translate-y-4 rotate-2 scale-105"
                : "animate-wida-float"
            )}
            style={{ willChange: "transform" }}
          >
            <img
              src={mascotImg}
              alt="Coby Maskot Infus Mengintip"
              className="w-full h-auto object-contain drop-shadow-[0_10px_16px_rgba(2,132,199,0.35)]"
              draggable={false}
            />
          </div>

          {/* 
            LAYER 2 (z-index: 20): KAPSUL TEKS "Butuh bantuan ?" + TOMBOL TUTUP + TOMBOL CHAT
          */}
          <div className="relative z-20 flex items-center gap-2">
            {/* Kapsul Teks Interaktif */}
            <div className="flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-200/80 dark:border-sky-700/80 shadow-[0_12px_32px_-6px_rgba(2,132,199,0.35)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.7)] group-hover:border-[#0284c7] transition-all duration-300">
              <div
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Buka Chatbot Asisten Coby"
                onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0284c7] transition-colors whitespace-nowrap">
                  Butuh bantuan ?
                </span>
              </div>

              {/* Tombol Minimize / Sembunyikan ke Samping */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDocked(true);
                  localStorage.setItem("wida-bot-docked", "true");
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-0.5 cursor-pointer"
                title="Sembunyikan Coby ke samping layar"
                aria-label="Sembunyikan Coby ke samping layar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tombol Aksi Lingkaran Biru Medis (#0284c7) dengan Ikon Chat Balon */}
            <div
              onClick={() => setIsOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Buka Chatbot Asisten Coby"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white flex items-center justify-center shadow-[0_10px_28px_rgba(2,132,199,0.48)] group-hover:scale-108 group-hover:shadow-[0_14px_34px_rgba(2,132,199,0.65)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          POP-UP JENDELA OBROLAN (CHAT WINDOW DRAWER ~360px × 520px)
          Fixed bottom: 24px; right: 24px; z-index: 1000
      ========================================================= */}
      <div
        className={cn(
          "fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[1000] w-[calc(100vw-2rem)] sm:w-[370px] md:w-[390px] h-[540px] max-h-[calc(100vh-2.5rem)] rounded-[28px] overflow-hidden flex flex-col transition-all duration-300 ease-out",
          "bg-white dark:bg-slate-900 shadow-[0_24px_70px_-10px_rgba(2,132,199,0.45)] dark:shadow-[0_24px_70px_-10px_rgba(0,0,0,0.85)] border border-sky-100 dark:border-sky-900/60 ring-1 ring-black/5",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        )}
        role="dialog"
        aria-label="Coby Chat Window"
      >
        {/* HEADER: Coby, Avatar Maskot, Indikator Hijau Online, Tombol Tutup */}
        <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0E3192] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md relative z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar Maskot Bulat */}
            <div className="relative w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex-shrink-0 ring-2 ring-sky-300/60">
              <img
                src={mascotAvatar}
                alt="Coby Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-tight leading-none text-white">
                  Coby
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-bold uppercase tracking-wider text-sky-100">
                  Resmi
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-sky-100/90 mt-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online · Asisten Virtual Resmi PT Widatra Bhakti</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearChat}
              title="Reset Percakapan"
              className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-sky-100 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Tutup Chat"
              className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-sky-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AREA PESAN DENGAN BUBBLE CHAT USER & BOT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/80 dark:bg-slate-950/70 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-2.5 items-end",
                m.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {m.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 p-0.5 shadow-xs flex-shrink-0 border border-sky-100 dark:border-sky-900">
                  <img
                    src={mascotAvatar}
                    alt="Coby"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed",
                  m.sender === "user"
                    ? "bg-gradient-to-tr from-[#0284c7] to-[#0369a1] text-white rounded-br-xs whitespace-pre-line text-[12px] sm:text-[12.5px]"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/60 rounded-bl-xs"
                )}
              >
                {m.sender === "bot" ? (
                  <NaturalChatText text={m.text} />
                ) : (
                  m.text
                )}
                <div
                  className={cn(
                    "text-[9px] mt-1 text-right font-mono opacity-65",
                    m.sender === "user" ? "text-sky-100" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator saat menunggu jawaban Gemini */}
          {isLoading && (
            <div className="flex gap-2.5 items-end justify-start">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 p-0.5 shadow-xs flex-shrink-0 border border-sky-100">
                <img
                  src={mascotAvatar}
                  alt="Coby Typing"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTIONS CHIPS (HANYA MUNCUL JIKA PESAN MASIH SEDIKIT) */}
        {messages.length <= 3 && !isLoading && (
          <div className="px-3.5 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/60 dark:border-slate-800 flex-shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>Saran Pertanyaan:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INITIAL_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-[#0284c7] transition-all text-left truncate max-w-full"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INPUT BAR: Kolom Teks & Tombol Kirim */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Tanyakan seputar produk & pabrik Widatra..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-sky-500/20 transition-all disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white flex items-center justify-center hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1.5 text-center text-[9px] text-slate-400 dark:text-slate-500">
            Coby maskot resmi Otsuka Group. Penggunaan cairan infus harus di bawah pengawasan medis.
          </div>
        </div>
      </div>
    </>
  );
}
