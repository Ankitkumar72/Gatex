import React from 'react';
import Link from 'next/link';

const Footer = () => (
    <footer className="border-t border-white/5 pt-20 pb-10 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <span className="text-white font-bold text-xl tracking-tight">GateX</span>
                    </Link>
                </div>
                <p className="text-gray-500 text-sm max-w-xs">The operating system for modern real estate portfolios. Built for speed, reliability, and scale.</p>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-sm">Platform</h4>
                <ul className="text-gray-500 text-sm space-y-4">
                    <li>Maintenance</li>
                    <li>Vendor Network</li>
                    <li>Tenant Experience</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-sm">Company</h4>
                <ul className="text-gray-500 text-sm space-y-4">
                    <li>About</li>
                    <li>Careers</li>
                    <li>Press</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-sm">Resources</h4>
                <ul className="text-gray-500 text-sm space-y-4">
                    <li>Documentation</li>
                    <li>API Reference</li>
                    <li>Community</li>
                </ul>
            </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            <p>© 2024 GateX Inc. All rights reserved.</p>
            <div className="flex gap-4">
                <span className="text-green-500 flex items-center gap-1">● System Operational</span>
                <span>Privacy</span>
                <span>Terms</span>
            </div>
        </div>
    </footer>
);

export default Footer;
