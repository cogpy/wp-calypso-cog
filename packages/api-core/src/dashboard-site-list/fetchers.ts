import { wpcom } from '../wpcom-fetcher';
import type { FetchDashboardSiteListParams, DashboardSiteListResponse } from './types';

/**
 * Fetches the site list in a format appropriate for the multi-site dashboard.
 * Regardless of the fields requested in `params`, `blog_id` and `slug` will
 * always be included in the response. TypeScript logic is easier to deal with
 * when we know that they will be present.
 * @param params - Parameters for fetching the site list.
 * @returns A promise that resolves to the dashboard site list response.
 */
export async function fetchDashboardSiteList(
	params: FetchDashboardSiteListParams = {}
): Promise< DashboardSiteListResponse > {
	const fields = new Set( params.fields ?? [] );
	fields.add( 'blog_id' );
	fields.add( 'slug' );

	return wpcom.req.get(
		{ path: '/dashboard/site-list', apiNamespace: 'wpcom/v2' },
		{
			...params,
			fields: [ ...fields ].join( ',' ),
		}
	);
}
