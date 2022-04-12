
// degas.sidebar.tree

{
	init() {
		// fast references
		this.els = {
			el: window.find(".sidebar .tree"),
		};
		// render blank view
		window.render({
			template: "tree",
			match: `//Tree`,
			target: this.els.el,
		});

		// temp
		// setTimeout(() => this.els.el.find(".row:nth(5)").trigger("click"), 100);
		// setTimeout(() => this.els.el.find(".row:nth(3) .icon-arrow").trigger("click"), 100);
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.tree,
			name,
			value,
			el;
		// console.log(event);
		switch(event.type) {
			case "handle-tree-event":
				el = $(event.target);
				if (el.data("type")) {
					return Self.dispatch({ ...event, type: el.data("type") });
				}
				el.parents(".tree").find(".selected").removeClass("selected");
				el.addClass("selected");
				// TODO: focus / select on object
				break;
			case "toggle-expand":
				el = $(event.target).parents(".row:first");
				if (el.hasClass("expanded")) {
					el.removeClass("expanded");
				} else {
					if (!el.find(".children").length) {
						// render blank view
						window.render({
							template: "tree-branch",
							match: `//Tree//*[@id="${el.data("id")}"]`,
							append: el,
						});
					}
					// delay "animation" to next tick - wait for render finish
					requestAnimationFrame(() => el.addClass("expanded"));
				}
				break;
			case "toggle-visibility":
				el = $(event.target);
				if (el.hasClass("icon-eye-on")) el.prop({ className: "icon-eye-off" });
				else el.prop({ className: "icon-eye-on" });
				break;
		}
	}
}
