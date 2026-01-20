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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = {
    async chatWithAgent(message: string, threadId: string): Promise<AgentResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/agent/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, thread_id: threadId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(errorData.detail || `Server Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error (Connection):', error);
            // Cast error to any to access message safely
            const errMsg = error instanceof Error ? error.message : String(error);
            return {
                message: `Error: Could not connect to GateX backend at ${API_BASE_URL}. Details: ${errMsg}`,
                type: 'text',
                status: 'error'
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
