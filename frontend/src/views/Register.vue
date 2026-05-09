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
        <h3 class="auth-title">Utwórz konto</h3>

        <div class="row g-2 mb-2">
          <div class="col-6">
            <input v-model="first_name" placeholder="Imię" class="form-control auth-input" />
          </div>
          <div class="col-6">
            <input v-model="last_name" placeholder="Nazwisko" class="form-control auth-input" />
          </div>
        </div>
        <input v-model="email" placeholder="Email" class="form-control auth-input mb-2" />
        <input v-model="phone" type="tel" placeholder="Numer telefonu" class="form-control auth-input mb-2" />
        <input type="password" v-model="password" placeholder="Hasło" class="form-control auth-input mb-2" />

        <div class="d-flex align-items-start gap-2 mb-3 auth-meta">
          <input type="checkbox" class="mt-1" />
          <span>Kontynuując, akceptujesz <a href="#" @click.prevent>Regulamin</a></span>
        </div>

        <button @click="register" class="btn auth-btn w-100 mb-3">Zarejestruj się</button>

        <p class="auth-switch mb-0">
          Masz już konto?
          <router-link to="/login">Zaloguj się</router-link>
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
    return { first_name: "", last_name: "", email: "", phone: "", password: "" };
  },
  methods: {
    async register() {
      if (!this.first_name || !this.last_name || !this.email || !this.phone || !this.password) {
        alert("Wypelnij wszystkie pola, w tym numer telefonu.");
        return;
      }

      await API.post("/auth/register", {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone: this.phone,
        password: this.password
      });

      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.auth-wrap {
  width: min(100%, 560px);
}
</style>
