import React, { useState } from 'react';
import { Button, Container, Divider, Group, Stepper, Text, Title, Tooltip } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext.ts';
import { TiltList } from '@/components/configuration/TilltList.tsx';
import { WifiForm } from '@/components/configuration/WifiForm.tsx';
import { BrewfatherForm } from '@/components/configuration/BrewfatherForm.tsx';
import { HomeAssistantForm } from '@/components/configuration/HomeAssistantForm.tsx';
import { StatusItem } from '@/components/stepper/StatusItem.tsx';

export const ProcessStepper: React.FC = () => {
  const { t } = useTranslation();
  const { tilts, firmwareOptions } = useAppContext();

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
            label={t('processStepper.steps.step1.label')}
            description={t('processStepper.steps.step1.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.step1.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <TiltList />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(1)}
            mt="md"
            label={t('processStepper.steps.step2.label')}
            description={t('processStepper.steps.step2.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.step2.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <Text mt="xs" c="dimmed">
              {t('processStepper.steps.step2.content.subintro')}
            </Text>
            <WifiForm />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(2)}
            mt="md"
            label={t('processStepper.steps.step3.label')}
            description={t('processStepper.steps.step3.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.step3.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <BrewfatherForm />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(3)}
            mt="md"
            label={t('processStepper.steps.step4.label')}
            description={t('processStepper.steps.step4.description')}
          >
            <Text mt="xl">
              <Trans
                i18nKey="processStepper.steps.step4.content.intro"
                components={{ strong: <strong /> }}
              />
            </Text>
            <HomeAssistantForm />
          </Stepper.Step>
          <Stepper.Step
            loading={loadingSteps.includes(4)}
            mt="md"
            label={t('processStepper.steps.step5.label')}
            description={t('processStepper.steps.step5.description')}
          >
            <Text mt="md">{t('stepper.step1.content.text')}</Text>
            <Text style={{ fontWeight: 'bold' }} mt="xl">
              {t('processStepper.steps.step5.summary.title')}
            </Text>
            <Divider
              mt="md"
              label={t('processStepper.steps.step5.summary.required.title')}
              labelPosition="left"
            />
            <StatusItem
              label={t('processStepper.steps.step5.summary.required.check.tilt')}
              checked={hasAnyTiltEnabled}
            />
            <Divider
              mt="xl"
              label={t('processStepper.steps.step5.summary.optional.title')}
              labelPosition="left"
            />
            <StatusItem
              label={t('processStepper.steps.step5.summary.optional.check.wifi')}
              checked={!!firmwareOptions.wifiConfig.SSID}
            />
            <StatusItem
              label={t('processStepper.steps.step5.summary.optional.check.brewfather')}
              checked={firmwareOptions.brewfather.enabled}
            />
            <StatusItem
              label={t('processStepper.steps.step5.summary.optional.check.ha')}
              checked={firmwareOptions.ha}
            />
            <StatusItem
              label={t('processStepper.steps.step5.summary.optional.check.pressureSensor')}
              checked={firmwareOptions.enablePressureSensors}
            />
          </Stepper.Step>
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
