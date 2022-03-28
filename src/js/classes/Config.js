

class Config {
	
	constructor() {
		this.debug = false;
		this.name = 'threejs-editor';
		this.storage = {
			'language': 'en',
			'autosave': true,
			'project/title': '',
			'project/editable': false,
			'project/vr': false,
			'project/renderer/antialias': true,
			'project/renderer/shadows': true,
			'project/renderer/shadowType': 1, // PCF
			'project/renderer/physicallyCorrectLights': false,
			'project/renderer/toneMapping': 0, // NoToneMapping
			'project/renderer/toneMappingExposure': 1,
			'settings/history': false,
			'settings/shortcuts/translate': 'w',
			'settings/shortcuts/rotate': 'e',
			'settings/shortcuts/scale': 'r',
			'settings/shortcuts/undo': 'z',
			'settings/shortcuts/focus': 'f'
		};

		if ( window.localStorage[ this.name ] === undefined ) {
			window.localStorage[ this.name ] = JSON.stringify( this.storage );
		} else {
			const data = JSON.parse( window.localStorage[ this.name ] );
			for ( const key in data ) {
				this.storage[ key ] = data[ key ];
			}
		}
	}

	getKey( key ) {
		return this.storage[ key ];
	}

	setKey() { // key, value, key, value ...
		for ( let i = 0, l = arguments.length; i < l; i += 2 ) {
			this.storage[ arguments[ i ] ] = arguments[ i + 1 ];
		}
		window.localStorage[ this.name ] = JSON.stringify( this.storage );
		
		if (this.debug) {
			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );
		}
	}

	clear() {
		delete window.localStorage[ this.name ];
	}
}

export { Config };
