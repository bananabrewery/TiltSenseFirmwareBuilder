import React, { useEffect, useState } from 'react';
import { Box, PasswordInput, TextInput, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/useAppContext';

export const WifiForm: React.FC = () => {
  const { t } = useTranslation();
  const { firmwareOptions, setFirmwareOptions } = useAppContext();
  const [showWifiPasswordTooltip, setShowWifiPasswordTooltip] = useState(false);

  useEffect(() => {
    const shouldShow =
      firmwareOptions.wifiConfig.password.length < 8 &&
      firmwareOptions.wifiConfig.password.length > 0;

    const timeout = setTimeout(() => {
      setShowWifiPasswordTooltip(shouldShow);
    }, 500);

    return () => clearTimeout(timeout);
  }, [firmwareOptions.wifiConfig.password]);

  return (
    <>
      <Box mt="xl">
        <TextInput
          style={{ maxWidth: '350px' }}
          mt="md"
          label={t('configuration.wifi.fields.SSID.label')}
          placeholder={t('configuration.wifi.fields.SSID.placeholder')}
          value={firmwareOptions.wifiConfig.SSID}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setFirmwareOptions((prev) => ({
              ...prev,
              wifiConfig: {
                ...prev.wifiConfig,
                SSID: value,
              },
            }));
          }}
        />
        <Tooltip
          label={t('configuration.wifi.fields.password.validationMessage')}
          opened={showWifiPasswordTooltip}
          color="red"
        >
          <PasswordInput
            style={{ maxWidth: '350px' }}
            label={t('configuration.wifi.fields.password.label')}
            placeholder={t('configuration.wifi.fields.password.placeholder')}
            mt="md"
            value={firmwareOptions.wifiConfig.password}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFirmwareOptions((prev) => ({
                ...prev,
                wifiConfig: {
                  ...prev.wifiConfig,
                  password: value,
                },
              }));
            }}
          />
        </Tooltip>
      </Box>
    </>
  );
};
