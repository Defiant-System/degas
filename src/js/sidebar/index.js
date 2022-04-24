
// degas.sidebar

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			content: window.find("content"),
			sidebar: window.find(".sidebar"),
			vResize: window.find(".sidebar .view-vert-resize"),
			hResize: window.find("content .view-hori-resize"),
		};
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));
		// bind event handlers
		this.els.hResize.on("mousedown", this.resizeSidebar);
		this.els.vResize.on("mousedown", this.resizeTree);
		// temp
		this.els.sidebar.find(".properties .tabs > div:nth(0)").trigger("click");
	},
	resizeSidebar(event) {
		let APP = degas,
			Self = APP.sidebar,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// cover APP UI
				APP.els.content.addClass("cover hideMouse");
				// info about DnD event
				let el = Self.els.content.addClass("resizing"),
					offset = +Self.els.sidebar.find(".tree").prop("offsetWidth");

				Self.drag = {
					el,
					offset,
					clickX: event.clientX,
					min: 270,
					max: 400,
					_max: Math.max,
					_min: Math.min,
				};
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.resizeSidebar);
				break;
			case "mousemove":
				let width = Drag._min(Drag._max(Drag.offset + Drag.clickX - event.clientX, Drag.min), Drag.max);
				Drag.el.css({ "--sidebar-width": `${width}px` });
				// resize viewport
				viewport.resize();
				break;
			case "mouseup":
				Drag.el.removeClass("resizing");
				// uncover APP UI
				APP.els.content.removeClass("cover hideMouse");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.resizeSidebar);
				break;
		}
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "toggle-sidebar":
				let animStop = false,
					resizeAnim = () => {
						if (animStop) return;
						requestAnimationFrame(resizeAnim);
						viewport.resize();
					};
				// start resize animation
				resizeAnim();
				// schedule stopper
				value = Self.els.content.hasClass("show-sidebar");
				name = value ? "!show-sidebar" : "show-sidebar";
				Self.els.content.cssSequence(name, "transitionend", el => {
					if (el[0] !== Self.els.content[0]) return;
					animStop = true;
				});
				return !value;
			case "select-sidebar-tab":
				el = $(event.target);
				if (el[0] === event.el[0]) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				name = el.data("name");
				value = Self.els.sidebar.find(`.properties .tab-body div[data-section="${name}"]`);
				value.parent().find("> div[data-section].active").removeClass("active");
				value.addClass("active");
				break;
			default:
				el = event.el || (event.origin ? event.origin.el : null);
				if (el) {
					el = el.data("section") ? el : el.parents(`div[data-section]`);
					if (el.length) Self[el.data("section")].dispatch(event);
				}
		}
	},
	resizeTree(event) {
		let APP = degas,
			Self = APP.sidebar,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// cover APP UI
				APP.els.content.addClass("cover hideMouse");
				// info about DnD event
				let el = Self.els.sidebar.find(".tree");

				Self.drag = {
					el,
					offset: +el.prop("offsetHeight"),
					clickY: event.clientY,
					min: 100,
					max: 260,
					_max: Math.max,
					_min: Math.min,
				};
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.resizeTree);
				break;
			case "mousemove":
				let height = Drag._min(Drag._max(Drag.offset - Drag.clickY + event.clientY, Drag.min), Drag.max);
				Drag.el.css({ height });
				break;
			case "mouseup":
				// uncover APP UI
				APP.els.content.removeClass("cover hideMouse");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.resizeTree);
				break;
		}
	},
	UI: @import "./UI.js",
	tree: @import "./tree.js",
	scene: @import "./scene.js",
	light: @import "./light.js",
	files: @import "./files.js",
	camera: @import "./camera.js",
	modifiers: @import "./modifiers.js",
	material: @import "./material.js",
	settings: @import "./settings.js",
	texture: @import "./texture.js",
	object: @import "./object.js",
}
