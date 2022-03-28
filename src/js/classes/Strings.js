
class Strings {
	
	constructor(config) {
		this.language = config.getKey( 'language' );

		this.values = {
			en: {
				'menubar/file': 'File',
				'menubar/file/new': 'New',
				'menubar/file/import': 'Import',
				'menubar/file/export/geometry': 'Export Geometry',
				'menubar/file/export/object': 'Export Object',
				'menubar/file/export/scene': 'Export Scene',
				'menubar/file/export/dae': 'Export DAE',
				'menubar/file/export/drc': 'Export DRC',
				'menubar/file/export/glb': 'Export GLB',
				'menubar/file/export/gltf': 'Export GLTF',
				'menubar/file/export/obj': 'Export OBJ',
				'menubar/file/export/ply': 'Export PLY',
				'menubar/file/export/ply_binary': 'Export PLY (Binary)',
				'menubar/file/export/stl': 'Export STL',
				'menubar/file/export/stl_binary': 'Export STL (Binary)',
				'menubar/file/export/usdz': 'Export USDZ',
				'menubar/file/publish': 'Publish',

				'menubar/edit': 'Edit',
				'menubar/edit/undo': 'Undo (Ctrl+Z)',
				'menubar/edit/redo': 'Redo (Ctrl+Shift+Z)',
				'menubar/edit/clear_history': 'Clear History',
				'menubar/edit/center': 'Center',
				'menubar/edit/clone': 'Clone',
				'menubar/edit/delete': 'Delete (Del)',
				'menubar/edit/fixcolormaps': 'Fix Color Maps',

				'menubar/add': 'Add',
				'menubar/add/group': 'Group',
				'menubar/add/plane': 'Plane',
				'menubar/add/box': 'Box',
				'menubar/add/circle': 'Circle',
				'menubar/add/cylinder': 'Cylinder',
				'menubar/add/ring': 'Ring',
				'menubar/add/sphere': 'Sphere',
				'menubar/add/dodecahedron': 'Dodecahedron',
				'menubar/add/icosahedron': 'Icosahedron',
				'menubar/add/octahedron': 'Octahedron',
				'menubar/add/tetrahedron': 'Tetrahedron',
				'menubar/add/torus': 'Torus',
				'menubar/add/tube': 'Tube',
				'menubar/add/torusknot': 'TorusKnot',
				'menubar/add/lathe': 'Lathe',
				'menubar/add/sprite': 'Sprite',
				'menubar/add/pointlight': 'PointLight',
				'menubar/add/spotlight': 'SpotLight',
				'menubar/add/directionallight': 'DirectionalLight',
				'menubar/add/hemispherelight': 'HemisphereLight',
				'menubar/add/ambientlight': 'AmbientLight',
				'menubar/add/perspectivecamera': 'PerspectiveCamera',
				'menubar/add/orthographiccamera': 'OrthographicCamera',

				'menubar/status/autosave': 'autosave',

				'menubar/play': 'Play',
				'menubar/play/stop': 'Stop',
				'menubar/play/play': 'Play',

				'menubar/examples': 'Examples',
				'menubar/examples/Arkanoid': 'Arkanoid',
				'menubar/examples/Camera': 'Camera',
				'menubar/examples/Particles': 'Particles',
				'menubar/examples/Pong': 'Pong',
				'menubar/examples/Shaders': 'Shaders',

				'menubar/view': 'View',
				'menubar/view/fullscreen': 'Fullscreen',

				'menubar/help': 'Help',
				'menubar/help/source_code': 'Source Code',
				'menubar/help/icons': 'Icon Pack',
				'menubar/help/about': 'About',
				'menubar/help/manual': 'Manual',

				'sidebar/animations': 'Animations',
				'sidebar/animations/play': 'Play',
				'sidebar/animations/stop': 'Stop',
				'sidebar/animations/timescale': 'Time Scale',

				'sidebar/scene': 'Scene',
				'sidebar/scene/background': 'Background',
				'sidebar/scene/environment': 'Environment',
				'sidebar/scene/fog': 'Fog',

				'sidebar/properties/object': 'Object',
				'sidebar/properties/geometry': 'Geometry',
				'sidebar/properties/material': 'Material',
				'sidebar/properties/script': 'Script',

				'sidebar/object/type': 'Type',
				'sidebar/object/new': 'New',
				'sidebar/object/uuid': 'UUID',
				'sidebar/object/name': 'Name',
				'sidebar/object/position': 'Position',
				'sidebar/object/rotation': 'Rotation',
				'sidebar/object/scale': 'Scale',
				'sidebar/object/fov': 'Fov',
				'sidebar/object/left': 'Left',
				'sidebar/object/right': 'Right',
				'sidebar/object/top': 'Top',
				'sidebar/object/bottom': 'Bottom',
				'sidebar/object/near': 'Near',
				'sidebar/object/far': 'Far',
				'sidebar/object/intensity': 'Intensity',
				'sidebar/object/color': 'Color',
				'sidebar/object/groundcolor': 'Ground Color',
				'sidebar/object/distance': 'Distance',
				'sidebar/object/angle': 'Angle',
				'sidebar/object/penumbra': 'Penumbra',
				'sidebar/object/decay': 'Decay',
				'sidebar/object/shadow': 'Shadow',
				'sidebar/object/shadowBias': 'Shadow Bias',
				'sidebar/object/shadowNormalBias': 'Shadow Normal Bias',
				'sidebar/object/shadowRadius': 'Shadow Radius',
				'sidebar/object/cast': 'cast',
				'sidebar/object/receive': 'receive',
				'sidebar/object/visible': 'Visible',
				'sidebar/object/frustumcull': 'Frustum Cull',
				'sidebar/object/renderorder': 'Render Order',
				'sidebar/object/userdata': 'User data',

				'sidebar/geometry/type': 'Type',
				'sidebar/geometry/new': 'New',
				'sidebar/geometry/uuid': 'UUID',
				'sidebar/geometry/name': 'Name',
				'sidebar/geometry/bounds': 'Bounds',
				'sidebar/geometry/show_vertex_normals': 'Show Vertex Normals',

				'sidebar/geometry/box_geometry/width': 'Width',
				'sidebar/geometry/box_geometry/height': 'Height',
				'sidebar/geometry/box_geometry/depth': 'Depth',
				'sidebar/geometry/box_geometry/widthseg': 'Width Seg',
				'sidebar/geometry/box_geometry/heightseg': 'Height Seg',
				'sidebar/geometry/box_geometry/depthseg': 'Depth Seg',

				'sidebar/geometry/buffer_geometry/attributes': 'Attributes',
				'sidebar/geometry/buffer_geometry/index': 'index',

				'sidebar/geometry/circle_geometry/radius': 'Radius',
				'sidebar/geometry/circle_geometry/segments': 'Segments',
				'sidebar/geometry/circle_geometry/thetastart': 'Theta start',
				'sidebar/geometry/circle_geometry/thetalength': 'Theta length',

				'sidebar/geometry/cylinder_geometry/radiustop': 'Radius top',
				'sidebar/geometry/cylinder_geometry/radiusbottom': 'Radius bottom',
				'sidebar/geometry/cylinder_geometry/height': 'Height',
				'sidebar/geometry/cylinder_geometry/radialsegments': 'Radial segments',
				'sidebar/geometry/cylinder_geometry/heightsegments': 'Height segments',
				'sidebar/geometry/cylinder_geometry/openended': 'Open ended',

				'sidebar/geometry/extrude_geometry/curveSegments': 'Curve Segments',
				'sidebar/geometry/extrude_geometry/steps': 'Steps',
				'sidebar/geometry/extrude_geometry/depth': 'Depth',
				'sidebar/geometry/extrude_geometry/bevelEnabled': 'Bevel?',
				'sidebar/geometry/extrude_geometry/bevelThickness': 'Thickness',
				'sidebar/geometry/extrude_geometry/bevelSize': 'Size',
				'sidebar/geometry/extrude_geometry/bevelOffset': 'Offset',
				'sidebar/geometry/extrude_geometry/bevelSegments': 'Segments',
				'sidebar/geometry/extrude_geometry/shape': 'Convert to Shape',

				'sidebar/geometry/dodecahedron_geometry/radius': 'Radius',
				'sidebar/geometry/dodecahedron_geometry/detail': 'Detail',

				'sidebar/geometry/icosahedron_geometry/radius': 'Radius',
				'sidebar/geometry/icosahedron_geometry/detail': 'Detail',

				'sidebar/geometry/octahedron_geometry/radius': 'Radius',
				'sidebar/geometry/octahedron_geometry/detail': 'Detail',

				'sidebar/geometry/tetrahedron_geometry/radius': 'Radius',
				'sidebar/geometry/tetrahedron_geometry/detail': 'Detail',

				'sidebar/geometry/lathe_geometry/segments': 'Segments',
				'sidebar/geometry/lathe_geometry/phistart': 'Phi start (°)',
				'sidebar/geometry/lathe_geometry/philength': 'Phi length (°)',
				'sidebar/geometry/lathe_geometry/points': 'Points',

				'sidebar/geometry/plane_geometry/width': 'Width',
				'sidebar/geometry/plane_geometry/height': 'Height',
				'sidebar/geometry/plane_geometry/widthsegments': 'Width segments',
				'sidebar/geometry/plane_geometry/heightsegments': 'Height segments',

				'sidebar/geometry/ring_geometry/innerRadius': 'Inner radius',
				'sidebar/geometry/ring_geometry/outerRadius': 'Outer radius',
				'sidebar/geometry/ring_geometry/thetaSegments': 'Theta segments',
				'sidebar/geometry/ring_geometry/phiSegments': 'Phi segments',
				'sidebar/geometry/ring_geometry/thetastart': 'Theta start',
				'sidebar/geometry/ring_geometry/thetalength': 'Theta length',

				'sidebar/geometry/shape_geometry/curveSegments': 'Curve Segments',
				'sidebar/geometry/shape_geometry/extrude': 'Extrude',

				'sidebar/geometry/sphere_geometry/radius': 'Radius',
				'sidebar/geometry/sphere_geometry/widthsegments': 'Width segments',
				'sidebar/geometry/sphere_geometry/heightsegments': 'Height segments',
				'sidebar/geometry/sphere_geometry/phistart': 'Phi start',
				'sidebar/geometry/sphere_geometry/philength': 'Phi length',
				'sidebar/geometry/sphere_geometry/thetastart': 'Theta start',
				'sidebar/geometry/sphere_geometry/thetalength': 'Theta length',

				'sidebar/geometry/torus_geometry/radius': 'Radius',
				'sidebar/geometry/torus_geometry/tube': 'Tube',
				'sidebar/geometry/torus_geometry/radialsegments': 'Radial segments',
				'sidebar/geometry/torus_geometry/tubularsegments': 'Tubular segments',
				'sidebar/geometry/torus_geometry/arc': 'Arc',

				'sidebar/geometry/torusKnot_geometry/radius': 'Radius',
				'sidebar/geometry/torusKnot_geometry/tube': 'Tube',
				'sidebar/geometry/torusKnot_geometry/tubularsegments': 'Tubular segments',
				'sidebar/geometry/torusKnot_geometry/radialsegments': 'Radial segments',
				'sidebar/geometry/torusKnot_geometry/p': 'P',
				'sidebar/geometry/torusKnot_geometry/q': 'Q',

				'sidebar/geometry/tube_geometry/path': 'Path',
				'sidebar/geometry/tube_geometry/radius': 'Radius',
				'sidebar/geometry/tube_geometry/tube': 'Tube',
				'sidebar/geometry/tube_geometry/tubularsegments': 'Tubular segments',
				'sidebar/geometry/tube_geometry/radialsegments': 'Radial segments',
				'sidebar/geometry/tube_geometry/closed': 'Closed',
				'sidebar/geometry/tube_geometry/curvetype': 'Curve Type',
				'sidebar/geometry/tube_geometry/tension': 'Tension',

				'sidebar/material/new': 'New',
				'sidebar/material/copy': 'Copy',
				'sidebar/material/paste': 'Paste',
				'sidebar/material/slot': 'Slot',
				'sidebar/material/type': 'Type',
				'sidebar/material/uuid': 'UUID',
				'sidebar/material/name': 'Name',
				'sidebar/material/program': 'Program',
				'sidebar/material/info': 'Info',
				'sidebar/material/vertex': 'Vert',
				'sidebar/material/fragment': 'Frag',
				'sidebar/material/color': 'Color',
				'sidebar/material/depthPacking': 'Depth Packing',
				'sidebar/material/roughness': 'Roughness',
				'sidebar/material/metalness': 'Metalness',
				'sidebar/material/reflectivity': 'Reflectivity',
				'sidebar/material/emissive': 'Emissive',
				'sidebar/material/specular': 'Specular',
				'sidebar/material/shininess': 'Shininess',
				'sidebar/material/clearcoat': 'Clearcoat',
				'sidebar/material/clearcoatroughness': 'Clearcoat Roughness',
				'sidebar/material/transmission': 'Transmission',
				'sidebar/material/attenuationDistance': 'Attenuation Distance',
				'sidebar/material/attenuationColor': 'Attenuation Color',
				'sidebar/material/thickness': 'Thickness',
				'sidebar/material/vertexcolors': 'Vertex Colors',
				'sidebar/material/matcap': 'Matcap',
				'sidebar/material/map': 'Map',
				'sidebar/material/alphamap': 'Alpha Map',
				'sidebar/material/bumpmap': 'Bump Map',
				'sidebar/material/normalmap': 'Normal Map',
				'sidebar/material/clearcoatnormalmap': 'Clearcoat Normal Map',
				'sidebar/material/displacementmap': 'Displace Map',
				'sidebar/material/roughnessmap': 'Rough. Map',
				'sidebar/material/metalnessmap': 'Metal. Map',
				'sidebar/material/specularmap': 'Specular Map',
				'sidebar/material/envmap': 'Env Map',
				'sidebar/material/lightmap': 'Light Map',
				'sidebar/material/aomap': 'AO Map',
				'sidebar/material/emissivemap': 'Emissive Map',
				'sidebar/material/gradientmap': 'Gradient Map',
				'sidebar/material/side': 'Side',
				'sidebar/material/size': 'Size',
				'sidebar/material/sizeAttenuation': 'Size Attenuation',
				'sidebar/material/flatShading': 'Flat Shading',
				'sidebar/material/blending': 'Blending',
				'sidebar/material/opacity': 'Opacity',
				'sidebar/material/transparent': 'Transparent',
				'sidebar/material/alphatest': 'Alpha Test',
				'sidebar/material/depthtest': 'Depth Test',
				'sidebar/material/depthwrite': 'Depth Write',
				'sidebar/material/wireframe': 'Wireframe',

				'sidebar/script': 'Script',
				'sidebar/script/new': 'New',
				'sidebar/script/edit': 'Edit',
				'sidebar/script/remove': 'Remove',

				'sidebar/project': 'Project',
				'sidebar/project/title': 'Title',
				'sidebar/project/editable': 'Editable',
				'sidebar/project/vr': 'VR',
				'sidebar/project/renderer': 'Renderer',
				'sidebar/project/antialias': 'Antialias',
				'sidebar/project/shadows': 'Shadows',
				'sidebar/project/physicallyCorrectLights': 'Physical lights',
				'sidebar/project/toneMapping': 'Tone mapping',
				'sidebar/project/materials': 'Materials',
				'sidebar/project/Assign': 'Assign',

				'sidebar/project/video': 'Video',
				'sidebar/project/resolution': 'Resolution',
				'sidebar/project/duration': 'Duration',
				'sidebar/project/render': 'Render',

				'sidebar/settings': 'Settings',
				'sidebar/settings/language': 'Language',

				'sidebar/settings/shortcuts': 'Shortcuts',
				'sidebar/settings/shortcuts/translate': 'Translate',
				'sidebar/settings/shortcuts/rotate': 'Rotate',
				'sidebar/settings/shortcuts/scale': 'Scale',
				'sidebar/settings/shortcuts/undo': 'Undo',
				'sidebar/settings/shortcuts/focus': 'Focus',

				'sidebar/settings/viewport': 'Viewport',
				'sidebar/settings/viewport/grid': 'Grid',
				'sidebar/settings/viewport/helpers': 'Helpers',

				'sidebar/history': 'History',
				'sidebar/history/persistent': 'persistent',

				'toolbar/translate': 'Translate',
				'toolbar/rotate': 'Rotate',
				'toolbar/scale': 'Scale',
				'toolbar/local': 'Local',

				'viewport/info/objects': 'Objects',
				'viewport/info/vertices': 'Vertices',
				'viewport/info/triangles': 'Triangles',
				'viewport/info/frametime': 'Frametime'

			}
		};
	}

	getKey( key ) {
		return this.values[ this.language ][ key ] || '???';
	}

}

// export { Strings };
