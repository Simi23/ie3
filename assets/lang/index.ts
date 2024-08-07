import { huLang } from "./hu";

// TODO: delegate this to envvar/nuxt runtime config
const lang = "hu";

const localeCollection = {
  hu: huLang,
};

export function getLocale(id: string): string {
  return localeCollection[lang][id];
}
