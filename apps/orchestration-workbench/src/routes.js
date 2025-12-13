import page from '@automattic/calypso-router';
import { createElement } from '@wordpress/element';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Dashboard } from './pages/dashboard';

export default function registerOrchestrationWorkbenchPages( store, queryClient ) {
	const rootElement = document.getElementById( 'wpcom' );
	const root = createRoot( rootElement );

	const render = ( component ) => {
		root.render(
			createElement( Provider, { store }, component )
		);
	};

	page( '/', () => {
		render( createElement( Dashboard ) );
	} );

	page();
}
