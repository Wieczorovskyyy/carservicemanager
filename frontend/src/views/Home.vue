<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />

    <main class="container py-5 flex-grow-1">
      <AppCard class="mb-4" overflow-hidden>
        <div class="home-hero">
          <img
            class="home-hero-image"
            src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80"
            alt="Serwis samochodowy"
            @error="setImageFallback"
          />
          <div class="home-hero-overlay"></div>
          <div class="home-hero-content p-4 p-lg-5">
            <h1 class="fw-bold text-white mb-3">Nowoczesny serwis samochodowy w Twojej okolicy</h1>
            <p class="home-lead text-white-75 mb-4">
              Zgłoś pojazd online, opisz usterkę, podaj przebieg i śledź status naprawy bez dzwonienia do warsztatu.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <AppButton :to="token ? '/vehicle/new' : '/register'" size="lg">
                {{ token ? "Zapisz pojazd" : "Umów wizytę" }}
              </AppButton>
              <AppButton :to="token ? '/dashboard' : '/login'" variant="light" size="lg">
                {{ token ? "Twoje zapisy" : "Zaloguj" }}
              </AppButton>
            </div>
          </div>
        </div>
      </AppCard>

      <div class="row g-4 mb-4">
        <div class="col-md-4" v-for="stat in stats" :key="stat.label">
          <StatCard :icon="stat.icon" :icon-class="stat.iconClass" :label="stat.label" :value="stat.value" />
        </div>
      </div>

      <section class="row g-4 mb-4">
        <div class="col-lg-4" v-for="service in services" :key="service.title">
          <AppCard class="h-100" overflow-hidden>
            <img :src="service.image" :alt="service.title" class="service-image" @error="setImageFallback" />
            <div class="p-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="service-icon rounded-3" :class="service.iconClass">
                  <component :is="service.icon" :size="22" />
                </div>
                <h5 class="fw-bold text-dark mb-0">{{ service.title }}</h5>
              </div>
              <p class="text-muted mb-3">{{ service.description }}</p>
              <ul class="list-unstyled small text-muted mb-0">
                <li v-for="item in service.items" :key="item" class="d-flex align-items-center gap-2 mb-2">
                  <CheckCircle :size="16" class="text-primary flex-shrink-0" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </AppCard>
        </div>
      </section>

      <section class="row g-4 mb-4">
        <div class="col-lg-7">
          <AppCard class="p-4 p-lg-5 h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="icon-wrapper bg-primary-subtle text-primary rounded-3 p-2">
                <ClipboardList :size="22" />
              </div>
              <div>
                <h3 class="fw-bold text-dark mb-0">Czym zajmuje się serwis?</h3>
                <p class="text-muted mb-0">Pełna obsługa codziennych napraw i wizyt okresowych</p>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-6" v-for="item in workshopScope" :key="item.title">
                <div class="scope-item border rounded-4 p-3 h-100">
                  <div class="fw-bold text-dark mb-1">{{ item.title }}</div>
                  <p class="small text-muted mb-0">{{ item.text }}</p>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <div class="col-lg-5">
          <AppCard class="h-100" overflow-hidden>
            <img
              class="location-image"
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
              alt="Lokalizacja serwisu samochodowego"
              @error="setImageFallback"
            />
            <div class="p-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="icon-wrapper bg-primary-subtle text-primary rounded-3 p-2">
                  <MapPin :size="22" />
                </div>
                <div>
                  <h3 class="fw-bold text-dark mb-0">Lokalizacja serwisu</h3>
                  <p class="text-muted mb-0">ul. Mechaników 12, 00-001 Warszawa</p>
                </div>
              </div>
              <div class="location-box rounded-4 border p-3 mb-3">
                <div class="fw-bold text-dark mb-1">Godziny otwarcia</div>
                <div class="small text-muted">Poniedziałek - Piątek: 8:00 - 18:00</div>
                <div class="small text-muted">Sobota: 9:00 - 14:00</div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <AppButton href="tel:+48500100100" variant="outline">
                  +48 500 100 100
                </AppButton>
                <AppButton :to="token ? '/vehicle/new' : '/register'">
                  Zgłoś auto
                </AppButton>
              </div>
            </div>
          </AppCard>
        </div>
      </section>

      <AppCard class="p-4 p-lg-5">
        <div class="row g-4 align-items-center">
          <div class="col-lg-8">
            <h3 class="fw-bold text-dark mb-2">Wygodny kontakt i przejrzysty status naprawy</h3>
            <p class="text-muted mb-0">
              Po wysłaniu zgłoszenia zespół serwisu przypisuje termin, aktualizuje status i zostawia notatki. Klient widzi swoje wizyty w panelu, a pracownicy obsługują kalendarz i listę zgłoszeń.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <AppButton :to="token ? '/dashboard' : '/register'" size="lg">
              {{ token ? "Przejdź do panelu" : "Załóż konto" }}
            </AppButton>
          </div>
        </div>
      </AppCard>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import AppFooter from "../components/AppFooter.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppButton from "../components/ui/AppButton.vue";
