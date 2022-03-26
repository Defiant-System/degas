
@import "./classes/editor.js";
@import "./classes/viewport.js";
@import "./classes/vr.js";

// import libs
const {
	THREE,

	Loader,
	ViewHelper,
	TransformControls,
	EditorControls,

	UIPanel,
} = await window.fetch("~/js/bundle.js");


let editor,
	viewport;


let renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio ); // TODO: Use player.setPixelRatio()
renderer.outputEncoding = THREE.sRGBEncoding;


let _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set( 0, 5, 10 );
_DEFAULT_CAMERA.lookAt( new THREE.Vector3() );



const degas = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

	},
	dispatch(event) {
		let Self = degas,
			el;
		switch (event.type) {
			// system events
			case "window.init":
				// reset app by default - show initial view
				Self.dispatch({ type: "reset-app" });
				break;
			case "open.file":
				event.open({ responseType: "blob" })
					.then(file => Self.dispatch({ type: "prepare-file", file }));
				break;
			// custom events
			case "prepare-file":
				if (!event.isSample) {
					// add file to "recent" list
					Self.blankView.dispatch({ ...event, type: "add-recent-file" });
				}
				// set up workspace
				Self.dispatch({ ...event, type: "setup-workspace" });
				break;
			case "setup-workspace":
				// hide blank view
				Self.els.content.removeClass("show-blank-view");
				// resize renderer canvas
				Self.workspace.dispatch({ type: "resize-renderer" });
				break;
			case "open-file":
				window.dialog.open({
					obj: item => Self.dispatch(item),
					fbx: item => Self.dispatch(item),
				});
				break;
			case "close-file":
				// show blank view
				Self.els.content.addClass("show-blank-view");
				break;
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;
			default:
				if (event.el) {
					let pEl = event.el.parents(`div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
		}
	},
	sidebar: @import "modules/sidebar.js",
	blankView: @import "modules/blankView.js",
	workspace: @import "modules/workspace.js",
};

const APP = degas;

window.exports = degas;
