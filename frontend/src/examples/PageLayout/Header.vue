<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar navbar-expand-md navbar-light">
    <div class="container-fluid">
      <div class="col-md-4 d-flex align-items-center">
        <h5>{{ screenTitle }}</h5>
      </div>
      <div class="col-md-8 d-flex justify-content-end align-items-center">
        <div class="user-info d-flex align-items-center me-3">
          <img src="@/assets/img/user.png" alt="" />
          <span class="user-name ms-1">{{ $t("app.hello") + userName }}</span>
        </div>
        <!-- Nút cài đặt -->
        <div class="position-relative">
          <i @click="toggleSettingsMenu" class="bi bi-gear-fill text-light"></i>
          <!-- Menu Cài đặt -->
          <div v-if="showSettingsMenu" class="settings-menu shadow">
            <button @click="openChangePassword">Đổi mật khẩu</button>
            <button class="btn me-3" @click="signOut">
              <i class="bi bi-box-arrow-right"></i> {{ $t("app.logout") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup đổi mật khẩu -->
    <div v-if="showChangePassword" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h5>Đổi mật khẩu</h5>
          <div class="password-field">
            <argon-input
              id="old-password"
              :type="showOldPassword ? 'text' : 'password'"
              placeholder="Mật khẩu cũ"
              v-model="oldPassword"
            />
            <img
              v-if="!showOldPassword"
              src="../../assets/img/icon-eye-inactive.png"
              alt="Hiện mật khẩu"
              class="eye-icon"
              @click="togglePassword('old')"
            />
            <img
              v-else
              src="../../assets/img/icon-eye-active.png"
              alt="Ẩn mật khẩu"
              class="eye-icon"
              @click="togglePassword('old')"
            />
          </div>
          <div class="password-field">
            <argon-input
              id="new-password"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Mật khẩu mới"
              v-model="newPassword"
            />
            <img
              v-if="!showNewPassword"
              src="../../assets/img/icon-eye-inactive.png"
              alt="Hiện mật khẩu"
              class="eye-icon"
              @click="togglePassword('new')"
            />
            <img
              v-else
              src="../../assets/img/icon-eye-active.png"
              alt="Ẩn mật khẩu"
              class="eye-icon"
              @click="togglePassword('new')"
            />
          </div>
          <div class="password-field">
            <argon-input
              id="confirm-password"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Xác nhận mật khẩu"
              v-model="confirmPassword"
            />
            <img
              v-if="!showConfirmPassword"
              src="../../assets/img/icon-eye-inactive.png"
              alt="Hiện mật khẩu"
              class="eye-icon"
              @click="togglePassword('confirm')"
            />
            <img
              v-else
              src="../../assets/img/icon-eye-active.png"
              alt="Ẩn mật khẩu"
              class="eye-icon"
              @click="togglePassword('confirm')"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeChangePassword">
              Hủy
            </button>
            <button class="btn btn-success" @click="changePassword">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <Toast
    v-if="showToast"
    :action="toastAction"
    :message="toastMessage"
    @hide="showToast = false"
  />
</template>
<script>
import ArgonInput from "@/components/UI/ArgonInput.vue";
import Toast from "@/components/UI/Toast.vue";
import { useRoute } from "vue-router";
import axiosInstance from "@/config";
export default {
  components: {
    ArgonInput,
    Toast,
  },
  data() {
    return {
      showSettingsMenu: false,
      showChangePassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      accessToken: localStorage.getItem("accessToken"),
      showToast: false,
      toastAction: "",
      toastMessage: "",
    };
  },
  computed: {
    route() {
      return useRoute();
    },
    screenTitle() {
      return this.route.meta.screenTitle || "Tên Màn Hình";
    },
    userName() {
      return localStorage.getItem("userName") || "";
    },
    passwordFields() {
      return {
        old: {
          id: "old-password",
          placeholder: "Mật khẩu cũ",
          model: this.oldPassword,
          show: this.showOldPassword,
        },
        new: {
          id: "new-password",
          placeholder: "Mật khẩu mới",
          model: this.newPassword,
          show: this.showNewPassword,
        },
        confirm: {
          id: "confirm-password",
          placeholder: "Xác nhận mật khẩu",
          model: this.confirmPassword,
          show: this.showConfirmPassword,
        },
      };
    },
  },
  methods: {
    toggleSettingsMenu() {
      this.showSettingsMenu = !this.showSettingsMenu;
    },
    openChangePassword() {
      this.showSettingsMenu = false;
      this.showChangePassword = true;
    },
    closeChangePassword() {
      this.showChangePassword = false;
    },
    signOut() {
      this.$router.push("/login");
    },
    togglePassword(field) {
      if (field === "old") this.showOldPassword = !this.showOldPassword;
      else if (field === "new") this.showNewPassword = !this.showNewPassword;
      else if (field === "confirm")
        this.showConfirmPassword = !this.showConfirmPassword;
    },
    async changePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.toastAction = "error";
        this.toastMessage = "Vui lòng điền đầy đủ thông tin.";
        this.showToast = true;
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.toastAction = "error";
        this.toastMessage = "Mật khẩu xác nhận không khớp.";
        this.showToast = true;
        return;
      }

      try {
        const response = await axiosInstance.post(
          "/auth/change-password",
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        this.toastAction = "success";
        this.toastMessage = response.data.message;
        this.showToast = true;
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.closeChangePassword();
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          this.$router.push("/login");
        }, 4000);
      } catch (error) {
        const message =
          error.response?.data?.message || "Đổi mật khẩu thất bại.";
        this.toastAction = "error";
        this.toastMessage = message;
        this.showToast = true;
      }
    },
  },
};
</script>

<style scoped>
.settings-menu {
  position: absolute;
  top: 46px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  z-index: 1000;
}
.settings-menu button {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 5px 10px;
  cursor: pointer;
}
.settings-menu button:hover {
  background: #f0f0f0;
}
.modal-mask {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
img {
  width: 35px;
}
.modal-wrapper {
  width: 100%;
  max-width: 400px;
}
.modal-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 8px;
}
.settings-menu.shadow {
  width: 200px;
}
nav.navbar.navbar-expand-md.navbar-light {
  height: 70px;
}
.password-field {
  position: relative;
  margin-bottom: 8px;
}
h5,span{
  color: white;
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
</style>
