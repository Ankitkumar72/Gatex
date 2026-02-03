'use client';
import React, { useState } from 'react';
import {
    LayoutDashboard, Building2, Wrench, DollarSign, Users, Settings, Bell, Search,
    Check, X, MessageSquare, AlertTriangle, ChevronRight, MoreHorizontal,
    Maximize2, Info, Calendar, ChevronLeft, Menu as MenuIcon, MapPin as MapPinIcon
} from 'lucide-react';

export default function ManagerDashboard() {
    // Mobile view state: 'main', 'nav', 'utils'
    const [mobileView, setMobileView] = useState<'main' | 'nav' | 'utils'>('main');

    return (
        <div className="flex bg-[#0b0c10] text-slate-300 font-sans min-h-screen relative">

            {/* 1. Left Sidebar - Hidden on mobile, shown via state */}
            <aside className={`
                ${mobileView === 'nav' ? 'flex' : 'hidden lg:flex'}
                w-full lg:w-64 bg-[#0f1116] border-r border-slate-800 flex-col shrink-0
                fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
            `}>
                {/* Mobile Close Button */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-white font-bold">Menu</h2>
                    <button
                        onClick={() => setMobileView('main')}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">G</div>
                    <div>
                        <h1 className="text-white font-bold tracking-tight">GateX</h1>
                        <p className="text-[10px] text-slate-500">Command Center</p>
                    </div>
                </div>

                <div className="px-5 py-2 flex-1 overflow-y-auto">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Menu</p>
                    <nav className="space-y-1">
                        <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                        <NavItem icon={<Building2 size={18} />} label="Properties" />
                        <NavItem icon={<Wrench size={18} />} label="Work Orders" badge="14" />
                        <NavItem icon={<DollarSign size={18} />} label="Finance" />
                        <NavItem icon={<Users size={18} />} label="Users" />
                    </nav>

                    <div className="mt-6">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">System Health</p>
                        <div className="grid grid-cols-2 gap-3">
                            <HealthSquare value="14" label="Open" color="text-white" />
                            <HealthSquare value="5" label="Pending" color="text-orange-500" />
                            <HealthSquare value="28" label="Resolved" color="text-green-500" />
                            <HealthSquare value="98%" label="Uptime" color="text-white" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-bold text-sm">October 2023</span>
                            <div className="flex gap-1">
                                <ChevronLeft size={14} className="text-slate-500" />
                                <ChevronRight size={14} className="text-slate-500" />
                            </div>
                        </div>
                        {/* Fake Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-slate-400">
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                            <span className="opacity-30">29</span><span className="opacity-30">30</span>
                            <span className="text-white font-bold">1</span><span>2</span><span>3</span><span className="bg-blue-600 rounded-full text-white">4</span><span>5</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                            {/* Avatar Placeholder */}
                            <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">AM</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white leading-none truncate">Alex Morgan</p>
                            <p className="text-[10px] text-slate-500">Lead Manager</p>
                        </div>
                        <Settings size={16} className="text-slate-500 hover:text-white flex-shrink-0" />
                    </div>
                </div>
            </aside>

            {/* 2. Main Content - Center Queue */}
            <main className={`
                ${mobileView === 'main' ? 'flex' : 'hidden lg:flex'}
                flex-1 flex-col w-full lg:border-r border-slate-800 overflow-y-auto
            `}>
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-30 bg-[#0f1116] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setMobileView('nav')}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400"
                    >
                        <MenuIcon size={20} />
                    </button>
                    <h1 className="text-white font-bold text-sm">Manager Dashboard</h1>
                    <button
                        onClick={() => setMobileView('utils')}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400"
                    >
                        <MapPinIcon size={20} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <header className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">HITL Priority Queue</h1>
                            <div className="flex bg-[#1c212c] rounded-lg p-1 border border-slate-800 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-initial px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded shadow-sm">All</button>
                                <button className="flex-1 sm:flex-initial px-3 py-1 text-slate-500 hover:text-white text-xs font-bold rounded transition">High Cost</button>
                                <button className="flex-1 sm:flex-initial px-3 py-1 text-slate-500 hover:text-white text-xs font-bold rounded transition">Emergency</button>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">Human-in-the-Loop review for high-risk tickets.</p>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3">
                            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-red-400 font-medium">2 Emergency tickets require immediate dispatch approval.</span>
                        </div>
                    </header>

                    <div className="space-y-4 sm:space-y-6 pb-20 lg:pb-0">
                        {/* Card 1: HVAC */}
                        <div className="bg-[#16181d] rounded-xl border border-slate-800 p-4 sm:p-6 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700">#4920</span>
                                    <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-wide flex items-center gap-1">
                                        <DollarSign size={10} /> High Cost
                                    </span>
                                </div>
                                <span className="text-xs text-slate-500">24m ago</span>
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">HVAC Unit Replacement - Rooftop</h2>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Technician reports compressor failure on main rooftop unit. Replacement required. Quote exceeds auto-approval threshold of $1,000.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-800/50">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Estimated Cost</p>
                                    <p className="text-xl font-bold text-white tabular-nums">$4,200.00</p>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Confidence</p>
                                        <span className="text-xs font-bold text-green-400">94%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[94%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                    <Check size={16} /> Approve
                                </button>
                                <button className="flex-1 bg-[#1c212c] hover:bg-slate-800 border border-slate-700 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                    <X size={16} /> Reject
                                </button>
                                <button className="w-full sm:w-10 h-10 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white">
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Leak */}
                        <div className="bg-[#16181d] rounded-xl border border-slate-800 p-4 sm:p-6 relative group overflow-hidden shadow-lg shadow-red-900/5">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700">#4925</span>
                                    <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wide flex items-center gap-1">
                                        <AlertTriangle size={10} /> Emergency
                                    </span>
                                </div>
                                <span className="text-xs text-slate-500">5m ago</span>
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Active Leak - Unit 4B</h2>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Tenant reports water pouring from ceiling fixture in master bath. Keywords matched: "Flood", "Water", "Emergency".
                            </p>

                            <div className="bg-[#1c212c] rounded-lg p-4 mb-6 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vendor</p>
                                    <p className="text-sm font-bold text-white">Rapid Fix Plumbing</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Sentiment</p>
                                    <p className="text-sm font-bold text-red-500">Critical</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                                    <AlertTriangle size={16} /> Dispatch Now
                                </button>
                                <button className="flex-1 bg-[#1c212c] hover:bg-slate-800 border border-slate-700 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                    <MoreHorizontal size={16} /> Details
                                </button>
                            </div>
                        </div>

                        {/* Card 3: Review */}
                        <div className="bg-[#16181d] rounded-xl border border-slate-800 p-4 sm:p-6 relative group overflow-hidden opacity-75 hover:opacity-100 transition">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700">#4918</span>
                                    <span className="bg-slate-700/50 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-600 uppercase tracking-wide">
                                        Review
                                    </span>
                                </div>
                                <span className="text-xs text-slate-500">1h ago</span>
                            </div>

                            <h2 className="text-base sm:text-lg font-bold text-slate-300 mb-2">Lobby Painting Quote</h2>
                            <p className="text-sm text-slate-500 mb-4">Vendor submitted quote for repainting lobby entrance.</p>
                            <button className="px-4 py-2 border border-slate-700 text-slate-400 text-xs font-bold rounded hover:bg-slate-800 hover:text-white transition">Review Quote</button>
                        </div>

                    </div>
                </div>
            </main>

            {/* 3. Right Sidebar - Utils */}
            <aside className={`
                ${mobileView === 'utils' ? 'flex' : 'hidden xl:flex'}
                w-full xl:w-80 bg-[#0f1116] flex-col p-4 sm:p-6 shrink-0
                fixed xl:relative inset-0 xl:inset-auto z-40 xl:z-auto overflow-y-auto
            `}>
                {/* Mobile Close Button */}
                <div className="xl:hidden flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                    <h2 className="text-white font-bold">Live Dispatch & Utils</h2>
                    <button
                        onClick={() => setMobileView('main')}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Live Dispatch Map Widget */}
                <div className="bg-[#16181d] rounded-xl border border-slate-800 p-1 mb-8">
                    <div className="flex justify-between items-center px-2 py-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase bg-green-500/10 px-1.5 py-0.5 rounded ring-1 ring-green-500/20"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live Dispatch</span>
                    </div>
                    <div className="h-40 bg-[#111319] rounded-lg relative overflow-hidden m-1 border border-slate-800/50">
                        {/* Map Simulation */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-500/20 shadow-lg"></div>
                            <div className="mt-1 bg-black/80 text-[8px] text-white px-1.5 py-0.5 rounded border border-slate-700">Tech #42</div>
                        </div>
                        <div className="absolute bottom-4 right-4 flex flex-col items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full ring-2 ring-red-500/20"></div>
                            <div className="bg-red-900/80 text-[8px] text-white px-1 py-0.5 rounded border border-red-500/30 mt-0.5">Emergency</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-3 py-3">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Active Techs</p>
                            <p className="text-xl font-bold text-white">12</p>
                        </div>
                        <Maximize2 size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Vendor Performance */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor Performance</h3>
                        <a href="#" className="text-xs text-blue-500 hover:text-white">View Report</a>
                    </div>
                    <div className="bg-[#16181d] rounded-xl border border-slate-800 p-4">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#1c212c] rounded-lg flex items-center justify-center text-blue-500 font-bold border border-slate-700">RF</div>
                            <div>
                                <p className="text-sm font-bold text-white">Rapid Fix Plumbing</p>
                                <p className="text-xs text-yellow-500">★ 4.8/5.0</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-[10px] text-slate-500">Avg Response</p>
                                <p className="text-sm font-bold text-white">42 mins</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500">Resolution Rate</p>
                                <p className="text-sm font-bold text-green-500">98%</p>
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-slate-400">SLA Compliance</span>
                                    <span className="text-white font-bold">92%</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full"><div className="w-[92%] h-full bg-blue-500 rounded-full"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-slate-400">Customer Satisfaction</span>
                                    <span className="text-white font-bold">4.5/5</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full"><div className="w-[90%] h-full bg-purple-500 rounded-full"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h3>
                    <div className="space-y-6 pl-2 border-l border-slate-800 ml-1">
                        <div className="relative pl-4">
                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0f1116]"></div>
                            <p className="text-xs text-slate-300 leading-snug"><span className="font-bold text-white">Ticket #4910</span> marked as <span className="text-green-500">Resolved</span> by Tech.</p>
                            <p className="text-[10px] text-slate-600 mt-1">2 mins ago</p>
                        </div>
                        <div className="relative pl-4">
                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-slate-600 rounded-full border-2 border-[#0f1116]"></div>
                            <p className="text-xs text-slate-300 leading-snug">System generated Invoice #INV-2023-001.</p>
                            <p className="text-[10px] text-slate-600 mt-1">15 mins ago</p>
                        </div>
                        <div className="relative pl-4">
                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[#0f1116]"></div>
                            <p className="text-xs text-slate-300 leading-snug">New quote received for Ticket #4920.</p>
                            <p className="text-[10px] text-slate-600 mt-1">24 mins ago</p>
                        </div>
                    </div>
                </div>

            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f1116] border-t border-slate-800 flex items-center justify-around px-4 z-50">
                <button
                    onClick={() => setMobileView('nav')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileView === 'nav' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <MenuIcon size={20} />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
                <button
                    onClick={() => setMobileView('main')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileView === 'main' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-medium">Queue</span>
                </button>
                <button
                    onClick={() => setMobileView('utils')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${mobileView === 'utils' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <MapPinIcon size={20} />
                    <span className="text-[10px] font-medium">Live Map</span>
                </button>
            </div>
        </div>
    );
}

// Sub-Components
const NavItem = ({ icon, label, active, badge }: any) => (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (
            <span className="bg-[#1c212c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-600">
                {badge}
            </span>
        )}
    </div>
);

const HealthSquare = ({ value, label, color }: any) => (
    <div className="bg-[#16181d] border border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center aspect-square hover:border-slate-700 transition">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    </div>
);
