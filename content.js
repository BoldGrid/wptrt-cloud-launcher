chrome.runtime.onMessage.addListener( function( request ) {
	request.message === "syncState" && syncState( request.tabUrl );
	request.message === "setState" && setState( request.tabUrl );
} );

/**
 * Sync state of tab.
 *
 * @param {string} tabId ID of tab.
 */
function syncState( url ) {
	let state = {};
	chrome.storage.sync.get( [ url ], function( data ) {
		state[ url ] = data[ url ] === 'on' ? 'off' : 'on';
		chrome.storage.sync.set( state, function() {
			state[ url ] === 'on' ? addBtns() : removeBtns();
		} );
	} );
};

/**
 * Sync state of tab.
 *
 * @param {string} tabId ID of tab.
 */
function setState( url ) {
	chrome.storage.sync.get( [ url ], function( data ) {
		chrome.runtime.sendMessage( { message: 'setState', data }, function() {
			data[ url ] === 'on' ? addBtns() : removeBtns();
		} );
	} );
};

/**
 * Add launch buttons under theme .zip downloads.
 */
function addBtns() {
	var links = document.querySelectorAll( '.ext-link' );
	var btns = document.querySelectorAll( '.wptrt-cloud-launch' );

	if ( links.length && ! btns.length ) {
		links.forEach( function( link ) {
			var noStats = '?nostats=1';
			if ( link.href.endsWith( noStats ) ) {
				let container = document.createElement( 'div' ),
					cloud = document.createElement( 'a' ),
					ico = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
					linkText = document.createTextNode( 'Launch In Cloud' );

				container.classList.add( 'wptrt-cloud-launch' );
				cloud.href = 'https://boldgrid.com/central/cloud-wordpress/try?theme=' + link.href.replace( noStats, '&plugins=theme-sniffer,theme-check,wp-debugging' );
				cloud.target = '_blank';
				cloud.title = 'Launch In Cloud';
				cloud.style.cssText = 'display: flex;align-items: center;padding: 1em;width: 11em;justify-content: space-around;border-radius: 8px;box-shadow: 0px 0px 1px 1px;';
				ico.innerHTML = '<path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>';
				let icoProps = {
					width: '24',
					height: '24',
					viewBox: '0 0 24 24',
					fill: 'currentColor'
				};

				Object.keys( icoProps ).forEach( key => ico.setAttribute( key, icoProps[ key ] ) );

				cloud.appendChild( ico );
				cloud.appendChild( linkText );
				container.appendChild( cloud );
				container.style.marginTop = '2em';

				link.parentNode.insertBefore( container, link.nextSibling );
			}
		} );
	}
};

/**
 * Remove launch buttons from links.
 */
function removeBtns() {
	document.querySelectorAll( '.wptrt-cloud-launch' ).forEach( function( btn ) {
		btn.parentNode.removeChild( btn );
	} );
};

setState( document.location.href );
