import React from 'react';
import Link from 'next/link';

const Footer = () => (
    <footer className="border-t border-white/5 pt-20 pb-10 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-6 inline-block">
                    <span className="font-bold text-lg text-white">GateX</span>
                </Link>
                <p className="text-gray-500 text-sm max-w-xs">The operating system for modern real estate portfolios. Built for speed, reliability, and scale.</p>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-sm text-white">Platform</h4>
                <ul className="text-gray-500 text-sm space-y-4">
                    <li><Link href="/platform" className="hover:text-white transition">Maintenance</Link></li>
                    <li><Link href="/platform" className="hover:text-white transition">Vendor Network</Link></li>
                    <li><Link href="/platform" className="hover:text-white transition">Tenant Experience</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-sm text-white">Company</h4>
                <ul className="text-gray-500 text-sm space-y-4">
                    <li><Link href="#" className="hover:text-white transition">About</Link></li>
                    <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                    <li><Link href="#" className="hover:text-white transition">Press</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-sm text-white">Resources</h4>
                <ul className="text-gray-500 text-sm space-y-4">
                    <li><Link href="/developers" className="hover:text-white transition">Documentation</Link></li>
                    <li><Link href="/developers" className="hover:text-white transition">API Reference</Link></li>
                    <li><Link href="/developers" className="hover:text-white transition">Community</Link></li>
                </ul>
            </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            <p>© 2024 GateX Inc. All rights reserved.</p>
            <div className="flex gap-4">
                <span className="text-green-500 flex items-center gap-1">● System Operational</span>
                <Link href="#" className="hover:text-gray-400 transition">Privacy</Link>
                <Link href="#" className="hover:text-gray-400 transition">Terms</Link>
            </div>
        </div>
    </footer>
);

export default Footer;
