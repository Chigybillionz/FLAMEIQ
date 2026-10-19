"use client"

import React, { useState, useRef, useEffect } from "react";
import { Send, Search, Sparkles } from "lucide-react";

// Shared flame icon artwork — background color is the only thing that
// changes between the active (blue) and inactive (gray) states.
function FlameAvatarIcon({ active = true, size = 30 }: { active?: boolean; size?: number }) {

  return (
    <svg width={size} height={size} viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="91" height="91" rx="45.5" fill={active ? "#1F4E79" : "#868C98"} />
      <path d="M38.9446 35.1852C35.8676 37.5651 35.9373 40.631 38.3368 43.2311C40.3944 45.4628 43.3195 47.5844 45.7127 49.6722L46.3331 49.7103C48.5491 47.631 51.2018 45.6661 53.3355 43.5615C60.8886 36.0999 46.4154 29.4006 38.9509 35.1894L38.9446 35.1852ZM46.0862 44.9801C45.9089 45.069 45.586 44.2432 45.5291 44.1501C44.2438 42.1852 41.8063 40.4786 38.647 39.9154L41.5404 38.8228C43.6677 37.7641 45.2505 36.3031 46.0292 34.605C46.846 36.481 48.6694 38.2045 51.2208 39.1828C51.8476 39.4241 52.4808 39.5554 53.1075 39.746C53.2278 39.7841 53.3988 39.7968 53.4114 39.9154C49.7963 40.5252 47.1119 42.651 46.0862 44.9801Z" fill="#E2E4E9" />
      <path d="M48.9404 39.9151L47.25 40.6943L45.9648 41.9901C45.5026 41.1135 44.4199 40.3513 43.1853 39.9235L43.1094 39.7499C44.4579 39.3984 45.3063 38.5303 46.0851 37.7554C46.5029 38.7336 47.7692 39.3519 48.9404 39.9108V39.9151Z" fill="#E2E4E9" />
      <path d="M39.8628 45.3864C39.0967 46.7626 41.2873 47.4063 42.275 48.3295C43.0347 49.0452 43.3007 49.7693 43.1677 50.6459C42.9651 51.9714 40.8885 52.5388 40.6732 54.1946C40.5592 55.0796 41.0784 55.7148 41.4519 56.5279C36.5579 56.1637 32.1767 52.5515 34.7725 49.367C35.0321 49.8879 35.3296 50.485 35.9628 50.8703C36.6085 51.2642 37.2607 51.5267 37.7735 50.9338C38.7358 49.8201 37.0644 48.2871 38.1597 46.6822C38.299 46.4832 39.5526 45.2212 39.8628 45.3906V45.3864Z" fill="#E2E4E9" />
      <path d="M54.8307 51.2984C55.6411 51.2772 56.3629 50.7945 56.7301 50.3414C56.9453 50.0746 57.0846 49.6215 57.2492 49.4521C57.3505 49.3504 57.4202 49.3504 57.5215 49.4521C58.1926 50.1254 58.0596 51.9209 57.7241 52.6832C56.8187 54.7158 53.5708 56.3462 50.4432 56.5241C51.3865 55.3214 51.5131 54.1653 50.6014 52.9245C50.2216 52.4079 49.4998 52.0734 49.2276 51.633C48.7211 50.803 48.8097 49.9602 49.2529 49.1387C50.0886 47.5761 53.1213 46.9536 52.5641 45.1157C53.976 45.4799 54.9447 47.0213 54.932 47.9784C54.913 49.1302 53.3492 50.1974 54.837 51.2899L54.8307 51.2984Z" fill="#E2E4E9" />
      <path d="M46.0186 50.0742C47.9116 51.9587 50.8937 54.6138 47.4115 56.5745C45.9933 57.3706 45.0689 56.9599 44.0496 56.0791C41.5804 53.949 44.1636 51.8486 46.0249 50.0742H46.0186Z" fill="#E2E4E9" />
    </svg>
  );
}

const QUICK_PROMPTS = [
  "How much did I spend on gas this month?",
  "When should I place my next order?",
  "How much gas do I have left?",
  "Show my previous gas orders",
  "When will my gas run out?",
  "When should I refill?",
];

