
// degas.workspace

{
	init() {
		this.els = {
			workspace: window.find(".workspace"),
		};

		// create editor + viewport
		editor = new Editor();
		viewport = new Viewport(editor);

		// append panel
		this.els.workspace.append(viewport.container.dom);
		this.els.rendererCvs = this.els.workspace.append(renderer.domElement),
		
		this.dispatch({ type: "resize-workspace" });
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.workspace,
			mesh,
			el;
		// console.log(event);
		switch (event.type) {
			case "resize-workspace":
				Self.els.rendererCvs.attr({
					width: Self.els.workspace.prop("offsetWidth"),
					height: Self.els.workspace.prop("offsetHeight"),
				});
				
				viewport.render();
				break;
			case "add-mesh":
				mesh = Self.getMesh(event.arg);
				editor.scene.add( mesh );
				editor.select( mesh );
				viewport.render();
				break;
			case "add-light":
			case "add-camera":
				console.log(event);
				break;
		}
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
