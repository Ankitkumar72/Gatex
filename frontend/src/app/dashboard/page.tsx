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

                    {/* Live Activity Feed */}
                    <div className="col-span-4 bg-[#1c212c] rounded-xl p-6 border border-slate-800">
                        <h3 className="text-sm font-medium mb-4 text-slate-400 uppercase tracking-wider">Live activity feed</h3>
                        <div className="space-y-4">
                            <ActivityItem status="success" title="Gate A - Main Lobby" desc="Access Granted" time="11 mins ago" />
                            <ActivityItem status="error" title="Gate B - Server Room" desc="Denied" time="45 mins ago" />
                            <ActivityItem status="success" title="Gate A - Main Lobby" desc="Access Granted" time="2 hours ago" />
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="col-span-8 bg-[#1c212c] rounded-xl p-6 border border-slate-800 h-80">
                        <h3 className="text-sm font-medium mb-4 text-slate-400 uppercase tracking-wider">Real-time location tracking</h3>
                        <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                            <span className="text-slate-500 italic">[Map Integration Placeholder]</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-span-7 bg-[#1c212c] rounded-xl p-6 border border-slate-800">
                        <h3 className="text-sm font-medium mb-4 text-slate-400 uppercase tracking-wider">Quick actions</h3>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">
                                <Plus size={18} /> Grant Access
                            </button>
                            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition">
                                <Lock size={18} /> Lockdown
                            </button>
                            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition">
                                <FileText size={18} /> Generate Report
                            </button>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="col-span-5 bg-[#1c212c] rounded-xl p-6 border border-slate-800 flex justify-around items-center">
                        <StatusBadge label="System" value="OK" color="text-green-400" />
                        <StatusBadge label="Security" value="Active" color="text-green-400" />
                        <StatusBadge label="Alerts" value="2" color="text-red-400" />
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
