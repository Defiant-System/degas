
let Test = {
	init() {
		let APP = degas;

		return;
		// setTimeout(() => defjam.dispatch({ type: "close-file" }), 300);

		// temp
		// setTimeout(() => APP.els.content.find(".sample:nth(0)").trigger("click"), 100);
		// setTimeout(() => {
		// 	APP.workspace.dispatch({ type: "deselect" });
		// 	APP.els.toolbar.sidebar.trigger("click");
		// 	APP.dispatch({ type: "add-light", arg: "directionallight", intensity: .75 });
		// }, 300);
		
		/**/
		APP.dispatch({ type: "new-file" });
		APP.dispatch({ type: "add-light", arg: "directionallight", intensity: .75 });
		// soft white light
		APP.dispatch({ type: "add-light", arg: "ambientlight", color: 0x404040, intensity: .5 });

		APP.dispatch({ type: "add-mesh", arg: "torusknot", position: [-4, 0, 0] });
		APP.dispatch({ type: "add-mesh", arg: "sphere", position: [3, 0, 0] });
		APP.dispatch({ type: "add-mesh", arg: "cylinder", position: [0, 0, 0] });

		// APP.workspace.dispatch({ type: "deselect" });
		APP.dispatch({ type: "set-view-shade", arg: "flat" });
		// APP.workspace.dispatch({ type: "set-editor-control-state", arg: "rotate" });
		setTimeout(() => APP.els.toolbar.sidebar.trigger("click"), 300);
		
	}
};
