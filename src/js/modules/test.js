
let Test = {
	init() {
		let APP = doob;

		return;
		// setTimeout(() => APP.dispatch({ type: "show-blank-view" }), 1000);

		// temp
		// setTimeout(() => APP.els.content.find(".sample:nth(0)").trigger("click"), 100);
		// setTimeout(() => {
		// 	// APP.workspace.dispatch({ type: "deselect" });
		// 	APP.els.toolbar.sidebar.trigger("click");
		// 	APP.dispatch({ type: "add-light", arg: "directionallight", intensity: .75 });
		// }, 300);

		// return;
		
		/**/
		APP.dispatch({ type: "new-file" });
		APP.dispatch({ type: "add-light", arg: "directionallight", intensity: .75 });
		// soft white light
		APP.dispatch({ type: "add-light", arg: "ambientlight", color: 0x404040, intensity: .5 });

		APP.dispatch({ type: "add-mesh", arg: "torusknot", position: [-4, 0, 0] });
		APP.dispatch({ type: "add-mesh", arg: "sphere", position: [3, 0, 0] });
		APP.dispatch({ type: "add-mesh", arg: "cylinder", position: [0, 0, 0] });

		// APP.workspace.dispatch({ type: "deselect" });
		// APP.dispatch({ type: "set-view-shade", arg: "flat" });
		// APP.workspace.dispatch({ type: "set-editor-control-state", arg: "rotate" });
		setTimeout(() => {
			APP.toolbar.dispatch({ type: "toggle-toolbar", enabled: true });
			APP.toolbar.els.sidebar.trigger("click");
			window.find(`.tabs > div[data-name="material"]`).trigger("click");

			setTimeout(() => APP.toolbar.els.viewMaterial.trigger("click"), 300);
			setTimeout(() => window.find(`ul.matcap-list li:nth(6)`).trigger("click"), 300);

		}, 300);
		
	}
};
