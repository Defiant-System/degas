
@import "./main.threee.js";

const Settings = {
	wireframe: {
		default: 0x010101,
		highlight: 0xff6600,
	},
};

const degas = {
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
		
		// TODO: fix outline instead of selection box
		this.outlinePass = false;

		return;
		// temp
		setTimeout(() => this.els.content.find(".sample:nth(0)").trigger("click"), 150);
		setTimeout(() => {
			this.els.toolbar.sidebar.trigger("click");
			this.dispatch({ type: "add-light", arg: "directionallight", intensity: .5 });
		}, 300);
		return;
		
		this.dispatch({ type: "new-file" });
		this.dispatch({ type: "add-light", arg: "directionallight", intensity: .5 });

		// this.dispatch({ type: "add-mesh", arg: "torusknot", position: [-3.5, 0, 0] });
		this.dispatch({ type: "add-mesh", arg: "torus", position: [0, 0, 0] });
		// this.dispatch({ type: "add-mesh", arg: "sphere", position: [2.5, 0, 0] });

		// this.workspace.dispatch({ type: "deselect" });
		this.dispatch({ type: "set-view-shade", arg: "flat" });
		// this.workspace.dispatch({ type: "set-editor-control-state", arg: "rotate" });
	},
	dispatch(event) {
		let Self = degas,
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
				file = new defiant.File({ kind: "obj" });
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
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;
			// proxy event
			case "toggle-sidebar":
				return Self.sidebar.dispatch(event);
			case "add-mesh":
			case "add-light":
			case "add-camera":
			case "set-view-shade":
			case "set-editor-control-state":
			case "set-transform-control-mode":
				return Self.workspace.dispatch(event);
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
	sidebar: @import "sidebar/index.js",
	blankView: @import "modules/blankView.js",
	workspace: @import "modules/workspace.js",
	colorpicker: @import "modules/colorpicker.js",
};

const APP = degas;

window.exports = degas;
