import { Box, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function AppFooter() {
  const { t } = useTranslation();
  return (
    <Box component="footer" mt="xl" py="md" px="md">
      <Group justify="space-between">
        <Text size="xs">
          {t('footer.version')} {__APP_VERSION__}
        </Text>
        <Text size="xs">{t('footer.powered')}</Text>
      </Group>
    </Box>
  );
}

export default AppFooter;
