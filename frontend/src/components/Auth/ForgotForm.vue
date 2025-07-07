<template>
  <div class="form-container">
    <h3>Quên mật khẩu</h3>
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <argon-input
      id="email"
      type="email"
      placeholder="Nhập email"
      v-model="email"
      :isRequired="true"
      class="mt-3"
    />

    <argon-button class="mt-4 w-100" @click="submitEmail">
      Gửi yêu cầu
    </argon-button>

    <p class="mt-3 text-center">
      Quay lại <router-link to="/login">Đăng nhập</router-link>
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
export default {
  name: "ForgotPassword",
  components: {
    ArgonInput,
    ArgonButton,
    Toast
  },
  data() {
    return {
      email: "",
      showToast: false,
      toastAction: '',
      toastMessage: '',
    };
  },
  methods: {
    async submitEmail() {
      try {
        const response = await axiosInstance.post("/auth/forgot-password", {
          email: this.email,
        });

        if (response.data) {
          this.showToast = true;
          this.toastAction = "success";
          this.toastMessage = response.data.message;
        }
        setTimeout(() => {
  this.$router.push({ path: '/login' });
}, 1000);
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = error.response?.data?.message|| "Lỗi kết nối";
      }

    },
  },
};
</script>

<style scoped>
.form-container {
  width: 350px;
  margin: 0px auto;
  padding: 50px 0;
  text-align: center;
  font-family: sans-serif;
  caret-color: transparent;
  height: 100vh;
  overflow: hidden !important;
}
.logo {
  width: 350px;
  height: auto;
}

.title {
  font-weight: bold;
  font-size: 22px;
  text-align: center;
  margin-bottom: 20px;
  color: #2a2a2a;
}
h3 {
  font-weight: 700;
  text-align: start;
}
a {
  text-decoration: none;
}
</style>
