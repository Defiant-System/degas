
// degas.sidebar.tree

{
	init() {

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
