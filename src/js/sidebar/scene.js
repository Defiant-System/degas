
// degas.sidebar.scene

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.properties div[data-section="scene"]`),
		};
		// temp
		// setTimeout(() => this.dispatch({ type: "select-scene-bg" }), 1000);
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.scene,
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch(event.type) {
			case "select-scene-bg":
			case "select-scene-env":
			case "select-scene-fog":
				name = event.xMenu.getAttribute("name");
				event.origin.el.find("span:first").html(name);
				pEl = event.origin.el.nextAll("div:first");

				pEl.find(".show").removeClass("show");
				el = pEl.find(`.hidden-fields[data-fields="${name}"]`);
				if (el.length) el.addClass("show");
				break;
			case "select-image":
				window.dialog.open({
					jpg: item => console.log(item),
					png: item => console.log(item),
				});
				break;
		}
	}
}
