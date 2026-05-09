<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />

    <main class="container py-5 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-wrapper bg-white shadow-sm border rounded-3 p-2">
            <Users :size="24" class="text-accent" />
          </div>
          <div>
            <h2 class="fw-bold text-dark mb-0">Klienci</h2>
            <p class="text-muted mb-0">Zarządzaj bazą klientów, uprawnieniami i historią zleceń</p>
          </div>
        </div>
        <div class="d-flex gap-3">
          <div class="search-box position-relative">
            <Search :size="18" class="search-icon position-absolute top-50 translate-middle-y ms-3 text-muted" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Szukaj klienta..." 
              class="form-control ps-5 border-0 shadow-sm rounded-3 py-2 bg-white text-dark"
            />
          </div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-primary-subtle rounded-3 text-primary">
              <Users :size="20" />
            </div>
            <div>
              <div class="small text-muted">Suma klientów</div>
              <div class="fw-bold h5 mb-0">{{ clients.length }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-success-subtle rounded-3 text-success">
              <ClipboardCheck :size="20" />
            </div>
            <div>
              <div class="small text-muted">Łącznie zleceń</div>
              <div class="fw-bold h5 mb-0">{{ totalOrders }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
            <div class="p-2 bg-info-subtle rounded-3 text-info">
              <ShieldCheck :size="20" />
            </div>
            <div>
              <div class="small text-muted">Personel</div>
              <div class="fw-bold h5 mb-0">{{ staffCount }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        <div class="table-responsive">
          <table class="table align-middle mb-0 custom-table">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">
                  <input type="checkbox" class="form-check-input shadow-none" @change="toggleAll" :checked="isAllSelected" />
                </th>
                <th @click="sortBy('last_name')" class="cursor-pointer">
                  Nazwa klienta <ArrowUpDown :size="12" class="ms-1" />
                </th>
                <th @click="sortBy('email')" class="cursor-pointer">
                  Email <ArrowUpDown :size="12" class="ms-1" />
                </th>
                <th>Telefon</th>
                <th @click="sortBy('orders_count')" class="cursor-pointer text-center">
                  Zlecenia <ArrowUpDown :size="12" class="ms-1" />
                </th>
                <th @click="sortBy('created_at')" class="cursor-pointer">
                  Data dołączenia <ArrowUpDown :size="12" class="ms-1" />
                </th>
                <th class="text-end pe-4">Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in paginatedClients" :key="client.id" class="client-row">
                <td class="ps-4 py-3">
                  <input type="checkbox" class="form-check-input shadow-none" v-model="selectedClients" :value="client.id" />
                </td>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="client-avatar" :style="{ background: getRandomColor(client.first_name) }">
                      {{ client.first_name ? client.first_name.charAt(0) : 'U' }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">
                        {{ client.first_name }} {{ client.last_name }}
                      </div>
                      <div class="d-flex gap-1 mt-1">
                        <span v-if="client.role === 'admin'" class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1" style="font-size: 0.65rem;">
                          ADMIN
                        </span>
                        <span v-else-if="client.role === 'mechanic'" class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style="font-size: 0.65rem;">
                          MECHANIK
                        </span>
                        <span v-else class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1" style="font-size: 0.65rem;">
                          KLIENT
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="text-muted">{{ client.email }}</td>
                <td class="text-muted">{{ client.phone || '—' }}</td>
                <td class="text-center">
                  <span class="badge rounded-pill bg-light text-dark border px-3 py-2 fw-bold">
                    {{ client.orders_count || 0 }}
                  </span>
                </td>
                <td class="text-muted small">{{ formatDate(client.created_at) }}</td>
                <td class="text-end pe-4">
                  <button class="btn btn-sm btn-white border shadow-sm px-3" @click="editClient(client)">
                    <Edit2 :size="14" class="me-1" /> Zarządzaj
                  </button>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="text-muted">
                    <Inbox :size="48" class="mb-3 opacity-25" />
                    <p class="mb-0">Nie znaleziono klientów spełniających kryteria.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center p-4 border-top bg-light-subtle">
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Pokaż:</span>
            <select v-model="perPage" class="form-select form-select-sm w-auto text-black border-0 shadow-sm rounded-2">
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
            </select>
            <span class="text-muted small ms-2">z {{ filteredClients.length }} klientów</span>
          </div>
          <nav v-if="totalPages > 1">
            <ul class="pagination pagination-sm mb-0 gap-1">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link border-0 shadow-sm rounded-2 bg-white text-dark p-2 d-flex align-items-center" href="#" @click.prevent="currentPage--">
                  <ChevronLeft :size="16" />
                </a>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <a class="page-link border-0 shadow-sm rounded-2 mx-0 fw-bold px-3 py-2" href="#" @click.prevent="currentPage = page">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link border-0 shadow-sm rounded-2 bg-white text-dark p-2 d-flex align-items-center" href="#" @click.prevent="currentPage++">
                  <ChevronRight :size="16" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal-content rounded-4 shadow-lg border-0 p-0">
        <div class="modal-header-custom p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-bold">Zarządzaj klientem: {{ editingClient.first_name }} {{ editingClient.last_name }}</h5>
          <button class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body-custom p-4">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label small fw-bold text-muted text-uppercase">Rola użytkownika</label>
              <div class="d-flex gap-2">
                <button 
                  v-for="role in ['user', 'mechanic', 'admin']" 
                  :key="role"
                  @click="editingClient.role = role"
                  :class="['btn flex-grow-1 py-2 fw-semibold', editingClient.role === role ? 'btn-accent' : 'btn-light text-muted border']"
                >
                  <User v-if="role === 'user'" :size="16" class="me-1" />
                  <Wrench v-if="role === 'mechanic'" :size="16" class="me-1" />
                  <ShieldCheck v-if="role === 'admin'" :size="16" class="me-1" />
                  {{ role === 'user' ? 'Klient' : role === 'mechanic' ? 'Mechanik' : 'Admin' }}
                </button>
              </div>
            </div>
            
            <div class="col-md-6 mt-4">
              <label class="form-label small fw-bold text-muted text-uppercase">Imię</label>
              <input type="text" v-model="editingClient.first_name" class="form-control bg-light border-0 py-2" readonly>
            </div>
            <div class="col-md-6 mt-4">
              <label class="form-label small fw-bold text-muted text-uppercase">Nazwisko</label>
              <input type="text" v-model="editingClient.last_name" class="form-control bg-light border-0 py-2" readonly>
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold text-muted text-uppercase">Email</label>
              <input type="email" v-model="editingClient.email" class="form-control bg-light border-0 py-2" readonly>
            </div>

            <div class="col-12 mt-4 border-top pt-4">
              <button class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2" @click="deleteClient(editingClient)">
                <Trash2 :size="18" /> Usuń klienta z systemu
              </button>
              <div class="form-text text-center mt-2">Uwaga: Ta operacja jest nieodwracalna.</div>
            </div>
          </div>
        </div>
        <div class="modal-footer-custom p-4 border-top d-flex justify-content-end gap-2">
          <button class="btn btn-light px-4" @click="closeModal">Anuluj</button>
          <button class="btn btn-accent px-4 fw-bold" @click="saveChanges" :disabled="saving">
            {{ saving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Search,
  Users,
  ClipboardCheck,
  ShieldCheck,
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  User,
  Wrench,
  Inbox,
  Edit2
} from "lucide-vue-next";
import API from "../services/api";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Clients",
  components: { 
    Navbar, 
    Search, 
    Users,
    ClipboardCheck,
    ShieldCheck,
    ArrowUpDown, 
    ChevronLeft, 
    ChevronRight,
    Trash2,
    User,
    Wrench,
    Inbox,
    Edit2
  },
  data() {
    return {
      clients: [],
      searchQuery: "",
      currentPage: 1,
      perPage: 6,
      sortKey: 'created_at',
      sortOrder: 'desc',
      selectedClients: [],
      showModal: false,
      editingClient: null,
      saving: false
    };
  },
  computed: {
    totalOrders() {
      return this.clients.reduce((acc, c) => acc + (c.orders_count || 0), 0);
    },
    staffCount() {
      return this.clients.filter(c => c.role !== 'user').length;
    },
    filteredClients() {
      let result = [...this.clients];
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(c => 
          (c.first_name && c.first_name.toLowerCase().includes(q)) || 
          (c.last_name && c.last_name.toLowerCase().includes(q)) || 
          (c.email && c.email.toLowerCase().includes(q))
        );
      }
      result.sort((a, b) => {
        let valA = a[this.sortKey];
        let valB = b[this.sortKey];
        if (this.sortKey === 'created_at') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      return result;
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredClients.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredClients.length / this.perPage);
    },
    isAllSelected() {
      return this.paginatedClients.length > 0 && this.selectedClients.length === this.paginatedClients.length;
    }
  },
  methods: {
    async loadClients() {
      try {
        const res = await API.get("/auth/users");
        this.clients = res.data;
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    },
    formatDate(date) {
      if (!date) return '—';
      return new Date(date).toLocaleDateString("pl-PL", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    toggleAll() {
      if (this.isAllSelected) {
        this.selectedClients = [];
      } else {
        this.selectedClients = this.paginatedClients.map(c => c.id);
      }
    },
    getRandomColor(name) {
      const colors = ["#2563eb", "#60a5fa", "#f87171", "#3b82f6", "#0ea5e9", "#a78bfa"];
      if (!name) return colors[0];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    },
    editClient(client) {
      this.editingClient = { ...client };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editingClient = null;
    },
    async saveChanges() {
      this.saving = true;
      try {
        await API.patch(`/auth/users/${this.editingClient.id}/role`, { 
          role: this.editingClient.role 
        });
        await this.loadClients();
        this.closeModal();
      } catch (error) {
        alert("Błąd podczas zapisywania zmian.");
      } finally {
        this.saving = false;
      }
    },
    async updateRole(client, newRole) {
      try {
        await API.patch(`/auth/users/${client.id}/role`, { role: newRole });
        client.role = newRole;
      } catch (error) {
        alert("Błąd podczas zmiany roli.");
      }
    },
    async deleteClient(client) {
      if (confirm(`Czy na pewno chcesz usunąć klienta ${client.first_name} ${client.last_name}?`)) {
        try {
          await API.delete(`/auth/users/${client.id}`);
          this.clients = this.clients.filter(c => c.id !== client.id);
          if (this.showModal) this.closeModal();
        } catch (error) {
          alert("Błąd podczas usuwania klienta.");
        }
      }
    }
  },
  async mounted() {
    await this.loadClients();
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.custom-table thead th {
  padding: 16px 12px;
}
.client-row:hover {
  background-color: #f8fafc;
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
  color: #fff;
}
.badge {
  font-weight: 600;
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

/* PAGINATION */
.pagination .page-link {
  font-size: 0.875rem;
  color: #64748b;
}
.pagination .page-item.active .page-link {
  background-color: #2563eb;
  color: #000;
  border-color: #2563eb;
}

</style>
