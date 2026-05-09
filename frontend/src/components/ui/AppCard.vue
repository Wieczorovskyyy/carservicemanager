<template>
  <div class="glass-card bg-white rounded-4 shadow-sm border-0" :class="{ 'overflow-hidden': overflowHidden }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "AppCard",
  props: {
    overflowHidden: {
      type: Boolean,
      default: false
    }
  }
};
</script>
