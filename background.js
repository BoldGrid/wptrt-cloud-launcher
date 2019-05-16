// Set delcarative content page state matches for for WP.org themes trac tickets.
var pageState = {
	conditions: [
		new chrome.declarativeContent.PageStateMatcher( {
			pageUrl: {
				hostEquals: 'themes.trac.wordpress.org',
				schemes: [ 'https' ],
				pathPrefix: '/ticket'
			},
			css: [".ext-link"]
		} )
	],
	actions: [ new chrome.declarativeContent.ShowPageAction() ]
};

// Setup declarative rules.
chrome.runtime.onInstalled.addListener( function( details ) {
	chrome.declarativeContent.onPageChanged.removeRules( undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules( [ pageState ] );
	} );
} );

// Called when the user clicks on the Cloud pageAction icon.
chrome.pageAction.onClicked.addListener( function( tab ) {
	chrome.storage.sync.get( [ tab.url ], function( data ) {
		let state = data[ tab.url ] === 'on' ? 'off' : 'on';
		chrome.pageAction.setIcon( { path: 'cloud-' + state + '.png', tabId: tab.id }, function() {
			chrome.tabs.sendMessage( tab.id, { "message": "syncState", "tabUrl": tab.url } );
		} );
	} );
} );

// Listen for tab changes to sync same tickets between tabs.
chrome.tabs.onActivated.addListener( function( info ) {
	chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
		let activeTab = tabs[0];
		chrome.tabs.sendMessage( activeTab.id, { "message": "setState", "tabUrl": activeTab.url } );
	} );
} );

// Sync the intial state set.
chrome.runtime.onMessage.addListener( function( request, sender ) {
	if ( 'setState' === request.message ) {
		chrome.pageAction.setIcon( { path: 'cloud-' + request.data[ sender.tab.url ] + '.png', tabId: sender.tab.id } );
	}
} );
