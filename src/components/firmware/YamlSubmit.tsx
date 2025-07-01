import { Button, Loader } from '@mantine/core';
import { compileYAMLAsync } from '@/api/uploadYaml';
import { useState } from 'react';
import { useAppContext } from '@/context/useAppContext.ts';
import { IconCpu } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';

export function YamlSubmit() {
  const { t } = useTranslation();

  const { yamlContent } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleSubmitAsync = async () => {
    setLoading(true);

    try {
      await compileYAMLAsync(yamlContent);
      resNotification(true);
    } catch (err) {
      resNotification(false, (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resNotification = (success: boolean, msg?: string) => {
    if (success) {
      showNotification({
        title: t('notifications.success.firmware.title'),
        message: t('notifications.success.firmware.message'),
        color: 'green',
        autoClose: 4000,
        withCloseButton: true,
      });
    } else {
      showNotification({
        title: t('notifications.error.firmware.title'),
        message: msg || t('notifications.error.firmware.message'),
        color: 'red',
        withCloseButton: true,
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleSubmitAsync}
        disabled={!yamlContent || loading}
        leftSection={<IconCpu size={14} />}
      >
        {loading && <Loader size="xs" mr="xs" />}
        {t('button.generateFirmware.title')}
      </Button>
    </>
  );
}
