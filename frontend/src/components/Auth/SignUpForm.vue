<template>
  <div class="register-container">
    <h3>Đăng ký</h3>
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <argon-input v-model="username" placeholder="Tên đăng nhập" class="mb-3" />

    <argon-input
      v-model="email"
      placeholder="Email"
      class="mb-3"
      type="email"
    />

    <div class="password-field">
      <argon-input
        id="password"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="$t('app.signin.placeholder.password')"
        v-model="passWord"
        :isRequired="true"
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

    <argon-button class="register-button" @click="register"
      >Đăng ký</argon-button
    >

    <p class="login-text">
      Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script>
import ArgonInput from "../UI/ArgonInput.vue";
import ArgonButton from "../UI/ArgonButton.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  components: {
    ArgonInput,
    ArgonButton,
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    register() {
      // Kiểm tra dữ liệu đơn giản
      if (!this.username || !this.email || !this.password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      // Gửi dữ liệu đăng ký
      const payload = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      console.log("Sending registration data:", payload);
      // Gửi API đăng ký tại đây (axios, fetch, v.v.)
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 350px;
  margin: 0px auto;
  padding: 50px 0;
  text-align: center;
  font-family: sans-serif;
  height: 100vh;
  overflow: hidden;
}
.logo {
  width: 350px;
  margin-bottom: 20px;
  caret-color: transparent;
}
.form-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.password-field {
  position: relative;
}
.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.register-button {
  width: 100%;
  padding: 12px;
  background-color: #27d3a2;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.login-text {
  margin-top: 15px;
  font-size: 14px;
}
.login-text a {
  color: #0b20e1;
  text-decoration: none;
}
h3 {
  font-weight: 700;
  text-align: start;
}
</style>
