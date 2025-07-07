<template>
  <div class="toast-container position-fixed top-0 end-0 m-3">
    <div v-if="visible" :class="['toast', action]" @click="hide">
      <!-- <i class="icon" v-html="iconSvg"></i> -->
      <i :class="iconSvg" style="margin-right: 8px;"></i>
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToastVue',
  props: {
    action: {
      type: String,
      default: 'success', // success | error | warning
    },
    message: {
      type: String,
      required: true,
    },
  },
  emits: ['hide'],
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    iconSvg() {
      const icons = {
        success: 'fa-solid fa-check me-2',
        error: 'fa-solid fa-bolt me-2',
        warning: 'fa-solid fa-exclamation me-2'
      };
      return icons[this.action] || '';
    }
  },
  mounted() {
    setTimeout(this.hide, 4000);
  },
  methods: {
    hide() {
      this.visible = false;
      this.$emit('hide');
    },
  },
};
</script>

<style scoped>
.toast-container {
  z-index: 9999;
  pointer-events: none; /* Cho phép click qua toast */
}

.toast {
  pointer-events: auto; /* Kích hoạt click trên toast */
  display: flex;
  align-items: center;
  background-color: #4caf50; /* Mặc định xanh success */
  padding: 14px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  min-width: fit-content;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  animation: slide-in 0.3s ease-out;
  user-select: none;
}

.toast.success {
  background-color: #4caf50;
  display: flex;
}

.toast.error {
  background-color: #f44336;
  display: flex;
}

.toast.warning {
  background-color: #ff9800;
  display: flex;
}

.icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message {
  flex: 1;
  margin: 0;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}
</style>
