import {createSSRApp} from "vue";
import * as pinia from "pinia";
import App from "./App.vue";
import "@/common/storage";
import "@/common/style/index.scss";

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia.createPinia());
  return {
    app,
    pinia,
  };
}
