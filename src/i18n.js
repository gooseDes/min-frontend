import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const modules = import.meta.glob("./locales/*", { eager: true });

const resources = {};
for (const path in modules) {
    const match = path.match(/\/locales\/(.*?)\.json$/);
    if (!match) continue;
    const lang = match[1];
    resources[lang] = { translation: modules[path].default };
}

i18n.use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        detection: {
            order: ["querystring", "localStorage", "cookie", "navigator", "htmlTag"],
            lookupLocalStorage: "lang",
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
