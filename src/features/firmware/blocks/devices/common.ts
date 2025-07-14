import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getTiltSenseTiltPage } from '@/features/firmware/blocks/devices/tiltSense/display.ts';
import { getTiltSenseMaxTiltPage } from '@/features/firmware/blocks/devices/tiltSenseMax/display.ts';

export function getTiltPage(tilt: Tilt, context: FirmwareContext): string[] {
  if (context.firmwareOptions.isMax) {
    return getTiltSenseMaxTiltPage(tilt);
  } else {
    return getTiltSenseTiltPage(tilt);
  }
}
