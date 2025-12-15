export interface Task {
	id: string;
	name: string;
	description: string;
	category: string;
	icon: string;
	config?: Record< string, unknown >;
}

export interface Workflow {
	id: string;
	name: string;
	description?: string;
	tasks: Task[];
	status: 'active' | 'paused' | 'draft';
	createdAt: string;
	updatedAt: string;
	stats: {
		executions: number;
		successCount: number;
		failureCount: number;
		lastExecutedAt?: string;
	};
}

export interface WorkflowsState {
	items: Record< string, Workflow >;
	isLoading: boolean;
	error: string | null;
}
