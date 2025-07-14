import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getTiltSenseTiltPage } from '@/features/firmware/blocks/devices/tiltSense/display.ts';
import { getTiltSenseMaxTiltPage } from '@/features/firmware/blocks/devices/tiltSenseMax/display.ts';
import {
  getTiltSenseInternalBattery,
  tiltSenseHardware,
} from '@/features/firmware/blocks/devices/tiltSense/hardware.ts';
import {
  getTiltSenseMaxInternalBattery,
  tiltSenseMaxHardware,
} from '@/features/firmware/blocks/devices/tiltSenseMax/hardware.ts';

export function getTiltPage(tilt: Tilt, context: FirmwareContext): string[] {
  if (context.firmwareOptions.isMax) {
    return getTiltSenseMaxTiltPage(tilt);
  } else {
    return getTiltSenseTiltPage(tilt);
  }
}

export function getHardware(context: FirmwareContext): string[] {
  if (context.firmwareOptions.isMax) {
    return tiltSenseMaxHardware;
  } else {
    return tiltSenseHardware;
  }
}

export function getInternalBattery(context: FirmwareContext): string[] {
  if (context.firmwareOptions.isMax) {
    return getTiltSenseMaxInternalBattery(context);
  } else {
    return getTiltSenseInternalBattery(context);
  }
}
