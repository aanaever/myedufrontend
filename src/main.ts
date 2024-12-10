// main.ts
import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus, { useLocale } from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import i18n from './types/i18n'; // Путь к i18n
import localeRu from 'element-plus/es/locale/lang/ru';
import localeEn from 'element-plus/es/locale/lang/en'; // Добавьте английскую локаль
import './permission';
import './styles/main.css';
import { httpUtil } from '@/util/http_util';
import type { AxiosError, AxiosResponse } from 'axios';
import YoutubeIframe from '@techassi/vue-youtube-iframe';
import VueTimeago from 'vue-timeago3';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus); // Используем ElementPlus без указания начальной локали
app.use(YoutubeIframe);
app.use(router);
app.use(i18n); // Зарегистрируйте i18n

app.use(VueTimeago, {
  locale: 'ru',
  locales: {
    en: enUS,
    ru: ru,
  },
  formatDistanceToNow: formatDistanceToNow,
});

// Добавьте наблюдателя для изменения локали ElementPlus
watch(
  () => i18n.global.locale.value, // Получите значение локали
  (newLocale) => {
    const elementLocale = newLocale === 'ru' ? localeRu : localeEn;
    useLocale().locale.value = elementLocale;
  },
  { immediate: true } // Добавьте, чтобы сразу установить начальную локаль
);

console.log('Current locale:', i18n.global.locale.value); // Должно быть 'ru'

// Redirect if 500 Server Error occurs
httpUtil.interceptors.response.use(
  (response: AxiosResponse) => response,
  function (error: AxiosError) {
    if (error.response && error.response.status === 500) {
      return router.replace('/Error500');
    }
    return Promise.reject(error);
  }
);

app.mount('#app');
