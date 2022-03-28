
class ViewportInfo {

	constructor(editor) {
		const container = new UIPanel();
		container.setId( 'viewInfo' );

		this.objectsText = new UIText( '0' ).setClass( 'item-value' );
		this.verticesText = new UIText( '0' ).setClass( 'item-value' );
		this.trianglesText = new UIText( '0' ).setClass( 'item-value' );
		this.frametimeText = new UIText( '0' ).setClass( 'item-value' );

		let row = new UIDiv();
		row.add( new UIText( editor.strings.getKey( 'viewport/info/objects' ) ), this.objectsText );
		container.add( row );

		row = new UIDiv();
		row.add( new UIText( editor.strings.getKey( 'viewport/info/vertices' ) ), this.verticesText );
		container.add( row );

		row = new UIDiv();
		row.add( new UIText( editor.strings.getKey( 'viewport/info/triangles' ) ), this.trianglesText );
		container.add( row );

		row = new UIDiv();
		row.add( new UIText( editor.strings.getKey( 'viewport/info/frametime' ) ), this.frametimeText );
		container.add( row );
		
		this.container = container;
	}

	update() {
		const scene = editor.scene;
		let objects = 0, vertices = 0, triangles = 0;
		for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
			const object = scene.children[ i ];
			object.traverseVisible( function ( object ) {
				objects ++;
				if ( object.isMesh ) {
					const geometry = object.geometry;
					vertices += geometry.attributes.position.count;
					if ( geometry.index !== null ) {
						triangles += geometry.index.count / 3;
					} else {
						triangles += geometry.attributes.position.count / 3;
					}
				}
			} );
		}
		this.objectsText.setValue( objects.format() );
		this.verticesText.setValue( vertices.format() );
		this.trianglesText.setValue( triangles.format() );
	}

	updateFrametime( frametime ) {
		this.frametimeText.setValue( Number( frametime ).toFixed( 2 ) + ' ms' );
	}

}

// export { ViewportInfo };
