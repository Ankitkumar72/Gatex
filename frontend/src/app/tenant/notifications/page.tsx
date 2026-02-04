'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Bell, CheckCircle2, AlertTriangle, Info, Clock
} from 'lucide-react';

export default function NotificationsPage() {
    // Mock Data for Notifications
    const notifications = [
        {
            id: 1, type: 'success', title: 'Request #2049 Resolved',
            message: 'Your plumbing issue has been marked as resolved by the technician.',
            time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500'
        },
        {
            id: 2, type: 'info', title: 'Maintenance Scheduled',
            message: 'Routine HVAC inspection scheduled for next Tuesday.',
            time: 'Yesterday', icon: Info, color: 'text-blue-500'
        },
        {
            id: 3, type: 'alert', title: 'Payment Due Soon',
            message: 'Rent for November is due in 3 days.',
            time: '2 days ago', icon: AlertTriangle, color: 'text-amber-500'
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
                            <span className="block text-[9px] text-slate-500 font-mono tracking-widest">NOTIFICATIONS</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10 max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-400">MARK ALL READ</button>
                </div>

                <div className="space-y-4">
                    {notifications.map((note) => (
                        <div key={note.id} className="bg-[#0f1116] border border-white/5 p-4 rounded-xl flex gap-4 hover:bg-white/5 transition">
                            <div className={`mt-1 p-2 rounded-full bg-opacity-10 ${note.color.replace('text', 'bg')} flex-shrink-0`}>
                                <note.icon size={18} className={note.color} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white text-sm">{note.title}</h4>
                                    <span className="text-[10px] text-slate-500">{note.time}</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">{note.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
