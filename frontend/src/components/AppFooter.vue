<template>
  <footer class="app-footer mt-4">
    <div class="container py-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div class="d-flex align-items-center">
        <span class="auth-mark footer-logo"><span></span><span></span><span></span></span>
      </div>
      <small class="muted">© {{ year }} Wszystkie prawa zastrzeżone.</small>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
.footer-logo {
  transform: scale(0.9);
  transform-origin: left center;
}
</style>
