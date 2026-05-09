<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />

    <main class="container py-5 flex-grow-1">
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="settings-icon-wrapper bg-white shadow-sm border rounded-3 p-2">
          <SettingsIcon :size="24" class="text-accent" />
        </div>
        <h2 class="fw-bold text-dark mb-0">Ustawienia konta</h2>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="settings-card bg-white p-4 rounded-4 shadow-sm border-0">
            <div class="d-flex align-items-center gap-2 mb-4">
              <User :size="20" class="text-muted" />
              <h5 class="mb-0 fw-bold text-dark">Dane profilu</h5>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted text-uppercase">Imię</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0"><User :size="16" /></span>
                  <input v-model="profile.first_name" class="form-control bg-white border-start-0 text-black" placeholder="Twoje imię" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted text-uppercase">Nazwisko</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0"><User :size="16" /></span>
                  <input v-model="profile.last_name" class="form-control bg-white border-start-0 text-black" placeholder="Twoje nazwisko" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted text-uppercase">Email</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0"><Mail :size="16" /></span>
                  <input v-model="profile.email" type="email" class="form-control bg-white border-start-0 text-black" placeholder="Twój adres email" />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted text-uppercase">Telefon</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0"><Phone :size="16" /></span>
                  <input v-model="profile.phone" class="form-control bg-white border-start-0 text-black" placeholder="Twój numer telefonu" />
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-top">
              <button 
                class="btn btn-accent px-4 py-2 fw-bold d-flex align-items-center gap-2" 
                @click="saveProfile"
                :disabled="loading"
              >
                <Save :size="18" />
                {{ loading ? 'Zapisywanie...' : 'Zapisz profil' }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="settings-card bg-white p-4 rounded-4 shadow-sm border-0">
            <div class="d-flex align-items-center gap-2 mb-4">
              <Lock :size="20" class="text-muted" />
              <h5 class="mb-0 fw-bold text-dark">Zmiana hasła</h5>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted text-uppercase">Aktualne hasło</label>
              <div class="input-group custom-input-group">
                <span class="input-group-text bg-white border-end-0"><Key :size="16" /></span>
                <input v-model="password.current_password" type="password" class="form-control bg-white border-start-0 text-black" placeholder="••••••••" />
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-bold text-muted text-uppercase">Nowe hasło</label>
              <div class="input-group custom-input-group">
                <span class="input-group-text bg-white border-end-0"><Key :size="16" /></span>
                <input v-model="password.new_password" type="password" class="form-control bg-white border-start-0 text-black" placeholder="••••••••" />
              </div>
            </div>

            <button 
              class="btn btn-outline-dark w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2" 
              @click="changePassword"
              :disabled="loadingPass"
            >
              <RefreshCw :size="18" :class="{ 'spin': loadingPass }" />
              Zmień hasło
            </button>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="message" :class="['alert mt-4 shadow-sm d-flex align-items-center gap-2', messageType]">
          <CheckCircle v-if="messageType === 'alert-success'" :size="20" />
          <AlertCircle v-else :size="20" />
          {{ message }}
        </div>
      </transition>
    </main>
  </div>
</template>

<script>
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Key, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-vue-next";
import API from "../services/api";
import Navbar from "../components/Navbar.vue";

export default {
  components: { 
    Navbar, 
    SettingsIcon, 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Key, 
    Save, 
    RefreshCw,
    CheckCircle,
    AlertCircle
  },
  data() {
    return {
      profile: {
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
      },
      password: {
        current_password: "",
        new_password: ""
      },
      message: "",
      messageType: "alert-success",
      loading: false,
      loadingPass: false
    };
  },
  methods: {
    async loadProfile() {
      try {
        const res = await API.get("/auth/me");
        this.profile = {
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          phone: res.data.phone || ""
        };
      } catch (error) {
        this.showStatus("Błąd podczas ładowania profilu", "alert-danger");
      }
    },
    async saveProfile() {
      if (!this.profile.first_name || !this.profile.last_name || !this.profile.email) {
        this.showStatus("Wypełnij wymagane pola (imię, nazwisko, email)", "alert-danger");
        return;
      }

      this.loading = true;
      try {
        await API.put("/auth/me", this.profile);
        this.showStatus("Profil został pomyślnie zaktualizowany", "alert-success");
        // Można dodać odświeżenie danych w Navbarze przez event bus lub prościej przeładowanie
      } catch (error) {
        this.showStatus(error.response?.data?.message || "Błąd podczas zapisywania profilu", "alert-danger");
      } finally {
        this.loading = false;
      }
    },
    async changePassword() {
      if (!this.password.current_password || !this.password.new_password) {
        this.showStatus("Wprowadź oba hasła", "alert-danger");
        return;
      }

      this.loadingPass = true;
      try {
        await API.put("/auth/change-password", this.password);
        this.password.current_password = "";
        this.password.new_password = "";
        this.showStatus("Hasło zostało zmienione pomyślnie", "alert-success");
      } catch (error) {
        this.showStatus(error.response?.data?.message || "Błąd podczas zmiany hasła", "alert-danger");
      } finally {
        this.loadingPass = false;
      }
    },
    showStatus(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
      }, 4000);
    }
  },
  async mounted() {
    await this.loadProfile();
  }
};
</script>

<style scoped>
.settings-icon-wrapper {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-card {
  transition: transform 0.2s;
}

.custom-input-group .input-group-text {
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.custom-input-group .form-control {
  border: 1px solid #e2e8f0;
  padding: 10px 15px;
}

.custom-input-group .form-control:focus {
  background-color: #fff !important;
  box-shadow: none;
  border-color: #2563eb;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
