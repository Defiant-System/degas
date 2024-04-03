
class File {

	constructor(fsFile, data) {
		// save reference to original FS file
		this._file = fsFile || new karaqu.File();

		// if new "empty" file
		if (!fsFile.blob) return;

		switch (this._file.kind) {
			case "obj":
				let reader = new FileReader();
				reader.addEventListener("load", async () => {

					await Promise.all(["MTLLoader", "OBJLoader"].map(async item => {
						let mod = {},
							resp = await this.getLoader(item),
							rx = new RegExp(`export { ${item} }`),
							str = resp.data.replace(rx, `module.exports = { ${item} };`),
							code = `let module = mod; ${str}`;

						new Function("mod", "THREE", code).call({}, mod, THREE);
						APP.Loaders[item] = mod.exports[item];

					}));

					let filepath = this._file.xNode ? `${this._file.dir + this._file.name}.mtl` : `/cdn/samples/3d/${this._file.name}.mtl`;
					let materials = await new APP.Loaders.MTLLoader().loadAsync(filepath),
						object = await new APP.Loaders.OBJLoader()
								    .setMaterials(materials)
								    .parse(reader.result);
								    // .loadAsync(`/cdn/samples/3d/${this._file.name}.obj`);
					// set object name as file name
					object.name = this._file.name;
					// pass along imported object to workspace
					APP.workspace.dispatch({ type: "add-mesh", object });

					// enable toolbar
					APP.toolbar.dispatch({ type: "toggle-toolbar", enabled: true });
					
				}, false);
				reader.readAsText(this._file.blob);
				break;
		}
	}

	dispatch(event) {
		let APP = doob,
			str;
		switch (event.type) {
			case "close-file":
				// enable toolbar
				APP.toolbar.dispatch({ type: "toggle-toolbar", enabled: false });
				break;
		}
	}

	getLoader(name) {
		return window.fetch("~/loaders/"+ name +".js", { responseType: "text" });
	}

	async toBlob(mime, quality) {
		
	}

	get isDirty() {
		
	}

}
