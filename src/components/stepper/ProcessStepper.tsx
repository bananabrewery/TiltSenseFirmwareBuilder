import React, { useState } from 'react';
import {
  Accordion,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Stepper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext.ts';
import { TiltList } from '@/components/configuration/TilltList.tsx';
import { WifiForm } from '@/components/configuration/WifiForm.tsx';
import { BrewfatherForm } from '@/components/configuration/BrewfatherForm.tsx';
import { HomeAssistantForm } from '@/components/configuration/HomeAssistantForm.tsx';
import { StatusItem } from '@/components/stepper/StatusItem.tsx';
import { IconCheck, IconCopy, IconCpu, IconDownload } from '@tabler/icons-react';
import { defaultFirmwareOptions } from '@/constants/defaults.ts';
import { YamlViewer } from '@/components/firmware/YamlViewer.tsx';

export const ProcessStepper: React.FC = () => {
  const { t } = useTranslation();
  const { tilts, firmwareOptions, yamlContent } = useAppContext();

  const [active, setActive] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState<number[]>([]);
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const hasAnyTiltEnabled = tilts.some((tilt) => tilt.enabled);

  const disableNextButton = () => {
    return !hasAnyTiltEnabled;
  };

  const disablePrevButton = () => {
    return active === 0;
  };

  const setStepLoading = (stepIndex: number, isLoading: boolean) => {
    setLoadingSteps((prev) =>
      isLoading ? [...prev, stepIndex] : prev.filter((i) => i !== stepIndex)
    );
  };

  const stepHandlers = [
    () => {
      return hasAnyTiltEnabled;
    },
    () => {
      return true;
    },
  ];

  const handleNextStep = () => {
    setStepLoading(active, true);
    const canContinue = stepHandlers[active]?.() ?? true;
    if (canContinue) nextStep();
    setStepLoading(active, false);
  };

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    await navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFirmwareOptions.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Container fluid mt="xl" px="xl">
        <Title order={4} mb="md">
          {t('processStepper.title')}
        </Title>
        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={hasAnyTiltEnabled}>
          <Stepper.Step
            loading={loadingSteps.includes(0)}
            mt="md"
            label={t('processStepper.steps.0.label')}
            description={t('processStepper.steps.0.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.0.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <TiltList />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(1)}
            mt="md"
            label={t('processStepper.steps.1.label')}
            description={t('processStepper.steps.1.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.1.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <Text mt="xs" c="dimmed">
              {t('processStepper.steps.1.content.subintro')}
            </Text>
            <WifiForm />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(2)}
            mt="md"
            label={t('processStepper.steps.2.label')}
            description={t('processStepper.steps.2.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.2.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <BrewfatherForm />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(3)}
            mt="md"
            label={t('processStepper.steps.3.label')}
            description={t('processStepper.steps.3.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.3.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <HomeAssistantForm />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(4)}
            mt="md"
            label={t('processStepper.steps.4.label')}
            description={t('processStepper.steps.4.description')}
          >
            <Text mt="xl">{t('processStepper.steps.4.content.intro')}</Text>
            <Text style={{ fontWeight: 'bold' }} mt="xl">
              {t('processStepper.steps.4.summary.title')}
            </Text>
            <Divider
              mt="md"
              label={t('processStepper.steps.4.summary.required.title')}
              labelPosition="left"
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.required.check.tilt')}
              checked={hasAnyTiltEnabled}
            />
            <Divider
              mt="xl"
              label={t('processStepper.steps.4.summary.optional.title')}
              labelPosition="left"
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.wifi')}
              checked={!!firmwareOptions.wifiConfig.SSID}
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.brewfather')}
              checked={firmwareOptions.brewfather.enabled}
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.ha')}
              checked={firmwareOptions.ha}
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.pressureSensor')}
              checked={firmwareOptions.enablePressureSensors}
            />
            {yamlContent && (
              <Accordion variant="separated" mt="xl">
                <Accordion.Item value="firmware">
                  <Accordion.Control icon={<IconCpu />}>
                    <Flex justify="space-between" align="center" w="100%">
                      <Text>{t('processStepper.steps.4.content.accordionTitle')}</Text>
                      <Group gap="xs">
                        <Button
                          onClick={(event) => handleCopy(event)}
                          variant="subtle"
                          size="xs"
                          leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                        >
                          {copied ? t('button.copy.shiftedTitle') : t('button.copy.title')}
                        </Button>
                        <Button
                          onClick={(event) => handleDownload(event)}
                          variant="subtle"
                          size="xs"
                          mr="lg"
                          leftSection={<IconDownload size={14} />}
                        >
                          {t('button.download.title')}
                        </Button>
                      </Group>
                    </Flex>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <YamlViewer code={yamlContent} />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(5)}
            mt="md"
            label={t('processStepper.steps.5.label')}
            description={t('processStepper.steps.5.description')}
          ></Stepper.Step>
          <Stepper.Completed>
            {t('processStepper.steps.completedStep.content.intro')}
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button disabled={disablePrevButton()} variant="default" onClick={prevStep}>
            {t('processStepper.button.prev')}
          </Button>
          <Tooltip label={t('validation.oneTilt')} disabled={hasAnyTiltEnabled}>
            <Button disabled={disableNextButton()} onClick={handleNextStep}>
              {t('processStepper.button.next')}
            </Button>
          </Tooltip>
        </Group>
      </Container>
    </>
  );
};
