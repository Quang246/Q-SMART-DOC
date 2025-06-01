<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="@/assets/logo.png" alt="Logo" />
    </div>
<hr>
    <div class="navbar-menu">
      <ul class="menu-list">
        <li
  v-for="item in menuData"
  :key="item.id"
  class="menu-item"
>
  <div
    class="menu-title"
    :class="{ active: selectedMenuId === item.id && selectedSubmenuId === null }"
    @click="selectMenu(item.id)"
  >
    {{ item.name }}
  </div>

  <ul
    v-if="item.children && item.children.length && isExpanded(item.id)"
    class="submenu"
  >
    <li
      v-for="child in item.children"
      :key="child.id"
      class="submenu-item"
      :class="{ active: selectedSubmenuId === child.id }"
      @click="selectSubmenu(item.id, child.id)"
    >
      <router-link :to="child.route">{{ child.name }}</router-link>
    </li>
  </ul>
</li>


      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          id: 1,
          name: "Quản lý người dùng",
          children: [
            { id: 11, name: "Thêm người dùng", route: "/user/add" },
            { id: 12, name: "Danh sách người dùng", route: "/user/list" },
          ],
        },
        {
          id: 2,
          name: "Tài liệu",
          children: [
            { id: 21, name: "Tải lên", route: "/doc/upload" },
            { id: 22, name: "Danh sách", route: "/doc/list" },
          ],
        },
        {
          id: 3,
          name: "Hệ thống",
          children: [
            { id: 31, name: "Phân quyền", route: "/system/roles" },
            { id: 32, name: "Cấu hình", route: "/system/settings" },
          ],
        },
      ],
      expandedIds: [],
      selectedMenuId: null,
      selectedSubmenuId: null,
    };
  },
  methods: {
    toggleSubMenu(id) {
      if (this.expandedIds.includes(id)) {
        this.expandedIds = this.expandedIds.filter((i) => i !== id);
      } else {
        this.expandedIds.push(id);
      }
    },
    isExpanded(id) {
      return this.expandedIds.includes(id);
    },
    selectMenu(id) {
      this.selectedMenuId = id;
      this.selectedSubmenuId = null;
      this.toggleSubMenu(id);
    },
    selectSubmenu(parentId, childId) {
      this.selectedMenuId = parentId;
      this.selectedSubmenuId = childId;
    },
  },
};

</script>

<style scoped>
.navbar {
  align-items: flex-start;
  display: block;
  height: fit-content;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.navbar-logo {
  /* padding: 10px; */
  text-align: center;
}

.navbar-logo > img {
  max-width: 100%;
  height: auto;
}

.navbar-menu {
  /* background: rgb(40, 18, 150); */
  padding: 0 10px;
  margin-top: 8px;
  height: 100%;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: start;
}

.menu-item {
  margin-bottom: 1px;
}

.menu-title {
  font-weight: bold;
  padding: 8px 10px;
  background-color: #fff;
  color: #281296;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}

.submenu {
  list-style: none;
  padding-left: 15px;
  /* margin-top: 5px; */
}

.submenu-item {
  padding: 5px 10px;
  background-color: #fff;
  color: #281296;
  border-radius: 5px;
  margin-bottom: 1px;
  cursor: pointer;
}

.submenu-item a {
  text-decoration: none;
  color: #681616;
}

.submenu-item:hover {
  /* color: #ffd700; */
  background-color: #f6f1f1;
}
.menu-title:hover{
  background-color: #f6f1f1;
}
.menu-title.active,
.submenu-item.active {
  background-color: #f6f1f1;
}
hr{
  margin: 0;
  color: #11202f;
}
</style>
