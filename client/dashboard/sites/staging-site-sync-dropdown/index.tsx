import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { chevronDown, cloudDownload, cloudUpload } from '@wordpress/icons';
import { lazy, Suspense } from 'react';
import { siteBySlugQuery, siteByIdQuery } from '../../app/queries/site';
import { stagingSiteSyncStateQuery } from '../../app/queries/site-staging-sites';
import {
	getProductionSiteId,
	getStagingSiteId,
	isStagingSiteSyncing,
} from '../../utils/site-staging-site';

const StagingSiteSyncModal = lazy(
	() =>
		import(
			/* webpackChunkName: "async-load-staging-site-sync-modal" */ '../staging-site-sync-modal'
		)
);

interface StagingSiteSyncDropdownProps {
	siteSlug: string;
	className?: string;
}

export default function StagingSiteSyncDropdown( {
	siteSlug,
	className,
}: StagingSiteSyncDropdownProps ) {
	const [ isModalOpen, setIsModalOpen ] = useState< boolean >( false );
	const [ syncType, setSyncType ] = useState< 'pull' | 'push' >( 'pull' );
	const { data: site } = useSuspenseQuery( siteBySlugQuery( siteSlug ) );
	const environment = ! site.is_wpcom_staging_site ? 'production' : 'staging';

	const productionSiteId = getProductionSiteId( site );

	const stagingSiteId = getStagingSiteId( site );

	const otherEnvironmentSiteId = environment === 'staging' ? productionSiteId : stagingSiteId;

	const { data: otherEnvironmentSite } = useQuery( {
		...siteByIdQuery( otherEnvironmentSiteId ?? 0 ),
		enabled: !! otherEnvironmentSiteId,
	} );

	const { data: syncState } = useQuery( {
		...stagingSiteSyncStateQuery( productionSiteId ?? 0 ),
		enabled: false,
		refetchInterval: ( data ) => {
			return isStagingSiteSyncing( data ) ? 5000 : false;
		},
		refetchIntervalInBackground: true,
	} );

	const isSyncing = isStagingSiteSyncing( syncState );

	const pullLabel =
		environment === 'staging' ? __( 'Pull from Production' ) : __( 'Pull from Staging' );
	const pushLabel =
		environment === 'staging' ? __( 'Push to Production' ) : __( 'Push to Staging' );

	const handleOpenModal = ( type: 'pull' | 'push' ): void => {
		setSyncType( type );
		setIsModalOpen( true );
	};

	const handleCloseModal = (): void => {
		setIsModalOpen( false );
	};

	const handleSyncStart = () => {};

	console.log( syncState );

	if ( ! productionSiteId || ! stagingSiteId ) {
		return null;
	}

	return (
		<>
			<Dropdown
				className={ className }
				popoverProps={ { placement: 'bottom-end' } }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Button
						icon={ chevronDown }
						iconPosition="right"
						variant="secondary"
						aria-expanded={ isOpen }
						onClick={ () => onToggle() }
						disabled={ isSyncing }
					>
						{ isSyncing ? __( 'Syncing…' ) : __( 'Sync' ) }
					</Button>
				) }
				renderContent={ ( { onClose } ) => (
					<div>
						<MenuGroup>
							<MenuItem
								onClick={ () => {
									onClose();
									handleOpenModal( 'pull' );
								} }
								icon={ cloudDownload }
								iconPosition="left"
							>
								{ pullLabel }
							</MenuItem>
							<MenuItem
								onClick={ () => {
									onClose();
									handleOpenModal( 'push' );
								} }
								icon={ cloudUpload }
								iconPosition="left"
							>
								{ pushLabel }
							</MenuItem>
						</MenuGroup>
					</div>
				) }
			/>
			{ isModalOpen && (
				<Suspense fallback={ null }>
					<StagingSiteSyncModal
						productionSite={ environment === 'production' ? site : otherEnvironmentSite }
						stagingSite={ environment === 'staging' ? site : otherEnvironmentSite }
						onClose={ handleCloseModal }
						syncType={ syncType }
						environment={ environment }
						onSyncStart={ handleSyncStart }
					/>
				</Suspense>
			) }
		</>
	);
}
