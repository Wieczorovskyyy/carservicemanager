import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Calendar from "../views/Calendar.vue";
import Settings from "../views/Settings.vue";
import VehicleNew from "../views/VehicleNew.vue";
import Requests from "../views/Requests.vue";
import Clients from "../views/Clients.vue";
import { getAuthUser } from "../services/auth";

const routes = [
  { path: "/", component: Home, meta: { guest: true } },
  { path: "/login", component: Login, meta: { guest: true, authOnly: true } },
  { path: "/register", component: Register, meta: { guest: true, authOnly: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/vehicle/new", component: VehicleNew, meta: { requiresAuth: true } },
  { path: "/requests", component: Requests, meta: { requiresAuth: true, staffOnly: true } },
  { path: "/clients", component: Clients, meta: { requiresAuth: true, adminOnly: true } },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },
  { path: "/calendar", component: Calendar, meta: { requiresAuth: true, staffOnly: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = getAuthUser();

  if (to.meta.requiresAuth && !auth.token) {
    return next("/login");
  }

  if (to.meta.staffOnly && auth.role !== "admin" && auth.role !== "mechanic") {
    return next("/dashboard");
  }

  if (to.meta.adminOnly && auth.role !== "admin") {
    return next("/dashboard");
  }

  if (to.meta.userOnly && auth.role !== "user") {
    return next("/dashboard");
  }

  if (auth.token && to.meta.authOnly) {
    return next("/dashboard");
  }

  next();
});

export default router;