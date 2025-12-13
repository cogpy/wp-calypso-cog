/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import { WorkflowStats } from '../workflow-stats';

// Mock i18n-calypso
jest.mock( 'i18n-calypso', () => ( {
	useTranslate: () => ( text: string ) => text,
} ) );

const createMockStore = ( initialState = {} ) => {
	return createStore(
		( state = { workflows: { items: {}, isLoading: false, error: null }, ...initialState } ) =>
			state
	);
};

describe( 'WorkflowStats', () => {
	test( 'should render all stat cards', () => {
		const store = createMockStore();
		render(
			<Provider store={ store }>
				<WorkflowStats />
			</Provider>
		);

		expect( screen.getByText( 'Active Workflows' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Completed Tasks' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Pending Tasks' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Failed Tasks' ) ).toBeInTheDocument();
	} );

	test( 'should display initial values as 0', () => {
		const store = createMockStore();
		const { container } = render(
			<Provider store={ store }>
				<WorkflowStats />
			</Provider>
		);
		const values = container.querySelectorAll( '.workflow-stats__value' );

		values.forEach( ( value ) => {
			expect( value ).toHaveTextContent( '0' );
		} );
	} );

	test( 'should apply correct color classes', () => {
		const store = createMockStore();
		const { container } = render(
			<Provider store={ store }>
				<WorkflowStats />
			</Provider>
		);

		expect( container.querySelector( '.workflow-stats__card--primary' ) ).toBeInTheDocument();
		expect( container.querySelector( '.workflow-stats__card--success' ) ).toBeInTheDocument();
		expect( container.querySelector( '.workflow-stats__card--warning' ) ).toBeInTheDocument();
		expect( container.querySelector( '.workflow-stats__card--error' ) ).toBeInTheDocument();
	} );
} );
