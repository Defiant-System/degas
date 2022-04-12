
class Editor {
	
	constructor() {
		this.config = new Config();
		this.history = new History( this );
		// this.storage = new Storage();
		this.strings = new Strings( this.config );

		this.loader = new Loader( this );
		this.camera = _DEFAULT_CAMERA.clone();

		this.scene = new THREE.Scene();
		this.scene.name = 'Scene';
		this.scene.background = new THREE.Color( 0x333333 );
		this.sceneHelpers = new THREE.Scene();

		this.object = {};
		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.materialsRefCounter = new Map(); // tracks how often is a material used by a 3D object
		this.mixer = new THREE.AnimationMixer( this.scene );

		this.selected = null;
		this.helpers = {};
		this.cameras = {};
		this.viewportCamera = this.camera;

		this.addCamera( this.camera );
	}

	setScene( scene ) {
		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;
		this.scene.background = scene.background;
		this.scene.environment = scene.environment;
		this.scene.fog = scene.fog;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );
		// avoid render per object
		while ( scene.children.length > 0 ) {
			this.addObject( scene.children[ 0 ] );
		}
	}

	addObject( object, parent, index ) {
		var scope = this;
		object.traverse( function ( child ) {
			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );
			scope.addCamera( child );
			scope.addHelper( child );
		} );
		if ( parent === undefined ) {
			this.scene.add( object );
		} else {
			parent.children.splice( index, 0, object );
			object.parent = parent;
		}
	}

	moveObject( object, parent, before ) {
		if ( parent === undefined ) {
			parent = this.scene;
		}
		parent.add( object );

		// sort children array
		if ( before !== undefined ) {
			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();
		}
	}

	nameObject( object, name ) {
		object.name = name;
	}

	removeObject( object ) {
		if ( object.parent === null ) return; // avoid deleting the camera or scene
		var scope = this;
		object.traverse( function ( child ) {
			scope.removeCamera( child );
			scope.removeHelper( child );
			if ( child.material !== undefined ) scope.removeMaterial( child.material );
		} );
		object.parent.remove( object );
	}

	addGeometry( geometry ) {
		this.geometries[ geometry.uuid ] = geometry;
	}

	setGeometryName( geometry, name ) {
		geometry.name = name;
	}

	addMaterial( material ) {
		if ( Array.isArray( material ) ) {
			for ( var i = 0, l = material.length; i < l; i ++ ) {
				this.addMaterialToRefCounter( material[ i ] );
			}
		} else {
			this.addMaterialToRefCounter( material );
		}
	}

	addMaterialToRefCounter( material ) {
		var materialsRefCounter = this.materialsRefCounter;
		var count = materialsRefCounter.get( material );
		if ( count === undefined ) {
			materialsRefCounter.set( material, 1 );
			this.materials[ material.uuid ] = material;
		} else {
			count ++;
			materialsRefCounter.set( material, count );
		}
	}

	removeMaterial( material ) {
		if ( Array.isArray( material ) ) {
			for ( var i = 0, l = material.length; i < l; i ++ ) {
				this.removeMaterialFromRefCounter( material[ i ] );
			}
		} else {
			this.removeMaterialFromRefCounter( material );
		}
	}

	removeMaterialFromRefCounter( material ) {
		var materialsRefCounter = this.materialsRefCounter;
		var count = materialsRefCounter.get( material );
		count --;
		if ( count === 0 ) {
			materialsRefCounter.delete( material );
			delete this.materials[ material.uuid ];
		} else {
			materialsRefCounter.set( material, count );
		}
	}

	getMaterialById( id ) {
		var material;
		var materials = Object.values( this.materials );
		for ( var i = 0; i < materials.length; i ++ ) {
			if ( materials[ i ].id === id ) {
				material = materials[ i ];
				break;
			}
		}
		return material;
	}

	setMaterialName( material, name ) {
		material.name = name;
	}

	addTexture( texture ) {
		this.textures[ texture.uuid ] = texture;
	}

	addCamera( camera ) {
		if ( camera.isCamera ) {
			this.cameras[ camera.uuid ] = camera;
		}
	}

	removeCamera( camera ) {
		if ( this.cameras[ camera.uuid ] !== undefined ) {
			delete this.cameras[ camera.uuid ];
		}
	}

	addHelper() {
		var geometry = new THREE.SphereGeometry( 2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );
		return function ( object, helper ) {
			if ( helper === undefined ) {
				if ( object.isCamera ) {
					helper = new THREE.CameraHelper( object );
				} else if ( object.isPointLight ) {
					helper = new THREE.PointLightHelper( object, 1 );
				} else if ( object.isDirectionalLight ) {
					helper = new THREE.DirectionalLightHelper( object, 1 );
				} else if ( object.isSpotLight ) {
					helper = new THREE.SpotLightHelper( object );
				} else if ( object.isHemisphereLight ) {
					helper = new THREE.HemisphereLightHelper( object, 1 );
				} else if ( object.isSkinnedMesh ) {
					helper = new THREE.SkeletonHelper( object.skeleton.bones[ 0 ] );
				} else if ( object.isBone === true && object.parent?.isBone !== true ) {
					helper = new THREE.SkeletonHelper( object );
				} else {
					// no helper for this object type
					return;
				}
				var picker = new THREE.Mesh( geometry, material );
				picker.name = 'picker';
				picker.userData.object = object;
				helper.add( picker );
			}
			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;
		};
	}

	removeHelper( object ) {
		if ( this.helpers[ object.id ] !== undefined ) {
			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );
			delete this.helpers[ object.id ];
		}
	}

	addScript( object, script ) {
		if ( this.scripts[ object.uuid ] === undefined ) {
			this.scripts[ object.uuid ] = [];
		}
		this.scripts[ object.uuid ].push( script );
	}

	removeScript( object, script ) {
		if ( this.scripts[ object.uuid ] === undefined ) return;
		var index = this.scripts[ object.uuid ].indexOf( script );
		if ( index !== - 1 ) {
			this.scripts[ object.uuid ].splice( index, 1 );
		}
	}

	getObjectMaterial( object, slot ) {
		var material = object.material;
		if ( Array.isArray( material ) && slot !== undefined ) {
			material = material[ slot ];
		}
		return material;
	}

	setObjectMaterial( object, slot, newMaterial ) {
		if ( Array.isArray( object.material ) && slot !== undefined ) {
			object.material[ slot ] = newMaterial;
		} else {
			object.material = newMaterial;
		}
	}

	setViewportCamera( uuid ) {
		this.viewportCamera = this.cameras[ uuid ];
	}

	select( object ) {
		if ( this.selected === object ) return;
		var uuid = null;
		if ( object !== null ) {
			uuid = object.uuid;
		}

		if ( object && object.type === "LineSegments" ) {
			object = object.parent;
		}

		if (this.selected && this.selected.material) {
			let material = this.selected.material;
			// unhighlight selected, if any
			if (!material.length) this.selected.material.color.setHex(Settings.wireframe.default);
		}

		this.selected = object;
		this.config.setKey( 'selected', uuid );
		
		if (this.selected && this.selected.material) {
			let material = this.selected.material;
			if (!material.length) this.selected.material.color.setHex(Settings.wireframe.highlight);
		}

		viewport.selectObject(object);
	}

	selectById( id ) {
		if ( id === this.camera.id ) {
			this.select( this.camera );
			return;
		}
		this.select( this.scene.getObjectById( id ) );
	}

	selectByUuid( uuid ) {
		var scope = this;
		this.scene.traverse( function ( child ) {
			if ( child.uuid === uuid ) {
				scope.select( child );
			}
		} );
	}

	deselect() {
		this.select( null );
	}

	focus( object ) {
		if ( object !== undefined ) {
		}
	}

	focusById( id ) {
		this.focus( this.scene.getObjectById( id ) );
	}

	clear() {
		this.history.clear();
		// this.storage.clear();
		this.camera.copy( _DEFAULT_CAMERA );
		this.scene.name = 'Scene';
		this.scene.userData = {};
		// this.scene.background = null;
		this.scene.environment = null;
		this.scene.fog = null;

		var objects = this.scene.children;
		while ( objects.length > 0 ) {
			this.removeObject( objects[ 0 ] );
		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};
		this.materialsRefCounter.clear();
		this.animations = {};
		this.mixer.stopAllAction();
		this.deselect();
	}

	async fromJSON( json ) {
		var loader = new THREE.ObjectLoader();
		var camera = await loader.parseAsync( json.camera );
		this.camera.copy( camera );
		this.history.fromJSON( json.history );
		this.scripts = json.scripts;
		this.setScene( await loader.parseAsync( json.scene ) );
	}

	toJSON() {
		// scripts clean up
		var scene = this.scene;
		var scripts = this.scripts;
		for ( var key in scripts ) {
			var script = scripts[ key ];
			if ( script.length === 0 || scene.getObjectByProperty( 'uuid', key ) === undefined ) {
				delete scripts[ key ];
			}
		}
		//
		return {
			metadata: {},
			project: {
				shadows: this.config.getKey( 'project/renderer/shadows' ),
				shadowType: this.config.getKey( 'project/renderer/shadowType' ),
				vr: this.config.getKey( 'project/vr' ),
				physicallyCorrectLights: this.config.getKey( 'project/renderer/physicallyCorrectLights' ),
				toneMapping: this.config.getKey( 'project/renderer/toneMapping' ),
				toneMappingExposure: this.config.getKey( 'project/renderer/toneMappingExposure' )
			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts,
			history: this.history.toJSON()

		};
	}

	objectByUuid( uuid ) {
		return this.scene.getObjectByProperty( 'uuid', uuid, true );
	}

	execute( cmd, optionalName ) {
		this.history.execute( cmd, optionalName );
	}

	undo() {
		this.history.undo();
	}

	redo() {
		this.history.redo();
	}

}
