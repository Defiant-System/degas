
// doob.sidebar.camera

{
	init() {

	},
	dispatch(event) {
		let APP = doob,
			Self = APP.sidebar.camera,
			el;
		// console.log(event);
		switch(event.type) {
			case "select-image":
				window.dialog.open({
					jpg: item => console.log(item),
					png: item => console.log(item),
				});
				break;
			case "set-color-type":
				console.log(event);
				break;
			case "set-compression":
			case "set-location":
			case "set-rotation":
			case "set-scale":
				console.log(event);
				break;
		}
	}
}
