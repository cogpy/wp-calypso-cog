import debugFactory from 'debug';
import i18n from 'i18n-calypso';
import moment from 'moment';

const debug = debugFactory( 'apps:orchestration-workbench' );

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_MOMENT_LOCALE = 'en';
const ALWAYS_LOAD_WITH_LOCALE = [ 'zh' ];

const getLanguageCodeFromLocale = ( localeSlug ) => {
	if ( localeSlug.indexOf( '-' ) > -1 ) {
		return localeSlug.split( '-' )[ 0 ];
	}
	return localeSlug;
};

const loadMomentLocale = ( localeSlug, languageCode ) => {
	return import( `moment/locale/${ localeSlug }` )
		.catch( ( error ) => {
			debug(
				`Encountered an error loading moment locale file for ${ localeSlug }. Falling back to language datetime format.`,
				error
			);
			if ( localeSlug !== languageCode ) {
				localeSlug = languageCode;
				return import( `moment/locale/${ localeSlug }` );
			}
			return Promise.reject( error );
		} )
		.catch( ( error ) => {
			debug(
				`Encountered an error loading moment locale file for ${ localeSlug }. Falling back to US datetime format.`,
				error
			);
			localeSlug = DEFAULT_MOMENT_LOCALE;
		} )
		.then( () => moment.locale( localeSlug ) );
};

const loadLanguageFile = ( languageFileName ) => {
	const url = `https://widgets.wp.com/orchestration-workbench/v1/languages/${ languageFileName }-v1.1.json`;

	return globalThis.fetch( url ).then( ( response ) => {
		if ( response.ok ) {
			return response.json().then( ( body ) => {
				if ( body ) {
					i18n.setLocale( body );
				}
			} );
		}
		return Promise.reject( response );
	} );
};

export default ( localeSlug ) => {
	const languageCode = getLanguageCodeFromLocale( localeSlug );

	if ( languageCode !== DEFAULT_LANGUAGE ) {
		const languageFileName = ALWAYS_LOAD_WITH_LOCALE.includes( languageCode )
			? localeSlug
			: languageCode;
		loadLanguageFile( languageFileName )
			.then( () => debug( `Loaded locale files for ${ languageCode } successfully.` ) )
			.catch( ( error ) =>
				debug(
					`Encountered an error loading locale file for ${ languageCode }. Falling back to English.`,
					error
				)
			);
	}

	return loadMomentLocale( localeSlug, languageCode );
};
