
class Selection {

	constructor() {
		this.thickness = 5;
		this.useThickLines = true;
		this.lineColor = 0xff6600;
	}

	clear() {
		if (this.outline) {
			editor.scene.remove(this.outline);
		}
	}

	add(object) {
		let group = new THREE.Group(),
			meshes = [];

		// init conditional model
		group.add(object.clone());


		group.traverse(child => child.isMesh ? meshes.push(child) : null);
		meshes.map(mesh => {
			let parent = mesh.parent;
			let lineGeom = new THREE.EdgesGeometry(mesh.geometry, 90);
			let lineMat = new THREE.LineBasicMaterial({ color: this.lineColor });
			let line = new THREE.LineSegments(lineGeom, lineMat);

			line.position.copy(mesh.position);
			line.scale.copy(mesh.scale);
			line.rotation.copy(mesh.rotation);

			let thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry(lineGeom);
			let thickLineMat = new LineMaterial({ color: this.lineColor, linewidth: this.thickness });
			let thickLines = new LineSegments2(thickLineGeom, thickLineMat);

			parent.remove(mesh);
			parent.add(line);
			parent.add(thickLines);
		});


		let clone = group.clone();
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
			let material = new THREE.ShaderMaterial(ConditionalEdgesShader);
			material.uniforms.diffuse.value.set(this.lineColor);

			let thickLineGeom = new ConditionalLineSegmentsGeometry().fromConditionalEdgesGeometry(lineGeom);
			let thickLineMat = new ConditionalLineMaterial({ color: this.lineColor });
			let thickLines = new LineSegments2(thickLineGeom, thickLineMat);
			thickLines.position.copy(mesh.position);
			thickLines.scale.copy(mesh.scale);
			thickLines.rotation.copy(mesh.rotation);

			parent.remove(mesh);
			parent.add(thickLines);
		});

		clone.traverse(child => {
			if (child.material && child.material.resolution) {
				renderer.getSize(child.material.resolution);
				child.material.resolution.multiplyScalar(window.devicePixelRatio);
				child.material.linewidth = this.thickness;
			}
			if (child.material) child.visible = child.isLineSegments2;
		});

		this.outline = clone;

	}

}
