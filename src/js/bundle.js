
import * as THREE from "./modules/threejs/build/three.module.js";
import { Loader } from './modules/threejs/editor/js/Loader.js';
import { UIPanel, UIDiv, UIText } from './modules/threejs/editor/js/libs/ui.js';

import { EffectComposer } from './modules/threejs/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './modules/threejs/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './modules/threejs/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './modules/threejs/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './modules/threejs/examples/jsm/shaders/FXAAShader.js';
import { GammaCorrectionShader } from './modules/threejs/examples/jsm/shaders/GammaCorrectionShader.js';

import { Strings } from "./classes/Strings.js";
import { TransformControls } from './classes/TransformControls.js';
import { Config } from './classes/Config.js';
import { History } from './classes/History.js';
import { SetPositionCommand } from './classes/commands/SetPositionCommand.js';
import { SetRotationCommand } from './classes/commands/SetRotationCommand.js';
import { SetScaleCommand } from './classes/commands/SetScaleCommand.js';


module.exports = {
	THREE,
	History,
	Loader,

	EffectComposer,
	RenderPass,
	ShaderPass,
	OutlinePass,
	FXAAShader,
	GammaCorrectionShader,
	
	Strings,
	TransformControls,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	Config,
	UIPanel,
	UIDiv,
	UIText,
};
