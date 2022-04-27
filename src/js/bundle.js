
import * as THREE from "./modules/threejs/build/three.module.js";
import { Loader } from './modules/threejs/editor/js/Loader.js';
import { UIPanel, UIDiv, UIText } from './modules/threejs/editor/js/libs/ui.js';

import { Strings } from "./classes/Strings.js";
import { Config } from './classes/Config.js';
import { History } from './classes/History.js';
import { SetPositionCommand } from './classes/commands/SetPositionCommand.js';
import { SetRotationCommand } from './classes/commands/SetRotationCommand.js';
import { SetScaleCommand } from './classes/commands/SetScaleCommand.js';

import { VR } from './classes/Viewport.VR.js';
import { ViewportInfo } from './classes/Viewport.ViewportInfo.js';
import { RoomEnvironment } from './modules/threejs/examples/jsm/environments/RoomEnvironment.js';


import * as BufferGeometryUtils from "./modules/threejs/examples/jsm/utils/BufferGeometryUtils.js";
import { LineSegmentsGeometry } from "./modules/threejs/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineSegments2 } from "./modules/threejs/examples/jsm/lines/LineSegments2.js";
import { LineMaterial } from "./modules/threejs/examples/jsm/lines/LineMaterial.js";

import { ConditionalEdgesGeometry } from "./modules/conditional-lines/ConditionalEdgesGeometry.js";
import { ConditionalEdgesShader } from "./modules/conditional-lines/ConditionalEdgesShader.js";
import { ConditionalLineSegmentsGeometry } from "./modules/conditional-lines/ConditionalLineSegmentsGeometry.js";
// import { ConditionalLineMaterial } from "./modules/conditional-lines/ConditionalLineMaterial.js";



// custom THREE.js "dispose"
THREE_dispose = () => {
	delete window.__THREE__;
};


module.exports = {
	THREE,
	THREE_dispose,
	History,
	Loader,

	Strings,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	Config,
	UIPanel,
	UIDiv,
	UIText,

	VR,
	ViewportInfo,
	RoomEnvironment,

	BufferGeometryUtils,
	LineSegmentsGeometry,
	LineSegments2,
	LineMaterial,
	
	ConditionalEdgesGeometry,
	ConditionalEdgesShader,
	ConditionalLineSegmentsGeometry,
	// ConditionalLineMaterial,
};
