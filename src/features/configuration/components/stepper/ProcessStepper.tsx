import React, { Suspense, useState } from 'react';
import {
  Accordion,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Stepper,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext.ts';
import { TiltList } from '@/features/configuration/components/stepper/TilltList.tsx';
import { WifiForm } from '@/features/configuration/components/stepper/WifiForm.tsx';
import { BrewfatherForm } from '@/features/configuration/components/stepper/BrewfatherForm.tsx';
import { HomeAssistantForm } from '@/features/configuration/components/stepper/HomeAssistantForm.tsx';
import { StatusItem } from '@/features/configuration/components/StatusItem.tsx';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconCopy,
  IconCpu,
  IconDownload,
  IconFileCode,
} from '@tabler/icons-react';
import { defaultFirmwareOptions } from '@/constants/defaults.ts';
import { usePersistentStep } from '@/features/configuration/hooks/usePersistentStep.ts';
import type { Tilt } from '@/features/configuration/types/tilt.ts';
import { generateFirmwareConfig } from '@/features/firmware/generateFirmware.ts';
import { showNotification } from '@mantine/notifications';
import { isValidPressureSensorEntity } from '@/utils/validation.ts';
import { CompileButton } from '@/features/configuration/components/stepper/CompileButton.tsx';

const YamlViewer = React.lazy(() => import('@/features/firmware/components/YamlViewer'));

