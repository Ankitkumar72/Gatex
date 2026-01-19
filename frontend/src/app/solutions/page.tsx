import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />
            <div className="pt-32 pb-12 px-4 text-center">
                <h1 className="text-5xl font-bold mb-6">Solutions</h1>
                <p className="text-gray-400 text-xl">Tailored solutions for every portfolio size.</p>
            </div>
            <Footer />
        </div>
    );
}
