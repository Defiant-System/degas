
class Viewport {
	
	constructor(editor) {
		const Self = this;

		const container = new UIPanel();
		container.setId( 'viewport' );
		container.setPosition( 'absolute' );
		//
		let viewInfo = new ViewportInfo( editor );
		container.add( viewInfo.container );

		//
		const camera = editor.camera;
		const scene = editor.scene;
		const sceneHelpers = editor.sceneHelpers;
		let showSceneHelpers = true;

		// helpers
		const grid = new THREE.Group();
		
		const grid1 = new THREE.GridHelper( 30, 30, 0x0d0d0d );
		grid1.material.color.setHex( 0x0d0d0d );
		grid1.material.vertexColors = false;
		grid.add( grid1 );

		const grid2 = new THREE.GridHelper( 30, 6, 0x171717 );
		grid2.material.color.setHex( 0x171717 );
		grid2.material.depthFunc = THREE.AlwaysDepth;
		grid2.material.vertexColors = false;
		grid.add( grid2 );

		const selection = new Selection();
		const viewHelper = new ViewHelper( camera, container );
		const vr = new VR( editor );
		const box = new THREE.Box3();
		const selectionBox = new THREE.Box3Helper( box, Settings.wireframe.highlight );

		selectionBox.material.depthTest = THREE.AlwaysDepth;
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
		raycaster.params.Line.threshold = 0.1;

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
				const intersects = getIntersects( onUpPosition, scene.children );
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
		
		function onDoubleClick( event ) {
			const array = getMousePosition( container.dom, event.clientX, event.clientY );
			onDoubleClickPosition.fromArray( array );
			const intersects = getIntersects( onDoubleClickPosition, scene.children );
			if ( intersects.length > 0 ) {
				let object = intersects[ 0 ].object;
				let p1 = object.position.clone().add( new THREE.Vector3(3, 3, 6) ),
					p2 = object.position.clone();
				// update camera position & lookAt
				camera.position.set( ...p1.toArray() );
				camera.lookAt(p2);
				// update controls center
				controls.center.set( ...p2.toArray() );
				
				render();
			}
		}
		
		container.dom.addEventListener( 'mousedown', onMouseDown );
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
		let clock = new THREE.Clock(); // only used for animations
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
			} else {
				// reset animation clock
				clock = new THREE.Clock();
			}
			if ( vr.currentSession !== null ) {
				needsUpdate = true;
			}
			if ( needsUpdate === true ) {
				render();
				requestAnimationFrame(animate);
			}
		}

		//
		let startTime = 0;
		let endTime = 0;
		function render() {
			startTime = performance.now();
			// Adding/removing grid to scene so materials with depthWrite false
			// don't render under the grid.
			scene.add( grid );
			// renderer.setClearColor( 0x333333 );
			renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
			renderer.render( scene, editor.viewportCamera );
			
			scene.remove( grid );
			if ( camera === editor.viewportCamera ) {
				renderer.autoClear = false;
				if ( showSceneHelpers === true ) renderer.render( sceneHelpers, camera );
				if ( vr.currentSession === null ) viewHelper.render( renderer );
				// if ( vr.currentSession === null ) console.log(vr.currentSession);
				renderer.autoClear = true;
			}
			endTime = performance.now();

			Self.viewInfo.updateFrametime( endTime - startTime );
		}

		function resize() {
			let width = container.dom.offsetWidth,
				height = container.dom.offsetHeight;
			updateAspectRatio();
			renderer.setSize( width, height );
			render();
		}

		function toggleSceneHelpers(showHelpers) {
			showSceneHelpers = showHelpers;
		}

		// public properties / methods
		this.resize = resize;
		this.render = render;
		this.animate = animate;
		this.viewInfo = viewInfo;
		this.container = container;
		this.viewHelper = viewHelper;
		this.toggleSceneHelpers = toggleSceneHelpers;
		this.grid = grid;

		this.selectObject = function(object) {
			selectionBox.visible = false;
			transformControls.detach();

			if ( object !== null && object !== scene && object !== camera ) {
				box.setFromObject( object, true );
				if ( box.isEmpty() === false ) {
					// TODO: replace with OUTLINE
					// selectionBox.visible = true;
				}
				transformControls.attach( object );
			}

			selection.add(object);

			render();
		};

		this.transformControlsSetMode = function(mode) {
			transformControls.visible = true;
			transformControls.setMode( mode );
		};

		this.editorControlsSetState = function(state) {
			controls.setState( state );
		};

	}

}
