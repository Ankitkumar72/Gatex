"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import clsx from "clsx";
import { WORKFLOW_STATUS, WorkflowStatus } from "@/lib/constants";

type Message = {
  role: "user" | "agent";
  content: string;
};

type ChatResponse = {
  response: string;
  thread_id: string;
  status: WorkflowStatus;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [input, setInput] = useState("");
  // Initial message
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hello! I am Gatex. How can I help with your property today?" },
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkflowStatus>(WORKFLOW_STATUS.ACTIVE);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, thread_id: threadId }),
      });
      const data: ChatResponse = await res.json();

      setThreadId(data.thread_id);
      setStatus(data.status);
      setMessages((prev) => [...prev, { role: "agent", content: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "agent", content: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!threadId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/agent/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, action: "approve" }),
      });
      const data: ChatResponse = await res.json();
      setStatus(data.status);
      setMessages((prev) => [...prev, { role: "agent", content: data.response }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
              Gatex Agent
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Property Management AI</p>
          </div>
        </div>
        <div className={clsx(
          "text-xs px-3 py-1.5 rounded-full border flex items-center gap-2 font-medium transition-colors duration-300",
          status === WORKFLOW_STATUS.WAITING_APPROVAL
            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        )}>
          <span className={clsx("w-2 h-2 rounded-full animate-pulse",
            status === WORKFLOW_STATUS.WAITING_APPROVAL ? "bg-amber-500" : "bg-emerald-500"
          )} />
          {(status || "active").toUpperCase().replace(/_/g, " ")}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "agent" && (
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-indigo-400" />
                </div>
              )}

              <div
                className={clsx(
                  "max-w-[85%] md:max-w-[65%] p-4 rounded-2xl shadow-sm border text-sm md:text-base leading-relaxed",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none border-indigo-500 shadow-indigo-900/20"
                    : "bg-gray-900 border-gray-800 text-gray-300 rounded-bl-none shadow-black/40"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center shrink-0 mt-1">
                  <User size={14} className="text-indigo-200" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-indigo-400" />
            </div>
            <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Approval Alert within Flow */}
      <AnimatePresence>
        {status === WORKFLOW_STATUS.WAITING_APPROVAL && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-2xl mx-auto px-4 pb-4 absolute bottom-[88px] left-0 right-0 z-20"
          >
            <div className="bg-gray-900/90 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between shadow-2xl shadow-black/50 backdrop-blur-md ring-1 ring-amber-500/20">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500 animate-pulse">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-amber-100">Approval Required</h3>
                  <p className="text-xs text-amber-200/70">The agent is ready to dispatch a work order.</p>
                </div>
              </div>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Approve
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <footer className="p-4 bg-gray-900/80 border-t border-gray-800 backdrop-blur-xl relative z-30">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 bg-gray-950 border border-gray-800 text-gray-100 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 shadow-inner"
            placeholder="Type your request..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={status === WORKFLOW_STATUS.WAITING_APPROVAL || loading}
          />
          <button
            onClick={sendMessage}
            disabled={status === WORKFLOW_STATUS.WAITING_APPROVAL || loading || !input.trim()}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:grayscale transition-all shadow-lg active:scale-95 flex items-center justify-center w-14 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>
      </footer>
    </div>
  );
}