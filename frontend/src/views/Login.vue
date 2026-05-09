<template>
  <div class="auth-shell min-vh-100 d-flex align-items-center justify-content-center p-4">
    <router-link to="/" class="auth-back-link">
      <ArrowLeft :size="18" />
      <span>Strona główna</span>
    </router-link>

    <div class="auth-wrap">
      <div class="auth-brand mb-4 text-center">
        <div class="auth-mark mb-2">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="auth-card mx-auto">
        <h3 class="auth-title">Zaloguj się do konta</h3>

        <input v-model="email" placeholder="Email" class="form-control auth-input mb-2" />
        <input type="password" v-model="password" placeholder="Hasło" class="form-control auth-input mb-2" />

        <div class="d-flex align-items-center justify-content-between mb-3 auth-meta">
          <label class="d-flex align-items-center gap-2 mb-0">
            <input type="checkbox" />
            <span>Zapamiętaj mnie</span>
          </label>
          <a href="#" @click.prevent>Nie pamiętasz hasła?</a>
        </div>

        <button @click="login" class="btn auth-btn w-100 mb-3">Zaloguj się</button>

        <p class="auth-switch mb-0">
          Nie masz konta?
          <router-link to="/register">Załóż konto</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowLeft } from "lucide-vue-next";
import API from "../services/api";

export default {
  components: {
    ArrowLeft
  },
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async login() {
      const res = await API.post("/auth/login", {
        email: this.email,
        password: this.password
      });

      localStorage.setItem("token", res.data.token);
      this.$router.push("/dashboard");
    }
  }
};
</script>

<style scoped>
.auth-wrap {
  width: min(100%, 520px);
}
</style>