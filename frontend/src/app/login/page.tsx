'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, ShieldCheck, Wrench, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function LoginPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LoginForm />
        </React.Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');

    // Determine view and active role from URL
    const view = roleParam ? 'login' : 'selection';
    const activeRole = (roleParam === 'manager' || roleParam === 'tech') ? roleParam : 'tenant';

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('tenant@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');

    const handleRoleSelect = (role: 'tenant' | 'manager' | 'tech') => {
        // Set default email based on role for demo convenience
        if (role === 'tenant') setEmail('tenant@example.com');
        if (role === 'manager') setEmail('manager@example.com');
        if (role === 'tech') setEmail('tech@example.com');

        router.push(`/login?role=${role}`);
    };

    const handleBackToSelection = () => {
        router.push('/login');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.login(email, password);

            // Redirect based on role
            if (activeRole === 'tenant') router.push('/tenant');
            else if (activeRole === 'manager') router.push('/manager');
            else if (activeRole === 'tech') router.push('/technician');
            else router.push('/tenant');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    const getRoleIcon = () => {
        if (activeRole === 'tenant') return <User size={32} className="text-blue-500" />;
        if (activeRole === 'manager') return <ShieldCheck size={32} className="text-green-500" />;
        return <Wrench size={32} className="text-orange-500" />;
    };

    const getRoleName = () => {
        if (activeRole === 'tenant') return 'Tenant Portal';
        if (activeRole === 'manager') return 'Manager Portal';
        return 'Technician Portal';
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden bg-grid">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-8 shadow-2xl relative">

                    {view === 'selection' ? (
                        <>
                            {/* Selection View Content */}
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    {/* GateX Icon */}
                                    <div className="w-10 h-10 text-blue-500">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                            <circle cx="12" cy="12" r="3" />
                                            <circle cx="12" cy="5" r="2" opacity="0.5" />
                                            <circle cx="12" cy="19" r="2" opacity="0.5" />
                                            <circle cx="5" cy="12" r="2" opacity="0.5" />
                                            <circle cx="19" cy="12" r="2" opacity="0.5" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome to GateX</h2>
                                <p className="text-zinc-500 text-sm">Select your role to access the secure workspace.</p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleRoleSelect('tenant')}
                                    className="w-full flex items-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/50 hover:bg-blue-900/10 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors mr-4">
                                        <User size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-zinc-200 group-hover:text-white">Tenant Portal</h3>
                                        <p className="text-xs text-zinc-500 group-hover:text-blue-200/70">Pay rent, maintenance, documents</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('manager')}
                                    className="w-full flex items-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-green-500/50 hover:bg-green-900/10 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-green-500 group-hover:text-white transition-colors mr-4">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-zinc-200 group-hover:text-white">Manager Dashboard</h3>
                                        <p className="text-xs text-zinc-500 group-hover:text-green-200/70">Operations, dispatch, analytics</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('tech')}
                                    className="w-full flex items-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-orange-500/50 hover:bg-orange-900/10 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-colors mr-4">
                                        <Wrench size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-zinc-200 group-hover:text-white">Field Technician</h3>
                                        <p className="text-xs text-zinc-500 group-hover:text-orange-200/70">Assignments, tickets, navigation</p>
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Login View Content */}
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                                        {getRoleIcon()}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-white mb-1">{getRoleName()}</h2>
                                <p className="text-zinc-500 text-xs">Enter your credentials to access your secure workspace.</p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded bg-red-900/20 border border-red-500/20 text-red-400 text-xs text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2 block">Email or Username</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Password</label>
                                        <button type="button" className="text-[10px] text-blue-500 hover:text-blue-400 font-semibold">Forgot password?</button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-lg py-3 pl-10 pr-10 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="remember" className="rounded border-zinc-800 bg-zinc-900 text-blue-600 focus:ring-blue-500/20" />
                                    <label htmlFor="remember" className="text-xs text-zinc-500 cursor-pointer select-none">Remember this device</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? 'Signing in...' : 'Sign In to Portal'}
                                </button>
                            </form>

                            <button
                                onClick={handleBackToSelection}
                                className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors py-2"
                            >
                                <ArrowLeft size={16} />
                                Back to role selection
                            </button>
                        </>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center text-[10px] font-medium text-zinc-600">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(22,163,74,0.5)]"></span>
                            <span className="text-zinc-500">Secure Access</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span>
                            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
