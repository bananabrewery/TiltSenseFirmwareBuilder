import type { FirmwareOptions } from '@/types/firmware';
import type { Tilt } from '@/models/tilt';

const LOCAL_STORAGE_KEY = 'tiltSenseConfig';

export type PersistedState = {
  firmwareOptions: FirmwareOptions;
  tilts: Tilt[];
};

export const loadPersistedState = (): PersistedState | null => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const savePersistedState = (state: PersistedState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Error loading persisted state', state);
  }
};
