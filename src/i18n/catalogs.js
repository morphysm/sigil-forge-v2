import en from './locales/en';
import is from './locales/is';
import ja from './locales/ja';
import ru from './locales/ru';

export const languages = {
  en: 'English',
  ja: '日本語',
  ru: 'Русский',
  is: 'Íslenska',
};

const catalogs = { en, ja, ru, is };
const interfaceKeys = Object.keys(en.messages);
const readingFields = {
  legacy: ['name', 'theme', 'text'],
  expanded: [
    'name', 'theme', 'archetype', 'morphystic', 'intentReflection',
    'tension', 'question', 'closing', 'artAlt',
  ],
};

function hasTextFields(record, keys) {
  return Boolean(record) && keys.every(key => typeof record[key] === 'string' && record[key].trim());
}

export function getInterface(locale) {
  const messages = catalogs[locale]?.messages;
  return hasTextFields(messages, interfaceKeys)
    ? { language: locale, messages }
    : { language: 'en', messages: en.messages };
}

export function getReading(locale, cardId, edition = 'legacy') {
  const fields = readingFields[edition];
  if (!fields) return null;

  const localized = catalogs[locale]?.tarot?.[edition]?.[cardId];
  if (hasTextFields(localized, fields)) return { ...localized, language: locale };

  const english = en.tarot[edition]?.[cardId];
  return hasTextFields(english, fields) ? { ...english, language: 'en' } : null;
}
