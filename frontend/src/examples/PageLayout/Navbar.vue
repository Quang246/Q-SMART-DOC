<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar">
        <nav class="navbar-logo">
      <img src="@/assets/logo.png" alt="Logo" /></nav>
      <nav class="navbar-menu">
      </nav>
  </nav>
</template>

<script setup>
// Bạn có thể thêm logic hoặc import các module nếu cần
</script>

<style scoped>
.navbar {
  align-items: center;
  justify-content: space-between;
  color: #fff;
  display: block;
  padding: 0;
  height: 100vh;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
}
.navbar-logo{
    padding: 10px;
}
.navbar-logo>img{
    max-width: 100%;
    height: auto;
}
.navbar-menu {
    background: rgb(40, 18, 150);
  list-style: none;
  display: block;
  margin: 0;
  padding: 0;
}

.navbar-menu li {
  margin-left: 20px;
}

.navbar-menu a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}
</style>