// Deterministic mock "intelligence" — scripted answers keyed by intent.
function mockReply(userText: string) {
  const t = userText.toLowerCase();

  if (t.includes("spend") || t.includes("spent") || t.includes("cost this")) {
    return "You've spent ₦31,600 on gas this month across 2 refills — about 8% less than last month. Your average refill cost is ₦15,800.";
  }
  if (t.includes("next order") || t.includes("place my next")) {
    return "Based on your usage, your next order should go out around August 29th. I can schedule it now, or you can place it manually from Order Gas.";
  }
  if (t.includes("previous") || t.includes("order history") || t.includes("past order")) {
    return "Your last 3 orders: 12.5kg on Aug 3rd (₦15,800), 12.5kg on Jul 12th (₦15,400), and 6kg on Jun 28th (₦8,200). Want the full list in Order History?";
  }
  if (t.includes("refill")) {
    return "Based on your usage pattern, you're averaging about 0.6kg of cooking gas a day. At that rate, I'd recommend scheduling a refill by Friday so you don't run close to empty over the weekend. Want me to place a Smart Refill order for you?";
  }
  if (t.includes("run out") || t.includes("empty")) {
    return "At your current usage rate, your 12.5kg cylinder should last approximately 9 more days — putting you at empty around September 1st. I'll send a reminder 2 days before that.";
  }
  if (t.includes("how much") || t.includes("left") || t.includes("level")) {
    return "Your cylinder is currently at about 38% — roughly 4.8kg remaining. That's based on your last smart sensor sync, 3 hours ago.";
  }
  if (t.includes("order") && (t.includes("place") || t.includes("yes"))) {
    return "Got it — I've drafted a 12.5kg refill order to your default address, arriving within 24 hours. Head to Order Gas to confirm and pay.";
  }
  if (t.includes("price") || t.includes("cost") || t.includes("how much is")) {
    return "A standard 12.5kg refill is currently ₦15,800 in your area. Prices can shift slightly with market rates, so I'll always show the live price at checkout.";
  }
  if (t.includes("hi") || t.includes("hello") || t.includes("hey")) {
    return "Hey! I'm your FlameIntel assistant. I can tell you how much gas you have left, when you're likely to run out, or help you schedule a refill. What would you like to know?";
  }

  return "I can help with that — could you tell me a bit more? In the meantime, you can ask me things like \"how much gas do I have left\" or \"when should I refill.\"";
}

function TypingDots() {
  return (
    <div className="fi-typing">
      <span></span><span></span><span></span>
    </div>
  );
}

type Message = {
  role: "bot" | string;
  text: string;
};

function ChatMessage({ role, text }: { role: "bot" | string; text: string }) {



  const isBot = role === "bot";
  return (
    <div className={`fi-msg-row ${isBot ? "fi-row-bot" : "fi-row-user"}`}>
      {isBot && (
        <div className="fi-avatar">
          <FlameAvatarIcon active={true} />
        </div>
      )}
      <div className={`fi-bubble ${isBot ? "fi-bubble-bot" : "fi-bubble-user"}`}>
        {text}
      </div>
    </div>
  );
}

