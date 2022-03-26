
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
		this.els.workspace.append(viewport.dom);
		this.els.rendererCvs = this.els.workspace.append(renderer.domElement),
		
		this.dispatch({ type: "resize-renderer" });
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.workspace,
			el;
		// console.log(event);
		switch (event.type) {
			case "resize-renderer":
				Self.els.rendererCvs.attr({
					width: Self.els.workspace.prop("offsetWidth"),
					height: Self.els.workspace.prop("offsetHeight"),
				});
				break;
		}
	}
}
