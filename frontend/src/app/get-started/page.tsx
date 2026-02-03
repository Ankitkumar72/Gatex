'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Building2, Home, Briefcase, LayoutGrid, Shield, Lock, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function GetStartedPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        portfolioType: '',
        portfolioSize: ''
    });

    const handleNext = () => setStep(prev => prev + 1);

    const handleLaunch = () => {
        setLoading(true);
        setTimeout(() => {
            router.push('/manager');
        }, 1500);
    };

    const updateData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden bg-grid">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">

                {/* Step 0: Hero / Intro */}
                {step === 0 && (
                    <div className="max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                                Get GateX Running <br /> in Minutes
                            </h1>
                            <p className="text-xl text-zinc-400">
                                No credit card. No setup fees. Cancel anytime.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={handleNext}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-900/20 hover:scale-105 flex items-center gap-2"
                            >
                                Create Your Workspace <ArrowRight size={20} />
                            </button>

                            <div className="flex items-center gap-6 text-xs text-zinc-500 font-medium">
                                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> ~5 min setup</span>
                                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Enterprise security</span>
                                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Operator built</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wizard Steps Container */}
                {step > 0 && (
                    <div className="w-full max-w-lg bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">

                        {/* Progress Indicator */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900 rounded-t-2xl overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>

                        {/* Step 1: Who are you? */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white">Let's create your account</h2>
                                    <p className="text-zinc-500 text-sm mt-1">First, tell us a bit about yourself.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Jane Doe"
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => updateData('name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Work Email</label>
                                        <input
                                            type="email"
                                            placeholder="jane@company.com"
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                                            value={formData.email}
                                            onChange={(e) => updateData('email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Create a strong password"
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                                            value={formData.password}
                                            onChange={(e) => updateData('password', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-900/20"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* Step 2: What are you managing? */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white">What are you managing?</h2>
                                    <p className="text-zinc-500 text-sm mt-1">We'll customize your workspace based on this.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'residential', icon: Home, label: 'Residential Portfolio', sub: 'Apartments, Single Family' },
                                        { id: 'commercial', icon: Building2, label: 'Commercial Buildings', sub: 'Office, Retail, Industrial' },
                                        { id: 'mixed', icon: LayoutGrid, label: 'Mixed Use', sub: 'Combined Residential & Commercial' },
                                        { id: 'mgmt', icon: Briefcase, label: 'Property Management Firm', sub: 'Third-party management' },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                updateData('portfolioType', type.id);
                                                handleNext();
                                            }}
                                            className="flex items-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors mr-4">
                                                <type.icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{type.label}</h3>
                                                <p className="text-xs text-zinc-500">{type.sub}</p>
                                            </div>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                                                <ArrowRight size={16} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Portfolio Size */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white">How large is your portfolio?</h2>
                                    <p className="text-zinc-500 text-sm mt-1">This helps us scale your infrastructure.</p>
                                </div>

                                <div className="space-y-3">
                                    {['1–10 Units', '10–100 Units', '100–1,000 Units', '1,000+ Units'].map((size) => (
                                        <label key={size} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 cursor-pointer transition-all group">
                                            <span className="font-medium text-zinc-300 group-hover:text-white">{size}</span>
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    value={size}
                                                    checked={formData.portfolioSize === size}
                                                    onChange={(e) => updateData('portfolioSize', e.target.value)}
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-zinc-600 checked:border-blue-500 checked:bg-blue-500 transition-all"
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={handleLaunch}
                                    disabled={!formData.portfolioSize || loading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Setting up workspace...' : 'Launch Dashboard'}
                                    {!loading && <ArrowRight size={20} />}
                                </button>
                            </div>
                        )}

                    </div>
                )}

                {/* Trust Section (Bottom) */}
                <div className="mt-12 md:absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                    <div className="flex gap-8 text-zinc-600 text-xs font-medium pointer-events-auto">
                        <div className="flex items-center gap-2">
                            <Shield size={14} />
                            <span>SOC-2 Ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock size={14} />
                            <span>256-bit Encryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>10k+ Units Managed</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
