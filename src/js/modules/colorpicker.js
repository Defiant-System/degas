
// degas.colorpicker

{
	init() {

	},
	dispatch(event) {
		let APP = degas,
			Self = APP.colorpicker,
			name,
			value,
			el;
		// console.log(event);
		switch(event.type) {
			case "group-head":
				el = $(event.target);
				value = el.index();
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				el = el.parent().nextAll(".group-body:first");
				el.find("> div.active").removeClass("active");
				el.find(`> div:nth(${value})`).addClass("active");
				break;
			case "select-palette-color":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
