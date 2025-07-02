import { Draggable } from '@hello-pangea/dnd';
import { Box, Checkbox, TextInput } from '@mantine/core';
import { IconGripVertical, IconTestPipe2Filled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { Tilt } from '@/models/tilt';
import type { FirmwareOptions } from '@/types/firmware';
import React from 'react';
import cx from 'clsx';
import classes from '@/components/configuration/DndTilts.module.css';

type Props = {
  tilt: Tilt;
  index: number;
  firmwareOptions: FirmwareOptions;
  onChange: (index: number, field: keyof Tilt, value: boolean | string) => void;
};

export const TiltItem = React.memo(({ tilt, index, firmwareOptions, onChange }: Props) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof Tilt) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      index,
      field,
      event.currentTarget.type === 'checkbox'
        ? event.currentTarget.checked
        : event.currentTarget.value
    );
  };

  const showPressureInput =
    tilt.enabled && firmwareOptions.ha && firmwareOptions.enablePressureSensors;

  return (
    <Draggable key={tilt.key} draggableId={tilt.key} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
        >
          <Box className={classes.dragBox}>
            <Box {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconGripVertical size={20} />
            </Box>
            <Box className={classes.dragIcon}>
              <IconTestPipe2Filled size={24} color={tilt.color?.hexColor ?? '#ccc'} />
            </Box>
            <Box className={classes.dragCheckbox}>
              <Checkbox
                label={t(`tilt.colors.${tilt.color?.name ?? 'unknown'}`)}
                checked={tilt.enabled}
                onChange={handleChange('enabled')}
              />
            </Box>
            <Box className={classes.dragCheckbox}>
              {tilt.enabled && (
                <Checkbox
                  label={t('configuration.tilt.fields.tilt.pro')}
                  checked={tilt.isPro}
                  onChange={handleChange('isPro')}
                />
              )}
            </Box>
            <Box className={classes.dragSensorBox}>
              {showPressureInput && (
                <TextInput
                  className={classes.dragSensorInput}
                  placeholder={t('configuration.tilt.fields.pressureSensor.placeholder')}
                  value={tilt.haPressureSensor}
                  onChange={handleChange('haPressureSensor')}
                />
              )}
            </Box>
          </Box>
        </div>
      )}
    </Draggable>
  );
});
