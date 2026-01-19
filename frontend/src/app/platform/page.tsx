import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import { ShieldCheck, Zap, Activity, Globe, Database, Server } from 'lucide-react';

export default function PlatformPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 bg-grid">
            <Navbar />

            <div className="pt-32 pb-12 px-4 text-center max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">The GateX Platform</h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-16">
                    A unified operating system for real estate assets, powered by advanced AI and autonomous agents.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    <FeatureCard title="Autonomous Agents" desc="Self-learning agents that handle tenant requests, dispatch vendors, and follow up on maintenance." icon={Zap} />
                    <FeatureCard title="Enterprise Security" desc="SOC 2 Type II compliant security with role-based access control and audit logging." icon={ShieldCheck} />
                    <FeatureCard title="Data Intelligence" desc="Real-time analytics on asset performance, vendor costs, and tenant satisfaction." icon={Activity} />
                    <FeatureCard title="Global Infrastructure" desc="Distributed edge network ensuring low-latency access from anywhere in the world." icon={Globe} />
                    <FeatureCard title="Vector Knowledge Base" desc="RAG-powered policy lookup searching your specific leases and documents." icon={Database} />
                    <FeatureCard title="API First" desc="Full programmatic access to all platform capabilities for custom integrations." icon={Server} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
