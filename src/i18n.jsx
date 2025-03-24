import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { login: "Login", register: "Register", save: "Save" } },
  de: {
    translation: {
      login: "Anmelden",
      register: "Registrieren",
      save: "Speichern",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({ resources, lng: "de", interpolation: { escapeValue: false } });

export default i18n;
