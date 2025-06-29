import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Title } from '@mantine/core';
import { TiltList } from '@/components/configuration/TilltList';
import { WifiForm } from '@/components/configuration/WifiForm';
import { BrewfatherForm } from '@/components/configuration/BrewfatherForm';
import { HomeAssistantForm } from '@/components/configuration/HomeAssistantForm';

export const ConfigurationForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box style={{ padding: 32 }}>
      <Title order={4} mb="md">
        {t('configuration.text')}
      </Title>
      <Stack>
        <TiltList />
        <WifiForm />
        <BrewfatherForm />
        <HomeAssistantForm />
      </Stack>
    </Box>
  );
};
