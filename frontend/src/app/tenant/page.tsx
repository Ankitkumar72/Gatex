'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import {
    Bot, User, Send, Paperclip, MoreHorizontal,
    MapPin, Clock, ShieldAlert, Phone, MessageSquare,
    CheckCircle2, AlertTriangle, ArrowUpRight, Bell, Menu, FileText, X, Info, StickyNote, Plus, RotateCcw
} from 'lucide-react';
import { api } from '@/lib/api';

export default function TenantPortalWorkspace() {
    // Mobile Tab State
    const [mobileTab, setMobileTab] = useState<'chat' | 'details'>('chat');

    // Toast State
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    // Chat State
    const [messages, setMessages] = useState<{ id: string; role: string; content: string; time: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Chat with Local Time and Random ID on Mount
    useEffect(() => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const randomId = Math.floor(1000 + Math.random() * 9000).toString();

        setMessages([
            { id: '1', role: 'agent', content: 'Hello Alex. I noticed you started a new request ticket. How can I help with your unit today?', time: now }
        ]);

        setTicketState(prev => ({ ...prev, requestId: randomId }));
    }, []);

    // Ticket State (Dynamic from Backend)
    const [ticketState, setTicketState] = useState<{
        requestId: string;
        title: string;
        priority: string;
        category: string;
        status: string;
        eta: string;
        location: string;
        assetInfo: string;
        assignedTechnician: any;
    }>({
        requestId: '----',
        title: 'New Maintenance Request',
        priority: 'Normal', // Normal, High, Emergency
        category: 'Uncategorized',
        status: 'In Progress',
        eta: 'Pending Analysis',
        location: '',
        assetInfo: '',
        assignedTechnician: null
    });

    // Notes State
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState<{ id: string; content: string; time: string }[]>([]);

    const handleAddNote = () => {
        if (!noteInput.trim()) return;
        const newNote = {
            id: Date.now().toString(),
            content: noteInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotes(prev => [newNote, ...prev]);
        setNoteInput('');
        showToast('Note added successfully!');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, mobileTab]);

    // Toast Helper
    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    // Button Handlers
    const handleReset = () => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Generate new ID on reset to simulate fresh start
        const newId = Math.floor(1000 + Math.random() * 9000).toString();
        setTicketState(prev => ({ ...prev, requestId: newId }));

        setMessages([{ id: '1', role: 'agent', content: 'Hello Alex. I noticed you started a new request ticket. How can I help with your unit today?', time: now }]);
        showToast('Chat history has been reset.');
    };

    const handleQuickReply = (text: string) => {
        setInput(text);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Use the generated requestId as the thread_id
            const response = await api.chatWithAgent(userMsg.content, ticketState.requestId);

            const agentMsg = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: response.message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, agentMsg]);

            if (response.final_state) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const state: any = response.final_state;

                setTicketState(prev => ({
                    ...prev,
                    requestId: state.request_id || prev.requestId,
                    priority: state.classification === 'emergency' ? 'High' :
                        state.urgency_score && state.urgency_score > 7 ? 'High' : 'Normal',
                    category: state.maintenance_category ?
                        state.maintenance_category.charAt(0).toUpperCase() + state.maintenance_category.slice(1) + ' System'
                        : prev.category,
                    title: state.maintenance_category ?
                        `${state.maintenance_category.charAt(0).toUpperCase() + state.maintenance_category.slice(1)} Issue`
                        : prev.title,
                    location: state.location || prev.location,
                    assetInfo: state.asset_info || prev.assetInfo,
                    assignedTechnician: state.selected_vendor || prev.assignedTechnician
                }));
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col h-screen overflow-hidden relative">

            {/* Toast Notification */}
            <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="bg-[#1c212c] border border-blue-500/30 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            </div>

            {/* Top Header */}
            <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                    <span className="font-semibold text-white tracking-tight">GateX <span className="hidden md:inline text-slate-500 font-normal">Workspace</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <Bell size={18} className="text-slate-400 hover:text-white cursor-pointer transition-colors" onClick={() => showToast('No new notifications')} />
                    <div className="flex items-center gap-2">
                        <div className="text-right hidden md:block">
                            <p className="text-sm text-white leading-none">Alex Morgan</p>
                            <p className="text-[10px] text-slate-500">Tenant • Unit 402</p>
                        </div>
                        <Link href="/tenant/settings">
                            <div className="w-8 h-8 rounded-full bg-slate-700 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"></div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Workspace Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* LEFT PANEL: Chat / AI Assistant */}
                <div className={`
                    ${mobileTab === 'chat' ? 'flex' : 'hidden md:flex'}
                    w-full md:w-1/3 md:min-w-[350px] border-r border-border bg-muted flex-col h-full
                `}>
                    <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-semibold text-white">AI Maintenance Assistant</span>
                        </div>
                        <button
                            onClick={handleReset}
                            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 md:pb-4">
                        <div className="flex justify-center">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-900/50 px-2 py-1 rounded uppercase">
                                TODAY, {messages.length > 0 ? messages[0].time : '...'}
                            </span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                    {msg.role === 'agent' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[10px] text-muted-foreground ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.role === 'agent' ? 'Assistant' : 'You'}</span>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.role === 'agent' ? 'bg-secondary text-foreground rounded-tl-none border border-border' : 'bg-blue-600 text-white rounded-tr-none'
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
                                <div className="bg-secondary p-3 rounded-2xl rounded-tl-none border border-border">
                                    <span className="animate-pulse text-foreground">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-card shrink-0 mb-16 md:mb-0">
                        <div className="relative">
                            <input
                                className="w-full bg-secondary border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-foreground focus:outline-none focus:border-blue-500 placeholder:text-muted-foreground"
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
                    </div>
                </div>

                {/* RIGHT PANEL: Request Details */}
                <div className={`
                    ${mobileTab === 'details' ? 'flex' : 'hidden md:flex'}
                    w-full md:flex-1 bg-card flex-col h-full overflow-hidden
                `}>
                    {/* Header */}
                    <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">Id : {ticketState.requestId}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wide">{ticketState.status}</span>
                        </div>
                        <div className="flex gap-2 text-slate-400">
                            <MoreHorizontal size={20} className="hover:text-white cursor-pointer" onClick={() => showToast('Menu options coming soon')} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">

                        {/* Main Card */}
                        <div className="bg-muted border border-border rounded-xl p-6 mb-8 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${ticketState.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground mb-2">{ticketState.title}</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm h-5">
                                        {(ticketState.location || ticketState.assetInfo) ? (
                                            <>
                                                <MapPin size={14} />
                                                <span>{ticketState.location} {ticketState.assetInfo ? `• ${ticketState.assetInfo}` : ''}</span>
                                            </>
                                        ) : (
                                            /* Empty or Pending */
                                            <span className="text-slate-600 text-xs italic">Location pending...</span>
                                        )}
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
                                <div className="bg-secondary p-4 rounded-lg border border-border">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-2">System Category</span>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <div className="p-1.5 rounded bg-accent text-accent-foreground"><Menu size={14} /></div>
                                        <span className="font-medium">{ticketState.category}</span>
                                    </div>
                                </div>
                                <div className="bg-secondary p-4 rounded-lg border border-border">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-2">Target Completion</span>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <div className="p-1.5 rounded bg-accent text-accent-foreground"><Clock size={14} /></div>
                                        <span className="font-medium">{ticketState.eta}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Log / Timeline */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Activity Log
                                </h3>
                                <Link href="/archive" className="text-xs text-blue-500 hover:text-blue-400">View Full History</Link>
                            </div>

                            <div className="space-y-6 relative pl-4 border-l border-border ml-2">

                                {ticketState.assignedTechnician && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-background"></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-bold text-foreground">Technician Dispatched <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-600 text-[10px] text-white">LIVE</span></h4>
                                            <span className="text-xs text-muted-foreground font-mono">Just now</span>
                                        </div>

                                        {/* Technician Card */}
                                        <div className="bg-muted border border-border rounded-lg p-4 mt-2">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-800 border border-green-600/30 flex items-center justify-center text-green-100 font-bold">
                                                        {ticketState.assignedTechnician.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{ticketState.assignedTechnician.name}</p>
                                                        <p className="text-xs text-slate-400">Maintenance Specialist</p>
                                                    </div>
                                                </div>
                                                <div className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/20">★ {ticketState.assignedTechnician.rating}</div>
                                            </div>

                                            {/* Fake Map Grid */}
                                            <div className="h-32 bg-background rounded border border-border relative overflow-hidden mb-3">
                                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-500/20"></div>
                                                    <div className="bg-card text-[10px] text-foreground px-2 py-1 rounded mt-1 border border-border">En Route</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => showToast('Calling Technician...')}
                                                    className="flex-1 py-1.5 rounded bg-secondary hover:bg-muted border border-border text-xs text-foreground transition flex items-center justify-center gap-2"
                                                >
                                                    <Phone size={12} /> Call Tech
                                                </button>
                                                <button
                                                    onClick={() => showToast('Opening secure message channel...')}
                                                    className="flex-1 py-1.5 rounded bg-secondary hover:bg-muted border border-border text-xs text-foreground transition flex items-center justify-center gap-2"
                                                >
                                                    <MessageSquare size={12} /> Message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}





                            </div>
                        </div>

                        {/* Access Details & Notes Section */}
                        <div className="mt-8">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Access Details & Notes
                                </h3>
                                <span className="text-[10px] text-muted-foreground">For Technician</span>
                            </div>

                            {/* Note Input */}
                            <div className="bg-muted border border-border rounded-xl p-4 mb-4">
                                <label className="text-xs text-muted-foreground mb-2 block">Gate Code, Access Instructions, or Important Details</label>
                                <div className="relative">
                                    <textarea
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        placeholder="e.g., Gate code is #4523. Use side entrance. Dog is friendly."
                                        className="w-full bg-secondary border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-blue-500 placeholder:text-muted-foreground resize-none min-h-[80px]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                handleAddNote();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-muted-foreground">Click " Add Note " button to submit</span>
                                    <button
                                        onClick={handleAddNote}
                                        disabled={!noteInput.trim()}
                                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed text-sm text-white transition font-semibold flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Add Note
                                    </button>
                                </div>
                            </div>

                            {/* Display Notes */}
                            {notes.length > 0 && (
                                <div className="space-y-3">
                                    {notes.map((note) => (
                                        <div key={note.id} className="bg-muted border border-border rounded-lg p-4 flex gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                                                <StickyNote size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground leading-relaxed break-words">{note.content}</p>
                                                <span className="text-[10px] text-muted-foreground font-mono mt-2 block">{note.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Mobile Actions - Visible only on mobile */}
                    <div className="md:hidden border-t border-border bg-card px-4 py-3 pb-20">
                        <div className="flex gap-2">
                            <button
                                onClick={() => showToast('Message sent to Property Manager')}
                                className="flex-1 px-3 py-2 rounded-lg bg-secondary hover:bg-muted border border-border text-xs text-foreground transition flex items-center justify-center gap-1.5"
                            >
                                <MessageSquare size={14} /> Contact Manager
                            </button>
                            <button
                                onClick={() => showToast('Cancellation request submitted')}
                                className="flex-1 px-3 py-2 rounded-lg bg-secondary hover:bg-red-900/20 border border-border text-xs text-red-400 hover:text-red-300 transition flex items-center justify-center gap-1.5"
                            >
                                <X size={14} /> Cancel
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions - Desktop Only (Hidden on mobile as it takes too much space, or we can adapt it) */}
                    <div className="hidden md:flex h-16 border-t border-border bg-card items-center justify-between px-6 shrink-0">
                        <div className="text-xs text-foreground">
                            <span className="text-muted-foreground block">STATUS</span>
                            Updated just now
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => showToast('Message sent to Property Manager')}
                                className="px-4 py-2 rounded-lg bg-secondary hover:bg-muted border border-border text-sm text-foreground transition"
                            >
                                Contact Manager
                            </button>
                            <button
                                onClick={() => showToast('Cancellation request submitted')}
                                className="px-4 py-2 rounded-lg bg-secondary hover:bg-red-900/20 border border-border text-sm text-red-400 hover:text-red-300 transition"
                            >
                                Cancel Request
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-4 z-50">
                    <button
                        onClick={() => setMobileTab('chat')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileTab === 'chat' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Bot size={20} />
                        <span className="text-[10px] font-medium">Assistant</span>
                    </button>
                    <button
                        onClick={() => setMobileTab('details')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileTab === 'details' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <FileText size={20} />
                        <span className="text-[10px] font-medium">Details</span>
                    </button>
                </div>

            </div>
        </div>
    );
}

