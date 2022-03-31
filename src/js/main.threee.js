
// import libs
const {
	THREE,
	History,
	Loader,

	VR,
	ViewHelper,
	Strings,

	TransformControls,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	Config,
	UIPanel,
	UIDiv,
	UIText,
} = await window.fetch("~/js/bundle.js");


@import "./classes/Editor.js";
@import "./classes/EditorControls.js";
@import "./classes/Viewport.js";
@import "./classes/Viewport.ViewportInfo.js";


@import "./classes/File.js";


let editor,
	viewport,
	renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.outputEncoding = THREE.sRGBEncoding;


let _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 5, 5, 6.5 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

