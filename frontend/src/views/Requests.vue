<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />

    <main class="container py-5 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-wrapper bg-white shadow-sm border rounded-3 p-2">
            <ClipboardList :size="24" class="text-accent" />
          </div>
          <div>
            <h2 class="fw-bold text-dark mb-0">Zgłoszenia serwisowe</h2>
            <p class="text-muted mb-0">Zarządzaj zleceniami, przypisuj terminy i aktualizuj statusy</p>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-warning-subtle rounded-3 text-warning">
              <Clock :size="20" />
            </div>
            <div>
              <div class="small text-muted">Nowe / Oczekujące</div>
              <div class="fw-bold h5 mb-0">{{ stats.pending }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-primary-subtle rounded-3 text-primary">
              <Wrench :size="20" />
            </div>
            <div>
              <div class="small text-muted">W trakcie serwisu</div>
              <div class="fw-bold h5 mb-0">{{ stats.in_progress }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-danger-subtle rounded-3 text-danger">
              <AlertCircle :size="20" />
            </div>
            <div>
              <div class="small text-muted">Problemy / Błędy</div>
              <div class="fw-bold h5 mb-0">{{ stats.error }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-success-subtle rounded-3 text-success">
              <CheckCircle :size="20" />
            </div>
            <div>
              <div class="small text-muted">Zakończone</div>
              <div class="fw-bold h5 mb-0">{{ stats.done }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        <div class="table-responsive">
          <table class="table align-middle mb-0 custom-table">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Klient</th>
                <th>Pojazd</th>
                <th>Usługa i Opis</th>
                <th>Status</th>
                <th>Termin</th>
                <th class="text-end pe-4">Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.id" class="appointment-row">
                <td class="ps-4 py-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="client-avatar" :style="{ background: getRandomColor(a.first_name) }">
                      {{ a.first_name ? a.first_name.charAt(0) : 'U' }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ a.first_name }} {{ a.last_name }}</div>
                      <div class="small text-muted">ID: #{{ a.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <Car :size="16" class="text-muted" />
                    <span class="fw-semibold text-dark">{{ a.car_model }}</span>
                  </div>
                </td>
                <td>
                  <div class="fw-semibold text-dark">{{ a.service_type }}</div>
                  <div class="small text-muted text-truncate" style="max-width: 200px;" v-if="a.description">
                    {{ a.description }}
                  </div>
                </td>
                <td>
                  <span :class="['badge rounded-pill px-3 py-2', statusBadgeClass(a.status)]">
                    {{ statusLabel(a.status) }}
                  </span>
                  <div v-if="a.notes" class="small text-danger mt-1">
                    <AlertCircle :size="12" class="me-1" /> Notatka: {{ a.notes }}
                  </div>
                </td>
                <td>
                  <div v-if="a.appointment_date">
                    <div class="fw-semibold text-dark">{{ formatDate(a.appointment_date) }}</div>
                    <div class="small text-muted">{{ formatTime(a.appointment_date) }}</div>
                  </div>
                  <div v-else class="text-muted small italic">Nie przypisano</div>
                </td>
                <td class="text-end pe-4">
                  <button class="btn btn-sm btn-white border shadow-sm px-3" @click="editAppointment(a)">
                    <Edit2 :size="14" class="me-1" /> Zarządzaj
                  </button>
                </td>
              </tr>
              <tr v-if="appointments.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="text-muted">
                    <Inbox :size="48" class="mb-3 opacity-25" />
                    <p class="mb-0">Brak zgłoszeń do wyświetlenia.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal-content rounded-4 shadow-lg border-0 p-0">
        <div class="modal-header-custom p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-bold">Zarządzaj zgłoszeniem #{{ editingApt.id }}</h5>
          <button class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body-custom p-4">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted text-uppercase">Status zgłoszenia</label>
              <select v-model="editingApt.status" class="form-select bg-light border-0 py-2">
                <option value="new">Nowe / Oczekujące</option>
                <option value="accepted">Zaakceptowane</option>
                <option value="in_progress">W trakcie serwisu</option>
                <option value="done">Zakończone</option>
                <option value="error">Błąd / Problem</option>
                <option value="rejected">Odrzucone</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted text-uppercase">Termin wizyty</label>
              <input type="datetime-local" v-model="editingApt.appointment_date" class="form-control bg-light border-0 py-2">
            </div>
            <div class="col-12 mt-3">
              <label class="form-label small fw-bold text-muted text-uppercase">Notatki administratora / Problemy</label>
              <textarea 
                v-model="editingApt.notes" 
                class="form-control bg-light border-0" 
                rows="3" 
                placeholder="Np. Brak części, Nieobsługiwany model auta, Skontaktuj się z klientem..."
              ></textarea>
              <div class="form-text small text-muted">Ta notatka będzie widoczna dla klienta przy statusie "Problem".</div>
            </div>
          </div>
        </div>
        <div class="modal-footer-custom p-4 border-top d-flex justify-content-between gap-2">
          <button class="btn btn-outline-danger px-4 d-flex align-items-center gap-2" @click="deleteAppointment" :disabled="saving">
            <Trash2 :size="18" /> Usuń
          </button>
          <div class="d-flex gap-2">
          <button class="btn btn-light px-4" @click="closeModal">Anuluj</button>
          <button class="btn btn-accent px-4 fw-bold" @click="saveChanges" :disabled="saving">
            {{ saving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  ClipboardList, 
  Car, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wrench, 
  Edit2, 
  Inbox,
  Trash2
} from "lucide-vue-next";
import API from "../services/api";
import Navbar from "../components/Navbar.vue";
import { appointmentStatusBadgeClass, appointmentStatusLabel } from "../constants/appointmentStatus";

export default {
  name: "Requests",
  components: { 
    Navbar, 
    ClipboardList, 
    Car, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    Wrench, 
    Edit2, 
    Inbox,
    Trash2
  },
  data() {
    return {
      appointments: [],
      stats: {
        pending: 0,
        in_progress: 0,
        error: 0,
        done: 0
      },
      showModal: false,
      editingApt: null,
      saving: false
    };
  },
  watch: {
    '$route.query.id': {
      handler(newId) {
        if (newId && this.appointments.length > 0) {
          const apt = this.appointments.find(a => a.id == newId);
          if (apt) this.editAppointment(apt);
        }
      },
      immediate: false
    }
  },
  methods: {
    async loadAppointments() {
      try {
        const [aptRes, statsRes] = await Promise.allSettled([
          API.get("/appointments"),
          API.get("/appointments/stats")
        ]);

        if (aptRes.status === "fulfilled") {
          this.appointments = aptRes.value.data;
        }

        if (statsRes.status === "fulfilled") {
          this.stats = statsRes.value.data;
        }
      } catch (err) {
        console.error("Błąd ładowania zgłoszeń:", err);
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("pl-PL", { day: 'numeric', month: 'long', year: 'numeric' });
    },
    formatTime(date) {
      if (!date) return "";
      return new Date(date).toLocaleTimeString("pl-PL", { hour: '2-digit', minute: '2-digit' });
    },
    statusBadgeClass(status) {
      const classes = {
        'new': 'bg-warning-subtle text-warning border border-warning-subtle',
        'accepted': 'bg-info-subtle text-info border border-info-subtle',
        'in_progress': 'bg-primary-subtle text-primary border border-primary-subtle',
        'done': 'bg-success-subtle text-success border border-success-subtle',
        'error': 'bg-danger-subtle text-danger border border-danger-subtle',
        'rejected': 'bg-secondary-subtle text-secondary border border-secondary-subtle',
        'cancelled': 'bg-secondary-subtle text-secondary border border-secondary-subtle'
      };
      return appointmentStatusBadgeClass(status);
    },
    statusLabel(status) {
      const labels = {
        'new': 'Nowe / Oczekujące',
        'accepted': 'Zaakceptowane',
        'in_progress': 'W serwisie',
        'done': 'Zakończone',
        'error': 'Błąd / Problem',
        'rejected': 'Odrzucone',
        'cancelled': 'Anulowane'
      };
      return appointmentStatusLabel(status);
    },
    getRandomColor(name) {
      const colors = ["#2563eb", "#60a5fa", "#f87171", "#3b82f6", "#0ea5e9", "#a78bfa"];
      if (!name) return colors[0];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    },
    formatDateTimeForInput(date) {
      if (!date) return "";
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return "";
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const day = String(parsed.getDate()).padStart(2, "0");
      const hours = String(parsed.getHours()).padStart(2, "0");
      const minutes = String(parsed.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    editAppointment(apt) {
      this.editingApt = { 
        ...apt, 
        appointment_date: this.formatDateTimeForInput(apt.appointment_date)
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editingApt = null;
      if (this.$route.query.id) {
        this.$router.replace({ query: {} });
      }
    },
    async saveChanges() {
      this.saving = true;
      try {
        await API.put(`/appointments/${this.editingApt.id}`, {
          status: this.editingApt.status,
          appointment_date: this.editingApt.appointment_date || null,
          notes: this.editingApt.notes
        });
        await this.loadAppointments();
        this.closeModal();
      } catch (err) {
        alert(err.response?.data?.message || "Błąd podczas zapisywania zmian.");
      } finally {
        this.saving = false;
      }
    },
    async deleteAppointment() {
      if (!this.editingApt) return;
      if (!confirm(`Czy na pewno chcesz usunąć zgłoszenie #${this.editingApt.id}?`)) return;

      this.saving = true;
      try {
        await API.delete(`/appointments/${this.editingApt.id}`);
        await this.loadAppointments();
        this.closeModal();
      } catch (err) {
        alert(err.response?.data?.message || "Błąd podczas usuwania zgłoszenia.");
      } finally {
        this.saving = false;
      }
    }
  },
  async mounted() {
    await this.loadAppointments();
    
    const aptId = this.$route.query.id;
    if (aptId) {
      const apt = this.appointments.find(a => a.id == aptId);
      if (apt) {
        this.editAppointment(apt);
      }
    }
  }
};
</script>

<style scoped>
.appointment-row:hover {
  background-color: #f8fafc;
}
.badge {
  font-weight: 600;
  font-size: 0.75rem;
}
.client-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
}
.btn-white {
  background-color: white;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
}
.btn-white:hover {
  background-color: #f8fafc;
  color: #000;
}

/* MODAL STYLES */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(4px);
}
.custom-modal-content {
  background: white;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

</style>
