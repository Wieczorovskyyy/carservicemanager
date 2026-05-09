<template>
  <div class="appointment-form-card bg-white p-4 rounded-4 shadow-sm border-0">
    <div class="d-flex align-items-center gap-2 mb-4">
      <Wrench :size="20" class="text-muted" />
      <h5 class="mb-0 fw-bold text-dark">Szczegóły zgłoszenia</h5>
    </div>

    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label small fw-bold text-muted text-uppercase">Marka pojazdu</label>
        <div class="input-group custom-input-group">
          <span class="input-group-text bg-white border-end-0"><Car :size="16" /></span>
          <input v-model="form.brand" class="form-control bg-white border-start-0 text-black" placeholder="np. BMW, Audi..." />
        </div>
      </div>
      <div class="col-md-6">
        <label class="form-label small fw-bold text-muted text-uppercase">Model pojazdu</label>
        <div class="input-group custom-input-group">
          <span class="input-group-text bg-white border-end-0"><Activity :size="16" /></span>
          <input v-model="form.model" class="form-control bg-white border-start-0 text-black" placeholder="np. Seria 3, A4..." />
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label small fw-bold text-muted text-uppercase">Przebieg</label>
        <div class="input-group custom-input-group">
          <span class="input-group-text bg-white border-end-0"><Gauge :size="16" /></span>
          <input
            v-model.number="form.mileage"
            type="number"
            min="0"
            step="1"
            class="form-control bg-white border-start-0 text-black"
            placeholder="np. 185000"
          />
          <span class="input-group-text bg-white border-start-0">km</span>
        </div>
      </div>

      <div class="col-12 mt-3">
        <label class="form-label small fw-bold text-muted text-uppercase">Rodzaj usługi</label>
        <div class="input-group custom-input-group">
          <span class="input-group-text bg-white border-end-0"><Tool :size="16" /></span>
          <select v-model="form.service_type" class="form-select bg-white border-start-0 text-black">
            <option value="" disabled>Wybierz rodzaj usługi</option>
            <option value="Przegląd okresowy">Przegląd okresowy</option>
            <option value="Wymiana oleju i filtrów">Wymiana oleju i filtrów</option>
            <option value="Naprawa układu hamulcowego">Naprawa układu hamulcowego</option>
            <option value="Naprawa zawieszenia">Naprawa zawieszenia</option>
            <option value="Diagnostyka komputerowa">Diagnostyka komputerowa</option>
            <option value="Inna naprawa">Inna naprawa (opis poniżej)</option>
          </select>
        </div>
      </div>

      <div class="col-12 mt-3">
        <label class="form-label small fw-bold text-muted text-uppercase">Opis problemu / Uwagi</label>
        <div class="input-group custom-input-group">
          <span class="input-group-text bg-white border-end-0 align-items-start pt-2"><ClipboardList :size="16" /></span>
          <textarea 
            v-model="form.description" 
            class="form-control bg-white border-start-0 text-black" 
            rows="4" 
            placeholder="Opisz co dzieje się z autem..."
          ></textarea>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
      <div class="text-muted small">
        <Info :size="14" class="me-1" />
        Termin zostanie przypisany przez administratora.
      </div>
      <button 
        class="btn btn-accent px-4 py-2 fw-bold d-flex align-items-center gap-2" 
        @click="submitForm"
        :disabled="loading"
      >
        <Send :size="18" v-if="!loading" />
        <RefreshCw :size="18" v-else class="spin" />
        {{ loading ? 'Wysyłanie...' : 'Wyślij zgłoszenie' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="message" :class="['alert mt-4 shadow-sm d-flex align-items-center gap-2 mb-0', messageType]">
        <CheckCircle v-if="messageType === 'alert-success'" :size="20" />
        <AlertCircle v-else :size="20" />
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { 
  Car, 
  Activity, 
  Wrench as Tool, 
  ClipboardList, 
  Send, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Wrench,
  Gauge
} from "lucide-vue-next";
import API from "../services/api";

export default {
  name: "AppointmentForm",
  components: { 
    Car, 
    Activity, 
    Tool, 
    ClipboardList, 
    Send, 
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Info,
    Wrench,
    Gauge
  },
  data() {
    return {
      form: {
        brand: "",
        model: "",
        mileage: null,
        service_type: "",
        description: ""
      },
      loading: false,
      message: "",
      messageType: "alert-success"
    };
  },
  methods: {
    async submitForm() {
      if (!this.form.brand || !this.form.model || !this.form.service_type) {
        this.showStatus("Wypełnij podstawowe dane (marka, model, rodzaj usługi)", "alert-danger");
        return;
      }

      if (this.form.mileage !== null && this.form.mileage !== "" && this.form.mileage < 0) {
        this.showStatus("Przebieg nie moze byc ujemny", "alert-danger");
        return;
      }

      this.loading = true;
      try {
        // Łączymy markę i model w jedno pole car_model dla kompatybilności z obecnym backendem
        const carFullModel = `${this.form.brand} ${this.form.model}`;
        
        await API.post("/appointments", {
          car_model: carFullModel,
          mileage: this.form.mileage || null,
          service_type: this.form.service_type,
          description: this.form.description,
          appointment_date: null // Administrator przypisze datę
        });

        this.showStatus("Zgłoszenie zostało wysłane pomyślnie!", "alert-success");
        
        // Czyścimy formularz
        this.form = {
          brand: "",
          model: "",
          mileage: null,
          service_type: "",
          description: ""
        };
        
        this.$emit("created");
      } catch (error) {
        this.showStatus(error.response?.data?.message || "Błąd podczas wysyłania zgłoszenia", "alert-danger");
      } finally {
        this.loading = false;
      }
    },
    showStatus(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
      }, 4000);
    }
  }
};
</script>

<style scoped>
.custom-input-group .input-group-text {
  color: #64748b;
  border: 1px solid #e2e8f0;
}
.custom-input-group .form-control,
.custom-input-group .form-select {
  border: 1px solid #e2e8f0;
  padding: 10px 15px;
}
.custom-input-group .form-control:focus,
.custom-input-group .form-select:focus {
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
