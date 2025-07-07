<template>
  <li>
    <div
      class="tree-title row"
      @click.stop="toggleExpand"
      :class="{ active: selectedId === item.categoryId }"
    >
      <div  @click="selectItem" class="col-md-10">
        <span>{{ item.categoryName }}</span>
      </div>
      <div class="col-md-2">
        <span
          v-if="item.children && item.children.length"
          style="cursor: pointer"
        >
          {{ isExpanded ? "▼" : "▶" }}
        </span>
      </div>
    </div>
    <ul
      v-if="item.children && item.children.length && isExpanded"
      class="tree-submenu"
    >
      <TreeNode
        v-for="child in item.children"
        :key="child.categoryId"
        :item="child"
        :selected-id="selectedId"
        :expanded-ids="expandedIds"
        @select="$emit('select', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: "TreeNode",
  props: {
    item: Object,
    selectedId: {
    type: [String, Number],
    required: false
  },
    expandedIds: Array,
  },
  emits: ["select", "toggle-expand"],
  computed: {
    isExpanded() {
      return this.expandedIds.includes(this.item.categoryId);
    },
  },
  methods: {
    selectItem() {
      this.$emit("select", this.item.categoryId);
    },
    toggleExpand() {
      this.$emit("toggle-expand", this.item.categoryId);
    },
  },
  components: {
    TreeNode: () => import("./TreeNode.vue"), // đệ quy
  },
};
</script>

<style scoped>
.tree-title {
  padding: 6px 10px;
  font-weight: bold;
  cursor: pointer;
}
.tree-title.active {
  background-color: #e6e6fa;
  color: #333;
}
.tree-submenu {
  padding-left: 10px;
}
li{
  list-style: none;
}
</style>
