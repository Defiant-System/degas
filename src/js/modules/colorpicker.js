
// degas.colorpicker

{
	init() {
		// fast references
		let el = window.find(".color-picker"),
			wrapper = el.find(".wrapper"),
			range = el.find(".range"),
			rgba = el.find(".rgba .color-group > div"),
			hsva = el.find(".hsva .color-group > div");
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
		// "settings"
		this.mode = "palette";  // palette RGBA HSVA
		this.radius = 74;
		this.origin = {};
		// click on the right "tab"
		this.els.el.find(`.group-head span[data-id="${this.mode}"]`).trigger("click");
		// bind event handlers
		this.els.el.on("mousedown", this.dispatch);
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.colorpicker,
			opacity,
			rgb, hsv,
			rad, sat,
			top, left, height,
			name, value,
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
				Self.origin = {
					el: event.el,
					hex: event.el.css("--color"),
					opacity: +event.el.css("--opacity"),
				};
				Self.origin.rgb = Color.hexToRgb(Self.origin.hex);
				Self.origin.hsv = Color.hexToHsv(Self.origin.hex);
				Self.dispatch({ type: `set-fields-${Self.mode}`, ...Self.origin });

				value = window.getBoundingClientRect(event.el[0]);
				top = value.top - (+Self.els.el.prop("offsetHeight") >> 1) + 12;
				left = value.left - +Self.els.el.prop("offsetWidth") - 14;
				Self.els.el.css({ top, left }).addClass("show");

				let doc = $(document),
					func = event => {
						if ($(event.target).parents(".color-picker").length) return;
						Self.els.el
							.cssSequence("hide", "animationend", el =>
								el.css({ top: -1e3, left: -1e3 }).removeClass("show hide"));
						doc.unbind("mousedown", func);
					};
				// capture next mousedown - if outside color picker hide, color picker
				doc.bind("mousedown", func);
				break;
			case "update-origin-el":
				Self.origin.el.css({
					"--color": Self.origin.hex,
					"--opacity": Self.origin.opacity,
				});
				break;
			case "group-head":
				el = $(event.target);
				value = el.index();
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				// show right "body"
				el = el.parent().nextAll(".group-body:first");
				el.find("> div.active").removeClass("active");
				el.find(`> div:nth(${value})`).addClass("active");
				// set mode
				Self.mode = el.data("id");
				Self.dispatch({ type: `set-fields-${Self.mode}`, ...Self.origin });
				break;
			case "set-fields-HSVA":
				hsv = event.hsv || Self.origin.hsv;
				value = (hsv.h / 360).toFixed(3); // if (value < 0.005) value = "0.000";
				Self.els.groupHSVA.H.data({ value }).css({ "--value": value });
				value = (hsv.s / 100).toFixed(3); // if (value < 0.005) value = "0.000";
				Self.els.groupHSVA.S.data({ value }).css({ "--value": value });
				value = (hsv.v / 100).toFixed(3); // if (value < 0.005) value = "0.000";
				Self.els.groupHSVA.V.data({ value }).css({ "--value": value });
				value = Self.origin.opacity.toFixed(3);
				Self.els.groupHSVA.A.data({ value }).css({ "--value": value });
				break;
			case "set-fields-RGBA":
				rgb = event.rgb || Self.origin.rgb;
				value = (rgb.r / 255).toFixed(3); // if (value < 0.005) value = "0.000";
				Self.els.groupRGBA.R.data({ value }).css({ "--value": value });
				value = (rgb.g / 255).toFixed(3); // if (value < 0.005) value = "0.000";
				Self.els.groupRGBA.G.data({ value }).css({ "--value": value });
				value = (rgb.b / 255).toFixed(3); // if (value < 0.005) value = "0.000";
				Self.els.groupRGBA.B.data({ value }).css({ "--value": value });
				value = Self.origin.opacity.toFixed(3);
				Self.els.groupRGBA.A.data({ value }).css({ "--value": value });
				break;
			case "set-fields-palette":
				value = event.hex || Self.origin.hex;
				el = Self.els.palette.find(`span[style="background: ${value};"]`);
				if (el.length) el.addClass("active");
				break;
			case "select-palette-color":
				el = $(event.target);
				if (el.prop("nodeName") !== "SPAN") return;
				Self.els.palette.find(".active").removeClass("active");
				Self.origin.hex = el.addClass("active").attr("style").match(/background: (#.+?);/i)[1];
				Self.origin.rgb = Color.hexToRgb(Self.origin.hex);
				Self.origin.hsv = Color.hexToHsv(Self.origin.hex);
				
				Self.dispatch({ type: "update-origin-el" });
				Self.dispatch({ type: "set-wheel-range" });
				break;
			case "set-wheel-range":
				hsv = event.hsv || Self.origin.hsv;
				height = +Self.els.range.prop("offsetHeight");
				// wheel cursor
				rad = hsv.h * (Math.PI / 180);
				sat = Self.radius * (hsv.s / 100);
				top = Math.round(Math.sin(rad) * sat + Self.radius);
				left = Math.round(Math.cos(rad) * sat + Self.radius);
				Self.els.wCursor.css({ top, left });
				// saturation cursor
				opacity = hsv.v / 100;
				top = Math.round(height * (1-opacity));
				Self.els.rCursor.css({ top });
				Self.els.wheel.css({ opacity });
				break;
		}
	},
	mod(a, n) {
		return (a % n + n) % n;
	},
	distance(left, top) {
		return Math.sqrt(Math.pow(left - this.radius, 2) + Math.pow(top - this.radius, 2));
	},
	doField(event) {
		
	},
	doWrapper(event) {
		
	},
	doRange(event) {
		
	}
}
