import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/i18n/i18n';
import { Providers } from '@/providers/Providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
