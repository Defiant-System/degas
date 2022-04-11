
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
		setTimeout(() => this.els.el.find(".row:nth(5)").trigger("click"), 100);
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.tree,
			el;
		// console.log(event);
		switch(event.type) {
			case "handle-tree-event":
				el = $(event.target);
				el.parents(".tree").find(".selected").removeClass("selected");
				el.addClass("selected");
				break;
			case "toggle-expand":
				console.log(event);
				break;
			case "toggle-visibility":
				console.log(event);
				break;
		}
	}
}
