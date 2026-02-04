'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Phone, Mail, MessageSquare, HelpCircle, FileText, AlertTriangle
} from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">

            {/* Navbar */}
            <nav className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link href="/tenant" className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">G</div>
                        <div className="leading-tight">
                            <span className="block font-bold text-foreground tracking-wide">PROPFLOW</span>
                            <span className="block text-[9px] text-muted-foreground font-mono tracking-widest">HELP & SUPPORT</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10 max-w-3xl">
                <h1 className="text-3xl font-bold text-foreground mb-2">How can we help?</h1>
                <p className="text-muted-foreground mb-8">Search for answers or get in touch with our support team.</p>

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
                    <div className="bg-card border border-border p-6 rounded-xl hover:border-input transition group">
                        <MessageSquare size={32} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Chat with AI Support</h3>
                        <p className="text-sm text-muted-foreground mb-4">Get instant answers about your lease, payments, or maintenance requests.</p>
                        <Link href="/tenant" className="text-blue-400 text-sm font-bold hover:underline">Start Chat →</Link>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-xl hover:border-input transition group">
                        <Mail size={32} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Email Management</h3>
                        <p className="text-sm text-muted-foreground mb-4">For complex inquiries or documentation, send us an email. Typical response in 24h.</p>
                        <a href="mailto:support@propflow.com" className="text-purple-400 text-sm font-bold hover:underline">Send Email →</a>
                    </div>
                </div>

                {/* FAQs */}
                <h2 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        "How do I pay my rent online?",
                        "What is considered an emergency maintenance request?",
                        "How do I register a guest for parking?",
                        "Can I paint my apartment walls?"
                    ].map((q, i) => (
                        <div key={i} className="bg-card border border-border p-4 rounded-lg flex justify-between items-center hover:bg-muted cursor-pointer transition">
                            <span className="text-muted-foreground font-medium text-sm">{q}</span>
                            <div className="text-muted-foreground">→</div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
