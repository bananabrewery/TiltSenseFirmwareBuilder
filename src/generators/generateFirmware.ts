import {type Tilt} from '../models/tilt.ts';
import {type FirmwareOptions} from '../types/firmware.ts';
import {generateBaseConfigBlock} from './blocks/base.ts';
import {generateGlobalsBlock} from "./blocks/globals.ts";
import {generateBLEBlock} from "./blocks/ble.ts";
import {generateSwitchesBlock} from "./blocks/switches.ts";
import {generateSensorsBlock} from "./blocks/sensors.ts";
import {generateHardwareBlock} from "./blocks/hardware.ts";
import {generateIntervalsBlock} from "./blocks/intervals.ts";
import {generateScriptsBlock} from "./blocks/scripts.ts";
import {generateLVGLBlock} from "./blocks/lvgl.ts";

const config = {
    isBeta: true,
    name: "tiltsensebeta",
    friendlyName: "TiltSenseBeta"
}

export function generateFirmwareConfig(tilts: Tilt[], firmwareOptions: FirmwareOptions): string {
    let tiltSenseGeneratedFirmware: string = generateBaseConfigBlock(config, firmwareOptions);
    tiltSenseGeneratedFirmware += generateGlobalsBlock(tilts);
    tiltSenseGeneratedFirmware += generateBLEBlock(tilts);
    tiltSenseGeneratedFirmware += generateSwitchesBlock(tilts);
    tiltSenseGeneratedFirmware += generateSensorsBlock(config, tilts);
    tiltSenseGeneratedFirmware += generateHardwareBlock(config);
    tiltSenseGeneratedFirmware += generateIntervalsBlock(tilts, firmwareOptions, config);
    tiltSenseGeneratedFirmware += generateScriptsBlock(tilts);
    tiltSenseGeneratedFirmware += generateLVGLBlock(tilts);
    return tiltSenseGeneratedFirmware;
}