
class File {

	constructor(fsFile, data) {
		// save reference to original FS file
		this._file = fsFile || new defiant.File();

		// if new "empty" file
		if (!fsFile.blob) return;

		switch (this._file.kind) {
			case "obj":
				let reader = new FileReader();
				reader.addEventListener("load", async () => {

					if (!APP.Loaders.OBJLoader) {
						let mod = {},
							resp = await this.getLoader(),
							code = `let module = mod; ${resp.data}`;
						new Function("mod", "THREE", code).call({}, mod, THREE);
						APP.Loaders.OBJLoader = mod.exports.OBJLoader;
					}
					let object = new APP.Loaders.OBJLoader().parse( reader.result );

					object = object.children[0];
					object.name = this._file.name;

					// pass along imported object to workspace
					APP.workspace.dispatch({ type: "add-mesh", object });
					
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

	getLoader(callback) {
		return window.fetch("~/js/loaders/OBJLoader.js", { responseType: "text" });
	}

	async toBlob(mime, quality) {
		
	}

	get isDirty() {
		
	}

}
