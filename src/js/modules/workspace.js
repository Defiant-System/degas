
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
		
		this.dispatch({ type: "resize-renderer" });

		setTimeout(() => {
			editor.scene.add( viewport.grid );
			renderer.setViewport( 0, 0, viewport.container.dom.offsetWidth, viewport.container.dom.offsetHeight );
			renderer.render( editor.scene, editor.camera );
			editor.scene.remove( viewport.grid );
		}, 300);
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
