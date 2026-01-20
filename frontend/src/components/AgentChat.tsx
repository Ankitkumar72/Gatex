'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { api, AgentResponse } from '@/lib/api';

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
}

export default function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'agent', content: 'Hi, I\'m your GateX assistant. How can I help you with your property today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Call API
        // Using a static thread ID for demo purposes
        const response = await api.chatWithAgent(userMsg.content, 'demo-thread');

        const agentMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: response.message
        };

        setMessages(prev => [...prev, agentMsg]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[500px] bg-[#1c212c] border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#161922] p-4 border-b border-slate-800 flex items-center gap-2">
                <Bot className="text-blue-500" size={20} />
                <span className="font-semibold text-white">GateX Assistant</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                            {msg.role === 'agent' ? <Bot size={16} text-white /> : <User size={16} text-white />}
                        </div>
                        <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'agent' ? 'bg-slate-800 text-slate-200' : 'bg-blue-600 text-white'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <Bot size={16} text-white />
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg flex items-center">
                            <Loader2 size={16} className="animate-spin text-slate-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[#161922] border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
