
function EditorControls( object, domElement ) {

	// API
	this.enabled = true;
	this.center = new THREE.Vector3();
	this.panSpeed = 0.002;
	this.zoomSpeed = 0.1;
	this.rotationSpeed = 0.005;
	this._mousedown = false;

	// internals
	var scope = this;
	var vector = new THREE.Vector3();
	var delta = new THREE.Vector3();
	var box = new THREE.Box3();
	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.ROTATE;
	var center = this.center;
	var normalMatrix = new THREE.Matrix3();
	var pointer = new THREE.Vector2();
	var pointerOld = new THREE.Vector2();
	var spherical = new THREE.Spherical();
	var sphere = new THREE.Sphere();

	// events
	var changeEvent = { type: 'change' };

	this.focus = function ( target ) {
		var distance;
		box.setFromObject( target );
		if ( box.isEmpty() === false ) {
			box.getCenter( center );
			distance = box.getBoundingSphere( sphere ).radius;
		} else {
			// Focusing on an Group, AmbientLight, etc
			center.setFromMatrixPosition( target.matrixWorld );
			distance = 0.1;
		}
		delta.set( 0, 0, 1 );
		delta.applyQuaternion( object.quaternion );
		delta.multiplyScalar( distance * 4 );
		object.position.copy( center ).add( delta );
		scope.dispatchEvent( changeEvent );
	};

	this.pan = function ( delta ) {
		var distance = object.position.distanceTo( center );
		delta.multiplyScalar( distance * scope.panSpeed );
		delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );
		object.position.add( delta );
		center.add( delta );
		scope.dispatchEvent( changeEvent );
	};

	this.zoom = function ( delta ) {
		var distance = object.position.distanceTo( center );
		delta.multiplyScalar( distance * scope.zoomSpeed * .1 );
		if ( delta.length() > distance ) return;
		delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );
		object.position.add( delta );
		scope.dispatchEvent( changeEvent );
	};

	this.rotate = function ( delta ) {
		vector.copy( object.position ).sub( center );
		spherical.setFromVector3( vector );
		spherical.theta += delta.x * scope.rotationSpeed;
		spherical.phi += delta.y * scope.rotationSpeed;
		spherical.makeSafe();
		vector.setFromSpherical( spherical );
		object.position.copy( center ).add( vector );
		object.lookAt( center );
		scope.dispatchEvent( changeEvent );
	};

	//
	function onPointerDown( event ) {
		if ( scope.enabled === false ) return;
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				onMouseDown( event );
				break;
		}
		domElement.ownerDocument.addEventListener( 'pointermove', onPointerMove );
		domElement.ownerDocument.addEventListener( 'pointerup', onPointerUp );
	}

	function onPointerMove( event ) {
		if ( scope.enabled === false ) return;
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				onMouseMove( event );
				break;
		}
	}

	function onPointerUp( event ) {
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				onMouseUp();
				break;
		}
		domElement.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
		domElement.ownerDocument.removeEventListener( 'pointerup', onPointerUp );
	}

	// mouse
	function onMouseDown( event ) {
		// if ( event.button === 0 ) {
		// 	state = STATE.ROTATE;
		// } else if ( event.button === 1 ) {
		// 	state = STATE.ZOOM;
		// } else if ( event.button === 2 ) {
		// 	state = STATE.PAN;
		// }
		scope._mousedown = true;
		pointerOld.set( event.clientX, event.clientY );
	}

	function onMouseMove( event ) {
		pointer.set( event.clientX, event.clientY );
		var movementX = pointer.x - pointerOld.x;
		var movementY = pointer.y - pointerOld.y;
		if ( state === STATE.ROTATE ) {
			scope.rotate( delta.set( - movementX, - movementY, 0 ) );
		} else if ( state === STATE.ZOOM ) {
			scope.zoom( delta.set( 0, 0, movementY ) );
		} else if ( state === STATE.PAN ) {
			scope.pan( delta.set( - movementX, movementY, 0 ) );
		}
		pointerOld.set( event.clientX, event.clientY );
	}

	function onMouseUp() {
		// state = STATE.NONE;
		scope._mousedown = false;
	}

	/*
	function onMouseWheel( event ) {
		if ( scope.enabled === false ) return;
		event.preventDefault();
		// Normalize deltaY due to https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
		scope.zoom( delta.set( 0, 0, event.deltaY > 0 ? 1 : - 1 ) );
	}

	function contextmenu( event ) {
		event.preventDefault();
	}
	*/

	this.setState = function ( name ) {
		state = STATE[name];
	}

	this.dispose = function () {
		// domElement.removeEventListener( 'contextmenu', contextmenu );
		// domElement.removeEventListener( 'dblclick', onMouseUp );
		// domElement.removeEventListener( 'wheel', onMouseWheel );
		domElement.removeEventListener( 'pointerdown', onPointerDown );
	};

	// domElement.addEventListener( 'contextmenu', contextmenu );
	// domElement.addEventListener( 'dblclick', onMouseUp );
	// domElement.addEventListener( 'wheel', onMouseWheel );
	domElement.addEventListener( 'pointerdown', onPointerDown );
	
}

EditorControls.prototype = Object.create( THREE.EventDispatcher.prototype );
EditorControls.prototype.constructor = EditorControls;

export { EditorControls };
