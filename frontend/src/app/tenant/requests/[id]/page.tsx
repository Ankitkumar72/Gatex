'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Calendar, User, Camera, CheckCircle2, Droplets, MapPin, Wrench, Shield, Clock, AlertTriangle
} from 'lucide-react';

export default function RequestDetailsPage() {
    // Unwrapping params using standard Next.js hook for client components
    const params = useParams();
    const requestId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : 'REQ-0000';

    // Derived state or mock data based on ID could go here
    // For now we stick to the polished mock data as requested

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
                <div className="flex items-center gap-6">
                    <Link href="/archive" className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-white tracking-wide text-sm">REQUEST DETAILS</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                            {requestId}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/tenant/help" className="text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-wider flex items-center gap-2">
                        Help & Support
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-6 lg:px-12 py-12 relative z-10 max-w-5xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wide flex items-center gap-1">
                                <Droplets size={10} /> PLUMBING
                            </span>
                            <span className="text-slate-500 text-xs flex items-center gap-1">
                                <Calendar size={10} /> Oct 12, 2023
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Kitchen Sink Leak</h1>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <MapPin size={16} className="text-slate-500" />
                            <span>Unit 402 • Kitchen</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <CheckCircle2 size={16} className="text-green-500 fill-green-500/10" />
                            <span className="text-green-500 font-bold text-sm tracking-wide">RESOLVED</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">CLOSED IN 2 DAYS</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description Card */}
                        <div className="bg-[#0f1116] border border-white/5 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileTextIcon /> Description
                            </h3>
                            <p className="text-slate-300 text-base leading-relaxed">
                                Noticed water pooling under the sink cabinet. Seems to be dripping from the P-trap connection.
                                I've placed a bucket underneath for now but it fills up every few hours.
                            </p>
                        </div>

                        {/* Photos Card */}
                        <div className="bg-[#0f1116] border border-white/5 rounded-2xl p-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Camera size={14} /> Evidence
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                <div className="w-32 h-32 bg-slate-800/50 rounded-xl flex flex-col items-center justify-center border border-white/5 hover:border-white/20 transition cursor-pointer group">
                                    <Camera size={24} className="text-slate-600 group-hover:text-slate-400 transition mb-2" />
                                    <span className="text-[10px] text-slate-600">Photo 1</span>
                                </div>
                                <div className="w-32 h-32 bg-slate-800/50 rounded-xl flex flex-col items-center justify-center border border-white/5 hover:border-white/20 transition cursor-pointer group">
                                    <Camera size={24} className="text-slate-600 group-hover:text-slate-400 transition mb-2" />
                                    <span className="text-[10px] text-slate-600">Photo 2</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div className="bg-[#0f1116] border border-white/5 rounded-2xl p-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Clock size={14} /> Activity Timeline
                            </h3>
                            <div className="space-y-8 relative pl-3 border-l-2 border-slate-800 ml-1">
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-green-500 bg-[#0f1116]"></div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                                        <h4 className="text-sm font-bold text-white">Issue Resolved</h4>
                                        <span className="text-[10px] text-slate-500 font-mono">Oct 14, 2:00 PM</span>
                                    </div>
                                    <p className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg border border-white/5 mt-2">
                                        Technician confirmed leak is fixed and dry.
                                        <span className="block mt-1 text-green-500 text-xs flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Verified by Manager
                                        </span>
                                    </p>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-[#0f1116]"></div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                                        <h4 className="text-sm font-bold text-white">Technician Dispatched</h4>
                                        <span className="text-[10px] text-slate-500 font-mono">Oct 13, 9:00 AM</span>
                                    </div>
                                    <p className="text-sm text-slate-400">Mike from <strong>FastFix Plumbing</strong> assigned.</p>
                                </div>

                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-700 bg-[#0f1116]"></div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                                        <h4 className="text-sm font-bold text-slate-300">Request Created</h4>
                                        <span className="text-[10px] text-slate-500 font-mono">Oct 12, 10:15 AM</span>
                                    </div>
                                    <p className="text-sm text-slate-500">Ticket #{requestId} opened via Tenant Portal.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Meta & Actions */}
                    <div className="space-y-6">
                        {/* Assigned Vendor Widget */}
                        <div className="bg-[#0f1116] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Shield size={80} />
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Assigned Vendor</h3>
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
                                    FP
                                </div>
                                <div>
                                    <p className="font-bold text-white text-base">FastFix Plumbing</p>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                        <span className="font-bold text-white">4.8</span>
                                        <span className="text-amber-400 text-[10px]">★★★★★</span>
                                        <span className="text-slate-600 ml-1">(124 jobs)</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-3 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition flex items-center justify-center gap-2">
                                <User size={14} /> VIEW PROFILE
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="bg-[#0f1116] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Actions</h3>
                            <button className="w-full py-3 mb-3 text-xs font-bold text-slate-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition flex items-center justify-center gap-2">
                                DOWNLOAD REPORT
                            </button>

                            {/* Redo / Warranty Button */}
                            <button className="w-full py-3 mb-3 text-xs font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 rounded-lg hover:bg-amber-500/10 transition flex items-center justify-center gap-2 group">
                                <Clock size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span>REQUEST REDO</span>
                                <span className="bg-amber-500 text-black px-1.5 rounded text-[9px]">WARRANTY</span>
                            </button>

                            <button className="w-full py-3 text-xs font-bold text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg hover:bg-red-500/10 transition flex items-center justify-center gap-2">
                                REPORT ISSUE
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Icon helper
function FileTextIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
