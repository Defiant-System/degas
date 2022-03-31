
// degas.workspace

{
	init() {
		// fast references
		this.els = {
			workspace: window.find(".workspace"),
		};

		this.viewShadeMode = "solid";
	},
	dispatch(event) {
		let APP = degas,
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
				switch (event.arg) {
					case "wireframe":
						value = mesh => {
							mesh.material.wireframe = true;
							// mesh.material.vertexColors = true;
							mesh.material.flatShading = false;
							mesh.material.needsUpdate = true;
						};
						break;
					case "solid":
						value = mesh => {
							mesh.material.wireframe = false;
							// mesh.material.vertexColors = false;
							mesh.material.flatShading = false;
							mesh.material.needsUpdate = true;
						};
						break;
					case "flat":
						value = mesh => {
							mesh.material.wireframe = false;
							// mesh.material.vertexColors = false;
							mesh.material.flatShading = true;
							mesh.material.needsUpdate = true;
						};
						break;
					case "material": return;
				}
				editor.scene.children.filter(item => item.material).map(value);
				// render
				viewport.render();
				return true;
			case "set-editor-control-state":
				viewport.editorControlsSetState(event.arg.toUpperCase());
				return true;
			case "set-transform-control-mode":
				viewport.transformControlsSetMode(event.arg);
				return true;
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
				object = Self.getLight(event.arg);
				// apply argument value
				if (event.intensity) object.intensity = event.intensity;
				editor.addObject( object );
				editor.select( object );
				viewport.viewInfo.update();
				viewport.render();
				break;
			case "add-camera":
				console.log(event);
				break;
		}
	},
	getLight(type) {
		let intensity = 1,
			distance = 0,
			color = 0xffffff,
			light;
		switch (type) {
			case "ambientlight":
				color = 0x222222;
				light = new THREE.AmbientLight( color );
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
	},
	getMesh(type) {
		let sprite,
			path,
			geometry,
			mesh;
		switch (type) {
			case "box":
				geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Box';
				break;
			case "circle":
				geometry = new THREE.CircleGeometry( 1, 8, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Circle';
				break;
			case "cylinder":
				geometry = new THREE.CylinderGeometry( 1, 1, 1, 8, 1, false, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Cylinder';
				break;
			case "dodecahedron":
				geometry = new THREE.DodecahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Dodecahedron';
				break;
			case "icosahedron":
				geometry = new THREE.IcosahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Icosahedron';
				break;
			case "lathe":
				geometry = new THREE.LatheGeometry();
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } ) );
				mesh.name = 'Lathe';
				break;
			case "octahedron":
				geometry = new THREE.OctahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Octahedron';
				break;
			case "plane":
				geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
				const material = new THREE.MeshStandardMaterial();
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Plane';
				break;
			case "ring":
				geometry = new THREE.RingGeometry( 0.5, 1, 8, 1, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Ring';
				break;
			case "sphere":
				geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Sphere';
				break;
			case "sprite":
				sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
				sprite.name = 'Sprite';
				break;
			case "tetrahedron":
				geometry = new THREE.TetrahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Tetrahedron';
				break;
			case "torus":
				geometry = new THREE.TorusGeometry( 1, 0.4, 8, 6, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Torus';
				break;
			case "torusknot":
				geometry = new THREE.TorusKnotGeometry( 1, 0.4, 64, 8, 2, 3 );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'TorusKnot';
				break;
			case "tube":
				path = new THREE.CatmullRomCurve3( [
					new THREE.Vector3( 2, 2, - 2 ),
					new THREE.Vector3( 2, - 2, - 0.6666666666666667 ),
					new THREE.Vector3( - 2, - 2, 0.6666666666666667 ),
					new THREE.Vector3( - 2, 2, 2 )
				] );
				geometry = new THREE.TubeGeometry( path, 64, 1, 8, false );
				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
				mesh.name = 'Tube';
				break;
		}
		return mesh;
	}
}
