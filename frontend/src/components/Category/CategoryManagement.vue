<template>
<div class="container-fluid">
  <div class="row justify-content-center">

    <!-- Form nhập liệu -->
    <div class="col-6 p-4 bg-white mb-4">
      <h5 class="mb-3 text-center">Thêm Chuyên Mục</h5>
      <div class="d-flex flex-column gap-3">
        <div class="d-flex align-items-center gap-2">
          <label class="form-label mb-0" style="min-width: 150px;">Tên chuyên mục:</label>
          <ArgonInput
            v-model="newCategoryName"
            class="flex-grow-1"
            placeholder="Tên chuyên mục"
            :isRequired="true"
          />
        </div>

        <div class="d-flex align-items-center gap-2">
          <label class="form-label mb-0" style="min-width: 150px;">Chuyên mục cha:</label>
          <select v-model="newParentId" class="form-select flex-grow-1">
            <option :value="0">-- Không có cha --</option>
            <option
              v-for="cat in parentOptions"
              :key="cat.categoryId"
              :value="cat.categoryId"
            >
              {{ cat.categoryName }}
            </option>
          </select>
        </div>

        <button class="btn bg-success text-white align-self-end mt-2" @click="createCategory">Thêm</button>
      </div>
    </div>

    <!-- Danh sách chuyên mục dạng cây -->
    <ul class="col-6 list-unstyled">
      <CategoryNode
        v-for="cat in treeData"
        :key="cat.categoryId"
        :node="cat"
        @delete="deleteCategory"
      />
    </ul>

  </div>
  <Toast
      v-if="showToast"
      :action="toastAction"
      :message="toastMessage"
      @hide="showToast = false"
    />
</div>

</template>

<script>
import { defineComponent, h } from "vue";
import axiosInstance from "@/config";
import ArgonInput from "../UI/ArgonInput.vue";
import Toast from "../UI/Toast.vue";
const CategoryNode = defineComponent({
  name: "CategoryNode",
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  emits: ["delete"],
  computed: {
    iconClass() {
      return this.node.children?.length
        ? "bi bi-folder-fill text-warning"
        : "bi bi-file-earmark-text";
    },
  },
  methods: {
    handleDelete() {
      this.$emit("delete", this.node.categoryId);
    },
  },
  render() {
    return h("li", { class: "", id: "list" }, [
      h("div", { class: "d-flex justify-content-between align-items-center" }, [
        h("div", {}, [
          h("i", { class: `${this.iconClass} me-2` }),
          this.node.categoryName,
        ]),
        h("i", {
          class: "text-danger bi bi-trash",
          onClick: this.handleDelete,
        }),
      ]),
      this.node.children?.length
        ? h(
            "ul",
            { id: "ul-list" },
            this.node.children.map((child) =>
              h(CategoryNode, {
                key: child.categoryId,
                node: child,
                onDelete: (id) => this.$emit("delete", id),
              })
            )
          )
        : null,
    ]);
  },
});

export default {
  name: "CategoryManager",
  components: {
    CategoryNode,
    ArgonInput,
    Toast
  },
  data() {
    return {
      categories: [],
      newCategoryName: "",
      newParentId: 0,
      levelsMap: {},
      showToast: false,
      toastMessage: "",
      toastAction: "success",
      token: localStorage.getItem("accessToken"),
    };
  },
  computed: {
    parentOptions() {
      return this.categories.filter((cat) => {
        const level = this.levelsMap[cat.categoryId];
        return level === 0 || level === 1;
      });
    },
    treeData() {
      const map = {};
      this.categories.forEach((cat) => {
        map[cat.categoryId] = { ...cat, children: [] };
      });

      const roots = [];
      this.categories.forEach((cat) => {
        if (cat.parentId) {
          map[cat.parentId]?.children.push(map[cat.categoryId]);
        } else {
          roots.push(map[cat.categoryId]);
        }
      });

      return roots;
    },
  },
  methods: {
    async fetchCategories() {
      const res = await axiosInstance.get(
        "/categoris/getAllCategory",
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      this.categories = res.data.data;

      const map = {};
      this.categories.forEach((cat) => {
        map[cat.categoryId] = cat;
      });

      const getLevel = (cat) => {
        let level = 0;
        while (cat.parentId && map[cat.parentId]) {
          level++;
          cat = map[cat.parentId];
        }
        return level;
      };

      this.levelsMap = {};
      this.categories.forEach((cat) => {
        this.levelsMap[cat.categoryId] = getLevel(cat);
      });
    },
    async createCategory() {
      try{
      if (!this.newCategoryName){
        this.showToast = true;
        this.toastAction = "danger";
        this.toastMessage = "Vui lòng nhập tên chuyên mục";
      }
      await axiosInstance.post(
        "/categoris/createCategory",
        {
          categoryName: this.newCategoryName,
          parentId: this.newParentId === 0 ? null : this.newParentId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      this.newCategoryName = "";
      this.newParentId = 0;
      this.showToast = true;
      this.toastAction = "success";
      this.toastMessage = "Tạo chuyên mục thành công";
      await this.fetchCategories();
      }catch(error){
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = error.response?.data?.message;
      }
    },
    async deleteCategory(id) {
      try{
      if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
      await axiosInstance.delete(
        `/categoris/deleteCatby/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      this.showToast = true;
      this.toastAction = "success";
      this.toastMessage = "Xóa chuyên mục thành công";
      await this.fetchCategories();
      }catch(error){
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = "Xóa chuyên mục thất bại";
      }
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
.container-fluid{
  padding: 0;
}
::v-deep #list {
  list-style: none;
  background: #fff;
}
.col-6.p-4.bg-white {
  height: fit-content;
}
::v-deep .d-flex.justify-content-between.align-items-center {
  min-height: 40px;
  padding: 0 15px;
}
::v-deep .d-flex.justify-content-between.align-items-center:hover {
  background: #e3dbdb;
  cursor: pointer;
}
</style>
