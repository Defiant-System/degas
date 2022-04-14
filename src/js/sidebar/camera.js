
// degas.sidebar.camera

{
	init() {

	},
	dispatch(event) {
		let APP = degas,
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
		}
	}
}
