import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Anchor,
  Box,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconGripVertical, IconInfoCircle, IconTestPipe2Filled } from '@tabler/icons-react';
import { useAppContext } from '@/context/useAppContext';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useListState } from '@mantine/hooks';
import cx from 'clsx';
import classes from './DndTilts.module.css';

export const ConfigurationForm: React.FC = () => {
  const { t } = useTranslation();
  const { firmwareOptions, setFirmwareOptions } = useAppContext();
  const { tilts: contextTilts, setTilts: setContextTilts } = useAppContext();
  const [tiltList, tiltHandlers] = useListState(contextTilts);
  const [showWifiPasswordTooltip, setShowWifiPasswordTooltip] = useState(false);

  useEffect(() => {
    setContextTilts(tiltList);
  }, [tiltList, setContextTilts]);

  useEffect(() => {
    const shouldShow =
      firmwareOptions.wifiConfig.password.length < 8 &&
      firmwareOptions.wifiConfig.password.length > 0;

    const timeout = setTimeout(() => {
      setShowWifiPasswordTooltip(shouldShow);
    }, 500);

    return () => clearTimeout(timeout);
  }, [firmwareOptions.wifiConfig.password]);

  return (
    <Box style={{ padding: 32 }}>
      <Title order={4} mb="md">
        {t('configuration.text')}
      </Title>
      <Stack>
        <Text>
          <Trans i18nKey="configuration.tilt.init" components={{ strong: <strong /> }} />
        </Text>
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            if (destination && source.index !== destination.index) {
              tiltHandlers.reorder({ from: source.index, to: destination.index });
            }
          }}
        >
          <Droppable droppableId="tilts-droppable" direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tiltList.map((tilt, index) => (
                  <Draggable key={tilt.key} draggableId={tilt.key} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cx(classes.item, {
                          [classes.itemDragging]: snapshot.isDragging,
                        })}
                      >
                        <Box style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                            <IconGripVertical size={20} />
                          </Box>
                          <Box style={{ width: 24 }}>
                            <IconTestPipe2Filled size={24} color={tilt.color.hexColor} />
                          </Box>
                          <Box style={{ minWidth: 100 }}>
                            <Checkbox
                              label={t(`tilt.colors.${tilt.color.name}`)}
                              checked={tilt.enabled}
                              onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                tiltHandlers.setItemProp(index, 'enabled', checked);
                              }}
                            />
                          </Box>
                          <Box style={{ minWidth: 80 }}>
                            {tilt.enabled && (
                              <Checkbox
                                label={t('configuration.tilt.fields.tilt.pro')}
                                checked={tilt.isPro}
                                onChange={(event) => {
                                  const checked = event.currentTarget.checked;
                                  tiltHandlers.setItemProp(index, 'isPro', checked);
                                }}
                              />
                            )}
                          </Box>
                          <Box style={{ flex: 1 }}>
                            {tilt.enabled &&
                              firmwareOptions.ha &&
                              firmwareOptions.enablePressureSensors && (
                                <TextInput
                                  style={{ width: 600 }}
                                  placeholder={t(
                                    'configuration.tilt.fields.pressureSensor.placeholder'
                                  )}
                                  value={tilt.haPressureSensor}
                                  onChange={(event) => {
                                    const value = event.currentTarget.value;
                                    tiltHandlers.setItemProp(index, 'haPressureSensor', value);
                                  }}
                                />
                              )}
                          </Box>
                        </Box>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Box mt="xl">
          <Text>
            <Trans i18nKey="configuration.wifi.init" components={{ strong: <strong /> }} />
          </Text>
          <Text mt="xs" c="dimmed">
            {t('configuration.wifi.subinit')}
          </Text>
          <TextInput
            style={{ maxWidth: '350px' }}
            mt="md"
            label={t('configuration.wifi.fields.SSID.label')}
            placeholder={t('configuration.wifi.fields.SSID.placeholder')}
            value={firmwareOptions.wifiConfig.SSID}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFirmwareOptions((prev) => ({
                ...prev,
                wifiConfig: {
                  ...prev.wifiConfig,
                  SSID: value,
                },
              }));
            }}
          />
          <Tooltip
            label={t('configuration.wifi.fields.password.validationMessage')}
            opened={showWifiPasswordTooltip}
            color="red"
          >
            <PasswordInput
              style={{ maxWidth: '350px' }}
              label={t('configuration.wifi.fields.password.label')}
              placeholder={t('configuration.wifi.fields.password.placeholder')}
              mt="md"
              value={firmwareOptions.wifiConfig.password}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFirmwareOptions((prev) => ({
                  ...prev,
                  wifiConfig: {
                    ...prev.wifiConfig,
                    password: value,
                  },
                }));
              }}
            />
          </Tooltip>
        </Box>
        <Box mt="xl">
          <Text>
            <Trans i18nKey="configuration.brewfather.init" components={{ strong: <strong /> }} />
          </Text>
          <Checkbox
            label={t('configuration.brewfather.fields.enable.label')}
            checked={firmwareOptions.brewfather.enabled}
            onChange={(event) => {
              const checked = event.currentTarget.checked;
              setFirmwareOptions((prev) => ({
                ...prev,
                brewfather: {
                  ...prev.brewfather,
                  enabled: checked,
                },
              }));
            }}
            mt="md"
          />
          {firmwareOptions.brewfather.enabled && (
            <TextInput
              style={{ maxWidth: '350px' }}
              label={
                <Group gap={4}>
                  <Trans
                    i18nKey="configuration.brewfather.fields.key.label"
                    components={{ span: <span /> }}
                  />
                  <Anchor
                    href="https://docs.brewfather.app/integrations/custom-stream"
                    target="_blank"
                    size="xs"
                    c="dimmed"
                  >
                    <IconInfoCircle size={16} />
                  </Anchor>
                </Group>
              }
              labelProps={{ style: { marginBottom: '10px' } }}
              placeholder={t('configuration.brewfather.fields.key.placeholder')}
              value={firmwareOptions.brewfather.apiKey}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFirmwareOptions((prev) => ({
                  ...prev,
                  brewfather: {
                    ...prev.brewfather,
                    apiKey: value,
                  },
                }));
              }}
              mt="md"
            />
          )}
        </Box>
        <Box mt="xl">
          <Text>
            <Trans i18nKey="configuration.ha.init" components={{ strong: <strong /> }} />
          </Text>
          <Checkbox
            label={t('configuration.ha.fields.enable.label')}
            checked={firmwareOptions.ha}
            onChange={(event) => {
              const checked = event.currentTarget.checked;
              setFirmwareOptions((prev) => ({
                ...prev,
                ha: checked,
              }));
            }}
            mt="md"
          />
        </Box>
        {firmwareOptions.ha && (
          <Box mt="xl">
            <Text>
              <Trans
                i18nKey="configuration.pressureSensor.init"
                components={{ strong: <strong /> }}
              />
            </Text>
            <Checkbox
              label={t('configuration.pressureSensor.fields.enable.label')}
              checked={firmwareOptions.enablePressureSensors}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                setFirmwareOptions((prev) => ({
                  ...prev,
                  enablePressureSensors: checked,
                }));
              }}
              mt="md"
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};
