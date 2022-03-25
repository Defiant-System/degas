
@import "./threejs/editor/js/libs/signals.min.js";


// import libs
const {
	THREE,
	Editor,
	Viewport,
	UIPanel,
	UIRow,
	UIInput,
	UICheckbox,
	UIText,
	UIListbox,
	UISpan,
	UIButton,
	UISelect,
	UINumber,
	UIBoolean,
} = await window.fetch("~/js/bundle.js");


let signals = window.signals,
	currentRenderer,
	editor,
	viewport;


function customInit() {
	editor = new Editor( signals );
	viewport = new Viewport( editor );
	APP.els.content[0].appendChild( viewport.dom );


	var config = editor.config;
	// var signals = editor.signals;
	var antialiasBoolean = new UIBoolean( config.getKey( 'project/renderer/antialias' ) ).onChange( function () {
		createRenderer();
	} );
	var shadowTypeSelect = new UISelect().setOptions( {
		0: 'Basic',
		1: 'PCF',
		2: 'PCF (Soft)',
		//	3: 'VSM'
	} ).setWidth( '125px' ).onChange( function () {
		currentRenderer.shadowMap.type = parseFloat( this.getValue() );
		signals.rendererUpdated.dispatch();
	} );
	shadowTypeSelect.setValue( config.getKey( 'project/renderer/shadowType' ) );

	var toneMappingSelect = new UISelect().setOptions( {
		0: 'None',
		1: 'Linear',
		2: 'Reinhard',
		3: 'Cineon',
		4: 'ACESFilmic'
	} ).setWidth( '120px' ).onChange( function () {
		currentRenderer.toneMapping = parseFloat( this.getValue() );
		toneMappingExposure.setDisplay( currentRenderer.toneMapping === 0 ? 'none' : '' );
		signals.rendererUpdated.dispatch();
	} );
	toneMappingSelect.setValue( config.getKey( 'project/renderer/toneMapping' ) );

	var toneMappingExposure = new UINumber( config.getKey( 'project/renderer/toneMappingExposure' ) );
	toneMappingExposure.setDisplay( toneMappingSelect.getValue() === '0' ? 'none' : '' );
	toneMappingExposure.setWidth( '30px' ).setMarginLeft( '10px' );
	toneMappingExposure.setRange( 0, 10 );
	toneMappingExposure.onChange( function () {
		currentRenderer.toneMappingExposure = this.getValue();
		signals.rendererUpdated.dispatch();
	} );

	var physicallyCorrectLightsBoolean = new UIBoolean( config.getKey( 'project/renderer/physicallyCorrectLights' ) ).onChange( function () {
		currentRenderer.physicallyCorrectLights = this.getValue();
		signals.rendererUpdated.dispatch();
	} );

	var shadowsBoolean = new UIBoolean( config.getKey( 'project/renderer/shadows' ) ).onChange( function () {
		currentRenderer.shadowMap.enabled = this.getValue();
		signals.rendererUpdated.dispatch();
	} );

	currentRenderer = new THREE.WebGLRenderer( { antialias: antialiasBoolean.getValue() } );
	currentRenderer.outputEncoding = THREE.sRGBEncoding;
	currentRenderer.physicallyCorrectLights = physicallyCorrectLightsBoolean.getValue();
	currentRenderer.shadowMap.enabled = shadowsBoolean.getValue();
	currentRenderer.shadowMap.type = parseFloat( shadowTypeSelect.getValue() );
	currentRenderer.toneMapping = parseFloat( toneMappingSelect.getValue() );
	currentRenderer.toneMappingExposure = toneMappingExposure.getValue();

	// editor.signals.rendererChanged.dispatch( currentRenderer );

}
