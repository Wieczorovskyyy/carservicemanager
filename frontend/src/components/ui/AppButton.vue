<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="buttonType"
    :class="buttonClasses"
    :disabled="isNativeButton ? disabled || loading : undefined"
    :aria-disabled="!isNativeButton && (disabled || loading) ? 'true' : undefined"
  >
    <component v-if="leadingIcon && !loading" :is="leadingIcon" :size="iconSize" />
    <RefreshCw v-if="loading" :size="iconSize" class="spin" />
    <span><slot></slot></span>
    <component v-if="trailingIcon" :is="trailingIcon" :size="iconSize" />
  </component>
</template>

<script>
import { RefreshCw } from "lucide-vue-next";

export default {
  name: "AppButton",
  components: { RefreshCw },
  props: {
    variant: {
      type: String,
      default: "accent",
      validator: (value) => ["accent", "light", "outline", "danger", "ghost"].includes(value)
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value)
    },
    to: {
      type: [String, Object],
      default: null
    },
    href: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: "button"
    },
    leadingIcon: {
      type: [Object, Function, String],
      default: null
    },
    trailingIcon: {
      type: [Object, Function, String],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tag() {
      if (this.to) return "router-link";
      if (this.href) return "a";
      return "button";
    },
    isNativeButton() {
      return this.tag === "button";
    },
    buttonType() {
      return this.isNativeButton ? this.type : undefined;
    },
    iconSize() {
      return this.size === "sm" ? 14 : 18;
    },
    buttonClasses() {
      return [
        "btn",
        "app-button",
        `app-button-${this.variant}`,
        `app-button-${this.size}`,
        {
          "w-100": this.block,
          disabled: !this.isNativeButton && (this.disabled || this.loading)
        }
      ];
    }
  }
};
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9px;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
}

.app-button-sm {
  min-height: 34px;
  padding: 0.35rem 0.85rem;
  font-size: 0.875rem;
}

.app-button-md {
  min-height: 40px;
  padding: 0.5rem 1rem;
}

.app-button-lg {
  min-height: 44px;
  padding: 0.625rem 1.25rem;
}

.app-button-accent {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
  color: #fff !important;
}

.app-button-accent:hover,
.app-button-accent:focus {
  background-color: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
  color: #fff !important;
}

.app-button-light {
  background: #fff !important;
  border-color: #e2e8f0 !important;
  color: #1f2937 !important;
}

.app-button-light:hover,
.app-button-light:focus {
  background: #f8fafc !important;
  border-color: #cbd5e1 !important;
  color: #111827 !important;
}

.app-button-outline {
  background: transparent !important;
  border-color: var(--line) !important;
  color: var(--text) !important;
}

.app-button-outline:hover,
.app-button-outline:focus {
  background: var(--surface-strong) !important;
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}

.app-button-danger {
  background: transparent !important;
  border-color: #f87171 !important;
  color: #dc2626 !important;
}

.app-button-danger:hover,
.app-button-danger:focus {
  background: #fee2e2 !important;
  border-color: #dc2626 !important;
  color: #991b1b !important;
}

.app-button-ghost {
  background: transparent !important;
  border-color: transparent !important;
  color: var(--text-muted) !important;
}

.app-button-ghost:hover,
.app-button-ghost:focus {
  background: rgba(37, 99, 235, 0.08) !important;
  color: #2563eb !important;
}

:global(:root[data-theme="dark"]) .app-button-light {
  background: var(--surface-muted) !important;
  border-color: var(--line) !important;
  color: var(--text) !important;
}

:global(:root[data-theme="dark"]) .app-button-light:hover,
:global(:root[data-theme="dark"]) .app-button-light:focus,
:global(:root[data-theme="dark"]) .app-button-outline:hover,
:global(:root[data-theme="dark"]) .app-button-outline:focus {
  background: var(--surface-hover) !important;
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}

:global(:root[data-theme="dark"]) .app-button-danger:hover,
:global(:root[data-theme="dark"]) .app-button-danger:focus {
  background: #4a1e29 !important;
  color: #ffc1cc !important;
}
</style>
