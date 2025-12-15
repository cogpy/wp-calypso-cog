import workflowsReducer from '../reducer';
import {
	createWorkflow,
	updateWorkflow,
	deleteWorkflow,
	setWorkflowStatus,
	receiveWorkflows,
} from '../actions';
import type { WorkflowsState } from '../types';

describe( 'workflowsReducer', () => {
	const initialState: WorkflowsState = {
		items: {},
		isLoading: false,
		error: null,
	};

	test( 'should return initial state', () => {
		expect( workflowsReducer( undefined, { type: 'UNKNOWN_ACTION' } as any ) ).toEqual(
			initialState
		);
	} );

	test( 'should handle WORKFLOW_CREATE', () => {
		const action = createWorkflow( 'Test Workflow', [] );
		const newState = workflowsReducer( initialState, action );

		expect( Object.keys( newState.items ) ).toHaveLength( 1 );
		const workflow = Object.values( newState.items )[ 0 ];
		expect( workflow.name ).toBe( 'Test Workflow' );
		expect( workflow.status ).toBe( 'draft' );
	} );

	test( 'should handle WORKFLOW_UPDATE', () => {
		const createAction = createWorkflow( 'Test Workflow', [] );
		const stateWithWorkflow = workflowsReducer( initialState, createAction );
		const workflowId = Object.keys( stateWithWorkflow.items )[ 0 ];

		const updateAction = updateWorkflow( workflowId, { name: 'Updated Workflow' } );
		const updatedState = workflowsReducer( stateWithWorkflow, updateAction );

		expect( updatedState.items[ workflowId ].name ).toBe( 'Updated Workflow' );
	} );

	test( 'should handle WORKFLOW_DELETE', () => {
		const createAction = createWorkflow( 'Test Workflow', [] );
		const stateWithWorkflow = workflowsReducer( initialState, createAction );
		const workflowId = Object.keys( stateWithWorkflow.items )[ 0 ];

		const deleteAction = deleteWorkflow( workflowId );
		const updatedState = workflowsReducer( stateWithWorkflow, deleteAction );

		expect( Object.keys( updatedState.items ) ).toHaveLength( 0 );
	} );

	test( 'should handle WORKFLOW_SET_STATUS', () => {
		const createAction = createWorkflow( 'Test Workflow', [] );
		const stateWithWorkflow = workflowsReducer( initialState, createAction );
		const workflowId = Object.keys( stateWithWorkflow.items )[ 0 ];

		const statusAction = setWorkflowStatus( workflowId, 'active' );
		const updatedState = workflowsReducer( stateWithWorkflow, statusAction );

		expect( updatedState.items[ workflowId ].status ).toBe( 'active' );
	} );

	test( 'should handle WORKFLOWS_RECEIVE', () => {
		const workflows = [
			{
				id: 'workflow-1',
				name: 'Workflow 1',
				tasks: [],
				status: 'active' as const,
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01',
				stats: {
					executions: 0,
					successCount: 0,
					failureCount: 0,
				},
			},
			{
				id: 'workflow-2',
				name: 'Workflow 2',
				tasks: [],
				status: 'draft' as const,
				createdAt: '2024-01-02',
				updatedAt: '2024-01-02',
				stats: {
					executions: 0,
					successCount: 0,
					failureCount: 0,
				},
			},
		];

		const receiveAction = receiveWorkflows( workflows );
		const newState = workflowsReducer( initialState, receiveAction );

		expect( Object.keys( newState.items ) ).toHaveLength( 2 );
		expect( newState.items[ 'workflow-1' ].name ).toBe( 'Workflow 1' );
		expect( newState.items[ 'workflow-2' ].name ).toBe( 'Workflow 2' );
	} );
} );
