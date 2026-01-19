'use client';
import React from 'react';
import Link from 'next/link';
import { User, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-4xl w-full relative z-10">
                <div className="text-center mb-12">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/50">
                        <div className="w-6 h-6 bg-white rounded-sm" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to GateX</h1>
                    <p className="text-slate-400 text-lg">Select your role to access the secure workspace.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Role 1: Tenant */}
                    <Link href="/portal" className="group relative bg-[#0f1116] border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all hover:bg-[#161922]">
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-white group-hover:bg-blue-600 transition-colors">
                            <User size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Tenant Portal</h3>
                        <p className="text-sm text-slate-500 mb-6">Submit maintenance requests, pay rent, and chat with AI assistant.</p>
                        <div className="flex items-center text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            Enter Portal <ArrowRight size={16} className="ml-2" />
                        </div>
                    </Link>

                    {/* Role 2: Manager */}
                    <Link href="/dashboard" className="group relative bg-[#0f1116] border border-slate-800 rounded-2xl p-8 hover:border-green-500/50 transition-all hover:bg-[#161922]">
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-white group-hover:bg-green-600 transition-colors">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Manager Dashboard</h3>
                        <p className="text-sm text-slate-500 mb-6">Orchestrate operations, view live activity, and approve dispatches.</p>
                        <div className="flex items-center text-green-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            Access Dashboard <ArrowRight size={16} className="ml-2" />
                        </div>
                    </Link>

                    {/* Role 3: Technician */}
                    <Link href="/technician" className="group relative bg-[#0f1116] border border-slate-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all hover:bg-[#161922]">
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-white group-hover:bg-orange-500 transition-colors">
                            <Wrench size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Field Technician</h3>
                        <p className="text-sm text-slate-500 mb-6">View assignments, navigate to units, and resolve tickets.</p>
                        <div className="flex items-center text-orange-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            Launch App <ArrowRight size={16} className="ml-2" />
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-12">
                    <p className="text-xs text-slate-600">
                        Secure Access • End-to-End Encrypted • GateX Enterprise OS
                    </p>
                </div>
            </div>
        </div>
    );
}
