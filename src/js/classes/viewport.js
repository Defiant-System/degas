
class Viewport {
	
	constructor(editor) {
		const container = new UIPanel();
		this.container = container;
		
		container.setId( 'viewport' );
		container.setPosition( 'absolute' );

		//
		let pmremGenerator = null;

		const camera = editor.camera;
		const scene = editor.scene;
		const sceneHelpers = editor.sceneHelpers;
		let showSceneHelpers = true;

		const objects = [];
		// helpers
		const grid = new THREE.Group();
		this.grid = grid;

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
		const box = new THREE.Box3();

		const selectionBox = new THREE.Box3Helper( box );
		selectionBox.material.depthTest = false;
		selectionBox.material.transparent = true;
		selectionBox.visible = false;
		sceneHelpers.add( selectionBox );

		let objectPositionOnDown = null;
		let objectRotationOnDown = null;
		let objectScaleOnDown = null;

		//
		const transformControls = new TransformControls( camera, container.dom );
		transformControls.addEventListener( 'change', function () {
			const object = transformControls.object;
			if ( object !== undefined ) {
				box.setFromObject( object, true );
				const helper = editor.helpers[ object.id ];
				if ( helper !== undefined && helper.isSkeletonHelper !== true ) {
					helper.update();
				}
			}
			render();
		} );

		transformControls.addEventListener( 'mouseDown', function () {
			const object = transformControls.object;
			objectPositionOnDown = object.position.clone();
			objectRotationOnDown = object.rotation.clone();
			objectScaleOnDown = object.scale.clone();
			controls.enabled = false;
		} );

		transformControls.addEventListener( 'mouseUp', function () {
			const object = transformControls.object;
			if ( object !== undefined ) {
				switch ( transformControls.getMode() ) {
					case 'translate':
						if ( ! objectPositionOnDown.equals( object.position ) ) {
							editor.execute( new SetPositionCommand( editor, object, object.position, objectPositionOnDown ) );
						}
						break;
					case 'rotate':
						if ( ! objectRotationOnDown.equals( object.rotation ) ) {
							editor.execute( new SetRotationCommand( editor, object, object.rotation, objectRotationOnDown ) );
						}
						break;
					case 'scale':
						if ( ! objectScaleOnDown.equals( object.scale ) ) {
							editor.execute( new SetScaleCommand( editor, object, object.scale, objectScaleOnDown ) );
						}
						break;
				}
			}
			controls.enabled = true;
		} );

		sceneHelpers.add( transformControls );


		// object picking
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		// events
		function updateAspectRatio() {
			camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
			camera.updateProjectionMatrix();
		}

		function getIntersects( point, objects ) {
			mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
			raycaster.setFromCamera( mouse, camera );
			return raycaster.intersectObjects( objects )
				.filter( intersect => intersect.object.visible === true );
		}

		const onDownPosition = new THREE.Vector2();
		const onUpPosition = new THREE.Vector2();
		const onDoubleClickPosition = new THREE.Vector2();
		
		function getMousePosition( dom, x, y ) {
			const rect = dom.getBoundingClientRect();
			return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
		}
		
		function handleClick() {
			if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
				const intersects = getIntersects( onUpPosition, objects );
				if ( intersects.length > 0 ) {
					const object = intersects[ 0 ].object;
					if ( object.userData.object !== undefined ) {
						// helper
						editor.select( object.userData.object );
					} else {
						editor.select( object );
					}
				} else {
					editor.select( null );
				}
				render();
			}
		}
		
		function onMouseDown( event ) {
			// event.preventDefault();
			const array = getMousePosition( container.dom, event.clientX, event.clientY );
			onDownPosition.fromArray( array );
			document.addEventListener( 'mouseup', onMouseUp );
		}
		
		function onMouseUp( event ) {
			const array = getMousePosition( container.dom, event.clientX, event.clientY );
			onUpPosition.fromArray( array );
			handleClick();
			document.removeEventListener( 'mouseup', onMouseUp );
		}
		
		function onTouchStart( event ) {
			const touch = event.changedTouches[ 0 ];
			const array = getMousePosition( container.dom, touch.clientX, touch.clientY );
			onDownPosition.fromArray( array );
			document.addEventListener( 'touchend', onTouchEnd );
		}
		
		function onTouchEnd( event ) {
			const touch = event.changedTouches[ 0 ];
			const array = getMousePosition( container.dom, touch.clientX, touch.clientY );
			onUpPosition.fromArray( array );
			handleClick();
			document.removeEventListener( 'touchend', onTouchEnd );
		}
		
		function onDoubleClick( event ) {
			const array = getMousePosition( container.dom, event.clientX, event.clientY );
			onDoubleClickPosition.fromArray( array );
			const intersects = getIntersects( onDoubleClickPosition, objects );
			if ( intersects.length > 0 ) {
				const intersect = intersects[ 0 ];
			}
		}
		
		container.dom.addEventListener( 'mousedown', onMouseDown );
		container.dom.addEventListener( 'touchstart', onTouchStart );
		container.dom.addEventListener( 'dblclick', onDoubleClick );
		
		// controls need to be added *after* main logic,
		// otherwise controls.enabled doesn't work.
		const controls = new EditorControls( camera, container.dom );
		controls.center.set( 0, 0, 0 );
		
		controls.addEventListener( 'change', function () {
			render();
		} );
		
		viewHelper.controls = controls;

		// animations
		const clock = new THREE.Clock(); // only used for animations
		function animate() {
			const mixer = editor.mixer;
			const delta = clock.getDelta();
			let needsUpdate = false;
			if ( mixer.stats.actions.inUse > 0 ) {
				mixer.update( delta );
				needsUpdate = true;
			}
			if ( viewHelper.animating === true ) {
				viewHelper.update( delta );
				needsUpdate = true;
			}
			if ( vr.currentSession !== null ) {
				needsUpdate = true;
			}
			if ( needsUpdate === true ) render();
		}

		//
		let startTime = 0;
		let endTime = 0;
		function render() {
			startTime = performance.now();
			// Adding/removing grid to scene so materials with depthWrite false
			// don't render under the grid.
			scene.add( grid );
			renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
			renderer.render( scene, editor.viewportCamera );
			scene.remove( grid );
			if ( camera === editor.viewportCamera ) {
				renderer.autoClear = false;
				if ( showSceneHelpers === true ) renderer.render( sceneHelpers, camera );
				if ( vr.currentSession === null ) viewHelper.render( renderer );
				renderer.autoClear = true;
			}
			endTime = performance.now();
		}
	}

}
