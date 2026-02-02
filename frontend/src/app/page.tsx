import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import {
  Play,
  Zap,
  Wallet,
  Smartphone,
  Activity
} from 'lucide-react';

export default function GateXLanding() {
  return (

    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 bg-grid">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] text-green-400 uppercase tracking-widest font-bold mb-8">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live System: AI Optimization Active | 99.9% Uptime
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
          The Operating System for <span className="text-gray-500">Modern Real Estate</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Orchestrate maintenance, vendors, and tenant satisfaction with a single, high-velocity platform designed for scale.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition w-full sm:w-auto">
            Start Free Trial
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition w-full sm:w-auto justify-center">
            <Play size={16} fill="white" /> Watch Video
          </button>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 hidden sm:block"></div>
          <div className="relative bg-[#0F0F0F] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <img
              src="/gatex-dashboard.png"
              alt="GateX Dashboard"
              className="w-full opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-20 border-y border-white/5">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-10">Trusted by production-scale teams</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {['SKYLINE', 'VANTAGE', 'APEX REIT', 'NEXUS', 'URBANA'].map(logo => (
            <span key={logo} className="font-black text-xl tracking-tighter">{logo}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto py-32 px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-4">Orchestration at scale</h2>
            <p className="text-gray-400">Everything you need to manage complex property portfolios without the chaos.</p>
          </div>
          <button className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:underline">
            View all features
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            size="large"
            title="Autonomous Dispatch"
            icon={Zap}
            desc="Our LangGraph-driven agent triages incoming tickets, verifies lease obligations, and dispatches the ideal vendor in < 40ms without human intervention."
          >
            <div className="h-24 w-full bg-gradient-to-r from-blue-500/20 to-transparent rounded border-l-2 border-blue-500" />
          </FeatureCard>

          <FeatureCard
            title="Vendor Wallet"
            icon={Wallet}
            desc="Programmatic escrow and instant payouts triggered automatically upon agent-verified job completion."
          >
            <div className="flex items-end gap-1 h-20">
              {[40, 70, 45, 90, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-purple-600/40 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            title="Tenant Portal"
            icon={Smartphone}
            desc="Mobile-first experience for modern tenant standards."
          >
            <div className="bg-gray-800 h-32 rounded-t-xl mx-4 mt-2 border-x border-t border-gray-700" />
          </FeatureCard>

          <FeatureCard
            size="large"
            title="Predictive Maintenance"
            icon={Activity}
            desc="Real-time IoT telemetry feeds directly into our reasoning engine to flag HVAC or plumbing anomalies before the tenant even notices."
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-3 rounded">
                <p className="text-[10px] text-gray-500 uppercase">HVAC Health</p>
                <p className="text-xl font-bold">98%</p>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <p className="text-[10px] text-gray-500 uppercase">Leak Sensors</p>
                <p className="text-xl font-bold text-green-500">SECURE</p>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <p className="text-[10px] text-gray-500 uppercase">Energy Use</p>
                <p className="text-xl font-bold text-orange-500">-12%</p>
              </div>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-32">
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for production-grade control?</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">Join the high-performance teams managing over 500 million square feet on GateX.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-bold">Get a Demo</button>
            <button className="bg-transparent border border-gray-700 px-8 py-3 rounded-lg font-bold">Contact Sales</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}