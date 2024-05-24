// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa los archivos de traducción
import translationEN from './locales/en/traslations.json';
import translationES from './locales/es/traslations.json';

const resources = {
    en: {
        translation: translationEN
    },
    es: {
        translation: translationES
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'es', // Idioma por defecto
        interpolation: {
            escapeValue: false // React ya se encarga de escapar por defecto
        }
    });

export default i18n;
