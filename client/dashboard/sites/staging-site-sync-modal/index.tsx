import { useQuery, useMutation } from '@tanstack/react-query';
import {
	Button,
	ExternalLink,
	Modal,
	Icon,
	__experimentalText as Text,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	// eslint-disable-next-line wpcalypso/no-unsafe-wp-apis
	__experimentalInputControl as InputControl,
	CheckboxControl,
	SelectControl,
	Notice,
	Tooltip,
} from '@wordpress/components';
import {
	createInterpolateElement,
	useState,
	useCallback,
	useMemo,
	useEffect,
} from '@wordpress/element';
import { __, isRTL } from '@wordpress/i18n';
import { error, chevronRight, chevronLeft } from '@wordpress/icons';
import clsx from 'clsx';
import { Suspense, lazy } from 'react';
import { useAnalytics } from '../../app/analytics';
import { siteLastBackupQuery } from '../../app/queries/site-backups';
import { siteRewindQuery } from '../../app/queries/site-rewind';
import {
	stagingSitePushToStagingMutation,
	stagingSitePullFromStagingMutation,
} from '../../app/queries/site-staging-sites';
import InlineSupportLink from '../../components/inline-support-link';
import { SectionHeader } from '../../components/section-header';
import SiteEnvironmentBadge, { EnvironmentType } from '../../components/site-environment-badge';
import { getSiteDisplayName } from '../../utils/site-name';
// import { setNodeCheckState } from 'calypso/state/rewind/browser/actions';
import type { Site } from '../../data/types';
import type { FileBrowserConfig } from 'calypso/my-sites/backup/backup-contents-page/file-browser';
import './style.scss';

const ROOT_PATH = '/';
const WP_CONFIG_PATH = '/wp-config.php';
const WP_CONTENT_PATH = '/wp-content';
const SQL_PATH = '/sql';

const fileBrowserConfig: FileBrowserConfig = {
	restrictedTypes: [ 'plugin', 'theme' ],
	restrictedPaths: [ 'wp-content' ],
	excludeTypes: [ 'wordpress' ],
	alwaysInclude: [ 'wp-config.php' ],
	showHeaderButtons: false,
	showFileCard: false,
	showBackupTime: true,
};

const FileBrowser = lazy(
	() =>
		import(
			/* webpackChunkName: "async-load-backup-file-browser" */ 'calypso/my-sites/backup/backup-contents-page/file-browser'
		)
);

const DirectionArrow = () => {
	return (
		<div style={ { marginTop: '44px' } }>
			<Icon
				icon={ isRTL() ? chevronLeft : chevronRight }
				style={ {
					fill: '#949494',
				} }
			/>
		</div>
	);
};

interface EnvironmentLabelProps {
	label: string;
	environmentType: EnvironmentType;
	siteTitle?: string;
}

const EnvironmentLabel = ( { label, environmentType, siteTitle }: EnvironmentLabelProps ) => {
	return (
		<VStack spacing={ 1 }>
			<SectionHeader level={ 3 } title={ label } />
			<HStack spacing={ 2 }>
				<SiteEnvironmentBadge environmentType={ environmentType } />
				{ siteTitle && (
					<Text
						style={ {
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							maxWidth: '190px',
						} }
					>
						{ siteTitle }
					</Text>
				) }
			</HStack>
		</VStack>
	);
};

interface SyncModalProps {
	productionSite: Site;
	stagingSite: Site;
	onClose: () => void;
	syncType: 'pull' | 'push';
	environment: 'production' | 'staging';
	productionSiteId: number;
	stagingSiteId: number;
	onSyncStart: () => void;
}

interface EnvironmentConfig {
	title: string;
	description: string;
	syncFrom: EnvironmentType;
	syncTo: EnvironmentType;
}

interface SyncConfig {
	staging: EnvironmentConfig;
	production: EnvironmentConfig;
	fromLabel: string;
	toLabel: string;
	syncSelectionHeading: string;
	learnMore: string;
	submit: string;
}

