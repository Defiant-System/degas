
@import "./main.threee.js";


const degas = {
	Loaders: {},
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// temp
		// return;
		// setTimeout(() => this.els.el.find(".sample:nth(1)").trigger("click"), 150);
		
		this.dispatch({ type: "new-file" });
		this.dispatch({ type: "add-light", arg: "directionallight", intensity: .5 });
		this.dispatch({ type: "add-mesh", arg: "torusknot", position: [-3.5, 0, 0] });
		this.dispatch({ type: "add-mesh", arg: "icosahedron", position: [0, 0, 0] });
		this.dispatch({ type: "add-mesh", arg: "sphere", position: [2.5, 0, 0] });

		// this.workspace.dispatch({ type: "deselect" });
		// this.dispatch({ type: "set-view-shade", arg: "wireframe" });
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
				// show blank view
				Self.els.content.addClass("show-blank-view");
				// call close method of file - will check for "is-dirty"
				Self.file.dispatch(event);
				break;
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;
			// proxy event
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
	sidebar: @import "modules/sidebar.js",
	blankView: @import "modules/blankView.js",
	workspace: @import "modules/workspace.js",
};

const APP = degas;

window.exports = degas;
