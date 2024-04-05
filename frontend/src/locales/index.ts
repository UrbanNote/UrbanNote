import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './en';
import fr from './fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: !import.meta.env.PROD,
    fallbackLng: localStorage.getItem('i18nextLng') ?? 'fr',
    interpolation: {
      escapeValue: false,
    },
    resources: { en, fr },
  });

export { i18n, en, fr };
