// src/types/i18n.ts
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    login: 'Login',
    signup: 'Signup',
    logout: 'Logout',
    welcome: 'Welcome',
  },
  ru: {
    login: 'Войти',
    signup: 'Регистрация',
    logout: 'Выйти',
    welcome: 'Добро пожаловать',
  }
};

const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD',
    },
  },
  ru: {
    currency: {
      style: 'currency',
      currency: 'RUB',
    },
  },
};

const i18n = createI18n({
  legacy: false, // Отключите режим legacy
  locale: 'ru', // Установите язык по умолчанию
  fallbackLocale: 'en', // Язык по умолчанию на случай, если перевод отсутствует
  messages,
  numberFormats,
});

export default i18n;
