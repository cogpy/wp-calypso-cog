import page from '@automattic/calypso-router';

export function setupContextMiddleware( store, queryClient ) {
	page( '*', ( context, next ) => {
		context.store = store;
		context.queryClient = queryClient;
		next();
	} );
}
