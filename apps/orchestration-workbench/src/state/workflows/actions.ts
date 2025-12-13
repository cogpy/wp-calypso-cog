import {
	WORKFLOW_CREATE,
	WORKFLOW_UPDATE,
	WORKFLOW_DELETE,
	WORKFLOW_SET_STATUS,
	WORKFLOWS_RECEIVE,
} from '../action-types';
import type { Workflow, Task } from './types';

export interface CreateWorkflowAction {
	type: typeof WORKFLOW_CREATE;
	workflow: Workflow;
}

export interface UpdateWorkflowAction {
	type: typeof WORKFLOW_UPDATE;
	workflowId: string;
	updates: Partial< Workflow >;
}

export interface DeleteWorkflowAction {
	type: typeof WORKFLOW_DELETE;
	workflowId: string;
}

export interface SetWorkflowStatusAction {
	type: typeof WORKFLOW_SET_STATUS;
	workflowId: string;
	status: 'active' | 'paused' | 'draft';
}

export interface ReceiveWorkflowsAction {
	type: typeof WORKFLOWS_RECEIVE;
	workflows: Workflow[];
}

export type WorkflowAction =
	| CreateWorkflowAction
	| UpdateWorkflowAction
	| DeleteWorkflowAction
	| SetWorkflowStatusAction
	| ReceiveWorkflowsAction;

export function createWorkflow( name: string, tasks: Task[] ): CreateWorkflowAction {
	const now = new Date().toISOString();
	const workflow: Workflow = {
		id: `workflow-${ Date.now() }`,
		name,
		tasks,
		status: 'draft',
		createdAt: now,
		updatedAt: now,
		stats: {
			executions: 0,
			successCount: 0,
			failureCount: 0,
		},
	};

	return {
		type: WORKFLOW_CREATE,
		workflow,
	};
}

export function updateWorkflow(
	workflowId: string,
	updates: Partial< Workflow >
): UpdateWorkflowAction {
	return {
		type: WORKFLOW_UPDATE,
		workflowId,
		updates: {
			...updates,
			updatedAt: new Date().toISOString(),
		},
	};
}

export function deleteWorkflow( workflowId: string ): DeleteWorkflowAction {
	return {
		type: WORKFLOW_DELETE,
		workflowId,
	};
}

export function setWorkflowStatus(
	workflowId: string,
	status: 'active' | 'paused' | 'draft'
): SetWorkflowStatusAction {
	return {
		type: WORKFLOW_SET_STATUS,
		workflowId,
		status,
	};
}

export function receiveWorkflows( workflows: Workflow[] ): ReceiveWorkflowsAction {
	return {
		type: WORKFLOWS_RECEIVE,
		workflows,
	};
}
