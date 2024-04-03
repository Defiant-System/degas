
// doob.toolbar

{
	init() {
		let el = window.find(".win-caption-toolbar_");
		// fast references
		this.els = {
			el,
			transformMove: el.find(`.toolbar-tool_[data-click="set-transform-control-mode"][data-arg="translate"]`),
			transformRotate: el.find(`.toolbar-tool_[data-click="set-transform-control-mode"][data-arg="rotate"]`),
			transformScale: el.find(`.toolbar-tool_[data-click="set-transform-control-mode"][data-arg="scale"]`),
			
			editorRotate: el.find(`.toolbar-tool_[data-click="set-editor-control-state"][data-arg="rotate"]`),
			editorZoom: el.find(`.toolbar-tool_[data-click="set-editor-control-state"][data-arg="zoom"]`),
			editorPan: el.find(`.toolbar-tool_[data-click="set-editor-control-state"][data-arg="pan"]`),

			viewWireframe: el.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="wireframe"]`),
			viewFlat: el.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="flat"]`),
			viewSolid: el.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="solid"]`),
			viewMaterial: el.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="material"]`),

			sidebar: el.find(`.toolbar-tool_[data-click="toggle-sidebar"]`),
		};
	},
	dispatch(event) {
		let APP = doob,
			Self = APP.toolbar,
			el;
		// console.log(event);
		switch (event.type) {
			case "toggle-toolbar":
				Self.els.transformMove.toggleClass("tool-disabled_", event.enabled);
				Self.els.transformRotate.toggleClass("tool-disabled_", event.enabled);
				Self.els.transformScale.toggleClass("tool-disabled_", event.enabled);
				// make active in group
				Self.els.transformMove.trigger("click");

				Self.els.editorRotate.toggleClass("tool-disabled_", event.enabled);
				Self.els.editorZoom.toggleClass("tool-disabled_", event.enabled);
				Self.els.editorPan.toggleClass("tool-disabled_", event.enabled);
				// make active in group
				Self.els.editorRotate.trigger("click");

				Self.els.viewWireframe.toggleClass("tool-disabled_", event.enabled);
				Self.els.viewFlat.toggleClass("tool-disabled_", event.enabled);
				Self.els.viewSolid.toggleClass("tool-disabled_", event.enabled);
				Self.els.viewMaterial.toggleClass("tool-disabled_", event.enabled);
				// make active in group
				Self.els.viewFlat.trigger("click");

				Self.els.sidebar.toggleClass("tool-disabled_", event.enabled);
				break;
		}
	}
}
