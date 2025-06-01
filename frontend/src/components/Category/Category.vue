<template>
  <div class="category-tree">
    <ul class="tree-list">
      <li v-for="item in categoryData" :key="item.id" class="tree-item">
        <div
  class="tree-title"
  :class="{ active: selectedCategoryId === item.id }"
  @click="toggleCategory(item)"
>
  {{ item.name }}
</div>


        <ul
          v-if="item.children && item.children.length && isExpanded(item.id)"
          class="tree-submenu"
        >
          <li
            v-for="child in item.children"
            :key="child.id"
            class="tree-subitem"
            :class="{ active: selectedCategoryId === child.id }"
            @click.stop="selectCategory(item.id, child.id)"
          >
            {{ child.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CategoryTree",
  data() {
    return {
      // Demo tạm, bạn có thể fetch từ API
      categoryData: [
        {
          id: 1,
          name: "Văn bản nội bộ",
          children: [
            { id: 11, name: "Quyết định" },
            { id: 12, name: "Thông báo" },
          ],
        },
        {
          id: 2,
          name: "Văn bản pháp lý",
          children: [
            { id: 21, name: "Luật" },
            { id: 22, name: "Nghị định" },
          ],
        },
        {
          id: 3,
          name: "Khác",
          children: [],
        },
      ],
      expandedIds: [],
      selectedCategoryId: null,
    };
  },
  methods: {
    isExpanded(id) {
      return this.expandedIds.includes(id);
    },
    toggleCategory(item) {
      if (item.children && item.children.length) {
        if (this.isExpanded(item.id)) {
          this.expandedIds = this.expandedIds.filter((i) => i !== item.id);
        } else {
          this.expandedIds.push(item.id);
        }
      }
      // Luôn chọn category khi click, kể cả có children
      this.selectedCategoryId = item.id;
    },
    selectCategory(parentId, childId) {
      this.selectedCategoryId = childId;
    },
  },
};
</script>

<style scoped>
.category-tree {
  background-color: #fff;
  border-radius: 10px;
  padding: 0 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tree-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tree-item {
  margin-bottom: 5px;
  text-align: start;
}

.tree-title {
  font-weight: bold;
  font-size: small;
  padding: 8px 10px;
  color: #281296;
  border-radius: 5px;
  cursor: pointer;
  background:#fff;
}

.tree-submenu {
  list-style: none;
  padding-left: 15px;
}

.tree-subitem {
  padding: 6px 10px;
  margin-bottom: 2px;
  border-radius: 5px;
  cursor: pointer;
  font-size: small;
  color: #281296;
}

.tree-title.active,
.tree-subitem.active {
  background-color: #f6f1f1;
}

</style>
