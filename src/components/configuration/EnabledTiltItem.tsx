import { Box, Text, TextInput } from '@mantine/core';
import { IconTestPipe2Filled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import type { Tilt } from '@/models/tilt';
import classes from '@/components/configuration/DndTilts.module.css';

interface EnabledTiltItemProps {
  tilt: Tilt;
  onChange: (key: string, field: keyof Tilt, value: string) => void;
}

export const EnabledTiltItem: React.FC<EnabledTiltItemProps> = ({ tilt, onChange }) => {
  const { t } = useTranslation();

  const [error, setError] = useState<string | false>(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isValidPressureSensorEntity = (value: string | undefined): boolean => {
    if (!value) return true;
    return /^sensor\.[\w.]+$/.test(value.trim());
  };

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
            <IconTestPipe2Filled size={24} color={tilt.color?.hexColor ?? '#ccc'} />
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
