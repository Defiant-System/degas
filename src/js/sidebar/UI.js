
// degas.sidebar.UI

{
	init() {
		this.dispatch({ type: "bind-event-handlers" });
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.UI,
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch(event.type) {
			case "bind-event-handlers":
				APP.sidebar.els.sidebar.on("mousedown", ".field.image", Self.resizeImagePreview);
				break;
			case "unbind-event-handlers":
				break;
		}
	},
	resizeImagePreview(event) {
		let APP = degas,
			Self = APP.sidebar.UI,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// info about DnD event
				let doc = $(document),
					el = $(event.target);
				if (!el.hasClass("field") && !el.hasClass("image")) return;

				Self.drag = {
					el,
					offset: +el.prop("offsetHeight"),
					clickY: event.clientY,
					min: 31,
					max: 109,
					_max: Math.max,
					_min: Math.min,
					doc,
				};
				// cover APP UI
				APP.els.content.addClass("cover hideMouse");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.resizeImagePreview);
				break;
			case "mousemove":
				let height = Drag._min(Drag._max(Drag.offset - Drag.clickY + event.clientY, Drag.min), Drag.max);
				Drag.el.css({ height });
				break;
			case "mouseup":
				// uncover APP UI
				APP.els.content.removeClass("cover hideMouse");
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.resizeImagePreview);
				break;
		}
	}
}
