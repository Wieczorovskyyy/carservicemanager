<template>
  <header class="app-topbar-wrapper">
    <div class="app-topbar container-fluid px-4 py-3">
      <div class="d-flex align-items-center gap-4">
        <router-link to="/" class="d-flex align-items-center gap-2 text-decoration-none">
          <span class="auth-mark"><span></span><span></span><span></span></span>
        </router-link>
      </div>

      <div v-if="isLogged" class="container-fluid px-4 flex-grow-1">
        <nav class="d-flex flex-wrap gap-2 py-2">
          <router-link
            v-for="tab in roleTabs"
            :key="tab.to"
            :to="tab.to"
            class="tab-link"
            :class="{ active: isTabActive(tab.to) }"
          >
            {{ tab.label }}
          </router-link>
        </nav>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button
          type="button"
          class="theme-toggle-btn"
          @click="toggleTheme"
          :title="isDarkTheme ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'"
          :aria-label="isDarkTheme ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'"
        >
          <Sun v-if="isDarkTheme" :size="18" />
          <Moon v-else :size="18" />
        </button>

        <template v-if="isLogged">
          <div class="profile-dropdown-container">
            <div class="profile-trigger" @click.stop="toggleDropdown">
              <div class="d-flex align-items-center gap-2 cursor-pointer">
                <div class="avatar-circle">{{ initials }}</div>
                <div class="profile-meta d-none d-md-block">
                  <div class="profile-name">{{ fullName }}</div>
                  <small class="profile-role">{{ roleLabel }}</small>
                </div>
              </div>
            </div>

            <div v-if="dropdownOpen" class="custom-dropdown-menu shadow-sm border-0">
              <li>
                <router-link to="/settings" class="dropdown-item">
                  <Settings :size="14" class="me-2" /> Ustawienia konta
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" @click.stop="logout">
                  <LogOut :size="14" class="me-2" /> Wyloguj się
                </button>
              </li>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="d-flex align-items-center gap-2">
            <router-link to="/login" class="navbar-login-btn">
              Zaloguj
            </router-link>
            <router-link to="/register" class="navbar-register-btn">
              <UserPlus :size="15" />
              <span>Zarejestruj</span>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { Settings, LogOut, Moon, Sun, UserPlus } from "lucide-vue-next";
import API from "../services/api";
import { getAuthUser } from "../services/auth";

export default {
  components: { Settings, LogOut, Moon, Sun, UserPlus },
  data() {
    return {
      profile: null,
      dropdownOpen: false,
      theme: "light"
    };
  },
  computed: {
    isLogged() {
      return Boolean(getAuthUser().token);
    },
    role() {
      return getAuthUser().role;
    },
    roleLabel() {
      if (this.role === "admin") return "Administrator";
      if (this.role === "mechanic") return "Mechanik";
      return "Klient";
    },
    fullName() {
      const user = this.profile || getAuthUser();
      const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      if (name) return name;
      return this.isLogged ? "Użytkownik" : "";
    },
    initials() {
      if (this.profile?.first_name) {
        return this.profile.first_name.charAt(0).toUpperCase();
      }
      const auth = getAuthUser();
      if (auth.first_name) {
        return auth.first_name.charAt(0).toUpperCase();
      }
      return "U";
    },
    roleTabs() {
      const customerTabs = [
        { label: "Twoje zapisy", to: "/dashboard" },
        { label: "Zapisz pojazd", to: "/vehicle/new" }
      ];

      if (this.role === "admin") {
        return [
          ...customerTabs,
          { label: "Klienci", to: "/clients" },
          { label: "Kalendarz", to: "/calendar" },
          { label: "Zgłoszenia", to: "/requests" }
        ];
      }
      if (this.role === "mechanic") {
        return [
          ...customerTabs,
          { label: "Kalendarz", to: "/calendar" },
          { label: "Zgłoszenia", to: "/requests" }
        ];
      }
      return customerTabs;
    },
    isDarkTheme() {
      return this.theme === "dark";
    }
  },
  methods: {
    isTabActive(path) {
      return this.$route.path === path;
    },
    async loadProfile() {
      if (!this.isLogged) return;
      try {
        const res = await API.get("/auth/me");
        this.profile = res.data;
      } catch {
        this.profile = null;
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    applyTheme(theme) {
      this.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    },
    initTheme() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        this.applyTheme(savedTheme);
        return;
      }

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.applyTheme(prefersDark ? "dark" : "light");
    },
    toggleTheme() {
      this.applyTheme(this.isDarkTheme ? "light" : "dark");
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    }
  },
  async mounted() {
    this.initTheme();
    await this.loadProfile();
    document.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  }
};
</script>

<style scoped>
.profile-dropdown-container {
  position: relative;
  display: inline-block;
}

.theme-toggle-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(60, 60, 60);
  border-radius: 9px;
  background: transparent;
  color: #64748b;
  box-shadow: none;
  transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.theme-toggle-btn:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  transform: translateY(-1px);
}

.theme-toggle-btn:focus,
.theme-toggle-btn:focus-visible {
  outline: none;
  box-shadow: none;
}

.navbar-register-btn {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border: 1px solid #2563eb;
  border-radius: 9px;
  background: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.navbar-login-btn {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.navbar-login-btn:hover,
.navbar-login-btn:focus {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #111827;
  transform: translateY(-1px);
}

.navbar-register-btn:hover,
.navbar-register-btn:focus {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
  transform: translateY(-1px);
}

:global(:root[data-theme="dark"]) .navbar-login-btn {
  background: var(--surface-muted);
  border-color: var(--line);
  color: var(--text);
}

:global(:root[data-theme="dark"]) .navbar-login-btn:hover,
:global(:root[data-theme="dark"]) .navbar-login-btn:focus {
  background: var(--surface-hover);
  border-color: var(--primary);
  color: var(--text);
}

:global(:root[data-theme="dark"]) .theme-toggle-btn {
  background: transparent;
  border: 0 !important;
  color: #99a7c2;
  box-shadow: none !important;
  outline: none !important;
}

:global(:root[data-theme="dark"]) .theme-toggle-btn:hover,
:global(:root[data-theme="dark"]) .theme-toggle-btn:focus {
  background: rgba(125, 143, 255, 0.12);
  color: var(--primary);
}

:global(:root[data-theme="dark"]) .navbar-register-btn {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

:global(:root[data-theme="dark"]) .navbar-register-btn:hover,
:global(:root[data-theme="dark"]) .navbar-register-btn:focus {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}

.profile-trigger {
  padding: 8px 15px;
  border-radius: 8px;
  transition: background 0.2s;
}

.profile-trigger:hover {
  background: var(--surface-strong);
}

.custom-dropdown-menu {
  top: 115% !important;
  right: 0 !important;
  min-width: 220px !important;
}
</style>
