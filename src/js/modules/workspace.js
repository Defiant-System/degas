
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
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.workspace,
			el;
		// console.log(event);
		switch (event.type) {
			case "some-event":
				// TODO
				break;
		}
	}
}
