import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Settings2,
  Copy,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
  errorHint?: string;
  errorType?: 'inactive_workflow' | 'network' | 'generic';
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialWebhookUrl?: string;
}

const DEFAULT_WEBHOOK_URL =
  'https://varshitha16.app.n8n.cloud/webhook/5add194e-cd98-4a61-86e9-f204cb66b461/chat';

const QUICK_PROMPTS = [
  '🍛 What are today\'s lunch specials?',
  '⏱️ What are the canteen opening timings?',
  '🌱 Show vegetarian dishes under ₹100',
  '📦 How does token order pickup work?',
  '☕ What hot beverages are available?',
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  isOpen,
  onClose,
  onOpen,
  initialWebhookUrl = DEFAULT_WEBHOOK_URL,
}) => {
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('campusbites_chat_webhook') || initialWebhookUrl;
  });
  const [useProxy, setUseProxy] = useState<boolean>(() => {
    return localStorage.getItem('campusbites_chat_proxy') !== 'false';
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('campusbites_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: "👋 **Hi there! Welcome to CampusBites AI Support.**\n\nI'm your 24/7 canteen dining assistant powered by your n8n workflow. Ask me anything about today's menu, specials, preparation times, dietary options, or order pickup!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    let sid = localStorage.getItem('campusbites_chat_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('campusbites_chat_session_id', sid);
    }
    return sid;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusbites_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const defaultMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: "👋 **Conversation reset.** How can I assist you with your campus canteen order today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([defaultMsg]);
    const newSid = 'session_' + Math.random().toString(36).substring(2, 10);
    setSessionId(newSid);
    localStorage.setItem('campusbites_chat_session_id', newSid);
  };

  const sendToWebhook = async (userText: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const targetUrl = useProxy
      ? `/api/n8n-proxy/webhook/${webhookUrl.replace(/^https?:\/\/[^/]+\/webhook\//, '')}`
      : webhookUrl;

    const payload = {
      action: 'sendMessage',
      chatInput: userText,
      sessionId: sessionId,
      metadata: {
        appName: 'CampusBites',
        clientTime: new Date().toISOString(),
        referrer: window.location.href,
      },
    };

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Not JSON
      }

      if (!response.ok) {
        // Handle n8n specific 404 inactive workflow
        if (response.status === 404 && responseJson?.hint) {
          const botErrorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            isError: true,
            errorType: 'inactive_workflow',
            errorHint: responseJson.hint,
            text: `⚠️ **n8n Workflow Inactive or Not Registered**\n\nThe webhook URL is configured, but n8n returned: \n*"${responseJson.message || 'Webhook not registered'}"*\n\n### 💡 How to activate in n8n:\n1. Open your workflow in your **n8n editor** (${webhookUrl.replace(/\/webhook\/.*/, '')}).\n2. In the top-right corner, toggle the switch from **Inactive** to **Active**.\n3. Make sure your workflow starts with an **n8n Chat Trigger** node.\n*(If you are testing inside the editor canvas, use the test webhook URL /webhook-test/...)*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botErrorMsg]);
          return;
        }

        // Handle n8n specific 500 "Error in workflow"
        if (response.status === 500 || responseJson?.message === 'Error in workflow') {
          const botErrorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            isError: true,
            errorType: 'generic',
            text: `⚠️ **n8n Workflow Execution Error (HTTP 500)**\n\nThe message successfully reached your n8n workflow, but a node inside the workflow failed while processing.\n\n### 🔍 How to diagnose in n8n:\n1. Open your **n8n cloud dashboard**.\n2. In the left sidebar, click on **Executions**.\n3. Open the top red execution marked **Error**.\n4. Click on the node that highlighted red to see the exact issue:\n   - **LLM / Model Node**: Check if your AI API Key (OpenAI, Gemini, Anthropic) is valid and has credits.\n   - **AI Agent Node**: Check that the prompt or chat memory node is properly wired.\n   - **Output**: Ensure the final node outputs a \`text\` or \`output\` field.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botErrorMsg]);
          return;
        }

        throw new Error(
          responseJson?.message || `Server responded with status ${response.status}: ${response.statusText}`
        );
      }

      // Parse success response from n8n
      let botResponse = '';
      if (typeof responseJson === 'object' && responseJson !== null) {
        if (typeof responseJson.output === 'string') {
          botResponse = responseJson.output;
        } else if (typeof responseJson.text === 'string') {
          botResponse = responseJson.text;
        } else if (typeof responseJson.message === 'string') {
          botResponse = responseJson.message;
        } else if (Array.isArray(responseJson)) {
          // If n8n returns array of items [{ text: ... }]
          const first = responseJson[0];
          botResponse = first?.output || first?.text || first?.message || JSON.stringify(responseJson, null, 2);
        } else {
          botResponse = JSON.stringify(responseJson, null, 2);
        }
      } else {
        botResponse = responseText || 'Received empty response from assistant.';
      }

      const botSuccessMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botSuccessMsg]);
    } catch (err: any) {
      console.error('Chat webhook error:', err);

      // Try direct fetch if proxy failed, or vice versa
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        isError: true,
        errorType: 'generic',
        text: `❌ **Connection Issue**\n\nCould not reach the n8n chat webhook.\n\n**Details:** ${err.message || 'Network request failed'}\n\n**Troubleshooting:**\n- Ensure your n8n workflow is **Active**.\n- Check if CORS origin is allowed in n8n Chat Trigger.\n- You can toggle the proxy mode or update the webhook URL in the chat settings above (⚙️).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isLoading) return;
    setInputMessage('');
    sendToWebhook(trimmed);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    sendToWebhook(prompt);
  };

  const formatMessageText = (content: string) => {
    // Basic Markdown formatting helper for bold, lists, and linebreaks
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      let formatted: React.ReactNode = line;
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-sm mt-2 mb-1 text-slate-900 dark:text-amber-300">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletContent = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed my-0.5">
            {renderInlineMarkdown(bulletContent)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs leading-relaxed my-0.5">
            {renderInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // Regex for bold **text** and code `code`
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
          <code key={i} className="px-1 py-0.5 text-[11px] font-mono bg-slate-200/80 dark:bg-slate-800 rounded">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button (When Closed) */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-center gap-3">
          {/* Subtle tooltip invite banner */}
          <div className="hidden lg:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-semibold text-slate-800 dark:text-slate-200 animate-bounce duration-1000">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>Ask Canteen AI</span>
          </div>

          <button
            onClick={onOpen}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-500/20"
            title="Chat with CampusBites AI"
            aria-label="Open chat with CampusBites AI"
          >
            <MessageSquare className="w-6 h-6 stroke-[2.2] group-hover:rotate-6 transition-transform" />
            
            {/* Live Indicator Dot */}
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>

            {/* Unread badge if any */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10 max-w-4xl mx-auto'
              : 'bottom-4 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] max-h-[82vh] h-[620px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                <Bot className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-amber-600 rounded-full" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight font-display">CampusBites AI</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-amber-100">
                    n8n
                  </span>
                </div>
                <span className="text-[11px] text-amber-100 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  Canteen Menu & Orders Bot
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white">
              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg hover:bg-white/20 transition-colors ${
                  showSettings ? 'bg-white/25' : ''
                }`}
                title="Webhook Configuration"
              >
                <Settings2 className="w-4 h-4" />
              </button>

              {/* Reset History */}
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Maximize/Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors hidden sm:block"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Webhook Settings Drawer */}
          {showSettings && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0 transition-all animate-fadeIn">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-amber-500" />
                  n8n Chat Webhook Settings
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Ready
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">
                    Webhook Endpoint URL:
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value);
                      localStorage.setItem('campusbites_chat_webhook', e.target.value);
                    }}
                    placeholder="https://...app.n8n.cloud/webhook/.../chat"
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={useProxy}
                      onChange={(e) => {
                        setUseProxy(e.target.checked);
                        localStorage.setItem('campusbites_chat_proxy', e.target.checked.toString());
                      }}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Use Server Proxy (Prevents CORS errors)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setWebhookUrl(DEFAULT_WEBHOOK_URL);
                      setUseProxy(true);
                      localStorage.setItem('campusbites_chat_webhook', DEFAULT_WEBHOOK_URL);
                      localStorage.setItem('campusbites_chat_proxy', 'true');
                    }}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                  >
                    Reset Default
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs shadow-sm transition-all ${
                      isUser
                        ? 'bg-amber-600 text-white rounded-br-xs'
                        : msg.isError
                        ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-slate-800 dark:text-rose-100 rounded-bl-xs'
                        : 'bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                    }`}
                  >
                    {/* Bot header inside message */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-700/50">
                        <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" />
                          Campus Assistant
                        </span>
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="p-1 hover:text-amber-600 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="break-words space-y-1">
                      {formatMessageText(msg.text)}
                    </div>

                    <div
                      className={`text-[9px] mt-1.5 text-right font-medium ${
                        isUser ? 'text-amber-200' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amber-500 animate-spin" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Consulting Canteen AI...
                  </span>
                  <div className="flex items-center gap-1 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 pl-1">
              Ask:
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about food, menu, timings, or orders..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex items-center justify-center p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 text-white shadow-md shadow-amber-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="w-4 h-4 stroke-[2.2]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
