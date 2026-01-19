import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Navbar = () => (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">GateX</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            <Link href="/platform" className="hover:text-white transition">Platform</Link>
            <Link href="/solutions" className="hover:text-white transition">Solutions</Link>
            <Link href="/developers" className="hover:text-white transition">Developers</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-white text-sm font-medium">Login</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition">
                Book Demo <ArrowRight size={14} />
            </button>
        </div>
    </nav>
);

export default Navbar;
