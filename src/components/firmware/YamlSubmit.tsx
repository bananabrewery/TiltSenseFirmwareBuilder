import { Button, Loader } from '@mantine/core';
import { compileYAML, compileYAMLAsync } from '@/api/uploadYaml';
import { useState } from 'react';
import { useAppContext } from '@/context/useAppContext.ts';
import { IconCpu } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';

export function YamlSubmit() {
  const { t } = useTranslation();

  const { yamlContent } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [loadingAsync, setLoadingAsync] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await compileYAML(yamlContent);
      resNotification(true, false);
    } catch (err) {
      resNotification(false, false, (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAsync = async () => {
    setLoadingAsync(true);

    try {
      await compileYAMLAsync(yamlContent);
      resNotification(true, true);
    } catch (err) {
      resNotification(false, true, (err as Error).message);
    } finally {
      setLoadingAsync(false);
    }
  };

  const resNotification = (success: boolean, isAsync: boolean, msg?: string) => {
    if (success) {
      showNotification({
        title: isAsync
          ? t('notifications.success.firmwareAsync.title')
          : t('notifications.success.firmware.title'),
        message: isAsync
          ? t('notifications.success.firmwareAsync.message')
          : t('notifications.success.firmware.message'),
        color: 'green',
        autoClose: 4000,
        withCloseButton: true,
      });
    } else {
      showNotification({
        title: isAsync
          ? t('notifications.error.firmwareAsync.title')
          : t('notifications.error.firmware.title'),
        message:
          msg || isAsync
            ? t('notifications.error.firmwareAsync.message')
            : t('notifications.error.firmware.message'),
        color: 'red',
        withCloseButton: true,
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleSubmit}
        disabled={!yamlContent || loading}
        leftSection={<IconCpu size={14} />}
      >
        {loading && <Loader size="xs" mr="xs" />}
        {t('button.generateFirmware.title')}
      </Button>
      <Button
        onClick={handleSubmitAsync}
        disabled={!yamlContent || loadingAsync}
        leftSection={<IconCpu size={14} />}
      >
        {loadingAsync && <Loader size="xs" mr="xs" />}
        {t('button.generateFirmwareAsync.title')}
      </Button>
    </>
  );
}
