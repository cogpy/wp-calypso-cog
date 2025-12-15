import type { Workflow } from './types';

interface RootState {
	workflows: {
		items: Record< string, Workflow >;
		isLoading: boolean;
		error: string | null;
	};
}

export function getWorkflows( state: RootState ): Workflow[] {
	return Object.values( state.workflows.items );
}

export function getWorkflowById( state: RootState, workflowId: string ): Workflow | undefined {
	return state.workflows.items[ workflowId ];
}

export function getActiveWorkflows( state: RootState ): Workflow[] {
	return getWorkflows( state ).filter( ( workflow ) => workflow.status === 'active' );
}

export function getWorkflowStats( state: RootState ) {
	const workflows = getWorkflows( state );
	const activeWorkflows = workflows.filter( ( workflow ) => workflow.status === 'active' );

	return {
		totalWorkflows: workflows.length,
		activeWorkflows: activeWorkflows.length,
		completedTasks: workflows.reduce( ( sum, workflow ) => sum + workflow.stats.successCount, 0 ),
		failedTasks: workflows.reduce( ( sum, workflow ) => sum + workflow.stats.failureCount, 0 ),
		pendingTasks: 0, // This would be calculated based on scheduled executions
	};
}

export function isWorkflowsLoading( state: RootState ): boolean {
	return state.workflows.isLoading;
}

export function getWorkflowsError( state: RootState ): string | null {
	return state.workflows.error;
}
