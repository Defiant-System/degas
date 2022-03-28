
@import "./classes/Editor.js";
@import "./classes/Viewport.js";
@import "./classes/Viewport.VR.js";
@import "./classes/Viewport.ViewportInfo.js";
@import "./classes/Strings.js";

// import libs
const {
	THREE,
	History,
	Loader,
	ViewHelper,
	TransformControls,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	EditorControls,
	Config,
	UIPanel,
	UIDiv,
	UIText,
} = await window.fetch("~/js/bundle.js");


let editor,
	viewport,
	renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.outputEncoding = THREE.sRGBEncoding;


let _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 7, 7, 10 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );
