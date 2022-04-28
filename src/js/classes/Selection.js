
class Selection {

	constructor() {
		this.scene = new THREE.Scene();
		this.resetSceneBgColor();

		this.thickness = 6;
		this.lineColor = 0xff6600;
	}

	resetSceneBgColor() {
		this.scene.background = new THREE.Color( 0x333333 );
	}

	clear() {
		if (this.outline) {
			this.scene.remove(this.outline);
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
			let thickLineMat = new LineMaterial({ color: this.lineColor, linewidth: this.thickness });
			let thickLines = new LineSegments2(thickLineGeom, thickLineMat);

			parent.add(thickLines);
			mesh.visible = false;
		});


		clone = group.clone();
		this.scene.add(clone);

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

			parent.add(thickLines);
		});

		clone.traverse(child => {
			if (child.material && child.material.resolution) {
				renderer.getSize(child.material.resolution);
				child.material.resolution.multiplyScalar(window.devicePixelRatio);
				child.material.linewidth = this.thickness;
			}
			if (child.material) child.visible = child.isLineSegments2;
			if (child.type === "Mesh") child.visible = false;

		});

		this.outline = clone;

	}

}
