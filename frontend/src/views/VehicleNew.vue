<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />

    <main class="container py-5 flex-grow-1">
      <PageHeader
        :icon="PlusCircle"
        title="Zapisz pojazd"
        subtitle="Wypełnij formularz, aby zgłosić auto do serwisu"
      />

      <div class="row">
        <div class="col-lg-8 mx-auto">
          <AppointmentForm />

          <div class="mt-4 p-3 bg-white rounded-4 shadow-sm border-0 d-flex align-items-start gap-3">
            <div class="p-2 bg-light rounded-circle">
              <Clock :size="20" class="text-primary" />
            </div>
            <div>
              <h6 class="fw-bold mb-1">Co dalej?</h6>
              <p class="small text-muted mb-0">
                Po wysłaniu zgłoszenia nasz zespół sprawdzi dostępność terminów i przypisze Twoją wizytę do kalendarza.
                Status zgłoszenia możesz śledzić w zakładce "Moje zapisy".
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Clock, PlusCircle } from "lucide-vue-next";
import AppointmentForm from "../components/AppointmentForm.vue";
import Navbar from "../components/Navbar.vue";
import PageHeader from "../components/ui/PageHeader.vue";

export default {
  name: "VehicleNew",
  components: {
    AppointmentForm,
    Clock,
    Navbar,
    PageHeader,
    PlusCircle
  }
};
</script>
