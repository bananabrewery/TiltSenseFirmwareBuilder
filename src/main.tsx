import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/i18n/i18n.ts';
import { Providers } from '@/context/Providers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
