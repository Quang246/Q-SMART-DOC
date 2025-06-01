<template>
  <div class="container">
    <div class="col-md-12 text-end">
      <argon-button
        color="danger"
        class="mb-3"
        @click="deleteSelected"
        :disabled="selectedUsers.length === 0"
      >
        Xóa người dùng
      </argon-button>
    </div>

    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th>
            <input type="checkbox" @change="toggleAll" :checked="allSelected" />
          </th>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Vai trò</th>
          <th>Ngày tạo</th>
          <th>Ngày cập nhật</th>
          <th class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId">
          <td>
            <input
              type="checkbox"
              :value="user.userId"
              v-model="selectedUsers"
            />
          </td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role?.roleName }}</td>
          <td>{{ formatDate(user.createdate) }}</td>
          <td>{{ formatDate(user.updatedDate) }}</td>
          <td class="text-center">
            <i
              class="bi bi-pencil-square text-primary me-2 cursor-pointer"
              @click="editUser(user)"
              title="Sửa"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>

    <argon-pagination />
    <!-- Modal chỉnh sửa -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h5 class="mb-3">Chỉnh sửa người dùng</h5>
        <argon-input
          v-model="editForm.username"
          placeholder="Tên đăng nhập"
          label="Tên đăng nhập"
          class="mb-2"
        />
        <argon-input
          v-model="editForm.email"
          placeholder="Email"
          label="Email"
          class="mb-2"
        />
        <argon-select
          v-model="editForm.roleId"
          placeholder="Chọn quyền"
          label="Role ID"
          class="mb-3"
        >
          <option :value="1">Admin</option>
          <option :value="2">User</option>
        </argon-select>

        <div class="d-flex justify-content-end">
          <argon-button
            color="secondary"
            class="me-2"
            @click="showEditModal = false"
            >Hủy</argon-button
          >
          <argon-button color="primary" @click="updateUser"
            >Cập nhật</argon-button
          >
        </div>
      </div>
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
import axiosInstance from "@/config";
import ArgonButton from "../UI/ArgonButton.vue";
import ArgonInput from "../UI/ArgonInput.vue";
import Toast from "../UI/Toast.vue";
import ArgonPagination from "../UI/ArgonPagination.vue";
import ArgonSelect from "../UI/ArgonSelect.vue";
import { format } from "date-fns";

export default {
  components: {
    ArgonButton,
    ArgonInput,
    Toast,
    ArgonPagination,
    ArgonSelect,
  },
  data() {
    return {
      users: [],
      selectedUsers: [],
      showToast: false,
      toastMessage: "",
      toastAction: "success",
      showEditModal: false,
      editForm: {
        userId: null,
        username: "",
        email: "",
        roleId: null,
      },
    };
  },
  computed: {
    allSelected() {
      return this.selectedUsers.length === this.users.length;
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const res = await axiosInstance.get("/auth/getAllUser");
        if (res.data?.statusCode === 200) {
          this.users = res.data.data;
        }
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = "Lỗi khi tải người dùng";
      }
    },
    editUser(user) {
      this.editForm = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        roleId: Number(user.role?.roleId) || null,
      };
      this.showEditModal = true;
    },
    async updateUser() {
      try {
        const payload = {
          username: this.editForm.username,
          email: this.editForm.email,
          roleId: Number(this.editForm.roleId),
        };
        const res = await axiosInstance.put(
          `/auth/users/${this.editForm.userId}`,
          payload,
          {}
        );

        if (res.data?.statusCode === 200) {
          this.showToast = true;
          this.toastAction = "success";
          this.toastMessage = "Cập nhập thành công";
          this.showEditModal = false;

          this.getUsers();
        } else {
          throw new Error("Cập nhật thất bại");
        }
      } catch (err) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = "Lỗi khi cập nhập người dùng";
      }
    },
    formatDate(dateStr) {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm");
    },
    toggleAll(event) {
      this.selectedUsers = event.target.checked
        ? this.users.map((u) => u.userId)
        : [];
    },
    async deleteSelected() {
      const selectedIds = this.selectedUsers;
      try {
        const response = await axiosInstance.delete("/auth/DeleteUser", {
          data: { ids: selectedIds },
          headers: { "Content-Type": "application/json" },
        });
        this.showToast = true;
        this.toastAction = "success";
        this.toastMessage = response.data.message;
        this.selectedUsers = [];
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage =
          error.response?.data?.message || "Lỗi không xác định";
      }
      this.getUsers();
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.table td,
.table th {
  vertical-align: middle;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
