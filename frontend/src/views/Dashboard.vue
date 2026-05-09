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
            <h2 class="fw-bold text-dark mb-0">Twoje zapisy</h2>
            <p class="text-muted mb-0">Historia i status Twoich zgłoszeń serwisowych</p>
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
              <div class="small text-muted">Oczekujące</div>
              <div class="fw-bold h5 mb-0">{{ stats.pending }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-primary-subtle rounded-3 text-primary">
              <CalendarCheck :size="20" />
            </div>
            <div>
              <div class="small text-muted">Zaplanowane</div>
              <div class="fw-bold h5 mb-0">{{ stats.accepted }}</div>
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
                <th class="ps-4">Pojazd</th>
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
                    <div class="car-icon p-2 bg-light rounded-3">
                      <Car :size="20" class="text-muted" />
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ a.car_model }}</div>
                      <div class="small text-muted">ID: #{{ a.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="fw-semibold text-dark">{{ a.service_type }}</div>
                  <div class="small text-muted text-truncate" style="max-width: 250px;" v-if="a.description">
                    {{ a.description }}
                  </div>
                </td>
                <td>
                  <span :class="['badge rounded-pill px-3 py-2', statusBadgeClass(a.status)]">
                    {{ statusLabel(a.status) }}
                  </span>
                </td>
                <td>
                  <div v-if="a.appointment_date">
                    <div class="fw-semibold text-dark">{{ formatDate(a.appointment_date) }}</div>
                    <div class="small text-muted">{{ formatTime(a.appointment_date) }}</div>
                  </div>
                  <div v-else class="text-muted small italic">Oczekiwanie na termin</div>
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2" v-if="canPerformActions(a.status)">
                    <button 
                      class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                      @click="performAction(a.id, 'cancel')"
                      title="Anuluj wizytę"
                    >
                      <XCircle :size="14" /> Anuluj
                    </button>
                  </div>
                  <div v-else class="text-muted small">Brak akcji</div>
                </td>
              </tr>
              <tr v-if="appointments.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="text-muted">
                    <Inbox :size="48" class="mb-3 opacity-25" />
                    <p class="mb-0">Nie masz jeszcze żadnych zapisów.</p>
                    <router-link to="/vehicle/new" class="btn btn-accent btn-sm mt-3">Zapisz pojazd teraz</router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { 
  ClipboardList, 
  RefreshCw, 
  Car, 
  Clock, 
  CheckCircle, 
  CalendarCheck, 
  XCircle, 
  CalendarDays,
  Inbox
} from "lucide-vue-next";
import API from "../services/api";
import Navbar from "../components/Navbar.vue";
import { appointmentStatusBadgeClass, appointmentStatusLabel } from "../constants/appointmentStatus";

export default {
  name: "Dashboard",
  components: { 
    Navbar, 
    ClipboardList, 
    RefreshCw, 
    Car, 
    Clock, 
    CheckCircle, 
    CalendarCheck, 
    XCircle, 
    CalendarDays,
    Inbox
  },
  data() {
    return {
      appointments: [],
      loading: false,
      stats: {
        pending: 0,
        accepted: 0,
        done: 0
      }
    };
  },
  methods: {
    async loadAppointments() {
      this.loading = true;
      try {
        const res = await API.get("/appointments/my");
        this.appointments = res.data;
        this.calculateStats();
      } catch (err) {
        console.error("Błąd ładowania zapisów:", err);
      } finally {
        this.loading = false;
      }
    },
    calculateStats() {
      this.stats.pending = this.appointments.filter(a => !a.status || a.status === 'new').length;
      this.stats.accepted = this.appointments.filter(a => a.status === 'accepted').length;
      this.stats.done = this.appointments.filter(a => a.status === 'done').length;
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
      return appointmentStatusBadgeClass(status);
    },
    statusLabel(status) {
      const labels = {
        'new': 'Oczekujące',
        'accepted': 'Zaakceptowane',
        'in_progress': 'W serwisie',
        'done': 'Zakończone',
        'error': 'Problem',
        'cancelled': 'Anulowane',
        'change_requested': 'Prośba o zmianę'
      };
      return appointmentStatusLabel(status);
    },
    canPerformActions(status) {
      return ['new', 'accepted'].includes(status || 'new');
    },
    async performAction(id, action) {
      const confirmMsg = "Czy na pewno chcesz anulować to zgłoszenie?";
      
      if (!confirm(confirmMsg)) return;

      try {
        await API.patch(`/appointments/${id}/action`, { action });
        await this.loadAppointments();
      } catch (err) {
        alert("Błąd podczas wykonywania akcji.");
      }
    }
  },
  async mounted() {
    await this.loadAppointments();
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
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
