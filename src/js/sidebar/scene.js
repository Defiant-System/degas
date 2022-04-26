
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
			type,
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch(event.type) {
			// Scene Background
			case "viewport-toggle-view":
				viewport.grid.visible = event.checked;
				viewport.render();
				break;
			case "viewport-toggle-helpers":
				viewport.toggleSceneHelpers(event.checked);
				viewport.render();
				break;
			case "select-tone-mapping":
				name = event.xMenu.getAttribute("name");
				event.origin.el.find("span:first").html(name);
				pEl = event.origin.el.nextAll("div:first");

				pEl.find(".show").removeClass("show");
				el = pEl.find(`.hidden-fields[data-fields="${name}"]`);
				if (el.length) el.addClass("show");

				break;
			// Scene Background
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
				} else {
					el = pEl.find(".field[data-change]:nth(0)");
					type = el.data("change");
					Self.dispatch({ type, el });
				}
				break;
			case "reset-scene-bg":
				editor.resetSceneBgColor();
				viewport.render();
				break;
			case "set-bg-color":
				pEl = event.el.parent();
				value = pEl.find(`.field[data-id="bg-color"]`).cssProp("--color");
				editor.scene.background.set(value);
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
				editor.scene.fog = null;
				viewport.render();
				break;
			case "set-linear-fog-color":
			case "set-linear-fog-near":
			case "set-linear-fog-far":
				pEl = event.el.parent();
				let fogLinearColor = new THREE.Color( pEl.find(`.field[data-id="fog-linear-color"]`).cssProp("--color") ),
					fogLinearNear = +pEl.find(`.field[data-id="fog-linear-near"]`).text() / 100,
					fogLinearFar = +pEl.find(`.field[data-id="fog-linear-far"]`).text() / 100;
				if (!editor.scene.fog) {
					editor.scene.fog = new THREE.Fog( fogLinearColor, fogLinearNear, fogLinearFar );
				} else {
					editor.scene.fog.color.set(fogLinearColor);
					editor.scene.fog.near = fogLinearNear;
					editor.scene.fog.far = fogLinearFar;
				}
				viewport.render();
				break;
			case "set-exponential-fog-color":
			case "set-exponential-fog-density":
				pEl = event.el.parent();
				let fogColor = new THREE.Color( pEl.find(`.field[data-id="fog-color"]`).cssProp("--color") ),
					fogDensity = +pEl.find(`.field[data-id="fog-density"]`).text() / 1000;
				if (!editor.scene.fog) {
					editor.scene.fog = new THREE.FogExp2( fogColor, fogDensity );
				} else {
					editor.scene.fog.color.set(fogColor);
					editor.scene.fog.density = fogDensity;
				}
				viewport.render();
				break;
		}
	}
}
