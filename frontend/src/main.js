import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles.css";

const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
document.documentElement.setAttribute(
  "data-theme",
  savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemTheme
);

createApp(App).use(router).mount("#app");
