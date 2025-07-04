import { Box, Text, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import type { Tilt } from '@/features/configuration/types/tilt.ts';
import classes from '@/features/configuration/components/stepper/DndTilts.module.css';
import { isValidPressureSensorEntity } from '@/utils/validation.ts';
import { IconTilt } from '@/components/Tilt.tsx';

interface EnabledTiltItemProps {
  tilt: Tilt;
  onChange: (key: string, field: keyof Tilt, value: string) => void;
}

export const EnabledTiltItem: React.FC<EnabledTiltItemProps> = ({ tilt, onChange }) => {
  const { t } = useTranslation();

  const [error, setError] = useState<string | false>(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const isValid = isValidPressureSensorEntity(tilt.haPressureSensor);
      setError(isValid ? false : t('validation.invalidPressureEntity'));
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [tilt.haPressureSensor, t]);

  return (
    <>
      <div className={classes.item}>
        <Box className={classes.dragBox}>
          <Box className={classes.dragIcon}>
            <IconTilt width={24} height={24} color={tilt.color?.hexColor} />
          </Box>
          <Box className={classes.dragCheckbox}>
            <Text>
              {t(`tilt.colors.${tilt.color?.name ?? 'unknown'}`)}
              {tilt.isPro ? ` ${t('configuration.tilt.fields.tilt.pro')}` : ''}
            </Text>
          </Box>
          <Box className={classes.dragSensorBox}>
            <TextInput
              className={classes.dragSensorInput}
              placeholder={t('configuration.tilt.fields.pressureSensor.placeholder')}
              value={tilt.haPressureSensor ?? ''}
              onChange={(event) => {
                const newValue = event.currentTarget.value;
                onChange(tilt.key, 'haPressureSensor', newValue);
              }}
              error={error}
            />
          </Box>
        </Box>
      </div>
    </>
  );
};
