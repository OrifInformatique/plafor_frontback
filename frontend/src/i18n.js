import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

/**
 * Automatically loads all localization files
 * from the "locales" folders of each package
 */
function loadLocales() {
    const resources = {};
    
    // Loads all JSON files in locales subdirectories
    const context = require.context('./', true, /locales\/.*\/.*\.json$/);
    
    context.keys().forEach(key => {
        // Example of a key: ./features/auth/locales/fr/auth.json
        const match = key.match(/locales\/([^/]+)\/(.+)\.json$/);
        if (match) {
            const lng = match[1];
            const namespace = match[2];
            
            // Initialize language if not exists
            if (!resources[lng]) {
                resources[lng] = {};
            }
            
            resources[lng][namespace] = context(key);
        }
    });
    console.log(resources)
    return resources;
}

const resources = loadLocales();
const namespaces = Object.keys(resources[Object.keys(resources)[0]] || {});

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
    {
        debug: false,

        supportedLngs: ["fr", "en"],
        fallbackLng: 'fr',

        detection:
        {
            // Always let query param win and avoid sticky cached language
            order: ['querystring', 'navigator', 'htmlTag', 'cookie', 'localStorage'],
            caches: [],
            lookupQuerystring: 'lng'
        },

        ns: namespaces,
        defaultNS: namespaces[0] || 'common',

        interpolation:
        {
            escapeValue: false
        },

        react:
        {
            useSuspense: true
        },

        resources
    });

export default i18n;