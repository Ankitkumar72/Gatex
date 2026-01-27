import React from 'react';
import { FileText, Send, ShieldCheck, MapPin } from 'lucide-react';

// 1. Define the interface to reflect your LangGraph state
interface GateXTicket {
    id: string;
    type: string;
    unit: string;
    tenantName: string;
    reasoning: {
        step: number;
        title: string;
        description: string;
        status: 'complete' | 'pending' | 'warning';
    }[];
    leaseExcerpt: string;
    recommendedVendor: {
        name: string;
        score: number;
        estimatedCost: number;
        eta: string;
    };
}

// 2. Apply the interface to the component props
export default function ApprovalDashboard({ ticketData }: { ticketData: GateXTicket }) {
    return (
        <div className="bg-[#0A0A0A] min-h-screen text-white p-8 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Critical Priority</span>
                        <h1 className="text-2xl font-bold tracking-tight">Ticket #{ticketData.id}: {ticketData.type}</h1>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin size={14} /> Unit {ticketData.unit} • Tenant: {ticketData.tenantName}
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition font-medium">
                        Reject
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                        <Send size={16} /> Approve Dispatch
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reasoning Path */}
                <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-6 shadow-inner">
                    <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-6">Agent Reasoning Engine</h3>
                    <div className="space-y-8 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5" />
                        {ticketData.reasoning.map((step) => (
                            <div key={step.step} className="flex gap-4 relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step.status === 'complete' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-500'
                                    }`}>
                                    {step.step}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{step.title}</p>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RAG Context */}
                <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-6 relative group overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <ShieldCheck size={160} />
                    </div>
                    <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-4">Lease Evidence (RAG)</h3>
                    <div className="bg-black/60 p-5 rounded-lg border border-white/5 text-sm text-gray-300 italic leading-loose font-serif">
                        "{ticketData.leaseExcerpt}"
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono">SOURCE: LEASE_V2_FINAL.PDF</span>
                        <button className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:underline">
                            <FileText size={12} /> View Full PDF
                        </button>
                    </div>
                </div>

                {/* Dispatch Target */}
                <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-6">Dispatch Optimization</h3>
                    <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-lg border border-white/5">
                        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center font-black text-xl">
                            {ticketData.recommendedVendor.name[0]}
                        </div>
                        <div>
                            <p className="font-bold">{ticketData.recommendedVendor.name}</p>
                            <p className="text-xs text-green-400 font-medium">Ranked #{ticketData.recommendedVendor.score} in Region</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gray-500 uppercase font-bold">Estimated Cost</span>
                            <span className="text-lg font-mono font-bold">${ticketData.recommendedVendor.estimatedCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gray-500 uppercase font-bold">Arrival Window</span>
                            <span className="text-sm font-bold">{ticketData.recommendedVendor.eta}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}