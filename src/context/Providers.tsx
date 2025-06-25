import { AppProvider } from '@/context/AppProvider';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React from 'react';

const theme = createTheme({});

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  </AppProvider>
);
