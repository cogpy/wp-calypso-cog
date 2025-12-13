/**
 * Global polyfills
 */
import './load-config';
import accessibleFocus from '@automattic/accessible-focus';
import config from '@automattic/calypso-config';
import '@automattic/calypso-polyfills';
import { QueryClient } from '@tanstack/react-query';
import { createStore, applyMiddleware, compose } from 'redux';
import { thunk as thunkMiddleware } from 'redux-thunk';
import { initializeAnalytics } from 'calypso/lib/analytics/init';
import getSuperProps from 'calypso/lib/analytics/super-props';
import analyticsMiddleware from 'calypso/state/analytics/middleware';
import { setCurrentUser } from 'calypso/state/current-user/actions';
import currentUser from 'calypso/state/current-user/reducer';
import wpcomApiMiddleware from 'calypso/state/data-layer/wpcom-api-middleware';
import { setStore } from 'calypso/state/redux-store';
import sites from 'calypso/state/sites/reducer';
import { setSelectedSiteId } from 'calypso/state/ui/actions';
import { combineReducers, addReducerEnhancer } from 'calypso/state/utils';
import setLocale from './lib/set-locale';
import { setupContextMiddleware } from './page-middleware/setup-context';
import registerOrchestrationWorkbenchPages from './routes';
import workflowsReducer from './state/workflows/reducer';
import themes from './themes';

import 'calypso/assets/stylesheets/style.scss';
import './app.scss';

async function AppBoot() {
	// Load the App theme
	const theme = themes( 'wpcom' );
	Object.entries( theme ).forEach( ( [ key, value ] ) => {
		document.documentElement.style.setProperty( key, value );
	} );

	const rootReducer = combineReducers( {
		currentUser,
		sites,
		workflows: workflowsReducer,
	} );

	const initialState = config( 'initial_state' );

	const user = initialState.currentUser.user;
	const localeSlug = user.localeSlug;

	const queryClient = new QueryClient();

	const store = createStore(
		rootReducer,
		initialState,
		compose(
			addReducerEnhancer,
			applyMiddleware( thunkMiddleware, wpcomApiMiddleware, analyticsMiddleware )
		)
	);

	// Add accessible-focus listener
	accessibleFocus();

	setStore( store );
	setupContextMiddleware( store, queryClient );

	// Set selected site ID & current user
	store.dispatch( setSelectedSiteId( config( 'blog_id' ) ) );
	store.dispatch( setCurrentUser( user ) );

	// Initialize analytics
	const superPropsFn = getSuperProps( store );
	initializeAnalytics( user?.email ? user : undefined, ( eventProperties ) =>
		superPropsFn( { ...eventProperties, force_site_id: true } )
	);

	// Ensure locale files are loaded before rendering
	setLocale( localeSlug ).then( () => {
		registerOrchestrationWorkbenchPages( store, queryClient );

		// Adds the section class name to the body
		document.querySelector( 'body' )?.classList.add( 'is-section-orchestration-workbench' );
	} );
}

AppBoot();
