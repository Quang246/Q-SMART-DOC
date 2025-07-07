<template>
  <div class="container-fluid">
    <div class="col-md-12 text-end">
      <ArgonButton class="btn btn-primary mb-3" @click="submitPermissions()">
      Lưu phân quyền
    </ArgonButton>
    </div>
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Mã chức năng</th>
          <th>Tên chức năng</th>
          <th>Mô tả</th>
          <th class="text-center">Người dùng</th>
          <th class="text-center">Quản trị</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in permissions" :key="item.actionId">
          <td>{{ item.actionId }}</td>
          <td>{{ item.actionName }}</td>
          <td>{{ item.description }}</td>
          <td class="text-center">
            <input type="checkbox" v-model="item.roles[1].checked" class="form-check-input"
              @change="onChange(item.roles[1].roleId, item.actionId, item.roles[1].checked)" />
          </td>
          <td class="text-center">
            <input type="checkbox" v-model="item.roles[0].checked" class="form-check-input" disabled="true" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Toast v-if="showToast" :action="toastAction" :message="toastMessage" @hide="showToast = false" />
</template>

<script>
import axiosInstance from "@/config";
import Toast from "../UI/Toast.vue";
import ArgonButton from "../UI/ArgonButton.vue";
export default {
  name: "PermissionScreen",
  components: {
    Toast,
    ArgonButton,
  },
  data() {
    return {
      permissions: [],
      token: localStorage.getItem("accessToken"),
      roleId: "",
      selectedRoleId: "",
      selectedActionId: "",
      checked: true,
      showToast: false,
      toastAction: "",
      toastMessage: "",
    };
  },
  created() {
    this.getAction();
  },
  methods: {
    onChange(roleId, actionId, checked) {
      this.selectedRoleId = roleId;
      this.selectedActionId = actionId;
      this.checked = checked;
    },
    async getAction() {
      try {
        const response = await axiosInstance.get("/action-with-role", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.permissions = response.data;
      } catch (error) {
        console.log();
      }
    },
    async submitPermissions() {
      try {
        const response = await axiosInstance.put(
          `/action-with-role/${this.selectedActionId}`,
          {
            roleId: this.selectedRoleId,
            checked: this.checked,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.showToast = true;
        this.toastAction = "success";
        this.toastMessage = response.data.message;
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage = "Có lỗi khi phân quyền";
      }
    },
  },
};
</script>

<style scoped>
.container-fluid{
  padding: 0;
}
.table th,
.table td {
  vertical-align: middle;
}
</style>
