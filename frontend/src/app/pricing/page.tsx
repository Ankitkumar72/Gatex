import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

const PricingCard = ({ title, price, features, recommended = false }: any) => (
    <div className={`p-8 rounded-2xl border ${recommended ? 'bg-[#1c1c1c] border-blue-500 relative' : 'bg-[#0a0a0a] border-gray-800'}`}>
        {recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
            </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-gray-500 text-sm">/unit/month</span>
        </div>
        <ul className="space-y-4 mb-8">
            {features.map((feat: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    {feat}
                </li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-lg font-bold transition ${recommended ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            Get Started
        </button>
    </div>
);

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 bg-grid">
            <Navbar />

            <div className="pt-32 pb-12 px-4 text-center max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-16">
                    Start for free, scale as you grow. No hidden fees for AI usage.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
                    <PricingCard
                        title="Starter"
                        price="0"
                        features={[
                            "Up to 50 units",
                            "Basic AI Triage",
                            "Vendor Dispatching",
                            "Email Support"
                        ]}
                    />
                    <PricingCard
                        title="Growth"
                        price="1.50"
                        recommended={true}
                        features={[
                            "Up to 500 units",
                            "Advanced AI Analysis",
                            "RAG Policy Lookup",
                            "Tenant Portal",
                            "Priority Support"
                        ]}
                    />
                    <PricingCard
                        title="Enterprise"
                        price="Custom"
                        features={[
                            "Unlimited units",
                            "Custom Integration",
                            "Dedicated Account Manager",
                            "SLA Guarantees",
                            "On-premise Deployment"
                        ]}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