import StatCard from "../components/ui/StatCard.vue";
import { getAuthUser } from "../services/auth";
import {
  BatteryCharging,
  CalendarCheck,
  CheckCircle,
  ClipboardList,
  Gauge,
  MapPin,
  ShieldCheck,
  Wrench
} from "lucide-vue-next";

export default {
  components: {
    Navbar,
    AppFooter,
    AppCard,
    AppButton,
    BatteryCharging,
    CalendarCheck,
    CheckCircle,
    ClipboardList,
    Gauge,
    MapPin,
    ShieldCheck,
    Wrench,
    StatCard
  },
  computed: {
    token() {
      return getAuthUser().token;
    },
    stats() {
      return [
        { label: "Zgłoszenia online", value: "24/7", icon: ClipboardList, iconClass: "bg-primary-subtle text-primary" },
        { label: "Kontrola statusu", value: "Panel klienta", icon: CalendarCheck, iconClass: "bg-info-subtle text-info" },
        { label: "Obsługa warsztatu", value: "Serwis i kalendarz", icon: ShieldCheck, iconClass: "bg-success-subtle text-primary" }
      ];
    },
    services() {
      return [
        {
          title: "Diagnostyka komputerowa",
          description: "Szybkie wykrywanie błędów, kontrola parametrów pracy i jasny opis dalszych kroków.",
          icon: Gauge,
          iconClass: "bg-primary-subtle text-primary",
          image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80",
          items: ["odczyt błędów sterowników", "kontrola czujników", "raport dla klienta"]
        },
        {
          title: "Naprawy mechaniczne",
          description: "Codzienne naprawy eksploatacyjne, serwis hamulców, zawieszenia, filtrów i oleju.",
          icon: Wrench,
          iconClass: "bg-info-subtle text-info",
          image: "https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?auto=format&fit=crop&w=900&q=80",
          items: ["hamulce i zawieszenie", "oleje i filtry", "układ kierowniczy"]
        },
        {
          title: "Elektryka i akumulator",
          description: "Sprawdzenie ładowania, wymiana akumulatora oraz diagnostyka problemów z instalacją.",
          icon: BatteryCharging,
          iconClass: "bg-success-subtle text-primary",
          image: "https://images.pexels.com/photos/6473244/pexels-photo-6473244.jpeg?auto=compress&cs=tinysrgb&w=900",
          items: ["test akumulatora", "alternator i rozrusznik", "oświetlenie pojazdu"]
        }
      ];
    },
    workshopScope() {
      return [
        { title: "Przeglądy okresowe", text: "Regularna kontrola pojazdu, płynów, filtrów i elementów eksploatacyjnych." },
        { title: "Hamulce", text: "Wymiana klocków, tarcz, płynu hamulcowego i kontrola bezpieczeństwa." },
        { title: "Zawieszenie", text: "Diagnoza stuków, luzów, amortyzatorów oraz elementów układu jezdnego." },
        { title: "Klimatyzacja", text: "Sprawdzenie szczelności, serwis układu, odgrzybianie i wymiana filtra kabinowego." }
      ];
    }
  },
  methods: {
    setImageFallback(event) {
      event.target.onerror = null;
      event.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 520'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%231e3158'/%3E%3Cstop offset='1' stop-color='%232563eb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='520' fill='url(%23g)'/%3E%3Cg fill='none' stroke='%23bfdbfe' stroke-width='18' stroke-linecap='round' stroke-linejoin='round' opacity='.9'%3E%3Cpath d='M190 330h520l-42-116H248z'/%3E%3Cpath d='M270 330a54 54 0 1 0 0 1M630 330a54 54 0 1 0 0 1M310 214l42-66h196l48 66'/%3E%3C/g%3E%3Ctext x='450' y='430' fill='%23ffffff' font-family='Arial, sans-serif' font-size='34' font-weight='700' text-anchor='middle'%3ECar Service Manager%3C/text%3E%3C/svg%3E";
    }
  }
};
</script>

<style scoped>
.text-white-75 {
  color: rgba(255, 255, 255, 0.82);
}

.home-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
}

.home-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.58), rgba(15, 23, 42, 0.18));
}

.home-hero-content {
  position: relative;
  max-width: 760px;
}

.home-hero h1 {
  font-size: clamp(2.25rem, 5vw, 4.5rem);
  line-height: 1.02;
}

.home-lead {
  max-width: 650px;
  font-size: 1.15rem;
}

.service-image,
.location-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.location-image {
  height: 260px;
}

.service-icon,
.icon-wrapper {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.scope-item,
.location-box {
  border-color: var(--line) !important;
  background: var(--surface-muted);
}

:global(:root[data-theme="dark"]) .bg-primary-subtle,
:global(:root[data-theme="dark"]) .bg-info-subtle,
:global(:root[data-theme="dark"]) .bg-success-subtle {
  background-color: #1e3158 !important;
}

:global(:root[data-theme="dark"]) .btn-outline-secondary {
  color: var(--text) !important;
  border-color: var(--line) !important;
}

:global(:root[data-theme="dark"]) .btn-outline-secondary:hover {
  background-color: var(--surface-hover) !important;
  border-color: var(--primary) !important;
}

@media (max-width: 991.98px) {
  .home-hero {
    min-height: 430px;
  }
}
</style>
