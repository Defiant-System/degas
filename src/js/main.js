
@import "./main.three.js";
@import "./modules/test.js";


const doob = {
	Loaders: {},
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			toolbar: {
				sidebar: window.find(`.toolbar-tool_[data-click="toggle-sidebar"]`),
			}
		};
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// DEV-ONLY-START
		Test.init();
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = doob,
			file,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.init":
				// reset app by default - show initial view
				Self.dispatch({ type: "reset-app" });
				break;
			case "window.resize":
				Self.workspace.dispatch({ type: "resize-workspace" });
				break;
			case "window.keystroke":
				switch (event.char) {
					case "del":
						editor.removeObject(editor.selected);
						editor.deselect();
						break;
				}
				break;
			case "window.close":
				// clears "window.__THREE__"
				THREE_dispose();
				renderer.dispose();
				break;
			case "open.file":
				event.open({ responseType: "blob" })
					.then(file => Self.dispatch({ type: "prepare-file", file }));
				break;

			// custom events
			case "load-samples":
				// opening image file from application package
				event.names.map(entry => {
					let url = `/cdn/samples/3d/${entry}`,
						[ name, kind ] = entry.split("."),
						file = new karaqu.File({ name, kind });
					// fetch file
					fetch(url, { responseType: "text" })
						.then(f => f.blob())
						.then(blob => {
							file.blob = blob;
							Self.dispatch({ type: "prepare-file", isSample: true, file });
							// auto insert directional light (temporary)
							Self.dispatch({ type: "add-light", arg: "directionallight", intensity: .75 });
						});

				});
				break;
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
				Self.workspace.dispatch({ type: "resize-workspace" });
				// save reference to file
				Self.file = new File(event.file);
				break;
			case "new-file":
				if (editor !== undefined) editor.clear();
				// create new empty file
				file = new karaqu.File({ kind: "obj" });
				Self.dispatch({ type: "setup-workspace", file });
				break;
			case "open-file":
				window.dialog.open({
					obj: item => Self.dispatch(item),
					fbx: item => Self.dispatch(item),
				});
				break;
			case "close-file":
				if (Self.els.content.hasClass("show-sidebar")) {
					Self.els.toolbar.sidebar.trigger("click");
				}
				editor.clear();
				// show blank view
				Self.els.content.addClass("show-blank-view");
				// call close method of file - will check for "is-dirty"
				Self.file.dispatch(event);
				break;
			case "show-blank-view":
				if (Self.els.content.hasClass("show-blank-view")) return;
				// show blank view
				Self.els.content.addClass("show-blank-view");
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			// proxy event
			case "toggle-sidebar":
				return Self.sidebar.dispatch(event);
			case "show-view-grid":
			case "show-view-info":
			case "show-view-helper":
			case "add-mesh":
			case "add-light":
			case "add-camera":
			case "set-view-shade":
			case "set-editor-control-state":
			case "set-transform-control-mode":
				return Self.workspace.dispatch(event);
			default:
				el = event.el || (event.origin ? event.origin.el : null);
				if (el) {
					let pEl = el.parents(`div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
		}
	},
	toolbar: @import "modules/toolbar.js",
	sidebar: @import "sidebar/index.js",
	blankView: @import "modules/blankView.js",
	workspace: @import "modules/workspace.js",
	colorpicker: @import "modules/colorpicker.js",
};

const APP = doob;

window.exports = doob;
