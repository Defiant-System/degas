
import * as THREE from "./modules/threejs/build/three.module.js";

import { Loader } from './modules/threejs/editor/js/Loader.js';
import { ViewHelper } from './modules/threejs/editor/js/Viewport.ViewHelper.js';
import { ViewportInfo } from './modules/threejs/editor/js/Viewport.Info.js';
import { TransformControls } from './modules/threejs/examples/jsm/controls/TransformControls.js';
import { EditorControls } from './modules/threejs/editor/js/EditorControls.js';
import { UIPanel, UIDiv, UIText } from './modules/threejs/editor/js/libs/ui.js';


import { Config } from './classes/Config.js';
import { History } from './classes/History.js';
import { SetPositionCommand } from './classes/commands/SetPositionCommand.js';
import { SetRotationCommand } from './classes/commands/SetRotationCommand.js';
import { SetScaleCommand } from './classes/commands/SetScaleCommand.js';


module.exports = {
	THREE,
	History,
	Loader,
	ViewHelper,
	ViewportInfo,
	TransformControls,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	EditorControls,
	Config,
	UIPanel,
	UIDiv,
	UIText,
};
