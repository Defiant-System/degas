
// degas.sidebar.UI

{
	init() {
		this.dispatch({ type: "bind-event-handlers" });

		// temp
		let el = window.find(`div[data-section="camera"] .field.color`);
		setTimeout(() => this.dispatch({ type: "mousedown", target: el[0], el }), 1500);
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
			case "mousedown":
				el = $(event.target);
				pEl = event.el || (el.hasClass("field") ? el : el.parents(".field"));
				// console.log(pEl);
				switch (true) {
					case pEl.hasClass("number"):
						return Self.numberInput(event);
					case pEl.hasClass("image"):
						return Self.resizeImagePreview(event);
					case pEl.hasClass("options"):
						pEl.find(".active").removeClass("active");
						el.addClass("active");
						break;
					case pEl.hasClass("checkbox"):
						if (pEl.data("checked")) pEl.removeAttr("data-checked");
						else pEl.data({ checked: 1 });
						break;
					case pEl.hasClass("color"):
						APP.colorpicker.dispatch({ type: "focus-color-field", el: pEl });
						break;
				}
				break;
			case "bind-event-handlers":
				APP.sidebar.els.sidebar.on("mousedown", ".field", Self.dispatch);
				break;
		}
	},
	numberInput(event) {
		let APP = degas,
			Self = APP.sidebar.UI,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// info about DnD event
				let doc = $(document),
					el = $(event.target),
					vEl = el.find("span"),
					val = (el.css("--value") || vEl.html()).match(/[\d\.]+/),
					offset = +val[0],
					min = +el.data("min"),
					max = +el.data("max"),
					step = +el.data("step"),
					dec = step < 1 ? el.data("step").split(".")[1].length : 0,
					suffix = vEl.html().match(/[\d\. ]+?(\D+)$/),
					name = el.parents("[data-section]").data("section"),
					etChange = el.data("change"),
					fnChange = APP.sidebar[name].dispatch;
				// clean up + fallback
				suffix = suffix ? suffix[1].trim() : "";
				// data for move event
				Self.drag = {
					el,
					vEl,
					min,
					max,
					step,
					dec,
					suffix,
					offset,
					clickX: event.clientX,
					_max: Math.max,
					_min: Math.min,
					_round: Math.round,
					etChange,
					fnChange,
					doc,
				};
				// cover APP UI
				APP.els.content.addClass("cover hideMouse");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.numberInput);
				break;
			case "mousemove":
				let diff = Drag.clickX - event.clientX,
					value;
				if (Drag.min !== Drag.max) {
					let width = Drag._min(Drag._max(Drag.offset - diff, Drag.min), Drag.max);
					value = width.toFixed(Drag.dec);
					Drag.el.css({ "--value": `${Drag._round(width)}%` });
					Drag.vEl.html(`${value} ${Drag.suffix}`.trim());
				} else {
					let sVal = Drag.offset - (diff * Drag.step),
						sValue = Drag.step * Drag._round(sVal / Drag.step);
					value = sValue.toFixed(Drag.dec);
					Drag.vEl.html(`${value} ${Drag.suffix}`.trim());
				}
				if (Drag.etChange) {
					Drag.fnChange({ type: Drag.etChange, value: +value });
				}
				break;
			case "mouseup":
				// uncover APP UI
				APP.els.content.removeClass("cover hideMouse");
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.numberInput);
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
					min: 37,
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
