
// degas.colorpicker

{
	init() {
		let rgba = window.find(".color-picker .rgba .color-group > div"),
			hsva = window.find(".color-picker .hsva .color-group > div");
		// fast references
		this.els = {
			content: window.find("content"),
			el: window.find(".color-picker"),
			wrapper: window.find(".color-picker .wrapper"),
			wheel: window.find(".color-picker .wheel"),
			range: window.find(".color-picker .range"),
			wCursor: window.find(".color-picker .wrapper .cursor"),
			rCursor: window.find(".color-picker .range .cursor"),
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
		this.els.el.on("mousedown", this.dispatch);
		// temp
		this.dispatch({ type: "select-palette-color", value: "rgba(252,173,42,1)" });
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.colorpicker,
			radius = 74,
			rgb,
			hsv,
			sat,
			rad,
			top,
			left,
			height,
			opacity,
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch(event.type) {
			case "mousedown":
				// dispatch mousedown event
				el = $(event.target);
				pEl = event.el || (el.hasClass("field") ? el : el.parents(".field"));
				switch (true) {
					case el.hasClass("wrapper"): return Self.doWrapper(event);
					case el.hasClass("range"): return Self.doRange(event);
					case pEl.hasClass("number"): return Self.doField(event);
				}
				break;
			case "show":
				Self.els.el.addClass("show");
				break;
			case "group-head":
				el = $(event.target);
				value = el.index();
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				el = el.parent().nextAll(".group-body:first");
				el.find("> div.active").removeClass("active");
				el.find(`> div:nth(${value})`).addClass("active");
				break;
			case "set-palette-hsv":
			case "select-palette-color":
				if (event.hsv) {
					hsv = event.hsv;
				} else if (event.value) {
					value = event.value;
					rgb = Color.parseRgb(value);
					hsv = Color.rgbToHsv(rgb);
				} else {
					el = $(event.target);
					el.parent().find(".active").removeClass("active");
					el.addClass("active");
					value = el.css("background-color");
					rgb = Color.parseRgb(value);
					hsv = Color.rgbToHsv(rgb);
				}
				sat = radius * (hsv.s / 100);
				rad = hsv.h * (Math.PI / 180);
				top = hsv.s === 0 ? radius : Math.round(Math.sin(rad) * sat + radius);
				left = hsv.s === 0 ? radius : Math.round(Math.cos(rad) * sat + radius);
				height = +Self.els.range.prop("offsetHeight");
				// wheel cursor
				Self.els.wCursor.css({ top, left });
				// saturation cursor
				let rTop = Math.round(height * ((100 - hsv.v) / 100));
				Self.els.rCursor.css({ top: rTop });
				// wheel opacity
				opacity = 1 - (rTop / height);
				Self.els.wheel.css({ opacity });
				
				// this will change fields
				if (!event.hsv) {
					let fakeEvent = {
							target: Self.els.wrapper[0],
							clientX: 0,
							clientY: 0,
							offsetX: left,
							offsetY: top,
							preventDefault: a => a,
						};
					Self.doWrapper({ ...fakeEvent, type: "mousedown" });
					Self.doWrapper({ ...fakeEvent, type: "mousemove" });
					Self.doWrapper({ ...fakeEvent, type: "mouseup" });
				}
				break;
			case "set-rgba-R": break;
			case "set-rgba-G": break;
			case "set-rgba-B": break;
			case "set-rgba-A": break;
			case "set-hsva-H":
			case "set-hsva-S":
			case "set-hsva-V":
				hsv = {
					h: +Self.els.groupHSVA.H.data("value") * 360,
					s: +Self.els.groupHSVA.S.data("value") * 100,
					v: +Self.els.groupHSVA.V.data("value") * 100,
				};
				Self.dispatch({ type: "set-palette-hsv", hsv });
				break;
			case "set-hsva-A":
				break;
		}
	},
	doField(event) {
		let Self = degas.colorpicker,
			Drag = Self.drag;
		switch(event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// info about DnD event
				let doc = $(document),
					el = $(event.target);
				// data for move event
				Self.drag = {
					el,
					changeType: el.data("change"),
					offset: +el.css("--value"),
					clickX: event.clientX,
					_max: Math.max,
					_min: Math.min,
					_round: Math.round,
					doc,
				};
				// cover APP UI
				APP.els.content.addClass("cover hideMouse");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.doField);
				break;
			case "mousemove":
				let step = 0.003,
					sVal = Drag.offset - ((Drag.clickX - event.clientX) * step),
					sValue = Drag._min(Drag._max(step * Drag._round(sVal / step), 0), 1),
					value = sValue.toFixed(3);
				Drag.el
					.data({ value })
					.css({ "--value": value });
				// forward value to dispatch
				Self.dispatch({ type: Drag.changeType, value });
				break;
			case "mouseup":
				// uncover APP UI
				APP.els.content.removeClass("cover hideMouse");
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.doField);
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
				let doc = $(document),
					el = $(event.target).find(".cursor"),
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
					distance: (left, top) => Math.sqrt(Math.pow(left - radius, 2) + Math.pow(top - radius, 2)),
					limit: (left, top) => {
						var dist = Self.drag.distance(left, top),
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
					doc,
				};
				// bind event
				Self.drag.doc.on("mousemove mouseup", Self.doWrapper);
				break;
			case "mousemove":
				let top = event.clientY + Drag.offset.top - Drag.click.y,
					left = event.clientX + Drag.offset.left - Drag.click.x,
					limited = Drag.limit(left, top),
					x = Drag.radius - limited.left,
					y = Drag.radius - limited.top,
					hue = Drag.mod(Math.atan2(-y, -x) * (360 / Drag.TAU), 360),
					sat = Self.drag.distance(left, top),
					value;
				// cursor position
				Drag.el.css(limited);
				// fields
				value = (hue / 360).toFixed(3);
				Drag.group.H.data({ value }).css({ "--value": value });
				value = (sat / Drag.radius).toFixed(3);
				Drag.group.S.data({ value }).css({ "--value": value });
				break;
			case "mouseup":
				// uncover layout
				Self.els.content.removeClass("cover hideMouse");
				// unbind event
				Self.drag.doc.off("mousemove mouseup", Self.doWrapper);
				// reset drag object
				delete Self.drag;
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
				let doc = $(document),
					el = $(event.target).find(".cursor"),
					group = Self.els.groupHSVA,
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
				Self.drag = { el, target, group, click, offset, constrain, _min, _max, doc };
				// bind event
				Self.drag.doc.on("mousemove mouseup", Self.doRange);
				break;
			case "mousemove":
				let top = Drag._min(Drag._max(event.clientY + Drag.offset.top - Drag.click.y, Drag.constrain.minY), Drag.constrain.maxY),
					opacity = 1 - (top / Drag.constrain.maxY),
					value;
				// cursor position
				Drag.el.css({ top });
				// wheel opacity
				Drag.target.css({ opacity });
				// fields
				value = (opacity / 1).toFixed(3);
				Drag.group.V.data({ value }).css({ "--value": value });
				break;
			case "mouseup":
				// uncover layout
				Self.els.content.removeClass("cover hideMouse");
				// unbind event
				Self.drag.doc.off("mousemove mouseup", Self.doRange);
				// reset drag object
				delete Self.drag;
				break;
		}
	}
}
