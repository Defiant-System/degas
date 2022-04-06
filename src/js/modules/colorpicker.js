
// degas.colorpicker

{
	init() {
		let rgba = window.find(".color-picker .rgba .color-group > div"),
			hsva = window.find(".color-picker .hsva .color-group > div");
		// fast references
		this.els = {
			doc: $(document),
			content: window.find("content"),
			el: window.find(".color-picker"),
			wrapper: window.find(".color-picker .wrapper"),
			wheel: window.find(".color-picker .wheel"),
			range: window.find(".color-picker .range"),
			groupRGBA: {
				R: rgba.get(0),
				G: rgba.get(1),
				B: rgba.get(2),
				A: rgba.get(3),
			},
			groupHSVA: {
				H: hsva.get(0),
				S: hsva.get(1),
				V: hsva.get(2),
				A: hsva.get(3),
			},
		};
		// bind event handlers
		this.els.wrapper.on("mousedown", this.doWrapper);
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

				value = el.css("background-color");

				let rgb = Color.parseRgb(value),
					hsv = Color.rgbToHsv(rgb),
					radius = 74,
					sat = radius * (hsv.s / 100),
					rad = hsv.h * (Math.PI / 180),
					top = hsv.s === 0 ? radius : Math.round(Math.sin(rad) * sat + radius),
					left = hsv.s === 0 ? radius : Math.round(Math.cos(rad) * sat + radius),
					height = +Self.els.range.prop("offsetHeight"),
					opacity;
				// wheel cursor
				Self.els.wrapper.find(".cursor").css({ top, left });
				// saturation cursor
				top = Math.round(height * ((100 - hsv.v) / 100));
				Self.els.range.find(".cursor").css({ top });
				// wheel opacity
				opacity = 1 - (top / height);
				Self.els.wheel.css({ opacity });
				break;
		}
	},
	doWrapper(event) {
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
					radius = 74,
					TAU = Math.PI * 2,
					group = Self.els.groupHSVA,
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
					radius,
					group,
					TAU,
					mod: (a, n) => (a % n + n) % n,
					limit: (left, top) => {
						var distance = (p1, p2) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)),
							dist = distance([left, top], [radius, radius]),
							rad;
						if (dist <= radius) return { left, top };
						else {
							left = left - radius;
							top = top - radius;
							rad = Math.atan2(top, left);
							return {
								left: Math.round(Math.cos(rad) * radius + radius),
								top: Math.round(Math.sin(rad) * radius + radius),
							}
						}
					},
				};
				// bind event
				Self.els.doc.on("mousemove mouseup", Self.doWrapper);
				break;
			case "mousemove":
				let top = event.clientY + Drag.offset.top - Drag.click.y,
					left = event.clientX + Drag.offset.left - Drag.click.x,
					limited = Drag.limit(left, top),
					x = Drag.radius - limited.left,
					y = Drag.radius - limited.top,
					hue = Drag.mod(Math.atan2(-y, -x) * (360 / Drag.TAU), 360),
					value;

				Drag.el.css(limited);

				value = (hue / 360).toFixed(3);
				Drag.group.H.data({ value }).css({ "--value": value });

				break;
			case "mouseup":
				// reset drag object
				delete Self.drag;
				// unbind event
				Self.els.doc.off("mousemove mouseup", Self.doWrapper);
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
					target = Self.els.wheel,
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
				Self.drag = { el, target, click, offset, constrain, _min, _max };
				// bind event
				Self.els.doc.on("mousemove mouseup", Self.doRange);
				break;
			case "mousemove":
				let top = Drag._min(Drag._max(event.clientY + Drag.offset.top - Drag.click.y, Drag.constrain.minY), Drag.constrain.maxY),
					opacity = 1 - (top / Drag.constrain.maxY);
				Drag.el.css({ top });
				Drag.target.css({ opacity });
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
