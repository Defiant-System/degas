
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

					await Promise.all(["MTLLoader", "OBJLoader"].map(async item => {
						let mod = {},
							resp = await this.getLoader(item),
							rx = new RegExp(`export { ${item} }`),
							str = resp.data.replace(rx, `module.exports = { ${item} };`),
							code = `let module = mod; ${str}`;

						new Function("mod", "THREE", code).call({}, mod, THREE);
						APP.Loaders[item] = mod.exports[item];

					}));

					let materials = await new APP.Loaders.MTLLoader().loadAsync("~/sample/sword_scimitar.mtl");
					let group = await new APP.Loaders.OBJLoader()
					    .setMaterials(materials)
					    .loadAsync("~/sample/sword_scimitar.obj")
					
					// object = object.children[0];
					// object.name = this._file.name;

					// pass along imported object to workspace
					APP.workspace.dispatch({ type: "add-mesh", object: group });
					
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

	getLoader(name) {
		return window.fetch("~/loaders/"+ name +".js", { responseType: "text" });
	}

	async toBlob(mime, quality) {
		
	}

	get isDirty() {
		
	}

}