export const ProcessStepper: React.FC = () => {
  const { t } = useTranslation();
  const { tilts, firmwareOptions, yamlContent, setYamlContent } = useAppContext();

  const [active, setActive, resetStep] = usePersistentStep();
  const [loadingSteps, setLoadingSteps] = useState<number[]>([]);
  const nextStep = () => setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const hasAnyTiltEnabled = tilts.some((tilt) => tilt.enabled);
  const hasYamlContent = !!yamlContent;
  const wifiConfigured = !!firmwareOptions.wifiConfig.SSID;
  const wifiPassword = !!firmwareOptions.wifiConfig.password;
  const brewfatherEnabled = firmwareOptions.brewfather.enabled;
  const brewfatherApiKey = !!firmwareOptions.brewfather.apiKey;
  const haEnabled = firmwareOptions.ha;
  const pressureSensorsEnabled = firmwareOptions.enablePressureSensors;
  const hasInvalidPressureSensor = tilts.some(
    (tilt) => !isValidPressureSensorEntity(tilt.haPressureSensor)
  );

  const disableNextButton = () => {
    if (active === 4 && !hasYamlContent) {
      return true;
    }
    if (active === 5) {
      return true;
    }
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
    () => {
      return true;
    },
    () => {
      return true;
    },
    () => {
      return hasYamlContent;
    },
    () => {
      resetStep();
      return true;
    },
  ];

  const handleNextStep = () => {
    setStepLoading(active, true);
    const canContinue = stepHandlers[active]?.() ?? true;
    if (canContinue) nextStep();
    setStepLoading(active, false);
  };

  const handleStepClick = (step: number) => {
    if (step === 5 && !hasYamlContent) return;
    setActive(step);
    setFinished(false);
  };

  const handleGenerateYAML = () => {
    const enabledTilts: Tilt[] = tilts.filter((tilt) => tilt.enabled);
    const tiltSenseGeneratedFirmware = generateFirmwareConfig(enabledTilts, firmwareOptions);
    setYamlContent(tiltSenseGeneratedFirmware);
    showNotification({
      title: t('notifications.success.firmwareGeneration.title'),
      message: (
        <Text>
          <Trans
            i18nKey="notifications.success.firmwareGeneration.message"
            components={{ strong: <strong /> }}
          />
        </Text>
      ),
      color: 'green',
    });
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

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError(null);
  };

  return (
    <>
      <Container fluid mt="xl" px="xl">
        <Title order={4} mb="md">
          {t('processStepper.title')}
        </Title>
        <Stepper
          active={active}
          onStepClick={handleStepClick}
          allowNextStepsSelect={hasAnyTiltEnabled}
        >
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
              onClick={() => setActive(0)}
              checked={hasAnyTiltEnabled}
            />
            <Divider
              mt="xl"
              label={t('processStepper.steps.4.summary.optional.title')}
              labelPosition="left"
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.wifi')}
              onClick={() => setActive(1)}
              checked={wifiConfigured}
              warning={wifiConfigured && !wifiPassword}
              warningMessage={t('validation.wifiWarning')}
              error={!wifiConfigured && (brewfatherEnabled || haEnabled)}
              errorMessage={t('validation.wifiError')}
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.brewfather')}
              onClick={() => setActive(2)}
              checked={brewfatherEnabled}
              error={brewfatherEnabled && !brewfatherApiKey}
              errorMessage={t('validation.brewfatherError')}
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.ha')}
              onClick={() => setActive(3)}
              checked={haEnabled}
            />
            <StatusItem
              label={t('processStepper.steps.4.summary.optional.check.pressureSensor')}
              onClick={() => setActive(3)}
              checked={haEnabled && pressureSensorsEnabled}
              error={hasInvalidPressureSensor}
              errorMessage={t('validation.invalidPressureSensors')}
            />
            <Text mt="xl">
              <Trans i18nKey="processStepper.steps.4.content.outro" components={{ i: <i /> }} />
            </Text>
            <Group justify="center" mt="xl">
              <Button
                onClick={handleGenerateYAML}
                disabled={
                  !hasAnyTiltEnabled ||
                  ((brewfatherEnabled || haEnabled) && !wifiConfigured) ||
                  (brewfatherEnabled && !brewfatherApiKey) ||
                  hasInvalidPressureSensor
                }
                leftSection={<IconFileCode size={14} />}
              >
                {t('button.generateYaml.title')}
              </Button>
            </Group>
            {yamlContent && (
              <Suspense
                fallback={
                  <Center mt="xl">
                    <Loader />
                  </Center>
                }
              >
                <Accordion variant="separated" mt="xl">
                  <Accordion.Item value="firmware">
                    <Accordion.Control icon={<IconCpu />}>
                      <Flex justify="space-between" align="center" w="100%">
                        <Text>{t('processStepper.steps.4.content.accordionTitle')}</Text>
                        {/*//TODO: This buttons inside the Accordion.Control provides an error.*/}
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
              </Suspense>
            )}
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(5)}
            mt="md"
            label={t('processStepper.steps.5.label')}
            description={t('processStepper.steps.5.description')}
            style={{
              pointerEvents: hasYamlContent ? 'auto' : 'none',
            }}
          >
            <Text mt="xl">
              <Trans i18nKey="processStepper.steps.5.content.intro" components={{ i: <i /> }} />
            </Text>
            <Text mt="xs" c="dimmed">
              {t('processStepper.steps.5.content.subintro')}
            </Text>
            <TextInput
              mt="xl"
              style={{ maxWidth: 450, width: '100%' }}
              label={t('processStepper.steps.5.content.emailInput.label')}
              labelProps={{ style: { marginBottom: '10px' } }}
              placeholder={t('processStepper.steps.5.content.emailInput.placeholder')}
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />
            <CompileButton
              email={email}
              setEmailError={setEmailError}
              setActive={setActive}
              setFinished={setFinished}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Group
              mt="xl"
              gap="md"
              align="center"
              style={{ justifyContent: 'center', flexDirection: 'column' }}
            >
              <IconCircleCheck size={64} color="lime" />
              <Text mt="lg" size="xl">
                {t('processStepper.steps.completedStep.content.intro')}
              </Text>
              <Text size="xl" c="dimmed">
                {t('processStepper.steps.completedStep.content.subintro')}
              </Text>
              <Text size="md" c="dimmed" ta="center">
                <Trans
                  i18nKey="processStepper.steps.completedStep.content.end"
                  components={[
                    <Text
                      span
                      component="a"
                      href="https://web.esphome.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      c="blue"
                    />,
                  ]}
                />
              </Text>
            </Group>
          </Stepper.Completed>
        </Stepper>
        {!finished && (
          <Group justify="center" mt="xl">
            <Button
              disabled={disablePrevButton()}
              variant="default"
              onClick={prevStep}
              leftSection={<IconArrowLeft size={14} />}
            >
              {t('processStepper.button.prev')}
            </Button>
            <Tooltip
              label={
                !hasAnyTiltEnabled ? t('validation.oneTilt') : t('validation.generateFirmware')
              }
              disabled={
                !((!hasAnyTiltEnabled && active === 0) || (!hasYamlContent && active === 4))
              }
            >
              <Button
                disabled={disableNextButton()}
                onClick={handleNextStep}
                leftSection={<IconArrowRight size={14} />}
              >
                {t('processStepper.button.next')}
              </Button>
            </Tooltip>
          </Group>
        )}
      </Container>
    </>
  );
};
