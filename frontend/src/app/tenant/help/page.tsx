'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Phone, Mail, MessageSquare, HelpCircle, FileText, AlertTriangle
} from 'lucide-react';

export default function HelpPage() {
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
                            <span className="block text-[9px] text-slate-500 font-mono tracking-widest">HELP & SUPPORT</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10 max-w-3xl">
                <h1 className="text-3xl font-bold text-white mb-2">How can we help?</h1>
                <p className="text-slate-500 mb-8">Search for answers or get in touch with our support team.</p>

                {/* Emergency Banner */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8 flex items-start gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full text-red-400">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Emergency Maintenance?</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            For fire, gas leaks, or immediate flooding, please call 911 immediately.
                            For urgent property emergencies (broken pipe, no heat), call our 24/7 hotline.
                        </p>
                        <a href="tel:555-0123" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-sm transition inline-block">
                            CALL 24/7 HOTLINE
                        </a>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Contact Options */}
                    <div className="bg-[#0f1116] border border-white/5 p-6 rounded-xl hover:border-white/10 transition group">
                        <MessageSquare size={32} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-white mb-2">Chat with AI Support</h3>
                        <p className="text-sm text-slate-400 mb-4">Get instant answers about your lease, payments, or maintenance requests.</p>
                        <Link href="/tenant" className="text-blue-400 text-sm font-bold hover:underline">Start Chat →</Link>
                    </div>

                    <div className="bg-[#0f1116] border border-white/5 p-6 rounded-xl hover:border-white/10 transition group">
                        <Mail size={32} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-white mb-2">Email Management</h3>
                        <p className="text-sm text-slate-400 mb-4">For complex inquiries or documentation, send us an email. Typical response in 24h.</p>
                        <a href="mailto:support@propflow.com" className="text-purple-400 text-sm font-bold hover:underline">Send Email →</a>
                    </div>
                </div>

                {/* FAQs */}
                <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        "How do I pay my rent online?",
                        "What is considered an emergency maintenance request?",
                        "How do I register a guest for parking?",
                        "Can I paint my apartment walls?"
                    ].map((q, i) => (
                        <div key={i} className="bg-[#0f1116] border border-white/5 p-4 rounded-lg flex justify-between items-center hover:bg-white/5 cursor-pointer transition">
                            <span className="text-slate-300 font-medium text-sm">{q}</span>
                            <div className="text-slate-500">→</div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
