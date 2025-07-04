import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/shared/i18n/locales/en.ts';
import es from '@/shared/i18n/locales/es.ts';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en,
      es,
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
    },
  })
  .then();
