
// degas.colorpicker

{
	init() {
		let el = window.find(".color-picker"),
			wrapper = el.find(".wrapper"),
			range = el.find(".range"),
			rgba = el.find(".rgba .color-group > div"),
			hsva = el.find(".hsva .color-group > div");
		// fast references
		this.els = {
			content: window.find("content"),
			palette: el.find(".palette"),
			el,
			wrapper,
			range,
			wheel: wrapper.find(".wheel"),
			wCursor: wrapper.find(".cursor"),
			rCursor: range.find(".cursor"),
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
		// default color mode
		this.mode = "palette";
		// this.mode = "RGBA";
		// this.mode = "HSVA";
		this.radius = 74;
		// click on the right "tab"
		this.els.el.find(`.group-head span[data-id="${this.mode}"]`).trigger("click");
		// bind event handlers
		this.els.el.on("mousedown", this.dispatch);
		// temp
		// this.dispatch({ type: "set-palette-hex", hex: "#aa0000" });
		// this.dispatch({ type: "select-palette-color", value: "rgba(252,173,42,1)" });
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.colorpicker,
			color,
			rgb,
			hsv,
			hue,
			sat,
			rad,
			tau,
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
			case "focus-color-field":
				Self.values = {
					hex: event.el.css("--color"),
					opacity: event.el.css("--opacity"),
				};
				Self.dispatch({ type: "set-palette-hex", ...Self.values });
				// console.log( color, opacity );

				value = window.getBoundingClientRect(event.el[0]);
				top = value.top - (+Self.els.el.prop("offsetHeight") >> 1) + 12;
				left = value.left - +Self.els.el.prop("offsetWidth") - 11;
				Self.els.el.css({ top, left }).addClass("show");
				break;
			case "group-head":
				el = $(event.target);
				value = el.index();
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				// set mode
				Self.mode = el.data("id");
				// show right "body"
				el = el.parent().nextAll(".group-body:first");
				el.find("> div.active").removeClass("active");
				el.find(`> div:nth(${value})`).addClass("active");
				break;
			case "set-palette-hex":
			case "set-palette-hsv":
			case "set-palette-rgb":
			case "select-palette-color":
				if (event.hex) {
					hsv = Color.hexToHsv(event.hex);
				} else if (event.hsv) {
					hsv = event.hsv;
				} else if (event.rgb) {
					hsv = Color.rgbToHsv(event.rgb);
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

				Self.values.hex = Color.hsvToHex(hsv);

				sat = Self.radius * (hsv.s / 100);
				rad = hsv.h * (Math.PI / 180);
				top = hsv.s === 0 ? Self.radius : Math.round(Math.sin(rad) * sat + Self.radius);
				left = hsv.s === 0 ? Self.radius : Math.round(Math.cos(rad) * sat + Self.radius);
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
				if (!event.hsv && !event.rgb) {
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
			case "set-rgba-R":
			case "set-rgba-G":
			case "set-rgba-B":
				rgb = {
					r: +Self.els.groupRGBA.R.data("value") * 255,
					g: +Self.els.groupRGBA.G.data("value") * 255,
					b: +Self.els.groupRGBA.B.data("value") * 255,
				};
				Self.dispatch({ type: "set-palette-rgb", rgb });
				break;
			case "set-rgba-A":
				break;
			case "set-RGBA":
				// fields
				tau = Math.PI * 2;
				hue = Self.mod(Math.atan2(-event.y, -event.x) * (360 / tau), 360);
				sat = Math.min(Self.radius, Self.distance(event.left, event.top)) / Self.radius * 100;
				value = event.opacity;
				rgb = Color.hsvToRgb({
					h: hue,
					s: sat,
					v: value,
				});
				value = (rgb.r / 255).toFixed(3); if (value < 0.005) value = "0.000";
				Self.els.groupRGBA.R.data({ value }).css({ "--value": value });
				value = (rgb.g / 255).toFixed(3); if (value < 0.005) value = "0.000";
				Self.els.groupRGBA.G.data({ value }).css({ "--value": value });
				value = (rgb.b / 255).toFixed(3); if (value < 0.005) value = "0.000";
				Self.els.groupRGBA.B.data({ value }).css({ "--value": value });
				break;
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
				// TODO
				break;
			case "set-HSva":
				// fields
				tau = Math.PI * 2;
				hue = Self.mod(Math.atan2(-event.y, -event.x) * (360 / tau), 360);
				sat = Math.min(Self.radius, Self.distance(event.left, event.top));
				value = (hue / 360).toFixed(3); if (value < 0.005) value = "0.000";
				Self.els.groupHSVA.H.data({ value }).css({ "--value": value });
				value = (sat / Self.radius).toFixed(3); if (value < 0.005) value = "0.000";
				Self.els.groupHSVA.S.data({ value }).css({ "--value": value });
				break;
			case "set-hsVa":
				// fields
				value = (event.opacity / 1).toFixed(3); if (value < 0.005) value = "0.000";
				Self.els.groupHSVA.V.data({ value }).css({ "--value": value });
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
	mod(a, n) {
		return (a % n + n) % n;
	},
	distance(left, top) {
		return Math.sqrt(Math.pow(left - this.radius, 2) + Math.pow(top - this.radius, 2));
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
					group = Self.els.groupHSVA,
					dim = {
						top: parseInt(Self.els.rCursor.css("top"), 10),
						height: parseInt(Self.els.range.css("height"), 10),
					},
					offset = {
						left: event.offsetX,
						top: event.offsetY,
					},
					click = {
						x: event.clientX,
						y: event.clientY,
					},
					mode = Self.mode;
				if (event.clientX !== 0 && event.clientY !== 0) {
					// remove "active" indicator from palette
					Self.els.palette.find(".active").removeClass("active");
				}
				// color mode
				if (Self.mode === "HSVA") mode = "HSva";
				// move cursor
				el.css(offset);
				// create drag
				Self.drag = {
					el,
					click,
					offset,
					group,
					mode,
					opacity: (1-(dim.top / dim.height)) * 100,
					limit: (left, top) => {
						var dist = Self.distance(left, top),
							rad;
						if (dist <= Self.radius) return { left, top };
						else {
							left = left - Self.radius;
							top = top - Self.radius;
							rad = Math.atan2(top, left);
							return {
								left: Math.round(Math.cos(rad) * Self.radius + Self.radius),
								top: Math.round(Math.sin(rad) * Self.radius + Self.radius),
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
					x = Self.radius - limited.left,
					y = Self.radius - limited.top,
					opacity = Drag.opacity;
				// cursor position
				Drag.el.css(limited);
				// update fields
				Self.dispatch({ type: `set-${Drag.mode}`, ...limited, x, y, opacity });
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
					wheel = {
						top: parseInt(Self.els.wCursor.css("top"), 10),
						left: parseInt(Self.els.wCursor.css("left"), 10),
					},
					_max = Math.max,
					_min = Math.min,
					mode = Self.mode;
				if (event.clientX !== 0 && event.clientY !== 0) {
					// remove "active" indicator from palette
					Self.els.palette.find(".active").removeClass("active");
				}
				// more calc
				wheel.x = Self.radius - wheel.left;
				wheel.y = Self.radius - wheel.top;
				// color mode
				if (Self.mode === "HSVA") mode = "hsVa";
				// move cursor
				el.css(offset);
				// create drag
				Self.drag = { el, target, group, click, offset, constrain, mode, wheel, _min, _max, doc };
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
				// update fields
				Self.dispatch({ type: `set-${Drag.mode}`, opacity: opacity * 100, ...Drag.wheel });
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
