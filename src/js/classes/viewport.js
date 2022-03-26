
class Viewport {
	
	constructor(editor) {
		const container = new UIPanel();
		container.setId( 'viewport' );
		container.setPosition( 'absolute' );

		//
		let renderer = null;
		let pmremGenerator = null;

		const camera = editor.camera;
		const scene = editor.scene;
		const sceneHelpers = editor.sceneHelpers;
		let showSceneHelpers = true;

		const objects = [];
		// helpers
		const grid = new THREE.Group();

		const grid1 = new THREE.GridHelper( 30, 30, 0x888888 );
		grid1.material.color.setHex( 0x888888 );
		grid1.material.vertexColors = false;
		grid.add( grid1 );

		const grid2 = new THREE.GridHelper( 30, 6, 0x222222 );
		grid2.material.color.setHex( 0x222222 );
		grid2.material.depthFunc = THREE.AlwaysDepth;
		grid2.material.vertexColors = false;
		grid.add( grid2 );

		const viewHelper = new ViewHelper( camera, container );
		const vr = new VR( editor );

	}

}
