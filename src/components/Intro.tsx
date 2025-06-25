import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Center, List, Text, Title } from '@mantine/core';
import { IconRadar } from '@tabler/icons-react';

export const Intro: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box style={{ padding: 32 }}>
      <Center>
        <div style={{ textAlign: 'center' }}>
          <IconRadar size={64} />
          <Title order={1}>{t('tiltSense')}</Title>
          <Title order={3} mt="md">
            {t('subTitle')}
          </Title>
        </div>
      </Center>
      <Title order={4} mt="lg" mb="md">
        {t('welcome')}
      </Title>
      <Text mb="md">{t('introduction.text')}</Text>
      <Text mb="md">{t('introduction.capabilities.init')}</Text>
      <List spacing="md" withPadding>
        <List.Item>
          <Trans i18nKey="introduction.capabilities.1" components={{ strong: <strong /> }} />
        </List.Item>
        <List.Item>
          <Trans i18nKey="introduction.capabilities.2" components={{ strong: <strong /> }} />
        </List.Item>
        <List.Item>
          <Trans i18nKey="introduction.capabilities.3" components={{ strong: <strong /> }} />
        </List.Item>
        <List.Item>
          <Trans i18nKey="introduction.capabilities.4" components={{ strong: <strong /> }} />
        </List.Item>
        <List.Item>
          <Trans i18nKey="introduction.capabilities.5" components={{ strong: <strong /> }} />
        </List.Item>
        <List.Item>
          <Trans i18nKey="introduction.capabilities.6" components={{ strong: <strong /> }} />
        </List.Item>
      </List>
      <Text mt="md">{t('introduction.capabilities.end')}</Text>
    </Box>
  );
};
