<template>
    <div class="change-password-container">
      <!-- Cột Form Đổi Mật Khẩu -->
      <div class="form-column">
        <div class="form-box">
          <h3>Đổi mật khẩu</h3>
          <div class="password-field" v-for="(field, index) in fields" :key="index">
            <argon-input
              :id="field.id"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="field.placeholder"
              v-model="field.model"
            />
            <img
              v-if="!showPassword"
              src="../../assets/img/icon-eye-inactive.png"
              alt="Hiện mật khẩu"
              class="eye-icon"
              @click="togglePassword"
            />
            <img
              v-else
              src="../../assets/img/icon-eye-active.png"
              alt="Ẩn mật khẩu"
              class="eye-icon"
              @click="togglePassword"
            />
          </div>
          <argon-button class="change-button" @click="changePassword">Đổi mật khẩu</argon-button>
        </div>
      </div>
  
      <!-- Cột Logo -->
      <div class="logo-column">
        <img src="../../assets/logo.png" alt="Logo" class="logo-image" />
      </div>
  
      <Toast
        v-if="showToast"
        :action="toastAction"
        :message="toastMessage"
        @hide="showToast = false"
      />
    </div>
  </template>
  
  <script>
  import ArgonInput from "../UI/ArgonInput.vue";
  import ArgonButton from "../UI/ArgonButton.vue";
  import Toast from "../UI/Toast.vue";
  
  export default {
    name: "ChangePassword",
    components: {
      ArgonInput,
      ArgonButton,
      Toast,
    },
    data() {
      return {
        oldPassword: "",
        newPassword: "",
        reNewPassword: "",
        showPassword: false,
        showToast: false,
        toastAction: "",
        toastMessage: "",
      };
    },
    computed: {
      fields() {
        return [
          { id: "oldPassword", placeholder: "Mật khẩu cũ", model: this.oldPassword },
          { id: "newPassword", placeholder: "Mật khẩu mới", model: this.newPassword },
          { id: "reNewPassword", placeholder: "Xác nhận mật khẩu mới", model: this.reNewPassword },
        ];
      },
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      changePassword() {
        if (!this.oldPassword || !this.newPassword || !this.reNewPassword) {
          this.showToast = true;
          this.toastAction = "error";
          this.toastMessage = "Vui lòng điền đầy đủ thông tin!";
          return;
        }
        // Gọi API đổi mật khẩu...
        this.showToast = true;
        this.toastAction = "success";
        this.toastMessage = "Đổi mật khẩu thành công!";
      },
    },
  };
  </script>
  
  <style scoped>
  .change-password-container {
    display: flex;
  }
  
  .form-column, .logo-column {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .form-box {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    width: 80%;
    max-width: 400px;
  }
  
  h3 {
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
  }
  
  .password-field {
    position: relative;
    margin-bottom: 15px;
  }
  
  .eye-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    width: 18px;
    height: 18px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  
  .change-button {
    width: 100%;
    padding: 10px;
    background-color: #27d3a2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .logo-image {
    width: 300px;
    max-width: 80%;
  }
  </style>
  