function AssistantPanel({ messages, isTyping, input, setInput, onSend, scrollRef }: {
  messages: Message[];
  isTyping: boolean;
  input: string;
  setInput: (value: string) => void;
  onSend: (input: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSend(input);
  }


  return (
    <div className="fi-assistant">
      <div className="fi-assistant-header">
        <div className="fi-assistant-title">
          <span>FlameIntel Assistant</span>
          <span className="fi-status"><span className="fi-status-dot"></span>Online</span>
        </div>
        <div className="fi-assistant-subtitle">Your smart gas companion</div>
      </div>

      <div className="fi-chat-scroll" ref={scrollRef}>
        {messages.map((message: Message, i: number) => (
  <ChatMessage key={i} role={message.role} text={message.text} />
))}
        {isTyping && (
          <div className="fi-msg-row fi-row-bot">
            <div className="fi-avatar">
              <FlameAvatarIcon active={false} />
            </div>
            <div className="fi-bubble fi-bubble-bot fi-bubble-typing">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <form className="fi-input-row" onSubmit={handleSubmit}>
        <input
          className="fi-input"
          type="text"
          placeholder="How can I help with your gas today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="fi-send-btn" type="submit" disabled={!input.trim() || isTyping} aria-label="Send">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

type SidePanelProps = {
  history: string[];
  isTyping: boolean;
  onPromptClick: (input: string) => void;
};
function SidePanel({ history, isTyping, onPromptClick }: SidePanelProps) {
  return (
    <aside className="fi-side">
      <div className="fi-side-card">
        <div className="fi-side-title">
          <Sparkles size={15} />
          <span>Quick Prompts</span>
        </div>
        <div className="fi-side-list">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              className="fi-pill"
              onClick={() => onPromptClick(q)}
              disabled={isTyping}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="fi-side-card">
        <div className="fi-side-title">
          <Search size={15} />
          <span>Search History</span>
        </div>
        <div className="fi-side-list">
          {history.length === 0 ? (
            <div className="fi-side-empty">Questions you ask will show up here.</div>
          ) : (
            history.map((q, i) => (
              <button
                key={`${q}-${i}`}
                className="fi-pill"
                onClick={() => onPromptClick(q)}
                disabled={isTyping}
              >
                {q}
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}


export default function FlameIntelApp() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your FlameIntel assistant. Ask me anything about your gas usage, refills, or orders." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
 // const scrollRef = useRef(null);
const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: mockReply(trimmed) }]);
      setIsTyping(false);
    }, delay);
  }

  // Most recent unique user questions, newest first.
  const searchHistory: string[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === "user" && !searchHistory.includes(m.text)) {
      searchHistory.push(m.text);
    }
    if (searchHistory.length >= 6) break;
  }

  return (
    <div className="fi-app">
      <style>{`
        .fi-app {
          --fi-navy: #17324d;
          --fi-navy-deep: #102437;
          --fi-blue: #2f6fb0;
          --fi-amber: #f5a623;
          --fi-bg: #f6f8fa;
          --fi-card: #ffffff;
          --fi-border: #e6eaee;
          --fi-text: #1c2b3a;
          --fi-muted: #7c8a99;
          --fi-green: #35b06b;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
          display: flex;
          height: 640px;
          background: var(--fi-bg);
          color: var(--fi-text);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--fi-border);
        }

        /* Main panel */
        .fi-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Assistant */
        .fi-assistant { display: flex; flex-direction: column; height: 100%; }
        .fi-assistant-header {
          padding: 14px 20px;
          border-bottom: 1px solid var(--fi-border);
          background: var(--fi-card);
        }
        .fi-assistant-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 14.5px;
        }
        .fi-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
          font-size: 12px;
          color: var(--fi-muted);
        }
        .fi-status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--fi-green);
        }
        .fi-assistant-subtitle {
          font-size: 12px;
          color: var(--fi-muted);
          margin-top: 2px;
        }

        .fi-chat-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .fi-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 78%;
        }
        .fi-row-bot { align-self: flex-start; }
        .fi-row-user { align-self: flex-end; flex-direction: row-reverse; margin-left: auto; }
        .fi-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .fi-bubble {
          padding: 10px 13px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.5;
        }
        .fi-bubble-bot {
          background: #fff;
          border: 1px solid var(--fi-border);
          border-bottom-left-radius: 4px;
        }
        .fi-bubble-user {
          background: var(--fi-navy);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .fi-bubble-typing { padding: 12px 16px; }
        .fi-typing { display: flex; gap: 4px; }
        .fi-typing span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--fi-muted);
          animation: fi-bounce 1.2s infinite ease-in-out;
        }
        .fi-typing span:nth-child(2) { animation-delay: 0.15s; }
        .fi-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes fi-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .fi-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px 18px 20px;
          border-top: 1px solid var(--fi-border);
          background: var(--fi-card);
        }
        .fi-input {
          flex: 1;
          border: 1px solid var(--fi-border);
          border-radius: 22px;
          padding: 10px 16px;
          font-size: 13.5px;
          outline: none;
          background: var(--fi-bg);
        }
        .fi-input:focus { border-color: var(--fi-blue); background: #fff; }
        .fi-send-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: none;
          background: var(--fi-navy);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }
        .fi-send-btn:disabled { opacity: 0.4; cursor: default; }

        /* Right-hand side panel */
        .fi-side {
          width: 250px;
          flex-shrink: 0;
          border-left: 1px solid var(--fi-border);
          background: var(--fi-bg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }
        .fi-side-card {
          background: var(--fi-card);
          border: 1px solid var(--fi-border);
          border-radius: 12px;
          padding: 14px;
        }
        .fi-side-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 13.5px;
          color: var(--fi-text);
          margin-bottom: 10px;
        }
        .fi-side-title svg { color: var(--fi-blue); }
        .fi-side-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .fi-pill {
          background: var(--fi-bg);
          border: 1px solid var(--fi-border);
          color: var(--fi-text);
          border-radius: 18px;
          padding: 8px 12px;
          font-size: 12px;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .fi-pill:hover:not(:disabled) { background: #eef3f8; border-color: var(--fi-blue); }
        .fi-pill:disabled { opacity: 0.5; cursor: default; }
        .fi-side-empty {
          font-size: 12px;
          color: var(--fi-muted);
          line-height: 1.5;
        }
      `}</style>

      <main className="fi-main">
        <AssistantPanel
          messages={messages}
          isTyping={isTyping}
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          scrollRef={scrollRef}
        />
      </main>

      <SidePanel history={searchHistory} isTyping={isTyping} onPromptClick={sendMessage} />
    </div>
  );
}