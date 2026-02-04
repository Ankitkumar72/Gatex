'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Bell, User, Moon, Shield, Smartphone, LogOut
} from 'lucide-react';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);

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
                            <span className="block text-[9px] text-muted-foreground font-mono tracking-widest">SETTINGS</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-8 py-12 relative z-10 max-w-2xl">
                <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* User Profile */}
                    <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-2xl border border-border">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Alex Morgan</h2>
                            <p className="text-muted-foreground">Unit 402 • Tenant since 2021</p>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Preferences</h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-secondary text-muted-foreground"><Bell size={18} /></div>
                                <div>
                                    <p className="font-medium text-foreground">Push Notifications</p>
                                    <p className="text-xs text-muted-foreground">Receive alerts for ticket updates</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-background rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Security</h3>

                        <button className="w-full flex items-center justify-between p-3 rounded hover:bg-muted transition text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-secondary text-muted-foreground"><Shield size={18} /></div>
                                <div>
                                    <p className="font-medium text-foreground">Change Password</p>
                                    <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                                </div>
                            </div>
                            <div className="text-muted-foreground">→</div>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 rounded hover:bg-muted transition text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-secondary text-muted-foreground"><Smartphone size={18} /></div>
                                <div>
                                    <p className="font-medium text-foreground">Two-Factor Auth</p>
                                    <p className="text-xs text-muted-foreground">Enabled</p>
                                </div>
                            </div>
                            <div className="text-green-500 text-xs font-bold">ACTIVE</div>
                        </button>
                    </div>

                    <button className="w-full py-4 text-muted-foreground font-bold hover:text-destructive transition flex items-center justify-center gap-2">
                        <LogOut size={18} /> Sign Out
                    </button>

                    <p className="text-center text-xs text-slate-600 font-mono">PropFlow Setup v1.0.4</p>

                </div>
            </main >
        </div >
    );
}
