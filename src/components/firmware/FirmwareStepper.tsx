import React, { useState } from 'react';
import { Accordion, Button, Divider, Group, Stepper, Text, Title, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext.ts';
import { StatusItem } from '@/components/firmware/StatusItem.tsx';
import { showNotification } from '@mantine/notifications';
import type { Tilt } from '@/models/tilt.ts';
import { generateFirmwareConfig } from '@/generators/generateFirmware.ts';
import { YamlViewer } from '@/components/firmware/YamlViewer.tsx';
import { IconCpu } from '@tabler/icons-react';

export const FirmwareStepper: React.FC = () => {
  const { t } = useTranslation();
  const { tilts, firmwareOptions, setYamlContent, yamlContent } = useAppContext();

  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const hasAnyTiltEnabled = tilts.some((tilt) => tilt.enabled);

  const disableNextButton = () => {
    return !hasAnyTiltEnabled;
  };

  const disablePrevButton = () => {
    return active === 0;
  };

  const stepHandlers = [
    () => {
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
        return false;
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
      setYamlContent(tiltSenseGeneratedFirmware);
      return true;
    },
    () => true,
  ];

  const handleNextStep = () => {
    const canContinue = stepHandlers[active]?.() ?? true;
    if (canContinue) nextStep();
  };

  return (
    <>
      <Title order={4} mb="md">
        {t('stepper.title')}
      </Title>
      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step
          mt="md"
          label={t('stepper.step1.label')}
          description={t('stepper.step1.description')}
        >
          <Text mt="md">{t('stepper.step1.content.text')}</Text>
          <Text style={{ fontWeight: 'bold' }} mt="xl">
            {t('stepper.step1.content.required.title')}
          </Text>
          <StatusItem
            label={t('stepper.step1.content.required.check.tilt')}
            checked={hasAnyTiltEnabled}
          />
          <Divider
            mt="lg"
            label={t('stepper.step1.content.optional.title')}
            labelPosition="center"
          />
          <StatusItem
            label={t('stepper.step1.content.optional.check.wifi')}
            checked={!!firmwareOptions.wifiConfig.SSID}
          />
          <StatusItem
            label={t('stepper.step1.content.optional.check.brewfather')}
            checked={firmwareOptions.brewfather.enabled}
          />
          <StatusItem
            label={t('stepper.step1.content.optional.check.ha')}
            checked={firmwareOptions.ha}
          />
          <StatusItem
            label={t('stepper.step1.content.optional.check.pressureSensor')}
            checked={firmwareOptions.enablePressureSensors}
          />
        </Stepper.Step>
        <Stepper.Step
          mt="md"
          label={t('stepper.step2.label')}
          description={t('stepper.step2.description')}
        >
          <Text mt="md">{t('stepper.step2.content.text')}</Text>
          <Accordion variant="separated" mt="xl">
            <Accordion.Item value="firmware">
              <Accordion.Control icon={<IconCpu />}>
                {t('stepper.step2.content.accordionTitle')}
              </Accordion.Control>
              <Accordion.Panel>{yamlContent && <YamlViewer code={yamlContent} />}</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stepper.Step>
        <Stepper.Step
          mt="md"
          label={t('stepper.step3.label')}
          description={t('stepper.step3.description')}
        >
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button disabled={disablePrevButton()} variant="default" onClick={prevStep}>
          {t('stepper.button.prev')}
        </Button>
        <Tooltip label={t('validation.oneTilt')} disabled={hasAnyTiltEnabled}>
          <Button disabled={disableNextButton()} onClick={handleNextStep}>
            {t('stepper.button.next')}
          </Button>
        </Tooltip>
      </Group>
    </>
  );
};
