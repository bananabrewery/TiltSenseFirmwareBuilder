import React from 'react';
import { Anchor, Box, Checkbox, Group, TextInput } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext.ts';
import { IconInfoCircle } from '@tabler/icons-react';

export const BrewfatherForm: React.FC = () => {
  const { t } = useTranslation();
  const { firmwareOptions, setFirmwareOptions } = useAppContext();

  return (
    <>
      <Box mt="xl">
        <Checkbox
          label={t('configuration.brewfather.fields.enable.label')}
          checked={firmwareOptions.brewfather.enabled}
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            setFirmwareOptions((prev) => ({
              ...prev,
              brewfather: {
                ...prev.brewfather,
                enabled: checked,
              },
            }));
          }}
          mt="md"
        />
        {firmwareOptions.brewfather.enabled && (
          <TextInput
            style={{ maxWidth: '350px' }}
            label={
              <Group gap={4}>
                <Trans
                  i18nKey="configuration.brewfather.fields.key.label"
                  components={{ span: <span /> }}
                />
                <Anchor
                  href="https://docs.brewfather.app/integrations/custom-stream"
                  target="_blank"
                  size="xs"
                  c="dimmed"
                >
                  <IconInfoCircle size={16} />
                </Anchor>
              </Group>
            }
            labelProps={{ style: { marginBottom: '10px' } }}
            placeholder={t('configuration.brewfather.fields.key.placeholder')}
            value={firmwareOptions.brewfather.apiKey}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFirmwareOptions((prev) => ({
                ...prev,
                brewfather: {
                  ...prev.brewfather,
                  apiKey: value,
                },
              }));
            }}
            mt="md"
          />
        )}
      </Box>
    </>
  );
};
