<template>
  <div class="login-container">
    <h3>Đăng nhập</h3>
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <argon-input v-model="userName" placeholder="Tên đăng nhập" class="mb-3" />

    <div class="password-field">
      <argon-input
        id="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Mật khẩu"
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

    <argon-button class="login-button" @click="Login">Đăng nhập</argon-button>

    <p class="register-text">
      Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
    </p>
  </div>
  <Toast
      v-if="showToast"
      :action="toastAction"
      :message="toastMessage"
      @hide="showToast = false"
    />
</template>

<script>
import ArgonInput from "../UI/ArgonInput.vue";
import ArgonButton from "../UI/ArgonButton.vue";
import axiosInstance from '@/config';
import Toast from '../UI/Toast.vue';
// import EventBus from '@/services/EventBus';
export default {
  name: "SignInForm",
  components: {
    ArgonInput,
    ArgonButton,
    Toast
  },
  props: {
    onSubmit: {
      type: Function,
      required: false,
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
      showToast: false,
      toastAction: '',
      toastMessage: '',
    };
  },
  watch: {
  },
  created() {
    const isRemembered = localStorage.getItem("rememberMe") === "true";
  if (isRemembered) {
    this.userName = localStorage.getItem("userName") || "";
    this.passWord = localStorage.getItem("passWord") || "";
    this.rememberMe = true;
  } else {
    localStorage.removeItem("userid");
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
  }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async Login() {
      try {
        const response = await axiosInstance.post("/auth/login", {
          username: this.userName,
          password: this.passWord,
        });

        if (response.data) {
          const { access_token, userid, username } = response.data.data;
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("userid", userid);
          localStorage.setItem("userName", username);
          localStorage.setItem("rememberMe", this.rememberMe ? "true" : "false");
          this.showToast = true;
          this.toastAction = "success";
          this.toastMessage = response.data.message;
        }
        setTimeout(() => {
  this.$router.push({ path: '/home' });
}, 1000);
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = error.response?.data?.message; 
      }
      
    }
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
