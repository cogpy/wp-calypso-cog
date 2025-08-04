import wpcom from 'calypso/lib/wp';

export async function fetchSiteRewind( siteId: number ) {
	return wpcom.req.post( {
		path: `/sites/${ siteId }/rewind`,
		apiNamespace: 'wpcom/v2',
	} );
}
