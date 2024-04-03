
// doob.workspace

{
	init() {
		// fast references
		this.els = {
			workspace: window.find(".workspace"),
			toolbar: {
				wireframe: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="wireframe"]`),
				flat: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="flat"]`),
				solid: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="solid"]`),
				material: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="material"]`),
			}
		};
		// for matcaps
		this.textureLoader = new THREE.TextureLoader();
		this.matcaps = { none: null };
	},
	dispatch(event) {
		let APP = doob,
			Self = APP.workspace,
			object,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "create-editor-viewport":
				// create editor + viewport
				editor = new Editor();
				viewport = new Viewport(editor);

				// append panel
				Self.els.workspace.append(viewport.container.dom);
				Self.els.rendererCvs = Self.els.workspace.append(renderer.domElement),
				Self.dispatch({ type: "resize-workspace" });
				break;
			case "show-view-grid":
				viewport.grid.visible = event.checked === 1;
				viewport.render();
				break;
			case "show-view-info":
				Self.els.workspace.find("#viewInfo").toggleClass("hidden", event.checked === 1);
				break;
			case "show-view-helper":
				Self.els.workspace.find("#viewHelper").toggleClass("hidden", event.checked === 1);
				viewport.viewHelper.visible = event.checked === 1;
				viewport.render();
				break;
			case "resize-workspace":
				if (editor === undefined) {
					Self.dispatch({ type: "create-editor-viewport" });
				}
				Self.els.rendererCvs.attr({
					width: Self.els.workspace.prop("offsetWidth"),
					height: Self.els.workspace.prop("offsetHeight"),
				});
				// resize viewport
				viewport.resize();
				break;
			case "deselect":
				editor.deselect();
				break;
			case "set-view-shade":
				el = Self.els.toolbar[event.arg];
				el.parent().find(".tool-active_").removeClass("tool-active_");
				el.addClass("tool-active_");

				switch (event.arg) {
					case "wireframe":
						editor.scene.children
							.filter(mesh => mesh.type === "Mesh")
							.map(mesh => {
								let edges = new THREE.EdgesGeometry(mesh.geometry),
									material = new THREE.LineBasicMaterial({ color: Settings.wireframe.default }),
									outline = new THREE.LineSegments(edges, material);

								mesh.add(outline);
								mesh.material.visible = false;
								mesh.material.flatShading = false;
								mesh.material.needsUpdate = true;
							});
						break;
					case "flat":
						editor.scene.children
							.filter(mesh => mesh.type === "Mesh")
							.map(mesh => {
								// delete potential line segments
								mesh.children.map(c => mesh.remove(c));

								mesh.material.visible = true;
								mesh.material.flatShading = true;
								mesh.material.needsUpdate = true;
							});
						break;
					case "solid":
						editor.scene.children
							.filter(mesh => mesh.type === "Mesh")
							.map(mesh => {
								// delete potential line segments
								mesh.children.map(c => mesh.remove(c));
								
								// mesh.material = new THREE.MeshMatcapMaterial({ matcap: Self.matcaps.none });

								mesh.material.visible = true;
								mesh.material.flatShading = false;
								mesh.material.needsUpdate = true;
							});
						break;
					case "material":
						editor.scene.children
							.filter(mesh => mesh.type === "Mesh")
							.map(mesh => {
								// mesh.material = new THREE.MeshMatcapMaterial({ matcap: Self.matcaps.test });

								mesh.material.visible = true;
								mesh.material.flatShading = false;
								mesh.material.needsUpdate = true;
							});
						break;
				}
				// render
				viewport.render();
				return true;
			case "set-editor-control-state":
				viewport.editorControlsSetState(event.arg.toUpperCase());
				return true;
			case "set-transform-control-mode":
				viewport.transformControlsSetMode(event.arg);
				return true;
			case "apply-material-selected-mesh":
				Self.textureLoader.load(`~/matcaps/${event.matcap}`, matcap => {
					let material = new THREE.MeshMatcapMaterial({ matcap });
					editor.selected.material = material;

					editor.selected.material.visible = true;
					editor.selected.material.flatShading = false;
					editor.selected.material.needsUpdate = true;
					// render
					viewport.render();
				});
				break;
			case "add-mesh":
				object = event.object || Self.getMesh(event.arg);
				// apply argument value
				if (event.position) object.position.set(...event.position);
				editor.addObject( object );
				editor.select( object );
				viewport.viewInfo.update();
				viewport.render();
				break;
			case "add-light":
				object = Self.getLight(event.arg, event.color, event.intensity);
				// apply argument value
				editor.addObject( object );
				// editor.select( object );
				viewport.viewInfo.update();
				viewport.render();
				break;
			case "add-camera":
				console.log(event);
				break;
		}
	},
	getMesh(type) {
		let material = new THREE.MeshStandardMaterial({ color: 0xffffff, /* metalness: 1, roughness: 0 */ }),
			geometry,
			mesh;
		switch (type) {
			case "box":
				geometry = new THREE.BoxBufferGeometry( 1, 1, 1, 1, 1, 1 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Box';
				break;
			case "circle":
				geometry = new THREE.CircleBufferGeometry( 1, 8, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Circle';
				break;
			case "cylinder":
				geometry = new THREE.CylinderBufferGeometry( 1, 1, 2, 12, 1, false, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Cylinder';
				break;
			case "dodecahedron":
				geometry = new THREE.DodecahedronBufferGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Dodecahedron';
				break;
			case "icosahedron":
				geometry = new THREE.IcosahedronBufferGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Icosahedron';
				break;
			case "lathe":
				let vec = [ new THREE.Vector2( 0, 1 ),
							new THREE.Vector2( 1, 0 ),
							new THREE.Vector2( 0, -1 ) ];
				geometry = new THREE.LatheBufferGeometry( vec, 8 );
				material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Lathe';
				break;
			case "octahedron":
				geometry = new THREE.OctahedronBufferGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Octahedron';
				break;
			case "plane":
				geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Plane';
				break;
			case "ring":
				geometry = new THREE.RingBufferGeometry( 0.5, 1, 8, 1, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Ring';
				break;
			case "sphere":
				geometry = new THREE.SphereBufferGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Sphere';
				break;
			case "sprite":
				material = new THREE.SpriteMaterial();
				mesh = new THREE.Sprite( material );
				mesh.name = 'Sprite';
				break;
			case "tetrahedron":
				geometry = new THREE.TetrahedronBufferGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Tetrahedron';
				break;
			case "torus":
				geometry = new THREE.TorusBufferGeometry( 1, 0.4, 12, 24, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Torus';
				break;
			case "torusknot":
				geometry = new THREE.TorusKnotBufferGeometry( 1, 0.4, 64, 8, 2, 3 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'TorusKnot';
				break;
			case "tube":
				let path = new THREE.CatmullRomCurve3( [
					new THREE.Vector3( 1, 1, -1 ),
					new THREE.Vector3( 1, -1, 0.6666666666666667 ),
					new THREE.Vector3( -1, -1, 0.6666666666666667 ),
					new THREE.Vector3( -1, 1, 1 )
				] );
				geometry = new THREE.TubeBufferGeometry( path, 32, .5, 8, false );
				material.side = THREE.DoubleSide;
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Tube';
				break;
		}
		return mesh;
	},
	getLight(type, color=0xffffff, intensity=1) {
		let distance = 0,
			light;
		switch (type) {
			case "ambientlight":
				light = new THREE.AmbientLight( color, intensity );
				light.name = 'AmbientLight';
				break;
			case "directionallight":
				light = new THREE.DirectionalLight( color, intensity );
				light.name = 'DirectionalLight';
				light.target.name = 'DirectionalLight Target';
				light.position.set( 5, 10, 7.5 );
				break;
			case "hemispherelight":
				let skyColor = 0x00aaff;
				let groundColor = 0xffaa00;
				light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
				light.name = 'HemisphereLight';
				light.position.set( 0, 10, 0 );
				break;
			case "pointlight":
				light = new THREE.PointLight( color, intensity, distance );
				light.name = 'PointLight';
				break;
			case "spotlight":
				let angle = Math.PI * 0.1;
				let penumbra = 0;
				light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
				light.name = 'SpotLight';
				light.target.name = 'SpotLight Target';
				light.position.set( 5, 10, 7.5 );
				break;
		}
		return light;
	}
}
