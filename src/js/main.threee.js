
// import libs
const {
	THREE,
	History,
	Loader,

	EffectComposer,
	RenderPass,
	ShaderPass,
	OutlinePass,
	FXAAShader,
	GammaCorrectionShader,
	
	Strings,
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
@import "./classes/TransformControls.js";
@import "./classes/Viewport.js";
@import "./classes/Viewport.VR.js";
@import "./classes/Viewport.ViewHelper.js";
@import "./classes/Viewport.ViewportInfo.js";


@import "./classes/File.js";
@import "./modules/color.js";


let editor,
	viewport,
	renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.outputEncoding = THREE.sRGBEncoding;


let _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 3, 3, 4.5 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

