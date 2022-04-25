
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
			func,
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

				// save default background color
				if (!Self.defaultBackground) {
					Self.defaultBackground = editor.scene.background.clone();
				}
				// if "none" is selected - Reset
				if (event.arg === "none") {
					let type = ["reset", ...event.type.split("-").slice(1)];
					Self.dispatch({ type: type.join("-") });
				}
				break;
			case "reset-scene-bg":
				editor.scene.background = Self.defaultBackground;
				viewport.render();
				break;
			case "reset-scene-env": break;
			case "reset-scene-fog": break;
			case "set-scene-bg-color":
				editor.scene.background.set(event.color);
				viewport.render();
				break;
			case "select-scene-texture-image":
			case "select-scene-equirect-image":
				func = item => new THREE.TextureLoader().load(item.path, texture => {
					if (event.type.split("-")[2] === "equirect") {
						texture.mapping = THREE.EquirectangularReflectionMapping;
					}
					// set scene background
					editor.scene.background = texture;
					viewport.render();
					// set element thumbnail
					event.el.css({ "background-image": `url(${item.path})` });
				});
				window.dialog.open({ png: func, jpg: func });
				break;
		}
	}
}
