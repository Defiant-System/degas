
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
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.tree,
			el;
		// console.log(event);
		switch(event.type) {
			case "toggle-expand":
				console.log(event);
				break;
			case "toggle-visibility":
				console.log(event);
				break;
		}
	}
}
