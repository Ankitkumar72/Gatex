'use client';
import React, { useState } from 'react';
import {
    LayoutGrid, Box, Calendar, MessageSquare, Map, Settings,
    Bell, HelpCircle, RefreshCw, Zap, CheckCircle2, MoreHorizontal,
    ArrowRight, Star, Clock, AlertTriangle, Key, Truck, ChevronRight
} from 'lucide-react';

export default function TechnicianDashboard() {
    return (
        <div className="flex bg-[#0b0c10] text-slate-300 font-sans min-h-screen">

            {/* 1. Sidebar */}
            <aside className="w-64 bg-[#0f1116] border-r border-slate-800 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-none tracking-tight">GateX</h1>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">TECH.OS v2.4</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    <NavItem icon={<LayoutGrid size={18} />} label="Mission Control" active />
                    <NavItem icon={<Box size={18} />} label="Inventory" />
                    <NavItem icon={<Calendar size={18} />} label="Schedule" badge="2" />
                    <NavItem icon={<MessageSquare size={18} />} label="Messages" />
                    <NavItem icon={<Map size={18} />} label="Site Maps" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <NavItem icon={<Settings size={18} />} label="Settings" />
                    <div className="mt-4 flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border border-slate-600">
                            <span className="text-xs font-bold text-white">AM</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-none">Agent Miller</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">ID: #882-TK</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Header */}
                <header className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-2xl font-bold text-white">Daily Operations</h2>
                            <div className="flex items-center bg-[#1c212c] border border-slate-700 rounded-lg px-3 py-1.5 w-64">
                                <span className="text-slate-500 mr-2">🔍</span>
                                <input placeholder="Search work orders, parts, or assets..." className="bg-transparent border-none focus:outline-none text-xs w-full text-white placeholder:text-slate-600" />
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded border border-slate-700">CMD+K</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Good Morning, Agent Miller</h1>
                        <p className="text-blue-400 text-sm mt-1 flex items-center gap-2 font-medium">
                            <Zap size={14} /> 5 Priority Missions Scheduled • 2 Nearby
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#1c212c] border border-slate-700 rounded-full px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-green-500">STATUS: ON DUTY</span>
                        </div>
                        <button className="text-slate-400 hover:text-white relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="text-slate-400 hover:text-white"><HelpCircle size={20} /></button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-blue-600/20">
                            <RefreshCw size={16} /> Sync Field Data
                        </button>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6 mb-10 relative z-10">
                    <StatCard title="Efficiency Score" value="94%" subLabel="↗ +2.5%" color="green" progress={94} icon={<Zap size={16} className="text-slate-600" />} />
                    <StatCard title="Weekly Completion" value="12/15" subLabel="~ On Track" color="blue" progress={80} icon={<CheckCircle2 size={16} className="text-slate-600" />} />
                    <StatCard title="Active Tickets" value="5" subLabel="0 Overdue" color="orange" progress={40} icon={<Clock size={16} className="text-slate-600" />} />
                </div>

                {/* Active Missions Grid */}
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutGrid size={20} className="text-blue-500" /> Active Missions
                        </h3>
                        <div className="flex bg-[#1c212c] rounded-lg p-1 border border-slate-800">
                            <button className="px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded shadow-sm">Grid</button>
                            <button className="px-3 py-1 text-slate-500 hover:text-white text-xs font-bold rounded transition">List</button>
                            <button className="px-3 py-1 text-slate-500 hover:text-white text-xs font-bold rounded transition">Map</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* 1. High Priority - AI Diagnosis */}
                        <div className="bg-[#16181d] rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded border border-red-500/20 uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Priority: High
                                </span>
                                <span className="text-xs text-slate-600 font-mono">#WO-9921</span>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">HVAC Unit 4B - Noise Complaint</h2>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                <span className="flex items-center gap-1"><Map size={12} /> Building C, Roof</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> 2h Est.</span>
                            </div>

                            {/* AI Box */}
                            <div className="bg-[#1e1b2e] border border-indigo-500/30 rounded-xl p-4 mb-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
                                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2 flex items-center gap-2">
                                    <Star size={12} fill="currentColor" /> AI Diagnosis
                                </h4>
                                <ul className="space-y-1 text-xs text-slate-300">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5"></span>
                                        Likely <span className="text-white font-medium">worn fan belt</span> or bearing issue.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5"></span>
                                        <span className="font-bold text-indigo-200">Suggested Tools:</span> Belt Tensioner, Size 12 Wrench.
                                    </li>
                                </ul>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">AM</span>
                                </div>
                                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                                    Start Job <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* 2. Review Required - Visual */}
                        <div className="bg-[#16181d] rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded border border-green-500/20 uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Review Required
                                </span>
                                <button className="text-blue-500 text-xs font-bold hover:underline">Full Report →</button>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">Lobby Entrance - Glass Repair</h2>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                <span>Job ID #WO-8812 • Completed 10m ago by Agent Sarah</span>
                            </div>

                            {/* Before / After Images Logic */}
                            <div className="flex gap-2 h-32 mb-6">
                                <div className="flex-1 bg-slate-800 rounded-lg relative overflow-hidden group/img">
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">BEFORE REPAIR</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-700 rounded-lg relative overflow-hidden">
                                    {/* Simulated Image Content */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"></div>
                                    <div className="absolute bottom-2 right-2">
                                        <span className="text-[10px] font-bold text-green-400 bg-green-900/80 px-2 py-1 rounded border border-green-500/30 backdrop-blur-sm">AFTER REPAIR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg text-sm font-bold transition shadow-lg shadow-green-900/20">
                                    Approve Quality
                                </button>
                                <button className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-bold transition">
                                    Flag Issue
                                </button>
                            </div>
                        </div>

                        {/* 3. Medium Priority - Standard */}
                        <div className="bg-[#16181d] rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition group relative overflow-hidden h-fit">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-1 rounded border border-orange-500/20 uppercase tracking-wider flex items-center gap-1">
                                    Priority: Medium
                                </span>
                                <span className="text-xs text-slate-600 font-mono">#WO-7723</span>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">Water Leak - Kitchenette</h2>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                <span className="flex items-center gap-1"><Map size={12} /> Floor 3, Suite 304</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> 45m Est.</span>
                            </div>

                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Tenant reported slow drip under the sink. Might require washer replacement or pipe tightening. Access granted via keypad.
                            </p>

                            <div className="bg-[#1c212c] rounded-lg p-3 flex items-center justify-between border border-slate-700 mb-2">
                                <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                                    <Key size={14} className="text-slate-500" />
                                    Keypad Code: <span className="text-white font-bold tracking-widest">4921#</span>
                                </div>
                                <button className="text-xs text-blue-500 font-bold hover:text-white transition">COPY</button>
                            </div>
                        </div>

                        {/* 4. Logistics - List */}
                        <div className="bg-[#16181d] rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition group relative overflow-hidden h-fit">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider flex items-center gap-1">
                                    Logistics
                                </span>
                                <span className="text-xs text-slate-500">Today</span>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">Parts Pickup Required</h2>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                <span className="flex items-center gap-1"><Truck size={12} /> Central Depot</span>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-[#1c212c] p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                                    <span className="text-sm text-slate-300">HVAC Filter (x4)</span>
                                    <span className="text-[10px] font-bold text-green-500">READY</span>
                                </div>
                                <div className="bg-[#1c212c] p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Copper Piping 1/2"</span>
                                    <span className="text-[10px] font-bold text-green-500">READY</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Components
const NavItem = ({ icon, label, active, badge }: any) => (
    <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (
            <span className="bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-600">
                {badge}
            </span>
        )}
    </button>
);

const StatCard = ({ title, value, subLabel, color, progress, icon }: any) => (
    <div className="bg-[#16181d] rounded-xl p-5 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-white leading-none">{value}</h3>
                    <span className={`text-xs font-bold mb-1 ${color === 'green' ? 'text-green-500' : color === 'blue' ? 'text-blue-500' : 'text-orange-500'}`}>{subLabel}</span>
                </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#1c212c] flex items-center justify-center border border-slate-700 text-slate-400">
                {icon}
            </div>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${color === 'green' ? 'bg-green-500' : color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
);
