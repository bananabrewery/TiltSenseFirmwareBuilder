import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

export function usePersistentStep(): [number, Dispatch<SetStateAction<number>>, () => void] {
  const STORAGE_KEY = 'tiltSenseActiveStep';

  const [active, setActive] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored !== null ? parseInt(stored, 10) : 0;
    if (isNaN(parsed)) return 0;
    if (parsed === 5 || parsed === 6) return 4;

    return parsed;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, active.toString());
  }, [active]);

  const resetStep = () => {
    localStorage.removeItem(STORAGE_KEY);
    setActive(0);
  };

  return [active, setActive, resetStep];
}
