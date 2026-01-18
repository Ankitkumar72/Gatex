"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "agent";
  content: string;
};

type ChatResponse = {
  response: string;
  thread_id: string;
  status: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hello! I am PropFlow. How can I help with your property today?" },
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("active");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/agent/chat", {
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
      const res = await fetch("http://127.0.0.1:8000/agent/approve", {
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
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">P</div>
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            PropFlow Agent
          </h1>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
          Status: <span className={status === "waiting_for_approval" ? "text-amber-400 font-bold" : "text-green-400"}>
            {status.toUpperCase().replace(/_/g, " ")}
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-lg leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-800/80 border border-gray-700 text-gray-200 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center text-gray-400 animate-pulse">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Approval Alert */}
      {status === "waiting_for_approval" && (
        <div className="px-4 pb-2">
          <div className="bg-amber-900/40 border border-amber-600/50 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-amber-900/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600/20 rounded-lg text-amber-500">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-amber-200">Approval Required</h3>
                <p className="text-sm text-amber-200/80">The agent drafted a dispatch action. Proceed?</p>
              </div>
            </div>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              approve
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="p-4 bg-gray-900/80 border-t border-gray-800 backdrop-blur">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 bg-gray-950 border border-gray-700 text-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
            placeholder="Type your request (e.g. 'Leaky faucet in Apt 4B')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={status === "waiting_for_approval" || loading}
          />
          <button
            onClick={sendMessage}
            disabled={status === "waiting_for_approval" || loading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:grayscale transition-all shadow-lg active:scale-95 font-medium"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
