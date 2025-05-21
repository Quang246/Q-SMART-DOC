<!-- eslint-disable no-undef -->
<script setup>

// Define the emit function
const emit = defineEmits(["update:modelValue"]);

// Define the props for the component
defineProps({
  size: {
    type: String,
    default: "default",
  },
  success: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  iconDir: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

// Function to get classes for the select element based on size, success, and error props
const getClasses = (size, success, error) => {
  let sizeValue, isValidValue;

  sizeValue = size ? `form-control-${size}` : null;

  if (error) {
    isValidValue = "is-invalid";
  } else if (success) {
    isValidValue = "is-valid";
  } else {
    isValidValue = "";
  }

  return `${sizeValue} ${isValidValue}`;
};

// Function to get icon class
const getIcon = (icon) => (icon ? icon : null);

// Function to check if icon is present
const hasIcon = (icon) => (icon ? "input-group" : null);
</script>
<template>
    <div class="form-group">
      <div :class="hasIcon(icon)">
        <span v-if="iconDir === 'left'" class="input-group-text">
          <i :class="getIcon(icon)"></i>
        </span>
        <select
          :id="id"
          class="form-control"
          :class="getClasses(size, success, error)"
          :name="name"
          :value="modelValue"
          :required="isRequired"
          :disabled="isDisabled"
          @input="emit('update:modelValue', $event.target.value)"
        >
          <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
          <slot></slot>
        </select>
        <span v-if="iconDir === 'right'" class="input-group-text">
          <i :class="getIcon(icon)"></i>
        </span>
      </div>
    </div>
  </template>
  