import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
    {
        debug: false,

        supportedLngs: ["fr"],
        fallbackLng: 'fr',

        backend:
        {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        },

        ns: ["annualAverage", "apprenticesList", "buttons", "teachingDomain", "texts", "titles"],

        detection:
        {
            order: ["querystring", "cookie", "localStorage", "navigator"],
            caches: ["localStorage", "cookie"]
        },

        interpolation:
        {
            escapeValue: false
        },

        react:
        {
            useSuspense: true
        }
    });

export default i18n;