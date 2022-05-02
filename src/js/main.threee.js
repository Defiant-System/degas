
// import libs
let {
	THREE,
	History,
	Loader,

	Strings,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	Config,
	UIPanel,
	UIDiv,
	UIText,

	VR,
	ViewportInfo,
	RoomEnvironment,

	EffectComposer,
	RenderPass,
	ShaderPass,
	OutlinePass,
	FXAAShader,

	Color,
} = await window.fetch("~/js/bundle.js");


@import "./classes/Editor.js";
@import "./classes/EditorControls.js";
@import "./classes/TransformControls.js";
@import "./classes/Viewport.js";
@import "./classes/Viewport.ViewHelper.js";
// @impor1t "./classes/Selection.js";

@import "./classes/File.js";
// @impor1t "./modules/color.js";



let Settings = {
		wireframe: {
			default: 0x010101,
			highlight: 0xff6600,
		},
	};

let editor,
	viewport,
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		// preserveDrawingBuffer: true,
	});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.outputEncoding = THREE.sRGBEncoding;


let _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 3, 3, 7.5 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

