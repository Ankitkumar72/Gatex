'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Bell, User, Moon, Shield, Smartphone, LogOut
} from 'lucide-react';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

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
                            <span className="block text-[9px] text-slate-500 font-mono tracking-widest">SETTINGS</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10 max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* User Profile */}
                    <div className="bg-[#0f1116] border border-white/5 rounded-xl p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-2xl border border-white/10">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Alex Johnson</h2>
                            <p className="text-slate-500">Unit 402 • Tenant since 2021</p>
                        </div>
                        <button className="ml-auto px-4 py-2 text-xs font-bold text-blue-400 bg-blue-500/10 rounded hover:bg-blue-500/20 transition">
                            EDIT PROFILE
                        </button>
                    </div>

                    {/* Preferences */}
                    <div className="bg-[#0f1116] border border-white/5 rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Preferences</h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-slate-800 text-slate-400"><Bell size={18} /></div>
                                <div>
                                    <p className="font-medium text-white">Push Notifications</p>
                                    <p className="text-xs text-slate-500">Receive alerts for ticket updates</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>

                        <div className="h-px bg-white/5"></div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-slate-800 text-slate-400"><Moon size={18} /></div>
                                <div>
                                    <p className="font-medium text-white">Dark Mode</p>
                                    <p className="text-xs text-slate-500">Always on for PropFlow</p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 font-mono">LOCKED ON</div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-[#0f1116] border border-white/5 rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Security</h3>

                        <button className="w-full flex items-center justify-between p-3 rounded hover:bg-white/5 transition text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-slate-800 text-slate-400"><Shield size={18} /></div>
                                <div>
                                    <p className="font-medium text-white">Change Password</p>
                                    <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                </div>
                            </div>
                            <div className="text-slate-500">→</div>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 rounded hover:bg-white/5 transition text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-slate-800 text-slate-400"><Smartphone size={18} /></div>
                                <div>
                                    <p className="font-medium text-white">Two-Factor Auth</p>
                                    <p className="text-xs text-slate-500">Enabled</p>
                                </div>
                            </div>
                            <div className="text-green-500 text-xs font-bold">ACTIVE</div>
                        </button>
                    </div>

                    <button className="w-full py-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 font-bold hover:bg-red-500/10 transition flex items-center justify-center gap-2">
                        <LogOut size={18} /> Sign Out
                    </button>

                    <p className="text-center text-xs text-slate-600 font-mono">PropFlow Setup v1.0.4</p>

                </div>
            </main>
        </div>
    );
}
