<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2">
        <Navbar />
      </div>
      <div class="col-md-10">
        <Header/>
      </div>
    </div>
    <div class="col-md-12">
      <Footer />
    </div>
  </div>
</template>

<script>
import Navbar from "./examples/PageLayout/Navbar.vue";
import Footer from "./examples/PageLayout/Footer.vue";
import Header from "./examples/PageLayout/Header.vue";
export default {
  name: "App",
  components: {
    Navbar,
    Footer,
    Header,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e1eaf3;
  background: linear-gradient(to bottom, #2a84de 30%, #fff 70%);
}
.row{
  display: flex;
}
/* .col-md-9{

} */
/* .color{
  height: 300px;
  background-color: blue;
} */
</style>
