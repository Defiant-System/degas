
class File {

	constructor(fsFile, data) {
		// save reference to original FS file
		this._file = fsFile || new defiant.File();

		// if new "empty" file
		// if (!fsFile.blob) return;

		switch (this._file.kind) {
			case "obj":
				let reader = new FileReader();
				reader.addEventListener("load", async () => {

					window.fetch("~/js/loaders/OBJLoader.js", { responseType: "text" })
					.then(resp => {
						let mod = {},
							code = `let module = mod; ${resp.data}`;

						let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
						new AsyncFunction("mod", "THREE", code).call({}, mod, THREE)
							.then(() => {
								let { OBJLoader } = mod.exports,
									object = new OBJLoader().parse( reader.result );
								object.name = this._file.name;

								editor.addObject( object );
								editor.select( object );
								viewport.viewInfo.update();
								viewport.render();
								
							});
					});

				}, false);
				reader.readAsText(this._file.blob);
				break;
		}
	}

	dispatch(event) {
		let APP = degas,
			str;
		switch (event.type) {
			case "close-file":
				break;
		}
	}

	async toBlob(mime, quality) {
		
	}

	get isDirty() {
		
	}

}
