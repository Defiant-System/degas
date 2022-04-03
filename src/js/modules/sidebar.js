
// degas.sidebar

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
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
					if (!el.hasClass("sidebar")) return;
					animStop = true;
				});
				return !value;
		}
	}
}
