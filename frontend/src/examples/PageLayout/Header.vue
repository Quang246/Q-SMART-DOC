<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar navbar-expand-md navbar-light">
    <div class="container-fluid">
      <!-- Phần tiêu đề màn hình (chiếm 4 cột trên md) -->
      <div class="col-md-4 d-flex align-items-center">
        <h5>{{ screenTitle }}</h5>
      </div>
      <div class="col-md-8 d-flex justify-content-end align-items-center">
        <div class="language-toggle me-3">
          <button
            :class="currentLang === 'vi' ? 'btn bg-success bg-gradient fs-6' : 'btn btn-light text-success fs-6'"
            @click="switchLanguage('vi')">
            VI
          </button>
          <button
            :class="currentLang === 'en' ? 'btn bg-success bg-gradient fs-6' : 'btn bg-light text-success fs-6'"
            @click="switchLanguage('en')">
            EN
          </button>
        </div>
        <!-- Thông tin người dùng: icon và tên -->
        <div class="user-info d-flex align-items-center me-3">
          <img src="@/assets/img/user.png
          " alt="">
          <span class="user-name ms-1">{{ $t('app.hello')+userName }}</span>
        </div>
        <!-- Nút đăng xuất -->
        <button class="btn me-3 text-light" @click="signOut">
          <!-- <img src="@/assets/img/logout.png" alt=""> -->
          <i class="bi bi-box-arrow-right"></i>
          {{ $t('app.logout') }}
        </button>
        <!-- Nút cài đặt (icon bánh răng) -->
        <button class="btn" @click="openSettings">
          <!-- <img src="@/assets/img/setting.png" alt=""> -->
          <i class="bi bi-gear-fill text-light"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const screenTitle = ref("Tên Màn Hình");
const currentLang = ref("vi");
const userName = ref("User Name");

function switchLanguage(lang) {
  currentLang.value = lang;
  // Thêm logic chuyển ngôn ngữ ở đây
}

function signOut() {
  // Thêm logic đăng xuất ở đây
  alert("Đăng xuất");
}

function openSettings() {
  // Thêm logic mở cài đặt ở đây
  alert("Mở cài đặt");
}
</script>

<style scoped>
.screen-title {
  margin: 0;
  font-size: 1.5rem;
}
.language-toggle button {
  margin-right: 5px;
}
.user-info i {
  font-size: 1.2rem;
}
img{
  width: 30px;
}
</style>
