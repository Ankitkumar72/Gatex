'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full relative z-50">
            <Link href="/" className="flex items-center gap-2 z-50">
                <span className="text-white font-bold text-xl tracking-tight">GateX</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
                <Link href="/platform" className="hover:text-white transition">Platform</Link>
                <Link href="/solutions" className="hover:text-white transition">Solutions</Link>
                <Link href="/developers" className="hover:text-white transition">Developers</Link>
                <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">Log in</Link>
                <Link href="/login" className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition">
                    Get Started
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-white z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden z-40">
                    <div className="flex flex-col items-center gap-6 text-gray-400 text-lg font-medium">
                        <Link href="/platform" className="hover:text-white transition" onClick={() => setIsOpen(false)}>Platform</Link>
                        <Link href="/solutions" className="hover:text-white transition" onClick={() => setIsOpen(false)}>Solutions</Link>
                        <Link href="/developers" className="hover:text-white transition" onClick={() => setIsOpen(false)}>Developers</Link>
                        <Link href="/pricing" className="hover:text-white transition" onClick={() => setIsOpen(false)}>Pricing</Link>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/login" className="px-8 py-3 text-slate-300 hover:text-white transition" onClick={() => setIsOpen(false)}>Log in</Link>
                        <Link href="/login" className="px-8 py-3 font-semibold bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition" onClick={() => setIsOpen(false)}>
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
