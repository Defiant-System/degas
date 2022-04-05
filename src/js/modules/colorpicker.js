
// degas.colorpicker

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			content: window.find("content"),
			el: window.find(".color-picker"),
			wheel: window.find(".color-picker .wheel"),
			range: window.find(".color-picker .range"),
		};
		// bind event handlers
		this.els.wheel.on("mousedown", this.doWheel);
		this.els.range.on("mousedown", this.doRange);
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.colorpicker,
			name,
			value,
			el;
		// console.log(event);
		switch(event.type) {
			case "group-head":
				el = $(event.target);
				value = el.index();
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				el = el.parent().nextAll(".group-body:first");
				el.find("> div.active").removeClass("active");
				el.find(`> div:nth(${value})`).addClass("active");
				break;
			case "select-palette-color":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	},
	doWheel(event) {
		let Self = degas.colorpicker,
			Drag = Self.drag;
		switch(event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// cover layout
				Self.els.content.addClass("cover hideMouse");
				// collect event info
				let el = $(event.target).find(".cursor"),
					offset = {
						left: event.offsetX,
						top: event.offsetY,
					},
					click = {
						x: event.clientX,
						y: event.clientY,
					};
				// move cursor
				el.css(offset);
				// create drag
				Self.drag = {
					el,
					click,
					offset,
					limit: (left, top) => {
						var r = 73,
							distance = (p1, p2) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)),
							dist = distance([left, top], [r, r]),
							rad;
						if (dist <= r) return { left, top };
						else {
							left = left - r;
							top = top - r;
							rad = Math.atan2(top, left);
							return {
								left: Math.cos(rad) * r + r,
								top: Math.sin(rad) * r + r
							}
						}
					},
				};
				// bind event
				Self.els.doc.on("mousemove mouseup", Self.doWheel);
				break;
			case "mousemove":
				let top = event.clientY + Drag.offset.top - Drag.click.y,
					left = event.clientX + Drag.offset.left - Drag.click.x,
					limited = Drag.limit(left, top);

				Drag.el.css(limited);
				break;
			case "mouseup":
				// reset drag object
				delete Self.drag;
				// unbind event
				Self.els.doc.off("mousemove mouseup", Self.doWheel);
				break;
		}
	},
	doRange(event) {
		let Self = degas.colorpicker,
			Drag = Self.drag;
		switch(event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// cover layout
				Self.els.content.addClass("cover hideMouse");
				// collect event info
				let el = $(event.target).find(".cursor"),
					offset = { top: event.offsetY - 3 },
					click = { y: event.clientY },
					constrain = {
						minY: 0,
						maxY: +Self.els.range.prop("offsetHeight"),
					},
					_max = Math.max,
					_min = Math.min;
				// move cursor
				el.css(offset);
				// create drag
				Self.drag = { el, click, offset, constrain, _min, _max };
				// bind event
				Self.els.doc.on("mousemove mouseup", Self.doRange);
				break;
			case "mousemove":
				let top = Drag._min(Drag._max(event.clientY + Drag.offset.top - Drag.click.y, Drag.constrain.minY), Drag.constrain.maxY);
				Drag.el.css({ top });
				break;
			case "mouseup":
				// reset drag object
				delete Self.drag;
				// unbind event
				Self.els.doc.off("mousemove mouseup", Self.doRange);
				break;
		}
	}
}
