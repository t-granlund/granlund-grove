// Floating portfolio chatbot widget
// Client-side RAG using the knowledge base. Zero external API calls.

import { useCallback, useEffect, useRef, useState } from "react";
import { processQuery, suggestedQuestions, type ChatMessage } from "@/lib/chatbot/engine";

const MESSAGE_KEY = "chat-widget-messages";
const OPEN_KEY = "chat-widget-open";

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return [
    {
      role: "assistant",
      text: "Hey there! Tyler is currently looking for his next opportunity. Ask me about his background, skills, projects, or how to reach him directly.",
    },
  ];
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
  } catch {
    /* noop */
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(OPEN_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_KEY, String(open));
    } catch {
      /* noop */
    }
  }, [open]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, typing]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const btn = document.querySelector("[data-chat-trigger]");
        if (btn && btn.contains(e.target as Node)) return;
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    // Simulate typing delay for natural feel
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const { response, sources } = processQuery(text);
      setTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", text: response, sources }]);
    }, delay);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    setInput("");
    sendMessage(trimmed);
  };

  const handleSuggested = (q: string) => {
    if (typing) return;
    sendMessage(q);
  };

  const clearChat = () => {
    const reset: ChatMessage[] = [
      {
        role: "assistant",
        text: "Chat cleared. Tyler is looking for his next opportunity. Ask about his background, skills, or how to get in touch.",
      },
    ];
    setMessages(reset);
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        data-chat-trigger
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cedar text-spruce-deep shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={open ? "Close chat" : "Open chat with Tyler's assistant"}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        {open ? (
          <CloseIcon />
        ) : (
          <>
            <ChatIcon />
            {/* Unread dot if messages exist beyond welcome */}
            {messages.length > 1 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-mist text-[10px] font-bold text-spruce-deep">
                {messages.filter((m) => m.role === "user").length}
              </span>
            )}
          </>
        )}
      </button>

      {/* ── Chat panel ── */}
      <div
        id="chat-panel"
        ref={panelRef}
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-3xl border border-border bg-card/90 backdrop-blur-xl shadow-2xl transition-all duration-300 sm:bottom-24 sm:right-6 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        role="dialog"
        aria-label="Chat with Tyler's portfolio assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cedar/20 text-cedar">
              <TreeIcon />
            </div>
            <div>
              <div className="font-display text-sm text-foreground">Ask about Tyler</div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cedar animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cedar/80">
                  Open to opportunities
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="rounded-lg p-2 text-stone/50 hover:text-stone hover:bg-white/5 transition-colors"
              aria-label="Clear conversation"
              title="Clear chat"
            >
              <ResetIcon />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-stone/50 hover:text-stone hover:bg-white/5 transition-colors"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[380px] overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-cedar/90 text-spruce-deep rounded-br-md"
                    : "bg-white/5 text-stone/90 rounded-bl-md border border-white/5"
                }`}
              >
                {msg.text.split("\n").map((line, li) => (
                  <p key={li} className={li > 0 ? "mt-2" : ""}>
                    {line}
                  </p>
                ))}
                {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.sources.map((s) => (
                      <span
                        key={s}
                        className="inline-block rounded-full border border-cedar/20 bg-cedar/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cedar/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/5 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-cedar/60"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-cedar/60"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-cedar/60"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions (when idle) */}
        {!typing && messages.length < 4 && (
          <div className="border-t border-border/40 px-6 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone/50 mb-2">
              Suggested
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggested(q)}
                  className="rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-[10px] text-stone/80 hover:border-cedar/40 hover:text-cedar transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Email CTA */}
        <div className="border-t border-border/40 px-6 py-3">
          <a
            href="mailto:hello@tylergranlund.com?subject=Opportunity%20for%20Tyler%20Granlund"
            className="flex items-center justify-center gap-2 rounded-xl border border-cedar/30 bg-cedar/[0.08] px-4 py-2.5 text-sm text-cedar hover:bg-cedar/[0.15] hover:border-cedar/50 transition-colors"
          >
            <MailIcon />
            <span>Email Tyler directly</span>
          </a>
          <p className="mt-2 text-center font-mono text-[9px] text-stone/40">
            hello@tylergranlund.com — for roles, questions, or just to say hi
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-border/60 px-6 py-4">
          <div className="flex items-center gap-3 rounded-full border border-border bg-white/5 px-4 py-2 focus-within:border-cedar/40 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Tyler's background..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-stone/40 outline-none"
              disabled={typing}
              aria-label="Type your question"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="rounded-full p-2 text-cedar hover:bg-cedar/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Send chat message"
            >
              <SendIcon />
            </button>
          </div>
          <div className="mt-2 text-center font-mono text-[9px] text-stone/40">
            Powered by site knowledge — no external API
          </div>
        </form>
      </div>
    </>
  );
}

// ── Icons ──
function ChatIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V8" />
      <path d="M5 12H2l10-8 10 8h-3" />
      <path d="M5 16H2l10-8 10 8h-3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 7-8.991 5.714a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}
