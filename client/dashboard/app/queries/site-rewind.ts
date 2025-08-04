import { queryOptions } from '@tanstack/react-query';
import { fetchSiteRewind } from '../../data/site-rewind';

export const siteRewindQuery = ( siteId: number ) =>
	queryOptions( {
		queryKey: [ 'site', siteId, 'has-staging-site' ],
		queryFn: () => fetchSiteRewind( siteId ),
	} );
