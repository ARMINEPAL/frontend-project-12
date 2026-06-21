import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './components/App';
import resources from './locales/index.js';
import { Provider } from 'react-redux';
import store from './store';
import filter from 'leo-profanity'
import { Provider as RollbarProvider , ErrorBoundary } from '@rollbar/react'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment:import.meta.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
}
const init = async () => {
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });
  filter.loadDictionary('ru')
  filter.add(['дурак'])
  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
    </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
