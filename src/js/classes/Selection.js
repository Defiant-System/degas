
class Selection {

	constructor() {
		this.thickness = 3;
		this.lineColor = 0xff6600;
	}

	clear() {
		if (this.outline) {
			editor.scene.remove(this.outline);
		}
	}

	add(object) {
		let group = new THREE.Group(),
			meshes = [],
			clone;

		// init conditional model
		clone = object.clone();
		group.add(clone);

		group.traverse(child => child.isMesh ? meshes.push(child) : null);
		meshes.map(mesh => {
			let parent = mesh.parent;
			let lineGeom = new THREE.EdgesGeometry(mesh.geometry, 90);
			let thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry(lineGeom);
			let thickLineMat = new LineMaterial({ color: this.lineColor });
			let thickLines = new LineSegments2(thickLineGeom, thickLineMat);

			parent.add(thickLines);
			// mesh.visible = false;
		});

		/*
		const material = new THREE.LineBasicMaterial({ color: 0x229922 });
		const points = [
			new THREE.Vector3( - 3, 0, 0 ),
			new THREE.Vector3( 0, 3, 0 ),
			new THREE.Vector3( 3, 0, 0 ),
		];
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		const line = new THREE.Line( geometry, material );
		editor.scene.add( line );
		*/

		clone = group.clone();
		editor.scene.add(clone);

		meshes = [];
		clone.traverse(child => child.isMesh ? meshes.push(child) : null);
		meshes.map(mesh => {
			let parent = mesh.parent;

			// Remove everything but the position attribute
			let mergedGeom = mesh.geometry.clone();
			for (let key in mergedGeom.attributes) {
				if (key !== 'position') {
					mergedGeom.deleteAttribute(key);
				}
			}

			// Create the conditional edges geometry and associated material
			let geomUtil = BufferGeometryUtils.mergeVertices(mergedGeom);
			let lineGeom = new ConditionalEdgesGeometry(geomUtil);
			// let material = new THREE.ShaderMaterial(ConditionalEdgesShader);
			// material.uniforms.diffuse.value.set(this.lineColor);

			let thickLineGeom = new ConditionalLineSegmentsGeometry().fromConditionalEdgesGeometry(lineGeom);
			let thickLineMat = new ConditionalLineMaterial({ color: this.lineColor });
			let thickLines = new LineSegments2(thickLineGeom, thickLineMat);

			thickLines.position.copy(mesh.position);
			thickLines.scale.copy(mesh.scale);
			thickLines.rotation.copy(mesh.rotation);

			parent.add(thickLines);
		});
		// remove copy of original object mesh
		meshes.map(mesh => mesh.type === "Mesh" ? mesh.parent.remove(mesh) : null);

		clone.traverse(child => {
			if (child.material && child.material.resolution) {
				renderer.getSize(child.material.resolution);
				child.material.resolution.multiplyScalar(window.devicePixelRatio);
				child.material.linewidth = this.thickness;
				// child.material.depthTest = THREE.NeverDepth;
			}
			if (child.material) child.visible = child.isLineSegments2;
			// if (child.type === "Mesh") child.visible = false;
		});

		object.material.transparent = true;
		object.material.opacity = .3;

		// object.renderOrder = 0;
		// clone.renderOrder = 2;

		this.outline = clone;

	}

}
