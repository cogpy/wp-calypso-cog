import {
	WORKFLOW_CREATE,
	WORKFLOW_UPDATE,
	WORKFLOW_DELETE,
	WORKFLOW_SET_STATUS,
	WORKFLOWS_RECEIVE,
} from '../action-types';
import type { WorkflowsState } from './types';
import type { WorkflowAction } from './actions';

const initialState: WorkflowsState = {
	items: {},
	isLoading: false,
	error: null,
};

export default function workflowsReducer(
	state = initialState,
	action: WorkflowAction
): WorkflowsState {
	switch ( action.type ) {
		case WORKFLOW_CREATE:
			return {
				...state,
				items: {
					...state.items,
					[ action.workflow.id ]: action.workflow,
				},
			};

		case WORKFLOW_UPDATE:
			if ( ! state.items[ action.workflowId ] ) {
				return state;
			}
			return {
				...state,
				items: {
					...state.items,
					[ action.workflowId ]: {
						...state.items[ action.workflowId ],
						...action.updates,
					},
				},
			};

		case WORKFLOW_DELETE:
			const { [ action.workflowId ]: deleted, ...remainingItems } = state.items;
			return {
				...state,
				items: remainingItems,
			};

		case WORKFLOW_SET_STATUS:
			if ( ! state.items[ action.workflowId ] ) {
				return state;
			}
			return {
				...state,
				items: {
					...state.items,
					[ action.workflowId ]: {
						...state.items[ action.workflowId ],
						status: action.status,
						updatedAt: new Date().toISOString(),
					},
				},
			};

		case WORKFLOWS_RECEIVE:
			const itemsById = action.workflows.reduce(
				( acc, workflow ) => {
					acc[ workflow.id ] = workflow;
					return acc;
				},
				{} as Record< string, typeof action.workflows[ 0 ] >
			);
			return {
				...state,
				items: {
					...state.items,
					...itemsById,
				},
			};

		default:
			return state;
	}
}
