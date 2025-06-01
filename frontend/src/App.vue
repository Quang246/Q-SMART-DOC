<template>
  <div :class="['container-fluid', { 'login-page': isLoginPage }]">
    <div v-if="isLoginPage">
      <!-- Chỉ hiện router-view nếu là trang đăng nhập / đăng ký -->
      <router-view />
    </div>

    <div v-else>
      <div class="row">
        <div class="col-md-2">
          <Navbar />
        </div>
        <div class="col-md-10">
          <Header />
          <router-view />
        </div>
      </div>
      <!-- <div class="col-md-12">
        <Footer />
      </div> -->
    </div>
  </div>
</template>


<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./examples/PageLayout/Navbar.vue";
// import Footer from "./examples/PageLayout/Footer.vue";
import Header from "./examples/PageLayout/Header.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Header,
  },
  setup() {
    const route = useRoute();

    const isLoginPage = computed(() =>
      ["/login", "/register", "/forgot"].includes(route.path)
    );

    return {
      isLoginPage,
    };
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  caret-color: transparent;
  background: linear-gradient(to bottom, #2a84de 30%, #f3efef 70%);
}
.row {
  display: flex;
}
.login-page {
  background: linear-gradient(to bottom, #2a84de 30%, #f3efef 70%);
  color: rgb(42, 19, 77);
}
/* .col-md-9{

} */
/* .color{
  height: 300px;
  background-color: blue;
} */
</style>
