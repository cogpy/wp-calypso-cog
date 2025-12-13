/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import page from '@automattic/calypso-router';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import { WorkflowList } from '../workflow-list';
import workflowsReducer from '../../state/workflows/reducer';

// Mock i18n-calypso
jest.mock( 'i18n-calypso', () => ( {
	useTranslate: () => ( text: string ) => text,
} ) );

// Mock calypso-router
jest.mock( '@automattic/calypso-router', () => jest.fn() );

const createMockStore = ( initialState = {} ) => {
	return createStore(
		( state = { workflows: { items: {}, isLoading: false, error: null }, ...initialState } ) =>
			state
	);
};

describe( 'WorkflowList', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	test( 'should render empty state', () => {
		const store = createMockStore();
		render(
			<Provider store={ store }>
				<WorkflowList />
			</Provider>
		);

		expect( screen.getByText( 'No workflows yet' ) ).toBeInTheDocument();
		expect(
			screen.getByText(
				'Get started by creating your first autonomous workflow to automate tasks across your WordPress sites.'
			)
		).toBeInTheDocument();
	} );

	test( 'should render create workflow button', () => {
		const store = createMockStore();
		render(
			<Provider store={ store }>
				<WorkflowList />
			</Provider>
		);

		const button = screen.getByRole( 'button', { name: /Create Workflow/i } );
		expect( button ).toBeInTheDocument();
	} );

	test( 'should navigate to builder when create button is clicked', async () => {
		const user = userEvent.setup();
		const store = createMockStore();
		render(
			<Provider store={ store }>
				<WorkflowList />
			</Provider>
		);

		const button = screen.getByRole( 'button', { name: /Create Workflow/i } );
		await user.click( button );

		expect( page ).toHaveBeenCalledWith( '/builder' );
	} );
} );
