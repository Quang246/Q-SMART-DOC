<template>
  <div class="login-container">
    <h3>Đăng nhập</h3>
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <argon-input v-model="userName" placeholder="Tên đăng nhập" class="mb-3" />

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

    <div class="options">
      <label>
        <input type="checkbox" v-model="rememberMe" />
        Nhớ mật khẩu
      </label>
      <a href="/forgot" class="forgot">Quên mật khẩu</a>
    </div>

    <argon-button class="login-button" @click="handleSubmit"
      >Đăng nhập</argon-button
    >

    <p class="register-text">
      Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
    </p>
  </div>
</template>

<script>
import ArgonInput from "../UI/ArgonInput.vue";
import ArgonButton from "../UI/ArgonButton.vue";
// import VueHcaptcha from "@hcaptcha/vue3-hcaptcha"
import AuthValidations from "@/Auth/AuthValidations";

export default {
  name: "SignInForm",
  components: {
    ArgonInput,
    ArgonButton,
    // VueHcaptcha,
  },
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    showCaptcha: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userName: "",
      passWord: "",
      rememberMe: false,
      showPassword: false,
      errors: {},
      captchaToken: "",
      localShowCaptcha: false,
    };
  },
  created() {
    localStorage.removeItem("userid");
    localStorage.removeItem("accessToken");

    if (localStorage.getItem("rememberMe") === "true") {
      this.userName = localStorage.getItem("userName") || "";
      this.passWord = localStorage.getItem("passWord") || "";
      this.rememberMe = true;
    }
  },
  watch: {
    showCaptcha(newVal) {
      this.localShowCaptcha = newVal;
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    onCaptchaSuccess(token) {
      this.captchaToken = token;
    },
    async handleSubmit() {
      this.errors = {};

      const validations = new AuthValidations(this.userName, this.passWord);
      const validationErrors = validations.checkValidations();

      if (this.localShowCaptcha && !this.captchaToken) {
        validationErrors.captcha = "Vui lòng xác minh CAPTCHA";
      }

      this.errors = validationErrors;
      if (Object.keys(this.errors).length > 0) return;

      try {
        await this.onSubmit(
          this.userName,
          this.passWord,
          this.rememberMe,
          this.captchaToken
        );
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 350px;
  margin: 50px auto;
  text-align: center;
  font-family: sans-serif;
  caret-color: transparent;
}
.logo {
  width: 350px;
  margin-bottom: 20px;
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
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: 10px 0;
}
.forgot {
  color: #00bcd4;
  text-decoration: none;
}
.login-button {
  width: 100%;
  padding: 12px;
  background-color: #27d3a2;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}
.register-text {
  margin-top: 15px;
  font-size: 14px;
}
.register-text a {
  color: #00bcd4;
  text-decoration: none;
}
h3 {
  font-weight: 700;
  text-align: start;
}
</style>
