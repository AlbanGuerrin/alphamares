import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";
import EN from "./assets/i18n/translations/en.json";
import FR from "./assets/i18n/translations/fr.json";

const resources = {
  en: {
    translation: EN
  },
  fr: {
    translation: FR
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.ENV === "development",
  });

export default i18n;