<template>
  <div class="category-tree">
    <ul class="tree-list">
      <li v-for="item in categoryData" :key="item.categoryId">
        <TreeNode
          :item="item"
          :selected-id="selectedCategoryId"
          :expanded-ids="expandedIds"
          @select="handleSelect"
          @toggle-expand="toggleExpand"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import axiosInstance from '@/config';
import TreeNode from './TreeNode.vue';

export default {
  name: "CategoryTree",
  components: { TreeNode },
  data() {
    return {
      categoryData: [],
      selectedCategoryId: null,
      expandedIds: [],
      token: localStorage.getItem("accessToken"),
    };
  },
  async mounted() {
    await this.fetchCategories();
    // Mặc định chọn category cha đầu tiên nếu có
    if (this.categoryData.length) {
      const firstRoot = this.categoryData[0];
      this.selectedCategoryId = firstRoot.categoryId;
      this.$emit('category-selected', firstRoot.categoryId);
      // Mở rộng nút cha
      this.expandedIds.push(firstRoot.categoryId);
    }
  },
  methods: {
    handleSelect(id) {
      this.selectedCategoryId = id;
      this.$emit("category-selected", id);
    },
    toggleExpand(id) {
      if (this.expandedIds.includes(id)) {
        this.expandedIds = this.expandedIds.filter(x => x !== id);
      } else {
        this.expandedIds.push(id);
      }
    },
    async fetchCategories() {
      try {
        const response = await axiosInstance.get("/categoris/getAllCategory", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        const flatList = response.data.data;
        this.categoryData = this.buildTree(flatList);
      } catch (error) {
        console.error("Lỗi khi gọi API chuyên mục:", error);
      }
    },
    buildTree(flatList) {
      const map = {};
      const roots = [];
      flatList.forEach((item) => {
        map[item.categoryId] = { ...item, children: [] };
      });
      flatList.forEach((item) => {
        if (item.parentId === null) {
          roots.push(map[item.categoryId]);
        } else if (map[item.parentId]) {
          map[item.parentId].children.push(map[item.categoryId]);
        }
      });
      return roots;
    },
  }
};
</script>

<style scoped>
.category-tree {
  background-color: white; /* form nổi màu trắng */
  padding: 0;
  border-radius: 8px;
  box-shadow: 5px rgba(0,0,0,0.1); /* đổ bóng nhẹ */
  max-height: 100%;
  overflow-y: auto;
  color: #320f49;
  overflow-x: hidden;
  caret-color: transparent;
}

.tree-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  font-size: small;
  text-align: start;
  border-radius: 4px;
}

.tree-title {
  /* padding: 8px 12px; */
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 8px;
}

.tree-title:hover {
  background-color: #f0f0f0;
}

.tree-title.active {
  background-color: #e6e6fa;
  color: #333;
}

.tree-submenu {
  padding-left: 20px;
}
</style>
