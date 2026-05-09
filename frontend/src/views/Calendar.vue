<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />

    <main class="container-fluid py-4 px-4 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm">
        <div class="d-flex align-items-center gap-3">
          <div class="calendar-icon-wrapper bg-light border">
            <Calendar :size="24" class="text-accent" />
          </div>
          <div>
            <h4 class="mb-0 fw-bold text-black">{{ formattedCurrentDateRange }}</h4>
          </div>
          <div class="d-flex gap-1 ms-3">
            <button class="btn btn-nav-square border" @click="prevWeek">
              <ChevronLeft :size="18" class="text-black" />
            </button>
            <button class="btn btn-nav-square border" @click="nextWeek">
              <ChevronRight :size="18" class="text-black" />
            </button>
          </div>
        </div>
      </div>

      <div class="calendar-card bg-white rounded-4 shadow-sm overflow-hidden">
        <div class="calendar-grid overflow-auto">
          <div class="grid-header d-flex border-bottom">
            <div class="time-column"></div>
            <div 
              v-for="day in weekDays" 
              :key="day.date" 
              class="day-column-header flex-grow-1 text-center py-3 border-start"
              :class="{ 'is-today': isToday(day.date) }"
            >
              <div class="fw-bold text-dark text-capitalize">{{ day.name }} {{ day.dayNum }}</div>
            </div>
          </div>

          <div class="grid-body position-relative">
            <div v-for="hour in hours" :key="hour" class="hour-row d-flex border-bottom">
              <div class="time-column text-muted small py-3 text-center">
                {{ formatHour(hour) }}
              </div>
              <div 
                v-for="day in weekDays" 
                :key="day.date" 
                class="day-column border-start flex-grow-1 d-flex flex-column"
                @click="onSlotClick(day.date, hour)"
              >
                <div 
                  v-for="apt in getAppointmentsForSlot(day.date, hour)" 
                  :key="apt.id"
                  class="appointment-card p-2"
                  :class="statusClass(apt.status)"
                  @click.stop="viewApt(apt)"
                >
                  <div class="d-flex align-items-center gap-2">
                    <div class="apt-avatar">
                      <img v-if="apt.avatar" :src="apt.avatar" class="rounded-circle w-100 h-100" />
                      <span v-else>{{ apt.first_name.charAt(0) }}</span>
                    </div>
                    <div class="apt-info overflow-hidden">
                      <div class="fw-bold small text-truncate name-label">{{ apt.first_name }} {{ apt.last_name }}</div>
                      <div class="apt-service text-truncate small-info">{{ apt.service_type }}</div>
                      <div class="apt-car text-truncate extra-info" v-if="apt.car_model">
                        <Car :size="10" class="me-1" />{{ apt.car_model }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Calendar, ChevronLeft, ChevronRight, User, Wrench, Car, Clock } from "lucide-vue-next";
import API from "../services/api";
import Navbar from "../components/Navbar.vue";

