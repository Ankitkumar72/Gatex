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

    const handlePaymentResponse = async (decision: 'AUTHORIZED' | 'DECLINED') => {
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: decision === 'AUTHORIZED' ? 'I authorize this work order.' : 'I decline this work order.' };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
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
                {messages.map((msg) => {
                    const isPaymentAuth = msg.content.includes('[PAYMENT_AUTH]');
                    const cleanContent = msg.content.replace(' [PAYMENT_AUTH]', '');

                    return (
                        <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                    {msg.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'agent' ? 'bg-slate-800 text-slate-200' : 'bg-blue-600 text-white'}`}>
                                    {cleanContent}
                                </div>
                            </div>

                            {/* Payment Widget */}
                            {isPaymentAuth && msg.role === 'agent' && (
                                <div className="ml-11 mt-2 p-4 bg-slate-900 border border-slate-700 rounded-lg max-w-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 bg-green-500/20 rounded-full">
                                            <span className="text-green-400 font-bold">$</span>
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-semibold">Payment Authorization</div>
                                            <div className="text-slate-400 text-xs">Work First, Pay Later Guarantee</div>
                                        </div>
                                    </div>
                                    <div className="text-slate-300 text-xs mb-4 border-l-2 border-slate-600 pl-3">
                                        You are approving the estimated cost. You will <b>not be charged</b> until the work is completed and verified.
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePaymentResponse('AUTHORIZED')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded transition"
                                        >
                                            Authorize (Pay Later)
                                        </button>
                                        <button
                                            onClick={() => handlePaymentResponse('DECLINED')}
                                            className="flex-1 bg-red-900/50 hover:bg-red-900/80 border border-red-800 text-red-200 text-xs font-semibold py-2 px-3 rounded transition"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <Bot size={16} />
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
