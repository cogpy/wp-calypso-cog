/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import page from '@automattic/calypso-router';
import { WorkflowList } from '../workflow-list';

// Mock i18n-calypso
jest.mock( 'i18n-calypso', () => ( {
	useTranslate: () => ( text: string ) => text,
} ) );

// Mock calypso-router
jest.mock( '@automattic/calypso-router', () => jest.fn() );

describe( 'WorkflowList', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	test( 'should render empty state', () => {
		render( <WorkflowList /> );

		expect( screen.getByText( 'No workflows yet' ) ).toBeInTheDocument();
		expect(
			screen.getByText(
				'Get started by creating your first autonomous workflow to automate tasks across your WordPress sites.'
			)
		).toBeInTheDocument();
	} );

	test( 'should render create workflow button', () => {
		render( <WorkflowList /> );

		const button = screen.getByRole( 'button', { name: /Create Workflow/i } );
		expect( button ).toBeInTheDocument();
	} );

	test( 'should navigate to builder when create button is clicked', async () => {
		const user = userEvent.setup();
		render( <WorkflowList /> );

		const button = screen.getByRole( 'button', { name: /Create Workflow/i } );
		await user.click( button );

		expect( page ).toHaveBeenCalledWith( '/builder' );
	} );
} );
