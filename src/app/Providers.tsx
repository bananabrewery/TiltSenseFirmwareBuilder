import { AppProvider } from '@/app/AppProvider.tsx';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React from 'react';

const theme = createTheme({ fontFamily: 'Alexandria, sans-serif' });

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  </AppProvider>
);
