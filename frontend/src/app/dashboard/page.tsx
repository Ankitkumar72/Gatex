import React from 'react';
import { LayoutDashboard, ShieldCheck, BarChart3, Users, Settings, Lock, FileText, Plus } from 'lucide-react';

const GateXDashboard = () => {
    return (
        <div className="flex h-screen bg-[#0f1116] text-slate-300 font-sans">
            {/* 1. Sidebar */}
            <aside className="w-64 bg-[#161922] border-r border-slate-800 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    {/* GateX Logo Icon */}
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                    <span className="text-xl font-semibold text-white tracking-tight">GateX</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <NavItem icon={<ShieldCheck size={20} />} label="Access Control" />
                    <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
                    <NavItem icon={<Users size={20} />} label="Users" />
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                </nav>
            </aside>

            {/* 2. Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600"></div>
                    </div>
                </header>

                {/* 3. Dashboard Grid */}
                <div className="grid grid-cols-12 gap-6">

                    {/* Live Activity Feed - Autonomous Dispatch */}
                    <div className="col-span-4 bg-[#1c212c] rounded-xl p-6 border border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Live Activity Feed</h3>
                            <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase border border-green-500/20 px-2 py-0.5 rounded bg-green-500/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Auto-Dispatch Active
                            </span>
                        </div>
                        <div className="space-y-4">
                            <ActivityItem status="warn" title="Dispatch System" desc="Auto-assigned Ticket #4092 (Plumbing) to John Doe" time="2 mins ago" />
                            <ActivityItem status="success" title="Access Control" desc="Verified Tech ID: John Doe at Unit 402" time="15 mins ago" />
                            <ActivityItem status="error" title="Gate B - Server Room" desc="Unauthorized Access Attempt Blocked" time="45 mins ago" />
                            <ActivityItem status="success" title="Maintenance AI" desc="Resolved Ticket #4088 (Lighting) - Routine" time="1 hour ago" />
                        </div>
                    </div>

                    {/* Map Section - Real-time Fleet */}
                    <div className="col-span-8 bg-[#1c212c] rounded-xl p-6 border border-slate-800 h-80">
                        <h3 className="text-sm font-medium mb-4 text-slate-400 uppercase tracking-wider">Real-time Technician Fleet Tracking</h3>
                        <div className="w-full h-full bg-[#111319] rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden">
                            {/* Fake Map Grid */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            {/* Ping 1 */}
                            <div className="absolute top-1/3 left-1/4 flex flex-col items-center group cursor-pointer">
                                <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-500/20 group-hover:scale-125 transition-transform"></div>
                                <div className="mt-2 bg-slate-900 text-[10px] text-white px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">John Doe (Occupied)</div>
                            </div>

                            {/* Ping 2 */}
                            <div className="absolute bottom-1/3 right-1/3 flex flex-col items-center group cursor-pointer">
                                <div className="w-4 h-4 bg-green-500 rounded-full ring-4 ring-green-500/20 group-hover:scale-125 transition-transform"></div>
                                <div className="mt-2 bg-slate-900 text-[10px] text-white px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Sarah Smith (Available)</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-span-7 bg-[#1c212c] rounded-xl p-6 border border-slate-800">
                        <h3 className="text-sm font-medium mb-4 text-slate-400 uppercase tracking-wider">Quick actions</h3>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">
                                <Plus size={18} /> Manual Dispatch
                            </button>
                            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition">
                                <Lock size={18} /> Site Lockdown
                            </button>
                            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition">
                                <FileText size={18} /> Export Compliance Report
                            </button>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="col-span-5 bg-[#1c212c] rounded-xl p-6 border border-slate-800 flex justify-around items-center">
                        <StatusBadge label="System Status" value="Healthy" color="text-green-400" />
                        <StatusBadge label="AI Efficiency" value="98.2%" color="text-blue-400" />
                        <StatusBadge label="Active Alerts" value="1" color="text-orange-400" />
                    </div>

                </div>
            </main>
        </div>
    );
};

// Helper Components
const NavItem = ({ icon, label, active = false }: any) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}>
        {icon}
        <span className="font-medium">{label}</span>
    </div>
);

const ActivityItem = ({ status, title, desc, time }: any) => (
    <div className="flex items-start gap-3">
        <div className={`w-2 h-2 mt-2 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div className="flex-1">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className={`text-xs ${status === 'success' ? 'text-green-500' : 'text-red-400'}`}>{desc}</p>
        </div>
        <span className="text-xs text-slate-500">{time}</span>
    </div>
);

const StatusBadge = ({ label, value, color }: any) => (
    <div className="text-center">
        <p className="text-xs text-slate-500 uppercase font-bold mb-1">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
);

export default GateXDashboard;
