
class Selection {

	constructor() {
		this.thickness = 3;
		this.useThickLines = true;
		this.lineColor = 0xff9900;
	}

	add(model) {
		let clone = model.clone(),
			meshes = [];

		clone.traverse(child => child.isMesh ? meshes.push(child) : null);

		meshes.map(mesh => {
			let parent = mesh.parent;
			let lineGeom = new THREE.EdgesGeometry(mesh.geometry, 90);
			let lineMat = new THREE.LineBasicMaterial({ color: this.lineColor });
			let line = new THREE.LineSegments(lineGeom, lineMat);

			line.position.copy(mesh.position);
			line.scale.copy(mesh.scale);
			line.rotation.copy(mesh.rotation);

			parent.remove(mesh);
			parent.add(line);
		});
				
		// init background model
		let bgClone = model.clone();
		bgClone.traverse(child => {
			if (child.isMesh) {
				child.material = new THREE.MeshBasicMaterial({ color: 0x0066dd });
				child.material.polygonOffset = true;
				child.material.polygonOffsetFactor = 1;
				child.material.polygonOffsetUnits = 1;
				child.receiveShadow = true;
				child.renderOrder = 2;
			}
		});
		editor.scene.add(bgClone);


		// init conditional model
		let conClone = model.clone();
		editor.scene.add(conClone);
		meshes = [];
		conClone.traverse(child => child.isMesh ? meshes.push(child) : null);

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

		edges.CONDITIONAL.traverse(child => {
			if (child.material && child.material.resolution) {
				renderer.getSize(child.material.resolution);
				child.material.resolution.multiplyScalar(window.devicePixelRatio);
				child.material.linewidth = this.thickness;
			}
			if (child.material) {
				child.visible = child.isLineSegments2;
			}
		} );

		// render
		// viewport.render();
	}

}
