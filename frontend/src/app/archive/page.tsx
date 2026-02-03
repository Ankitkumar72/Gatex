'use client';

import React, { useState } from 'react';
import {
    Calendar, ChevronDown, Filter, Search, MoreHorizontal,
    ArrowUpRight, Clock, CheckCircle2, AlertTriangle, FileText,
    Camera, Bell, User, Zap, Droplets, Wrench, Box
} from 'lucide-react';

export default function ArchivePage() {
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock Data based on Screenshot
    const requests = [
        {
            id: 'REQ-2049', date: 'Oct 12, 2023', category: 'Plumbing Leak',
            icon: Droplets, evidence: '/api/placeholder/40/40', status: 'Resolved',
            statusColor: 'text-green-500 bg-green-500/10 border-green-500/20'
        },
        {
            id: 'REQ-2048', date: 'Sep 01, 2023', category: 'HVAC Noise',
            icon: Box, evidence: '/api/placeholder/40/40', status: 'Cancelled',
            statusColor: 'text-red-500 bg-red-500/10 border-red-500/20'
        },
        {
            id: 'REQ-2045', date: 'Aug 15, 2023', category: 'Electrical Fault',
            icon: Zap, evidence: '/api/placeholder/40/40', status: 'Resolved',
            statusColor: 'text-green-500 bg-green-500/10 border-green-500/20'
        },
        {
            id: 'REQ-2032', date: 'Jul 22, 2023', category: 'Appliance Repair',
            icon: Wrench, evidence: '/api/placeholder/40/40', status: 'Resolved',
            statusColor: 'text-green-500 bg-green-500/10 border-green-500/20'
        },
        {
            id: 'REQ-2010', date: 'Jun 05, 2023', category: 'General Maintenance',
            icon: Wrench, evidence: '/api/placeholder/40/40', status: 'Resolved',
            statusColor: 'text-green-500 bg-green-500/10 border-green-500/20'
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-green-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}>
            </div>

            {/* Navbar */}
            <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-black font-bold">P</div>
                        <div className="leading-tight">
                            <span className="block font-bold text-white tracking-wide">PROPFLOW</span>
                            <span className="block text-[9px] text-slate-500 font-mono tracking-widest">PRODUCTION GRADE</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="/tenant" className="text-slate-400 hover:text-white transition">Dashboard</a>
                        <a href="#" className="text-slate-400 hover:text-white transition">Active Requests</a>
                        <a href="#" className="text-green-500 border-b-2 border-green-500 py-5">Archive</a>
                        <a href="#" className="text-slate-400 hover:text-white transition">Settings</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition">
                        <Bell size={18} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold border border-amber-200/20">
                        <User size={16} />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Data Table */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-xs font-mono text-green-500 mb-2">
                                <Clock size={12} />
                                <span>ARCHIVE // TENANT HISTORY</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">REQUEST LOGS</h1>
                            <p className="text-slate-500">Historical record of all maintenance requests, resolutions, and technician reports.</p>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/5 p-2 rounded-lg mb-8">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-white/5 rounded hover:bg-white/10 transition">
                                    <Filter size={12} /> FILTERS
                                </button>
                                <div className="h-6 w-px bg-white/5 mx-2"></div>
                                <button className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 bg-transparent hover:text-white transition border border-white/5 rounded">
                                    Date Range: 2023 <Calendar size={12} />
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 bg-transparent hover:text-white transition border border-white/5 rounded">
                                    Status: All <ChevronDown size={12} />
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 bg-transparent hover:text-white transition border border-white/5 rounded">
                                    Category: All <ChevronDown size={12} />
                                </button>
                            </div>
                            <button className="text-[10px] font-bold text-green-500 hover:text-green-400 px-4">CLEAR ALL</button>
                        </div>

                        {/* Data Table */}
                        <div className="border border-white/5 rounded-lg overflow-hidden bg-[#0a0a0a]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 tracking-wider">
                                        <th className="p-4 pl-6">ID</th>
                                        <th className="p-4">DATE</th>
                                        <th className="p-4">CATEGORY</th>
                                        <th className="p-4">EVIDENCE</th>
                                        <th className="p-4">STATUS</th>
                                        <th className="p-4 text-right pr-6">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition group">
                                            <td className="p-4 pl-6 text-sm font-mono font-bold text-green-500">
                                                {req.id.split('-').map((part, j) => j === 0 ? <span key={j} className="opacity-50 text-green-500 mr-0.5">#REQ-</span> : part)}
                                            </td>
                                            <td className="p-4 text-sm text-slate-300 font-mono">
                                                {req.date.split(',')[0]}<span className="text-slate-600">, {req.date.split(',')[1]}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <req.icon size={12} />
                                                    </div>
                                                    <span className="text-sm font-bold text-white">{req.category}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="w-10 h-10 rounded bg-slate-800 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-white/20 transition">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                    <Camera size={14} className="text-slate-500" />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${req.statusColor}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <button className="px-3 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold text-slate-300 transition">
                                                    QUICK VIEW
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                <span>Showing 1-5 of 24 records</span>
                                <div className="flex gap-2">
                                    <button className="hover:text-white">&lt;</button>
                                    <button className="hover:text-white">&gt;</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="w-full lg:w-80 space-y-6">

                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            MAINTENANCE SUMMARY
                        </h3>

                        {/* Summary Widget */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Requests (2023)</span>
                                <FileText size={40} className="text-slate-800 absolute right-4 top-4 opacity-50" />
                            </div>
                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-5xl font-bold text-green-500 tracking-tighter">24</span>
                                <span className="px-1.5 py-0.5 bg-green-900/30 text-green-400 text-[10px] font-bold rounded mb-2 border border-green-500/20">↑ 12%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>

                        {/* Resolution Time Widget */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 relative">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Avg. Resolution Time</span>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-white">4.2</span>
                                <span className="text-lg text-slate-500 font-mono">Days</span>
                            </div>
                            <p className="text-[10px] text-slate-500">15% faster than complex average.</p>
                            <Clock size={40} className="text-slate-800 absolute right-4 top-1/2 -translate-y-1/2 opacity-50" />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-6">Recent Activity</span>

                            <div className="space-y-6 relative pl-2 border-l border-white/5 ml-1">
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-green-500 bg-[#0a0a0a]"></div>
                                    <h4 className="text-xs font-bold text-white">REQ-2049 Resolved</h4>
                                    <p className="text-[10px] text-slate-500">Just now</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-slate-700 bg-[#0a0a0a]"></div>
                                    <h4 className="text-xs font-bold text-white">Ticket #2049 Updated</h4>
                                    <p className="text-[10px] text-slate-500">2 hours ago</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-slate-700 bg-[#0a0a0a]"></div>
                                    <h4 className="text-xs font-bold text-white">New Photo Added</h4>
                                    <p className="text-[10px] text-slate-500">Yesterday</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
