import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import { Building2, Building, Store, Warehouse, Hotel } from 'lucide-react';

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 bg-grid">
            <Navbar />

            <div className="pt-32 pb-12 px-4 text-center max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Solutions for Every Asset Class</h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-16">
                    Tailored workflows and AI models for specific property types.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    <FeatureCard title="Multifamily" desc="Optimized for high-volume tenant requests and rapid turnover maintenance." icon={Building2} />
                    <FeatureCard title="Commercial Office" desc="Manage complex HVAC systems, cleaning crews, and lease compliance for business tenants." icon={Building} />
                    <FeatureCard title="Retail" desc="Urgent response protocols for storefronts and common area maintenance." icon={Store} />
                    <FeatureCard title="Industrial" desc="Predictive maintenance for large-scale logistics centers and warehouses." icon={Warehouse} />
                    <FeatureCard title="Hospitality" desc="Zero-downtime maintenance coordination for hotels and short-term rentals." icon={Hotel} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
