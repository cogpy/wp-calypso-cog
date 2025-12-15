import {
	getWorkflows,
	getWorkflowById,
	getActiveWorkflows,
	getWorkflowStats,
	isWorkflowsLoading,
	getWorkflowsError,
} from '../selectors';
import type { Workflow } from '../types';

describe( 'workflows selectors', () => {
	const mockWorkflow1: Workflow = {
		id: 'workflow-1',
		name: 'Workflow 1',
		tasks: [],
		status: 'active',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01',
		stats: {
			executions: 10,
			successCount: 8,
			failureCount: 2,
		},
	};

	const mockWorkflow2: Workflow = {
		id: 'workflow-2',
		name: 'Workflow 2',
		tasks: [],
		status: 'draft',
		createdAt: '2024-01-02',
		updatedAt: '2024-01-02',
		stats: {
			executions: 5,
			successCount: 5,
			failureCount: 0,
		},
	};

	const mockState = {
		workflows: {
			items: {
				'workflow-1': mockWorkflow1,
				'workflow-2': mockWorkflow2,
			},
			isLoading: false,
			error: null,
		},
	};

	test( 'getWorkflows should return all workflows', () => {
		const workflows = getWorkflows( mockState );
		expect( workflows ).toHaveLength( 2 );
		expect( workflows ).toContainEqual( mockWorkflow1 );
		expect( workflows ).toContainEqual( mockWorkflow2 );
	} );

	test( 'getWorkflowById should return the correct workflow', () => {
		const workflow = getWorkflowById( mockState, 'workflow-1' );
		expect( workflow ).toEqual( mockWorkflow1 );
	} );

	test( 'getWorkflowById should return undefined for non-existent workflow', () => {
		const workflow = getWorkflowById( mockState, 'non-existent' );
		expect( workflow ).toBeUndefined();
	} );

	test( 'getActiveWorkflows should return only active workflows', () => {
		const activeWorkflows = getActiveWorkflows( mockState );
		expect( activeWorkflows ).toHaveLength( 1 );
		expect( activeWorkflows[ 0 ] ).toEqual( mockWorkflow1 );
	} );

	test( 'getWorkflowStats should calculate stats correctly', () => {
		const stats = getWorkflowStats( mockState );
		expect( stats ).toEqual( {
			totalWorkflows: 2,
			activeWorkflows: 1,
			completedTasks: 13, // 8 + 5
			failedTasks: 2,
			pendingTasks: 0,
		} );
	} );

	test( 'isWorkflowsLoading should return loading state', () => {
		expect( isWorkflowsLoading( mockState ) ).toBe( false );

		const loadingState = {
			...mockState,
			workflows: {
				...mockState.workflows,
				isLoading: true,
			},
		};
		expect( isWorkflowsLoading( loadingState ) ).toBe( true );
	} );

	test( 'getWorkflowsError should return error state', () => {
		expect( getWorkflowsError( mockState ) ).toBeNull();

		const errorState = {
			...mockState,
			workflows: {
				...mockState.workflows,
				error: 'Something went wrong',
			},
		};
		expect( getWorkflowsError( errorState ) ).toBe( 'Something went wrong' );
	} );
} );