const getSyncConfig = ( type: 'pull' | 'push' ): SyncConfig => {
	if ( type === 'pull' ) {
		return {
			staging: {
				title: __( 'Pull from Production' ),
				description: __(
					'Pulling will replace the existing files and database of the staging site. An automatic backup of your environment will be created, allowing you to revert changes from the <a>Activity log</a> if needed.'
				),
				syncFrom: 'production',
				syncTo: 'staging',
			},
			production: {
				title: __( 'Pull from Staging' ),
				description: __(
					'Pulling will replace the existing files and database of the production site. An automatic backup of your environment will be created, allowing you to revert changes from the <a>Activity log</a> if needed.'
				),
				syncFrom: 'staging',
				syncTo: 'production',
			},
			fromLabel: __( 'Pull' ),
			toLabel: __( 'To' ),
			syncSelectionHeading: __( 'What would you like to pull?' ),
			learnMore: __( 'Read more about <a>environment pull</a>.' ),
			submit: __( 'Pull' ),
		};
	}

	return {
		staging: {
			title: __( 'Push to Production' ),
			description: __(
				'Pushing will replace the existing files and database of the production site. An automatic backup of your environment will be created, allowing you to revert changes from the <a>Activity log</a> if needed.'
			),
			syncFrom: 'staging',
			syncTo: 'production',
		},
		production: {
			title: __( 'Push to Staging' ),
			description: __(
				'Pushing will replace the existing files and database of the staging site. An automatic backup of your environment will be created, allowing you to revert changes from the <a>Activity log</a> if needed.'
			),
			syncFrom: 'production',
			syncTo: 'staging',
		},
		fromLabel: __( 'Push' ),
		toLabel: __( 'To' ),
		syncSelectionHeading: __( 'What would you like to push?' ),
		learnMore: __( 'Read more about <a>environment push</a>.' ),
		submit: __( 'Push' ),
	};
};

const getBackupBrowserNode = ( rewind: any, pathList: string[] | string ) => {
	let currentNode = rewind?.browser?.rootNode ?? undefined;
	if ( currentNode === undefined ) {
		return currentNode;
	}

	if ( pathList.length === 0 ) {
		return undefined;
	}

	if ( typeof pathList === 'string' ) {
		pathList = pathList.split( '/' );
		pathList = pathList.filter( ( pathPart ) => pathPart.length > 0 );
	}

	// We're starting at the root node so we'll remove it from the top of the array if it exists
	// If we got a string of '/' we may end up with 0 length now, but want the root.
	if ( pathList.length > 0 && pathList[ 0 ] === '/' ) {
		pathList.shift();
	}

	for ( const pathPart of pathList ) {
		const childNode = currentNode.children.find( ( node ) => node.path === pathPart );
		if ( ! childNode ) {
			return undefined;
		}
		currentNode = childNode;
	}
	return currentNode;
};

const isSiteStore = ( site: Site ) => {
	return site.jetpack && site.options?.woocommerce_is_active;
};

