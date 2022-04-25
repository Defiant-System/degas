
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

				// if "none" is selected - Reset
				if (event.arg) {
					let type = [event.arg, ...event.type.split("-").slice(1)];
					Self.dispatch({ type: type.join("-") });
				}
				break;
			// Scene Background
			case "reset-scene-bg":
				editor.resetSceneBgColor();
				viewport.render();
				break;
			case "set-bg-color":
				editor.scene.background.set(event.color);
				viewport.render();
				break;
			case "select-bg-texture-image":
			case "select-bg-equirect-image":
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
			// Scene Environment
			case "reset-scene-env":
				editor.scene.environment = null;
				viewport.render();
				break;
			case "model-viewer-scene-env":
				let pmremGenerator = new THREE.PMREMGenerator( renderer );
				pmremGenerator.compileEquirectangularShader();
				editor.scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
				viewport.render();
				break;
			case "select-environment-equirect-image":
				func = item => new THREE.TextureLoader().load(item.path, texture => {
					// set scene background
					texture.mapping = THREE.EquirectangularReflectionMapping;
					editor.scene.environment = texture;
					viewport.render();
					// set element thumbnail
					event.el.css({ "background-image": `url(${item.path})` });
				});
				window.dialog.open({ png: func, jpg: func });
				break;
			// Scene Fog
			case "reset-scene-fog":
				break;
			case "set-linear-fog-color": break;
			case "set-linear-fog-near": break;
			case "set-linear-fog-far": break;
			case "set-exponential-fog-color": break;
			case "set-exponential-fog-value": break;
		}
	}
}
