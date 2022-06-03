import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type Locale = string;
export type LocaleMessage = string;

export type Resources = {
  [key: Locale]: { translation: { [key: LocaleMessage]: LocaleMessage } };
};
function getLocale(): Locale {
  const cookieLanguage = sessionStorage.getItem("language");
  if (cookieLanguage) return cookieLanguage;

  const navigatorLanguage = navigator.language.toLowerCase();
  if (navigatorLanguage) return navigatorLanguage;

  return process.env.VUE_APP_I18N_LOCALE || "en";
}

function loadLocaleMessages(): Resources {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: Resources = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = { translation: locales(key) };
    }
  });
  return messages;
}

const resources = loadLocaleMessages();
i18n.use(initReactI18next).init({
  resources,
  lng: getLocale(),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
