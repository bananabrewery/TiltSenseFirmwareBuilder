import React, { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, Group, Loader, Text, Tooltip } from '@mantine/core';
import { IconCpu } from '@tabler/icons-react';
import { appConstants } from '@/constants/firmware.ts';
import { compileYAMLAsync } from '@/features/firmware/api/uploadYaml.ts';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext.ts';
import { isValidEmail } from '@/utils/validation.ts';

interface CompileButtonProps {
  email: string;
  setEmailError: Dispatch<SetStateAction<string | null>>;
  setActive: Dispatch<SetStateAction<number>>;
  setFinished: Dispatch<SetStateAction<boolean>>;
}

export const CompileButton: React.FC<CompileButtonProps> = ({
  email,
  setEmailError,
  setActive,
  setFinished,
}) => {
  const { t } = useTranslation();
  const { yamlContent } = useAppContext();
  const hasYamlContent = !!yamlContent;

  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSlowTooltip, setShowSlowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const lastCompile = localStorage.getItem('tiltSenseLastFirmwareCompile');
      if (lastCompile) {
        const timeLeft = 60 * 60 * 1000 - (Date.now() - parseInt(lastCompile, 10));
        if (timeLeft <= 0) {
          setRemainingTime(null);
          clearInterval(interval);
        } else {
          setRemainingTime(timeLeft);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const canCompile = (): boolean => {
    const lastCompile = localStorage.getItem('tiltSenseLastFirmwareCompile');
    if (!lastCompile) return true;

    const elapsed = Date.now() - parseInt(lastCompile, 10);
    return elapsed > appConstants.timeBetweenCompilations;
  };

  const handleClick = async () => {
    setShowSlowTooltip(false);

    timeoutRef.current = setTimeout(() => {
      setShowSlowTooltip(true);
    }, 5000);

    try {
      await handleSubmitAsync();
    } finally {
      clearTimeout(timeoutRef.current!);
      setShowSlowTooltip(false);
    }
  };

  const handleSubmitAsync = async () => {
    if (!isValidEmail(email)) {
      setEmailError(t('validation.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      await compileYAMLAsync(yamlContent, email);
      resNotification(true);
      const now = Date.now();
      localStorage.setItem('tiltSenseLastFirmwareCompile', now.toString());
      setActive(6);
      setFinished(true);
    } catch (err) {
      resNotification(false, (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resNotification = (success: boolean, msg?: string) => {
    if (success) {
      showNotification({
        title: t('notifications.success.firmwareCompilation.title'),
        message: t('notifications.success.firmwareCompilation.message'),
        color: 'green',
      });
    } else {
      showNotification({
        title: t('notifications.error.firmwareCompilation.title'),
        message: msg || t('notifications.error.firmwareCompilation.message'),
        color: 'red',
      });
    }
  };

  const tooltipLabel = !hasYamlContent
    ? t('validation.yamlError')
    : !email
      ? t('validation.email')
      : showSlowTooltip
        ? t('notifications.warning.slowCompile.message')
        : undefined;

  return (
    <Group justify="center" mt="xl" style={{ flexDirection: 'column', alignItems: 'center' }}>
      <Tooltip
        label={tooltipLabel}
        disabled={!tooltipLabel}
        opened={showSlowTooltip ? true : undefined}
      >
        <Button
          onClick={handleClick}
          disabled={!hasYamlContent || loading || !email || !canCompile()}
          leftSection={<IconCpu size={14} />}
        >
          {loading && <Loader size="xs" mr="xs" />}
          {t('button.compileFirmware.title')}
        </Button>
      </Tooltip>
      {remainingTime && (
        <Text c="dimmed" size="sm">
          You can compile again in {Math.ceil(remainingTime / 60000)} minutes.
        </Text>
      )}
    </Group>
  );
};
