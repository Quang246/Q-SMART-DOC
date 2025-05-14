import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import messages from "./locales";
import router from "./router";
const i18n = createI18n({
  legacy: false,
  locale: "vi",
  messages,
});
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const appInstance = createApp(App);
appInstance.use(i18n);
appInstance.use(router);
appInstance.mount("#app");
