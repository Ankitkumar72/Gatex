import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Code2, Terminal, Book, Webhook, Key } from 'lucide-react';

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#1e1e1e] p-4 rounded-lg font-mono text-sm text-gray-300 overflow-x-auto border border-gray-800">
        {children}
    </div>
);

export default function DevelopersPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 bg-grid">
            <Navbar />

            <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6">Build on GateX</h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Integrate intelligent property management into your own applications with our robust API.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-lg h-fit"><Code2 className="text-blue-500" /></div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">REST API</h3>
                                <p className="text-gray-400 mb-4">Full programmatic access to tenants, maintenance tickets, and vendor dispatch.</p>
                                <button className="text-blue-400 text-sm hover:underline">Read the docs &rarr;</button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-purple-500/10 p-3 rounded-lg h-fit"><Webhook className="text-purple-500" /></div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Webhooks</h3>
                                <p className="text-gray-400 mb-4">Real-time notifications for ticket status changes, vendor arrivals, and emergency alerts.</p>
                                <button className="text-blue-400 text-sm hover:underline">Configure webhooks &rarr;</button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-green-500/10 p-3 rounded-lg h-fit"><Key className="text-green-500" /></div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Authentication</h3>
                                <p className="text-gray-400 mb-4">Secure API key authentication with granular scope permissions.</p>
                                <button className="text-blue-400 text-sm hover:underline">Get API Keys &rarr;</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal size={16} className="text-gray-400" />
                            <span className="text-xs font-mono text-gray-500">Example Request</span>
                        </div>
                        <CodeBlock>
                            {`curl -X POST https://api.gatex.com/v1/tickets \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "tenant_id": "usr_123",
    "unit_id": "apt_4b",
    "description": "Leaking faucet in master bath",
    "urgency": "high"
  }'`}
                        </CodeBlock>

                        <div className="flex items-center gap-2 mb-2 mt-8">
                            <Terminal size={16} className="text-gray-400" />
                            <span className="text-xs font-mono text-gray-500">Example Response</span>
                        </div>
                        <CodeBlock>
                            {`{
  "id": "tkt_890",
  "status": "analyzing",
  "ai_analysis": {
    "category": "Plumbing",
    "estimated_cost": "$150-$200",
    "recommended_action": "Dispatch Standard Plumbing"
  }
}`}
                        </CodeBlock>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
