<template>
  <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
    <div class="d-flex align-items-center gap-3">
      <div class="icon-wrapper bg-white shadow-sm border rounded-3 p-2">
        <component :is="icon" :size="24" class="text-accent" />
      </div>
      <div>
        <h2 class="fw-bold text-dark mb-0">{{ title }}</h2>
        <p v-if="subtitle" class="text-muted mb-0">{{ subtitle }}</p>
      </div>
    </div>
    <slot name="actions"></slot>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    icon: {
      type: [Object, Function, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    }
  }
};
</script>
