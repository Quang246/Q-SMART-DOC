<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="@/assets/logo.png" alt="Logo" />
    </div>
    <hr />
    <div class="navbar-menu">
      <ul class="menu-list">
        <li v-for="item in menuData" :key="item.id" class="menu-item">
          <router-link
            class="menu-title"
            :class="{ active: selectedMenuId === item.id }"
            :to="item.route"
            @click="selectMenu(item.id)"
          >
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import axiosInstance from "@/config";

export default {
  data() {
    return {
      menuData: [],
      expandedIds: [],
      selectedMenuId: null,
      selectedSubmenuId: null,
      currentRoleId: Number(localStorage.getItem("roleId")) || 1, // hoặc inject từ store
    };
  },
  mounted() {
    this.fetchRoleActions();
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
    async fetchRoleActions() {
      try {
        const response = await axiosInstance.get("/action-with-role");
        const data = response.data;
        const currentRoleId = Number(localStorage.getItem("role"));
        const filteredActions = data.filter((action) =>
          action.roles.some(
            (role) => role.roleId === currentRoleId && role.checked
          )
        );
        this.menuData = filteredActions.map((action) => ({
          id: action.actionId,
          name: action.actionName,
          route: `/${action.router}`,
        }));
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
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
  text-align: center;
}

.navbar-logo > img {
  max-width: 80%;
  height: auto;
}

.navbar-menu {
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

/* Dùng router-link làm menu chính */
.menu-title {
  display: block;
  font-weight: bold;
  padding: 8px 10px;
  background-color: #fff;
  color: #281296;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
}

/* Khi hover vào menu */
.menu-title:hover {
  background-color: #f6f1f1;
}

/* Khi menu hoặc submenu đang active */
.menu-title.active,
.submenu-item.active {
  background-color: #f6f1f1;
}

.submenu {
  list-style: none;
  padding-left: 15px;
}

.submenu-item {
  padding: 5px 10px;
  background-color: #fff;
  color: #281296;
  border-radius: 5px;
  margin-bottom: 1px;
  cursor: pointer;
}

/* Link trong submenu */
.submenu-item a {
  display: block;
  text-decoration: none;
  color: #681616;
  font-weight: normal;
}

/* Hover submenu */
.submenu-item:hover {
  background-color: #f6f1f1;
}

hr {
  margin: 0;
  color: #11202f;
}
</style>
