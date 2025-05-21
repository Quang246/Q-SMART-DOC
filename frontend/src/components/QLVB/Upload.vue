<template>
  <div class="container-fluid row">
    <!-- Bên trái: Cây danh mục -->
    <div class="col-md-2">
      <CategoryTree @category-selected="handleCategorySelect" />
    </div>

    <!-- Bên phải: Hiển thị khi chọn category con -->
    <div class="col-md-10">
    </div>
  </div>
</template>

<script>
import CategoryTree from "../Category/Category.vue";

export default {
  name: "CategoryScreen",
  components: {
    CategoryTree,
  },
  data() {
    return {
      selectedCategoryId: null,
    };
  },
  methods: {
    handleCategorySelect(categoryId) {
      this.selectedCategoryId = categoryId;
    },
  },
};
</script>

<style scoped>
.row{
    padding: 0;
}
</style>
