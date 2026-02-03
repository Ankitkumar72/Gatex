'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import {
    Bot, User, Send, Paperclip, MoreHorizontal,
    MapPin, Clock, ShieldAlert, Phone, MessageSquare,
    CheckCircle2, AlertTriangle, ArrowUpRight, Bell, Menu, FileText
} from 'lucide-react';
import { api } from '@/lib/api';

export default function TenantPortalWorkspace() {
    // Mobile Tab State
    const [mobileTab, setMobileTab] = useState<'chat' | 'details'>('chat');

    // Chat State
    const [messages, setMessages] = useState([
        { id: '1', role: 'agent', content: 'Hello Alex. I noticed you started a new request ticket. How can I help with your unit today?', time: '10:42 AM' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Ticket State (Dynamic from Backend)
    const [ticketState, setTicketState] = useState({
        title: 'New Maintenance Request',
        priority: 'Normal', // Normal, High, Emergency
        category: 'Uncategorized',
        status: 'In Progress',
        eta: 'Pending Analysis'
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, mobileTab]); // Scroll on tab switch too

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.chatWithAgent(userMsg.content, 'demo-thread');

            const agentMsg = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: response.message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, agentMsg]);

            // Update Ticket State from Backend Logic
            if (response.final_state) {
                const state = response.final_state;

                setTicketState(prev => ({
                    ...prev,
                    priority: state.classification === 'emergency' ? 'High' :
                        state.urgency_score && state.urgency_score > 7 ? 'High' : 'Normal',
                    category: state.maintenance_category ?
                        state.maintenance_category.charAt(0).toUpperCase() + state.maintenance_category.slice(1) + ' System'
                        : prev.category,
                    // Simple title heuristic if we just got a category
                    title: state.maintenance_category ?
                        `${state.maintenance_category.charAt(0).toUpperCase() + state.maintenance_category.slice(1)} Issue`
                        : prev.title
                }));
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-slate-300 font-sans flex flex-col h-screen overflow-hidden">

            {/* Top Header */}
            <header className="h-14 border-b border-slate-800 bg-[#0f1116] flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                    <span className="font-semibold text-white tracking-tight">GateX <span className="hidden md:inline text-slate-500 font-normal">Workspace</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <Bell size={18} className="text-slate-400" />
                    <div className="flex items-center gap-2">
                        <div className="text-right hidden md:block">
                            <p className="text-sm text-white leading-none">Alex Morgan</p>
                            <p className="text-[10px] text-slate-500">Tenant • Unit 402</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                    </div>
                </div>
            </header>

            {/* Main Workspace Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* LEFT PANEL: Chat / AI Assistant */}
                {/* Visible if tab is 'chat' OR we are on desktop (> md) */}
                <div className={`
                    ${mobileTab === 'chat' ? 'flex' : 'hidden md:flex'}
                    w-full md:w-1/3 md:min-w-[350px] border-r border-slate-800 bg-[#0a0b0f] flex-col h-full
                `}>
                    <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0f1116] shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-semibold text-white">AI Maintenance Assistant</span>
                        </div>
                        <button className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                            <span className="material-icons">refresh</span> Reset
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 md:pb-4">
                        <div className="flex justify-center">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-900/50 px-2 py-1 rounded">TODAY, 10:42 AM</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                    {msg.role === 'agent' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[10px] text-slate-500 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.role === 'agent' ? 'Assistant' : 'You'}</span>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.role === 'agent' ? 'bg-[#1c212c] text-white rounded-tl-none border border-slate-700' : 'bg-blue-600 text-white rounded-tr-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-[#1c212c] p-3 rounded-2xl rounded-tl-none border border-slate-700">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Fixed at bottom of chat panel */}
                    <div className="p-4 border-t border-slate-800 bg-[#0f1116] shrink-0 mb-16 md:mb-0">
                        <div className="relative">
                            <input
                                className="w-full bg-[#1c212c] border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                                placeholder="Type your response..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"
                            >
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                            <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#1c212c] border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition">No visible damage</button>
                            <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#1c212c] border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition">It's urgent</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Request Details */}
                {/* Visible if tab is 'details' OR we are on desktop (> md) */}
                <div className={`
                    ${mobileTab === 'details' ? 'flex' : 'hidden md:flex'}
                    w-full md:flex-1 bg-[#0f1116] flex-col h-full overflow-hidden
                `}>
                    {/* Header */}
                    <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f1116] shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">Request #4092</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wide">{ticketState.status}</span>
                        </div>
                        <div className="flex gap-2 text-slate-400">
                            <MoreHorizontal size={20} className="hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">

                        {/* Main Card */}
                        <div className="bg-[#12141a] border border-slate-800 rounded-xl p-6 mb-8 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${ticketState.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{ticketState.title}</h1>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <MapPin size={14} />
                                        <span>Master Bedroom • Unit 402</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Priority Level</span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border ${ticketState.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                        <AlertTriangle size={12} /> {ticketState.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#1c212c] p-4 rounded-lg border border-slate-800">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">System Category</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="p-1.5 rounded bg-slate-700"><Menu size={14} /></div>
                                        <span className="font-medium">{ticketState.category}</span>
                                    </div>
                                </div>
                                <div className="bg-[#1c212c] p-4 rounded-lg border border-slate-800">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">Target Completion</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="p-1.5 rounded bg-slate-700"><Clock size={14} /></div>
                                        <span className="font-medium">{ticketState.eta}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Log / Timeline */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Activity Log
                                </h3>
                                <Link href="/archive" className="text-xs text-blue-500 hover:text-blue-400">View Full History</Link>
                            </div>

                            <div className="space-y-6 relative pl-4 border-l border-slate-800 ml-2">

                                {/* Event 1 */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0f1116]"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-white">Technician Dispatched <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-600 text-[10px] text-white">LIVE</span></h4>
                                        <span className="text-xs text-slate-500 font-mono">10:45 AM</span>
                                    </div>

                                    {/* Technician Card */}
                                    <div className="bg-[#12141a] border border-slate-800 rounded-lg p-4 mt-2">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-800 border border-green-600/30 flex items-center justify-center text-green-100 font-bold">JD</div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">John Doe</p>
                                                    <p className="text-xs text-slate-400">Senior HVAC Specialist</p>
                                                </div>
                                            </div>
                                            <div className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/20">★ 4.9</div>
                                        </div>

                                        {/* Fake Map Grid */}
                                        <div className="h-32 bg-[#0a0b0f] rounded border border-slate-800 relative overflow-hidden mb-3">
                                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-500/20"></div>
                                                <div className="bg-[#0f1116] text-[10px] text-white px-2 py-1 rounded mt-1 border border-slate-700">4 mins away</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex-1 py-1.5 rounded bg-[#1c212c] hover:bg-slate-800 border border-slate-700 text-xs text-white transition flex items-center justify-center gap-2">
                                                <Phone size={12} /> Call Tech
                                            </button>
                                            <button className="flex-1 py-1.5 rounded bg-[#1c212c] hover:bg-slate-800 border border-slate-700 text-xs text-white transition flex items-center justify-center gap-2">
                                                <MessageSquare size={12} /> Message
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Event 2 */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-700 border-2 border-[#0f1116]"></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-300">Manager Approved</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Request validated by Property Manager.</p>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">10:15 AM</span>
                                    </div>
                                </div>

                                {/* Event 3 */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-900/50 border-2 border-[#0f1116]"></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-300">Priority Updated</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Changed from Normal to <span className="text-orange-500 font-bold bg-orange-500/10 px-1 rounded">HIGH</span></p>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">10:05 AM</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Footer Actions - Desktop Only (Hidden on mobile as it takes too much space, or we can adapt it) */}
                    <div className="hidden md:flex h-16 border-t border-slate-800 bg-[#0f1116] items-center justify-between px-6 shrink-0">
                        <div className="text-xs text-white">
                            <span className="text-slate-500 block">STATUS</span>
                            Updated just now
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg bg-[#1c212c] hover:bg-slate-800 border border-slate-700 text-sm text-white transition">Contact Manager</button>
                            <button className="px-4 py-2 rounded-lg bg-[#1c212c] hover:bg-red-900/20 border border-slate-700 text-sm text-red-400 hover:text-red-300 transition">Cancel Request</button>
                            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white transition font-semibold">Add Note</button>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-[#0f1116] border-t border-slate-800 flex items-center justify-around px-4 z-50">
                    <button
                        onClick={() => setMobileTab('chat')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileTab === 'chat' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Bot size={20} />
                        <span className="text-[10px] font-medium">Assistant</span>
                    </button>
                    <button
                        onClick={() => setMobileTab('details')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileTab === 'details' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <FileText size={20} />
                        <span className="text-[10px] font-medium">Details</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