export default {
  name: "CalendarView",
  components: { Navbar, Calendar, ChevronLeft, ChevronRight, User, Wrench, Car, Clock },
  data() {
    return {
      appointments: [],
      currentDate: new Date(),
      hours: Array.from({ length: 8 }, (_, i) => i + 8) // 08:00 to 15:00
    };
  },
  computed: {
    formattedCurrentDateRange() {
      const days = this.weekDays;
      if (days.length === 0) return '';
      
      const firstDay = new Date(days[0].date);
      const lastDay = new Date(days[days.length - 1].date);
      
      const monthOptions = { month: 'long' };
      const yearOptions = { year: 'numeric' };
      
      const firstDayNum = firstDay.getDate();
      const lastDayNum = lastDay.getDate();
      const firstMonth = firstDay.toLocaleDateString('pl-PL', monthOptions);
      const lastMonth = lastDay.toLocaleDateString('pl-PL', monthOptions);
      const year = lastDay.toLocaleDateString('pl-PL', yearOptions);
      
      if (firstMonth === lastMonth) {
        return `${firstDayNum} - ${lastDayNum} ${lastMonth} ${year}`;
      } else {
        return `${firstDayNum} ${firstMonth} - ${lastDayNum} ${lastMonth} ${year}`;
      }
    },
    weekDays() {
      const days = [];
      const curr = new Date(this.currentDate);
      
      const day = curr.getDay();
      const diff = curr.getDate() - day + (day === 0 ? -6 : 1); 
      const monday = new Date(curr.setDate(diff));

      for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push({
          name: d.toLocaleDateString('pl-PL', { weekday: 'short' }),
          dayNum: d.getDate(),
          date: d.toISOString().split('T')[0]
        });
      }
      return days;
    }
  },
  methods: {
    async loadAppointments() {
      try {
        const res = await API.get("/appointments/calendar");
        this.appointments = res.data;
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    },
    formatHour(h) {
      return `${h.toString().padStart(2, '0')}:00`;
    },
    isToday(dateStr) {
      return new Date().toISOString().split('T')[0] === dateStr;
    },
    getAppointmentsForSlot(date, hour) {
      return this.appointments.filter(a => {
        if (!a.appointment_date) return false;
        const aptDate = new Date(a.appointment_date);
        const aptDateStr = aptDate.toISOString().split('T')[0];
        const aptHour = aptDate.getHours();
        return aptDateStr === date && aptHour === hour;
      });
    },
    statusClass(status) {
      return `status-${status || 'new'}`;
    },
    prevWeek() {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() - 7);
      this.currentDate = d;
    },
    nextWeek() {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() + 7);
      this.currentDate = d;
    },
    viewApt(apt) {
      this.$router.push({ path: '/requests', query: { id: apt.id } });
    },
    onSlotClick(date, hour) {
    }
  },
  async mounted() {
    await this.loadAppointments();
  }
};
</script>

<style scoped>
.text-black {
  color: #000000 !important;
}
.bg-accent {
  background-color: #2563eb !important;
}
.btn-nav-square {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8px; /* Delikatnie zaokrąglone rogi dla nowoczesnego wyglądu */
  padding: 0;
  transition: all 0.2s;
}
.btn-nav-square:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1 !important;
}

.calendar-icon-wrapper {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.view-toggles {
  display: flex;
  gap: 4px;
}

.transition-all {
  transition: all 0.2s ease;
}

.time-column {
  width: 100px;
  min-width: 100px;
  color: #1e293b !important;
  font-weight: 500;
}

.day-column-header, .day-column {
  flex: 1 0 0;
  min-width: 120px;
}

.day-column-header.is-today {
  color: #2563eb;
}

.day-column-header .text-dark {
  color: #0f172a !important;
}

.day-column:hover {
  background-color: #f8fafc;
  cursor: pointer;
}

.appointment-card {
  flex: 1;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 5px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.appointment-card:hover {
  filter: brightness(0.95);
}

/* Status Colors */
.status-new {
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;
}
.status-accepted {
  background-color: #e0f2fe; /* Blueish */
  border-left: 4px solid #38bdf8;
}
.status-in_progress {
  background-color: #2563eb;
  border-left: 4px solid #1d4ed8;
}
.status-done {
  background-color: #bfdbfe;
  border-left: 4px solid #60a5fa;
}
.status-error {
  background-color: #fee2e2; /* Redish */
  border-left: 4px solid #f87171;
}
.status-cancelled {
  background-color: #f1f5f9; /* Greyish */
  border-left: 4px solid #94a3b8;
}
.status-change_requested {
  background-color: #e2e8f0; /* Darker grey */
  border-left: 4px solid #64748b;
}

.apt-avatar {
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  color: #0f172a;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
}

.apt-info {
  line-height: 1.1;
  display: flex;
  flex-direction: column;
}

.name-label {
  font-size: 0.85rem;
  color: #0f172a;
  margin-bottom: 1px;
}

.small-info {
  font-size: 0.75rem;
  color: rgba(15, 23, 42, 0.7);
  font-weight: 500;
}

.extra-info {
  font-size: 0.65rem;
  color: rgba(15, 23, 42, 0.5);
  margin-top: 1px;
  display: flex;
  align-items: center;
}

.grid-body {
  max-height: 700px;
  overflow-y: auto;
}

.hour-row {
  min-height: 80px;
}

/* Scrollbar styling */
.grid-body::-webkit-scrollbar {
  width: 6px;
}
.grid-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.grid-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
