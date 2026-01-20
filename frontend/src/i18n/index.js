import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enCommon from './locales/en/common.json'
import viCommon from './locales/vi/common.json'

// Translation resources
const resources = {
  en: {
    common: enCommon,
  },
  vi: {
    common: viCommon,
  },
}

i18n
  // Detect user language from browser/localStorage
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback to English if translation not found
    defaultNS: 'common', // Default namespace
    ns: ['common'], // Namespaces

    interpolation: {
      escapeValue: false, // React already handles XSS protection
    },

    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache language in localStorage
      caches: ['localStorage'],
      // localStorage key
      lookupLocalStorage: 'i18n_language',
    },

    // Supported languages
    supportedLngs: ['en', 'vi'],

    // React specific options
    react: {
      useSuspense: false, // Disable suspense for simpler setup
    },
  })

export default i18n
