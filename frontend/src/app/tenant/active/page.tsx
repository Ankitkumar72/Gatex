'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Bell, User, Clock, AlertTriangle, CheckCircle2,
    MoreHorizontal, Filter, Search
} from 'lucide-react';

export default function ActiveRequestsPage() {
    // Mock Data for Active Requests
    const activeRequests = [
        {
            id: 'REQ-2055', date: 'Just now', category: 'Plumbing',
            title: 'Kitchen Sink Leak', status: 'In Progress',
            statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            eta: 'Tech arriving in 45m'
        },
        {
            id: 'REQ-2052', date: 'Yesterday', category: 'HVAC',
            title: 'AC unit making rattling noise', status: 'Pending Review',
            statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            eta: 'Assessment scheduled'
        }
    ];

    return (
        <div className="min-h-screen bg-[#000000] text-slate-300 font-sans selection:bg-blue-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}>
            </div>

            {/* Navbar */}
            <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f1116]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link href="/tenant" className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                        <div className="leading-tight">
                            <span className="block font-bold text-white tracking-wide">PROPFLOW</span>
                            <span className="block text-[9px] text-slate-500 font-mono tracking-widest">ACTIVE REQUESTS</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Active Requests</h1>
                        <p className="text-slate-500">Track the status of your ongoing maintenance tickets.</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded transition">
                        + NEW TICKET
                    </button>
                </div>

                <div className="grid gap-4">
                    {activeRequests.map((req, i) => (
                        <div key={i} className="bg-[#0f1116] border border-white/5 rounded-xl p-6 hover:border-white/10 transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded text-xs">#{req.id}</span>
                                    <span className="text-xs text-slate-500">{req.date}</span>
                                </div>
                                <span className={`px-3 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${req.statusColor}`}>
                                    {req.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">{req.title}</h3>
                            <p className="text-sm text-slate-400 mb-6">{req.category} Maintenance</p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock size={14} />
                                    <span>{req.eta}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded transition">
                                        VIEW DETAILS
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeRequests.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-[#0f1116]/50">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} className="text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-400">No Active Requests</h3>
                            <p className="text-slate-600 text-sm">Everything is running smoothly!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
