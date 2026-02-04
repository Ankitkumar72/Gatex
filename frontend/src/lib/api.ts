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

function getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export const api = {
    async login(email: string, password: string): Promise<any> {
        try {
            const formData = new URLSearchParams();
            formData.append('username', email); // FASTAPI OAuth2PasswordRequestForm expects 'username'
            formData.append('password', password);

            // However, our backend implementation in main.py uses a custom LoginRequest JSON body
            // Let's verify: class LoginRequest(BaseModel): email: str, password: str
            // So we should send JSON.

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user_role', data.user.role);
                localStorage.setItem('user_name', data.user.name);
            }
            return data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        window.location.href = '/login';
    },

    async chatWithAgent(message: string, threadId: string): Promise<AgentResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/agent/chat`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ message, thread_id: threadId }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    return {
                        message: "Error: Not authenticated. Please log in again.",
                        type: 'text',
                        status: 'error'
                    };
                }
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
                headers: getHeaders(),
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
