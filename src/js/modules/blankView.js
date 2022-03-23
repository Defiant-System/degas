
// degas.blankView

{
	init() {
		// fast and direct references
		this.el = window.find("content .blank-view");
		// render blank view
		window.render({
			template: "blank-view",
			match: `//Data`,
			target: this.el,
		});
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.blankView,
			el;
		// console.log(event);
		switch (event.type) {
			case "open-filesystem":
				APP.dispatch({ type: "open-file" });
				break;
			case "from-clipboard":
				// TODO
				break;
		}
	}
}
