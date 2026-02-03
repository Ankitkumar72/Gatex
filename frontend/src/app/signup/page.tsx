'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { MapPin, Building, MessageSquare, Mail, Zap, Check } from 'lucide-react';

export default function SignupPage() {
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 bg-grid">

            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 py-8 md:py-12 relative z-10">
                <div className="w-full max-w-2xl bg-[#08090c] border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <div className="w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 relative gap-4 sm:gap-0">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Tenant Identity</h1>
                            <p className="text-slate-500 text-xs sm:text-sm">Enter your credentials to link with PropFlow systems.</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#13151b] border border-slate-800 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-900/10 flex-shrink-0">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>

                    <form className="space-y-4 sm:space-y-6">

                        {/* Row 1: Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-[#13151b] border border-slate-800 rounded-lg p-3 sm:p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 min-h-[44px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Primary Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full bg-[#13151b] border border-slate-800 rounded-lg p-3 sm:p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 min-h-[44px]"
                                />
                            </div>
                        </div>

                        {/* Row 2: Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Country Code</label>
                                <select className="w-full bg-[#13151b] border border-slate-800 rounded-lg p-3 sm:p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer min-h-[44px]">
                                    <option>US +1</option>
                                    <option>UK +44</option>
                                    <option>CA +1</option>
                                </select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="(555) 000-0000"
                                    className="w-full bg-[#13151b] border border-slate-800 rounded-lg p-3 sm:p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 min-h-[44px]"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative py-3 sm:py-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-800"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#08090c] px-3 sm:px-4 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Residence Verification</span>
                            </div>
                        </div>

                        {/* Row 3: Building & Unit */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Property/Building Name</label>
                                <div className="relative">
                                    <select className="w-full bg-[#13151b] border border-slate-800 rounded-lg p-3 sm:p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-400 min-h-[44px]">
                                        <option>Select a property</option>
                                        <option>The Vantages</option>
                                        <option>Highland Towers</option>
                                    </select>
                                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Apartment/Suite Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 402-B"
                                    className="w-full bg-[#13151b] border border-slate-800 rounded-lg p-3 sm:p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 min-h-[44px]"
                                />
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="space-y-3 sm:space-y-4 pt-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Communication Preferences</label>

                            <div className="bg-[#13151b] border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between group hover:border-slate-700 transition">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition flex-shrink-0">
                                        <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xs sm:text-sm font-medium text-white truncate">SMS Technician Alerts</h3>
                                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">Real-time updates on repair status</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSmsEnabled(!smsEnabled)}
                                    className={`w-11 h-6 sm:w-12 sm:h-6 rounded-full relative transition-colors flex-shrink-0 ml-2 ${smsEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${smsEnabled ? 'left-6 sm:left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="bg-[#13151b] border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between group hover:border-slate-700 transition">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition flex-shrink-0">
                                        <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xs sm:text-sm font-medium text-white truncate">Email Status Updates</h3>
                                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">Monthly reports and billing notices</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEmailEnabled(!emailEnabled)}
                                    className={`w-11 h-6 sm:w-12 sm:h-6 rounded-full relative transition-colors flex-shrink-0 ml-2 ${emailEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${emailEnabled ? 'left-6 sm:left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>

                        <button className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-bold text-xs sm:text-sm tracking-widest transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-4 sm:mt-6 uppercase group min-h-[48px]">
                            <span className="hidden sm:inline">Initialize Resident Account</span>
                            <span className="sm:hidden">Create Account</span>
                            <Zap size={16} className="group-hover:text-yellow-300 transition-colors flex-shrink-0" />
                        </button>

                    </form>

                    <p className="text-center text-[11px] sm:text-xs text-slate-500 mt-4 sm:mt-6">
                        Already registered? <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">Log in to GateX</Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
