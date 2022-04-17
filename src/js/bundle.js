
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
};
