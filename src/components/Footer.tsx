import { Box, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

function AppFooter() {
  const { t } = useTranslation();
  const clickCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const removeStorage = () => {
    localStorage.removeItem('tiltSenseLastFirmwareCompile');
    localStorage.removeItem('tiltSenseConfig');
    localStorage.removeItem('tiltSenseActiveStep');
    console.log('🧹 LocalStorage cleared');
    window.location.reload();
  };

  const handleVersionClick = () => {
    clickCount.current += 1;

    if (clickCount.current === 7) {
      removeStorage();
      clickCount.current = 0;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clickCount.current = 0;
    }, 5000);
  };

  return (
    <Box component="footer" mt="xl" py="md" px="md">
      <Group justify="space-between">
        <Text size="xs" c="dimmed" onClick={handleVersionClick}>
          {t('footer.version')} {__APP_VERSION__}
        </Text>
        <Text size="xs">{t('footer.powered')}</Text>
      </Group>
    </Box>
  );
}

export default AppFooter;
