import { Box, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function AppFooter() {
  const { t } = useTranslation();
  const version: string = __APP_VERSION__;
  return (
    <Box component="footer" mt="xl" py="md" px="md">
      <Group justify="space-between">
        <Text size="xs">
          {t('footer.version')} {version}
        </Text>
        <Text size="xs">{t('footer.powered')}</Text>
      </Group>
    </Box>
  );
}

export default AppFooter;
