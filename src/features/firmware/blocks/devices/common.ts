import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { DeviceConstants, FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getTiltSenseTiltPage } from '@/features/firmware/blocks/devices/tiltSense/display.ts';
import { getTiltSenseMaxTiltPage } from '@/features/firmware/blocks/devices/tiltSenseMax/display.ts';
import {
  getTiltSenseInternalBattery,
  tiltSenseConstants,
  tiltSenseHardware,
} from '@/features/firmware/blocks/devices/tiltSense/hardware.ts';
import {
  getTiltSenseMaxInternalBattery,
  tiltSenseMaxConstants,
  tiltSenseMaxHardware,
} from '@/features/firmware/blocks/devices/tiltSenseMax/hardware.ts';

export function getDeviceConstants(context: FirmwareContext): DeviceConstants {
  if (context.firmwareOptions.isMax) {
    return tiltSenseMaxConstants;
  } else {
    return tiltSenseConstants;
  }
}

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
