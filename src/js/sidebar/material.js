
// degas.sidebar.material

{
	init() {

	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.material,
			el;
		// console.log(event);
		switch(event.type) {
			case "select-matcap":
				event.el.find(".active").removeClass("active");
				el = $(event.target).addClass("active");

				let matcap = el.css("background-image").slice(4, -2).split("/matcaps/")[1];
				APP.workspace.dispatch({ type: "apply-material-selected-mesh", matcap});
				break;
		}
	}
}
