import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Container, Group, Tooltip } from '@mantine/core';
import { YamlViewer } from '@/components/YamlViewer';
import { useAppContext } from '@/context/useAppContext';
import { showNotification } from '@mantine/notifications';
import { generateFirmwareConfig } from '@/generators/generateFirmware';
import type { Tilt } from '@/models/tilt';

export const FirmwareGeneration: React.FC = () => {
  const { t } = useTranslation();
  const { tilts, firmwareOptions } = useAppContext();
  const [generatedYAML, setGeneratedYAML] = useState('');

  const isAnyTiltSelected = (): boolean => {
    if (!Array.isArray(tilts)) return false;
    return tilts.some((tilt) => tilt.enabled === true);
  };

  const handleGenerateYAML = () => {
    if (
      firmwareOptions.brewfather.enabled &&
      (!firmwareOptions.brewfather.apiKey || firmwareOptions.brewfather.apiKey.trim() === '')
    ) {
      showNotification({
        title: t('notifications.error.brewfather.title'),
        message: t('notifications.error.brewfather.message'),
        color: 'red',
        autoClose: 4000,
        withCloseButton: true,
      });
      return;
    }

    if (
      firmwareOptions.brewfather.enabled &&
      (!firmwareOptions.wifiConfig.SSID || !firmwareOptions.wifiConfig.password)
    ) {
      showNotification({
        title: t('notifications.warning.brewfather.title'),
        message: t('notifications.warning.brewfather.message'),
        color: 'yellow',
        autoClose: 4000,
        withCloseButton: true,
      });
    }

    const enabledTilts: Tilt[] = tilts.filter((tilt) => tilt.enabled);
    const tiltSenseGeneratedFirmware = generateFirmwareConfig(enabledTilts, firmwareOptions);
    setGeneratedYAML(tiltSenseGeneratedFirmware);
  };

  return (
    <>
      <Container fluid mt="xl" px="xl">
        <Group justify="center" mb="md">
          <Tooltip label={t('validation.oneTilt')} disabled={isAnyTiltSelected()}>
            <Button onClick={handleGenerateYAML} disabled={!isAnyTiltSelected()}>
              {t('button.generateYaml.title')}
            </Button>
          </Tooltip>
        </Group>
        {generatedYAML && <YamlViewer code={generatedYAML} />}
      </Container>
    </>
  );
};
