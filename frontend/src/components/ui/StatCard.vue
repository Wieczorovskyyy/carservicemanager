<template>
  <div class="stat-card bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3 h-100">
    <div class="p-2 rounded-3" :class="iconClass">
      <component :is="icon" :size="20" />
    </div>
    <div>
      <div class="small text-muted">{{ label }}</div>
      <div class="fw-bold h5 mb-0 text-dark">{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatCard",
  props: {
    icon: {
      type: [Object, Function, String],
      required: true
    },
    iconClass: {
      type: String,
      default: "bg-primary-subtle text-primary"
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
};
</script>
