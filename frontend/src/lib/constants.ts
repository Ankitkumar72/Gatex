export const WORKFLOW_STATUS = {
    ACTIVE: "active",
    TRIAGE: "triage",
    WAITING_APPROVAL: "waiting_for_approval",
    COMPLETED: "completed",
    ERROR: "error",
} as const;

export type WorkflowStatus = typeof WORKFLOW_STATUS[keyof typeof WORKFLOW_STATUS];
