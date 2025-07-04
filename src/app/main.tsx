import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App.tsx';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/shared/i18n/i18n.ts';
import { Providers } from '@/app/Providers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
