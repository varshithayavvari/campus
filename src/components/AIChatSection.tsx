import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Check,
  Copy,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { sanitizeWebhookUrl, getProxyUrl } from './ChatBox';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface AIChatSectionProps {
  webhookUrl?: string;
  onExploreMenu?: () => void;
}

const DEFAULT_WEBHOOK_URL =
  'https://varshitha16.app.n8n.cloud/webhook/c2f039a7-720b-41fa-8cbe-394d28b15ee8/chat';

const QUICK_QUESTIONS = [
  '🍛 What are today\'s lunch specials?',
  '🌱 Show pure veg options under ₹100',
  '🕒 What are the canteen opening timings?',
  '🎟️ What discount coupon codes can I use?',
  '⏱️ How long does food preparation take?',
  '📍 Where is the canteen located on campus?',
];

export const AIChatSection: React.FC<AIChatSectionProps> = ({
  webhookUrl = DEFAULT_WEBHOOK_URL,
  onExploreMenu,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'bot',
        text: "👋 **Welcome to CampusBites AI Dining Assistant!**\n\nI'm connected to the canteen kitchen system. I can help you with:\n* 🍛 **Menu & Prices**: Check dishes, calories, & ingredients\n* 🌱 **Dietary Filters**: Pure veg, vegan, & allergen info\n* 🎟️ **Coupons**: Save with `CAMPUS10`, `COMBO99`, `SNACKFEST`\n* 🕒 **Timings & Counter Info**: Track prep times and pickup\n\nWhat can I get for you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => {
    return 'canteen_web_' + Math.random().toString(36).substring(2, 9);
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: "Chat cleared! ✨ How can I help you with your canteen order now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const cleanUrl = sanitizeWebhookUrl(webhookUrl);
    const targetUrl = getProxyUrl(cleanUrl, true);

    const payload = {
      action: 'sendMessage',
      chatInput: text,
      sessionId: sessionId,
      metadata: {
        appName: 'CampusBites',
        clientTime: new Date().toISOString(),
        referrer: window.location.href,
      },
    };

    try {
      let response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      let responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Not JSON
      }

      // If proxy returned 404, try direct fetch once as fallback
      if (!response.ok && response.status === 404) {
        try {
          const directResp = await fetch(cleanUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json, text/plain, */*',
            },
            body: JSON.stringify(payload),
          });
          if (directResp.ok) {
            response = directResp;
            responseText = await directResp.text();
            try {
              responseJson = JSON.parse(responseText);
            } catch {}
          }
        } catch {
          // direct failed (CORS), keep proxy response
        }
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Webhook 404 Not Registered. Please ensure your workflow in n8n is toggled to Active.');
        }
        throw new Error(
          responseJson?.message || `Server responded with HTTP ${response.status}`
        );
      }

      let botResponse = '';
      if (typeof responseJson === 'object' && responseJson !== null) {
        if (typeof responseJson.output === 'string') {
          botResponse = responseJson.output;
        } else if (typeof responseJson.text === 'string') {
          botResponse = responseJson.text;
        } else if (typeof responseJson.message === 'string') {
          botResponse = responseJson.message;
        } else if (Array.isArray(responseJson) && responseJson.length > 0) {
          const item = responseJson[0];
          botResponse = item?.output || item?.text || item?.message || JSON.stringify(responseJson, null, 2);
        } else {
          botResponse = JSON.stringify(responseJson, null, 2);
        }
      } else {
        botResponse = responseText || 'Received empty reply from assistant.';
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('AIChatSection error:', err);
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        isError: true,
        text: `⚠️ **Unable to connect to n8n assistant**\n\n${err?.message || 'Connection error'}. Please check if the n8n workflow is active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 text-xs font-mono bg-amber-500/10 text-amber-800 dark:text-amber-300 rounded font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-sm leading-relaxed">
            <span className="text-amber-500 font-bold">•</span>
            <span className="flex-1">{renderInlineMarkdown(line.substring(2))}</span>
          </div>
        );
      }
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-sm leading-relaxed">
            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">{numMatch[1]}.</span>
            <span className="flex-1">{renderInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-sm leading-relaxed my-1">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  return (
    <section id="ai-assistant-section" className="py-12 md:py-16 bg-gradient-to-b from-slate-50 via-amber-500/5 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
              <Bot className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>CampusBites AI Concierge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Chat with Canteen AI
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Real-time answers powered by your n8n workflow. Ask about dishes, budget combos, dietary preferences, or canteen timings.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>n8n Cloud Live</span>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Main Chatbot Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Suggestion Prompts & Info (4 cols) */}
          <div className="lg:col-span-4 p-5 lg:p-6 bg-slate-50/70 dark:bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Questions</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Click any prompt below to query the AI assistant immediately:
              </p>
              
              <div className="space-y-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400/80 dark:hover:border-amber-600/80 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all duration-150 flex items-center justify-between group cursor-pointer disabled:opacity-50"
                  >
                    <span className="line-clamp-1">{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>FSSAI Certified Campus Dining</span>
              </div>
              <p>Operating Hours: Mon–Sat 8:00 AM – 8:30 PM</p>
              <p>Ground Floor, North Academic Block</p>
            </div>
          </div>

          {/* Right Panel: Interactive Message Flow & Input (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[520px]">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-amber-600 text-white'
                          : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm'
                      }`}
                    >
                      {isUser ? 'You' : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${
                        isUser
                          ? 'bg-amber-600 text-white rounded-tr-none'
                          : msg.isError
                          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 rounded-tl-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {/* Copy button for bot response */}
                      {!isUser && !msg.isError && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy reply"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      <div className="text-sm">
                        {renderFormattedText(msg.text)}
                      </div>

                      <div
                        className={`text-[10px] mt-2 font-medium flex items-center justify-end ${
                          isUser ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      CampusBites AI is thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about food, prices, specials, or timings..."
                  disabled={isLoading}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
