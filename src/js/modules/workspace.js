
// degas.workspace

{
	init() {
		this.els = {
			workspace: window.find(".workspace"),
		};

		// create editor + viewport
		editor = new Editor();
		viewport = new Viewport(editor);

		// append panel
		this.els.workspace.append(viewport.container.dom);
		this.els.rendererCvs = this.els.workspace.append(renderer.domElement),
		
		this.dispatch({ type: "resize-workspace" });
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.workspace,
			el;
		// console.log(event);
		switch (event.type) {
			case "resize-workspace":
				Self.els.rendererCvs.attr({
					width: Self.els.workspace.prop("offsetWidth"),
					height: Self.els.workspace.prop("offsetHeight"),
				});
				
				viewport.render();
				break;
		}
	}
}
