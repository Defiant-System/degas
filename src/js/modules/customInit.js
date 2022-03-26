
@import "../classes/editor.js";
@import "../classes/viewport.js";
@import "../classes/vr.js";


// import libs
const {
	THREE,

	Loader,
	ViewHelper,

	UIPanel,
} = await window.fetch("~/js/bundle.js");



let _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 0, 5, 10 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

let editor,
	viewport;


function customInit() {
	editor = new Editor();
	viewport = new Viewport(editor);
	// APP.els.content[0].appendChild(viewport.dom);

}