export default function SyncModal( {
	productionSite,
	stagingSite,
	onClose,
	syncType,
	environment,
	onSyncStart,
}: SyncModalProps ) {
	const { recordTracksEvent } = useAnalytics();
	const syncConfig = getSyncConfig( syncType );
	const [ isFileBrowserVisible, setIsFileBrowserVisible ] = useState( false );
	const [ domainConfirmation, setDomainConfirmation ] = useState( '' );

	const targetEnvironment = syncConfig[ environment ].syncTo;
	const sourceEnvironment = syncConfig[ environment ].syncFrom;

	const productionSiteId = productionSite.ID;
	const stagingSiteId = stagingSite.ID;

	const productionSiteSlug = productionSite.slug;
	const stagingSiteSlug = stagingSite.slug;

	const productionSiteTitle = getSiteDisplayName( productionSite );
	const stagingSiteTitle = getSiteDisplayName( stagingSite );

	const targetSiteSlug = targetEnvironment === 'production' ? productionSiteSlug : stagingSiteSlug;

	const sourceSiteTitle = sourceEnvironment === 'staging' ? stagingSiteTitle : productionSiteTitle;
	const targetSiteTitle =
		targetEnvironment === 'production' ? productionSiteTitle : stagingSiteTitle;

	const querySite = sourceEnvironment === 'staging' ? stagingSite : productionSite;
	const querySiteId = querySite.ID;
	const querySiteSlug = querySite.slug;

	const { data: siteRewind } = useQuery( siteRewindQuery( querySiteId ) );
	const { data: lastBackup } = useQuery( siteLastBackupQuery( querySiteId ) );
	console.log( siteRewind );
	const setNodeCheckState = ( siteId: number, node: string, status: string ) => {
		console.log( siteId, node, status );
	};

	const browserCheckList = siteRewind?.browser;

	// Calculate checkbox state based only on visible nodes (wp-content and wp-config.php)
	const wpContentNode = getBackupBrowserNode( siteRewind, WP_CONTENT_PATH );
	const wpConfigNode = getBackupBrowserNode( siteRewind, WP_CONFIG_PATH );
	const sqlNode = getBackupBrowserNode( siteRewind, SQL_PATH );

	const isSiteWooStore = isSiteStore( querySite );
	const filesAndFoldersNodesCheckState = useMemo( () => {
		const nodes = [ wpContentNode, wpConfigNode ].filter( Boolean );
		if ( nodes.length === 0 ) {
			// If nodes don't exist yet, default to 'unchecked' since we set the root to unchecked by default
			return 'unchecked';
		}

		const checkedCount = nodes.filter( ( node ) => node?.checkState === 'checked' ).length;
		const mixedCount = nodes.filter( ( node ) => node?.checkState === 'mixed' ).length;

		if ( mixedCount > 0 ) {
			return 'mixed';
		}

		if ( checkedCount === nodes.length ) {
			return 'checked';
		}

		if ( checkedCount === 0 ) {
			return 'unchecked';
		}

		return 'mixed';
	}, [ wpContentNode, wpConfigNode ] );

	const pullFromStagingMutation = useMutation( {
		...stagingSitePullFromStagingMutation( productionSiteId, stagingSiteId ),
		onSuccess: ( _, options ) => {
			recordTracksEvent( 'calypso_hosting_configuration_staging_site_pull_success', options );
		},
		onError: ( error, options ) => {
			recordTracksEvent( 'calypso_hosting_configuration_staging_site_pull_failure', {
				code: error.code,
				...options,
			} );
		},
	} );

	const pushToStagingMutation = useMutation( {
		...stagingSitePushToStagingMutation( productionSiteId, stagingSiteId ),
		onSuccess: ( _, options ) => {
			recordTracksEvent( 'calypso_hosting_configuration_staging_site_push_success', options );
		},
		onError: ( error, options ) => {
			recordTracksEvent( 'calypso_hosting_configuration_staging_site_push_failure', {
				code: error.code,
				...options,
			} );
		},
	} );

	const rewindId = lastBackup?.rewindId;

	const shouldDisableGranularSync = ! lastBackup;

	useEffect( () => {
		if ( shouldDisableGranularSync ) {
			setNodeCheckState( querySiteId, ROOT_PATH, 'checked' );
			setNodeCheckState( querySiteId, WP_CONTENT_PATH, 'checked' );
			setNodeCheckState( querySiteId, WP_CONFIG_PATH, 'checked' );
			setNodeCheckState( querySiteId, SQL_PATH, 'checked' );
		}
	}, [ querySiteId, shouldDisableGranularSync ] );

	const handleConfirm = () => {
		let include_paths = browserCheckList.includeList.map( ( item ) => item.id ).join( ',' );
		let exclude_paths = browserCheckList.excludeList.map( ( item ) => item.id ).join( ',' );
		if (
			shouldDisableGranularSync ||
			( filesAndFoldersNodesCheckState === 'checked' && sqlNode?.checkState === 'checked' )
		) {
			// Sync everything
			include_paths = '';
			exclude_paths = '';
		}

		onSyncStart();

		if (
			( syncType === 'pull' && environment === 'production' ) ||
			( syncType === 'push' && environment === 'staging' )
		) {
			pullFromStagingMutation.mutate( { types: 'paths', include_paths, exclude_paths } );
		} else {
			pushToStagingMutation.mutate( { types: 'paths', include_paths, exclude_paths } );
		}

		onClose();
	};

	const updateFilesAndFoldersCheckState = useCallback(
		( checkState: 'checked' | 'unchecked' | 'mixed' ) => {
			setNodeCheckState( querySiteId, WP_CONTENT_PATH, checkState );
			setNodeCheckState( querySiteId, WP_CONFIG_PATH, checkState );
		},
		[ querySiteId ]
	);

	const handleDomainConfirmation = useCallback(
		( value: string | undefined ) => setDomainConfirmation( value || '' ),
		[]
	);

	const onCheckboxChange = () => {
		updateFilesAndFoldersCheckState(
			filesAndFoldersNodesCheckState === 'checked' ? 'unchecked' : 'checked'
		);
	};

	const handleDatabaseCheckboxChange = () => {
		if ( sqlNode?.checkState === 'checked' ) {
			setNodeCheckState( querySiteId, SQL_PATH, 'unchecked' );
		} else {
			setNodeCheckState( querySiteId, SQL_PATH, 'checked' );
		}
	};

	const handleExpanderChange = ( value: string ) => {
		const isExpanded = value === 'true';
		setIsFileBrowserVisible( isExpanded );

		if ( ! isExpanded ) {
			// When collapsing, select all files
			updateFilesAndFoldersCheckState( 'checked' );
		}
	};

	const showWooCommerceWarning =
		isSiteWooStore && targetEnvironment === 'production' && sqlNode?.checkState === 'checked';

	const showDomainConfirmation = targetEnvironment === 'production';

	const isButtonDisabled =
		( showDomainConfirmation && domainConfirmation !== productionSiteSlug ) ||
		( browserCheckList?.totalItems === 0 && browserCheckList?.includeList.length === 0 );

	return (
		<Modal
			title={ syncConfig[ environment ].title }
			onRequestClose={ onClose }
			style={ { maxWidth: '668px' } }
		>
			<VStack spacing={ 6 }>
				<Text>
					{ createInterpolateElement( syncConfig[ environment ].description, {
						a: <ExternalLink href={ `/backup/${ targetSiteSlug }` } children={ null } />,
					} ) }
				</Text>
				<HStack spacing={ 4 } alignment="left">
					<EnvironmentLabel
						label={ syncConfig.fromLabel }
						environmentType={ sourceEnvironment }
						siteTitle={ sourceSiteTitle }
					/>
					<DirectionArrow />
					<EnvironmentLabel
						label={ syncConfig.toLabel }
						environmentType={ targetEnvironment }
						siteTitle={ targetSiteTitle }
					/>
				</HStack>
				<SectionHeader level={ 3 } title={ syncConfig.syncSelectionHeading } />

				<div
					className={ clsx( 'staging-site-card', {
						'confirmation-input': showDomainConfirmation,
					} ) }
				>
					<Tooltip
						text={
							shouldDisableGranularSync
								? __( 'Selective Sync will be enabled automatically once your backup is complete.' )
								: ''
						}
					>
						<HStack spacing={ 2 } justify="space-between" alignment="center">
							<CheckboxControl
								__nextHasNoMarginBottom
								label={ __( 'Files and folders' ) }
								disabled={ shouldDisableGranularSync }
								checked={
									shouldDisableGranularSync || filesAndFoldersNodesCheckState === 'checked'
								}
								indeterminate={ filesAndFoldersNodesCheckState === 'mixed' }
								onChange={ onCheckboxChange }
							/>
							<SelectControl
								style={ shouldDisableGranularSync ? { backgroundColor: 'white' } : {} }
								value={ isFileBrowserVisible ? 'true' : 'false' }
								variant="minimal"
								disabled={ shouldDisableGranularSync }
								options={ [
									{
										label: __( 'All files and folders' ),
										value: 'false',
									},
									{
										label: __( 'Specific files and folders' ),
										value: 'true',
									},
								] }
								onChange={ handleExpanderChange }
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								aria-label={ __( 'Select files and folders to sync' ) }
							/>
						</HStack>
					</Tooltip>
					{ /*
					 * Keep the FileBrowser component rendered (using a CSS 'hidden' class instead of conditional rendering)
					 * to ensure its child nodes initialize properly and can be selected by default.
					 */ }
					<div className={ isFileBrowserVisible ? '' : 'hidden' }>
						<Suspense fallback={ null }>
							<FileBrowser
								rewindId={ rewindId }
								siteId={ querySiteId }
								siteSlug={ querySiteSlug }
								fileBrowserConfig={ fileBrowserConfig }
							/>
						</Suspense>
					</div>
					<HStack
						alignment="left"
						spacing={ 2 }
						style={ {
							borderTop: '1px solid var(--wp-components-color-gray-300, #ddd)',
							borderBottom: '1px solid var(--wp-components-color-gray-300, #ddd)',
							padding: '16px 0',
							marginTop: '8px',
							marginBottom: '24px',
						} }
					>
						<CheckboxControl
							__nextHasNoMarginBottom
							label={ __( 'Database tables' ) }
							disabled={ shouldDisableGranularSync }
							checked={ shouldDisableGranularSync || sqlNode?.checkState === 'checked' }
							onChange={ handleDatabaseCheckboxChange }
						/>
						<Tooltip
							text={ __(
								'Selecting this option will overwrite the site database, including any posts, pages, products, or orders.'
							) }
						>
							<span>
								<Icon
									icon={ error }
									style={ { fill: 'var(--studio-orange-50)', display: 'flex' } }
								/>
							</span>
						</Tooltip>
					</HStack>
					{ showWooCommerceWarning && (
						<VStack style={ { paddingBottom: '52px' } }>
							<Notice status="warning" isDismissible={ false }>
								<Text as="p" weight="bold" style={ { lineHeight: '24px' } }>
									{ __( 'Warning! WooCommerce data will be overwritten.' ) }
								</Text>
								{ createInterpolateElement(
									__(
										'This site has WooCommerce installed. We do not recommend syncing or pushing data from a staging site to live production news sites or sites that use eCommerce plugins. <a>Learn more</a>'
									),
									{
										a: (
											<ExternalLink
												href="https://developer.wordpress.com/docs/developer-tools/staging-sites/sync-staging-production/#staging-to-production"
												children={ null }
											/>
										),
									}
								) }
							</Notice>
						</VStack>
					) }
				</div>
				<VStack className="staging-site-card__footer" spacing={ 6 }>
					{ showDomainConfirmation && (
						<InputControl
							__next40pxDefaultSize
							label={
								<HStack style={ { textTransform: 'none' } } alignment="left" spacing={ 1 }>
									<Text>
										{ __( 'Enter your site‘s name' ) }{ ' ' }
										<Text color="var(--studio-red-50)">{ productionSiteSlug }</Text>{ ' ' }
										{ __( 'to confirm.' ) }
									</Text>
								</HStack>
							}
							onChange={ handleDomainConfirmation }
						/>
					) }
					<HStack>
						<HStack>
							<Text className="staging-site-card__footer-text">
								{ createInterpolateElement( syncConfig.learnMore, {
									a: (
										<InlineSupportLink onClick={ onClose } supportContext="hosting-staging-site" />
									),
								} ) }
							</Text>
						</HStack>

						<HStack justify="flex-end" spacing={ 4 }>
							<Button variant="tertiary" onClick={ onClose }>
								{ __( 'Cancel' ) }
							</Button>
							<Button variant="primary" onClick={ handleConfirm } disabled={ isButtonDisabled }>
								{ syncConfig.submit }
							</Button>
						</HStack>
					</HStack>
				</VStack>
			</VStack>
		</Modal>
	);
}
