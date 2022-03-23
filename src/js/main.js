
@import "modules/customInit.js";

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

		// customInit();
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
			// custom events
			case "setup-workspace":
				// hide blank view
				Self.els.content.removeClass("show-blank-view");
				break;
			case "open-file":
				window.dialog.open({
					obj: item => Self.dispatch(item),
					fld: item => Self.dispatch(item),
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

window.exports = degas;
