import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

import translationKK from './locales/kk.json';
import translationEN from './locales/en.json';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources: {
      kk: { translation: translationKK },
      en: { translation: translationEN }
    },
    lng: 'kk',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false // Бұл экранның "қатып" қалмауына көмектеседі
    }
  });

export default i18n;