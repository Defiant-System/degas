
@import "modules/customInit.js";

const degas = {
	init() {
		// fast references
		this.content = window.find("content");

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
