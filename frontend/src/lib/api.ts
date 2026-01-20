export interface GatexState {
    classification?: 'emergency' | 'routine' | 'clarification_needed';
    urgency_score?: number;
    maintenance_category?: string;
    resolution_strategy?: string;
    approval_status?: boolean;
    draft_work_order?: string;
}

export interface AgentResponse {
    message: string;
    type: 'text' | 'action_required';
    data?: any;
    // The raw state from the LangGraph run
    final_state?: GatexState;
    thread_id?: string;
    status?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
    async chatWithAgent(message: string, threadId: string): Promise<AgentResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/agent/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, thread_id: threadId }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn('API Error (Connection):', error);
            console.info('Switching to Offline Simulation Mode');

            // Simulate network latency
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simple keyword-based mock responses for demo purposes
            const lowerMsg = message.toLowerCase();
            let mockResponse = "I've received your message. I'm currently running in 'Offline Demo Mode' because I can't reach the backend server. To activate the real AI, please run `python backend/main.py`.";

            // Mock State
            let mockState: GatexState = {
                classification: 'routine',
                urgency_score: 3,
                maintenance_category: undefined
            };

            if (lowerMsg.includes('leak') || lowerMsg.includes('water') || lowerMsg.includes('flood')) {
                mockResponse = "I've noted the water leak. Is it causing any immediate flooding or damage to flooring?";
                mockState = {
                    classification: 'emergency',
                    urgency_score: 8,
                    maintenance_category: 'plumbing'
                };
            } else if (lowerMsg.includes('fire') || lowerMsg.includes('smoke')) {
                mockResponse = "Please evacuate immediately if you are in danger. I have alerted the emergency services.";
                mockState = {
                    classification: 'emergency',
                    urgency_score: 10,
                    maintenance_category: 'fire_safety'
                };
            } else if (lowerMsg.includes('ac') || lowerMsg.includes('hvac') || lowerMsg.includes('hot')) {
                mockResponse = "I understand the AC is having issues. Is it completely off or just not cooling?";
                mockState = {
                    classification: 'routine',
                    urgency_score: 5,
                    maintenance_category: 'hvac'
                };
            } else if (lowerMsg.includes('urgent') || lowerMsg.includes('emergency')) {
                mockResponse = "I've escalated this to 'High Priority'. A notification has been sent to the property manager.";
                mockState = {
                    classification: 'emergency',
                    urgency_score: 9,
                    maintenance_category: 'general'
                };
            } else if (lowerMsg.includes('thanks')) {
                mockResponse = "You're welcome. Is there anything else I can help you with?";
            }

            return {
                message: mockResponse,
                type: 'text',
                final_state: mockState
            };
        }
    },

    async approveAction(threadId: string, approved: boolean): Promise<AgentResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/agent/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ thread_id: threadId, approved }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return {
                message: "Failed to submit approval.",
                type: 'text'
            };
        }
    }
};
