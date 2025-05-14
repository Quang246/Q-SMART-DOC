<template>
  <div class="form-group">
    <div :class="hasIcon(icon)">
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
      <input
        :id="id"
        :type="showPassword ? 'text' : type"
        class="form-control"
        :class="getClasses(size, success, localError)"
        :name="name"
        v-model="value"
        :placeholder="placeholder"
        :required="isRequired"
        :readonly="isReadonly"
        @input="handleInput"
        @invalid="setCustomValidity"
        @blur="setCustomValidity"
        :maxLength="maxLength"
        :min="min"
      />
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-low-vision'" @click="toggleShowPassword"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isReadonly: {
      type: Boolean,
      default: false,
    },
    messageError: {
      type: String,
      default: "This field is required",
    },
    isValidValidate: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 1000
    },
    min:{
      type: Number,
      default: -999999
    }
  },
  data() {
    return {
      showPassword: false,
      value: this.modelValue,
      localError: this.error,
    };
  },
  watch: {
    modelValue(newValue) {
      this.value = newValue;
    },
    error(newValue) {
      this.localError = newValue;
    }
  },
  methods: {
    getClasses(size, success, error) {
      let sizeValue = size ? `form-control-${size}` : null;
      let isValidValue = "";

      if (error) {
        isValidValue = "is-invalid";
      } else if (success) {
        isValidValue = "is-valid";
      }

      return `${sizeValue} ${isValidValue}`;
    },
    getIcon(icon) {
      return icon ? icon : null;
    },
    hasIcon(icon) {
      return icon ? "input-group" : null;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    setCustomValidity(event) {
      if (this.isRequired && !this.value) {
        event.target.setCustomValidity(this.messageError);
        this.localError = true;
      } else if (this.type === 'emailcustom' && !this.isValidEmail(this.value)) {
        event.target.setCustomValidity(this.$t('app.forgotpassword.error'));
        this.localError = true;
      } else {
        event.target.setCustomValidity('');
        this.localError = false;
      }
    },
    handleInput(event) {
      this.value = event.target.value;
      this.$emit('update:modelValue', event.target.value);
      this.clearCustomValidity(event);
    },
    clearCustomValidity(event) {
      if (event && event.target) {
        event.target.setCustomValidity('');
      }
      this.localError = false;
    },
    isValidEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    }
  }
};
</script>
<style>
.input-group-text{
  height: 36px !important;
  border: 0.8px solid rgb(210, 214, 218) !important;
}
</style>