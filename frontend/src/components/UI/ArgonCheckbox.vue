<!-- eslint-disable no-undef -->
<script setup>
defineProps({
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  checked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="form-check">
    <input
      :id="id"
      class="form-check-input"
      type="checkbox"
      :name="name"
      :checked="checked"
      :disabled="disabled"
    />
    <label :for="id" class="custom-control-label" :class="$attrs.class">
      <slot />
    </label>
  </div>
</template>
