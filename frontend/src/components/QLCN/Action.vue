<template>
  <div class="container-fluid">
    <div class="col-md-12 text-end">
      <ArgonButton class="btn btn-primary mb-3" @click="openModal()">
        Thêm quyền mới
      </ArgonButton>
    </div>
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Mã</th>
          <th>Tên chức năng</th>
          <th>Mô tả</th>
          <th>Đường dẫn</th>
          <th>Người tạo</th>
          <th>Ngày tạo</th>
          <th>Người cập nhật</th>
          <th>Ngày cập nhật</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in actions" :key="item.actionId">
          <td>{{ item.actionId }}</td>
          <td>{{ item.actionName }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.router }}</td>
          <td>{{ item.createdByUser }}</td>
          <td>{{ formatDate(item.createdDate) }}</td>
          <td>{{ item.updatedByUser }}</td>
          <td>{{ item.updatedDate? formatDate(item.updatedDate):'' }}</td>
          <td class="text-center">
            <i
              class="bi bi-pencil-square text-primary me-2"
              @click="openModal(item)"
            ></i>
            <i
              class="bi bi-trash text-danger"
              @click="deleteFunction(item.actionId)"
            ></i>
          </td>
        </tr>
        <tr v-if="actions.length === 0">
          <td colspan="8" class="text-center">Không có chức năng nào.</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal chức năng -->
    <div class="modal fade" id="functionModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Cập nhật chức năng" : "Thêm chức năng" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 row">
              <label class="col-md-4 text-start">Tên chức năng</label>
              <argon-input class="col-md-8" v-model="form.actionName" />
            </div>
            <div class="mb-3 row">
              <label class="col-md-2 text-start">Mô tả</label>
              <argon-input class="col-md-10" v-model="form.description" />
            </div>
            <div class="mb-3 row">
              <label class="col-md-2 text-start">Đường dẫn</label>
              <argon-input class="col-md-10" v-model="form.router" />
            </div>
          </div>
          <div class="modal-footer">
            <argon-button color="secondary" data-bs-dismiss="modal"
              >Đóng</argon-button
            >
            <argon-button color="primary" @click="saveFunction"
              >Lưu</argon-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast v-if="showToast" :action="toastAction" :message="toastMessage" @hide="showToast = false" />
</template>

<script>
import axiosInstance from "@/config";
import ArgonButton from "../UI/ArgonButton.vue";
import ArgonInput from "../UI/ArgonInput.vue";
import Toast from "../UI/Toast.vue";
import { format } from "date-fns";
import { Modal } from "bootstrap";
export default {
  name: "FunctionManager",
  components: { ArgonButton, ArgonInput, Toast },
  data() {
    return {
      actions: [],
      isEdit: false,
      form: {
        actionName: "",
        description: "",
        router: ""
      },
      token: localStorage.getItem("accessToken"),
      actionId:"",
      showToast: false,
      toastAction: "",
      toastMessage: "",
    };
  },
  created() {
    this.loadFunctions();
  },
  methods: {
    formatDate(dateStr) {
      return format(new Date(dateStr), "dd/MM/yyyy");
    },
    async loadFunctions() {
      try {
        const res = await axiosInstance.get("/Actions/getAllAction", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.actions = res.data.data;
      } catch (err) {
        console.error("Lỗi load chức năng:", err);
      }
    },
    openModal(func = null) {
      this.isEdit = !!func;
      if (func) {
        this.actionId = func.actionId;
        this.form = {
          actionName: func.actionName || "",
          description: func.description || "",
          router: func.router || "",
          updatedBy: null,
        };
      } else {
        this.form = { actionName: "", description: "", router: "" , createdBy: null };
      }

      const modalElement = document.getElementById("functionModal");

      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      } else {
        console.error("Không tìm thấy phần tử modal với id 'functionModal'");
      }
    },
    async saveFunction() {
      try {
        if (this.isEdit) {
          await axiosInstance.post(
            `/Actions/updateby/${this.actionId}`,
            this.form,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          );
          this.showToast = true;
        this.toastAction = "success";
        this.toastMessage = "Cập nhật chức năng thành công";
        } else {
          await axiosInstance.post("/Actions/createAction", this.form, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.showToast = true;
          this.toastAction = "success";
          this.toastMessage = "Tạo chức năng thành công";
        }
        const modal = Modal.getInstance(
          document.getElementById("functionModal")
        );
        modal.hide();
        this.loadFunctions();
      } catch (err) {
        console.error("Lỗi lưu chức năng:", err);
        alert("Có lỗi xảy ra khi lưu chức năng.");
      }
    },
    async deleteFunction(id) {
      if (!confirm("Bạn có chắc muốn xóa chức năng này?")) return;
      try {
        await axiosInstance.delete(
          `/Actions/deleteby/${id}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.loadFunctions();
        this.showToast = true;
        this.toastAction = "success";
        this.toastMessage = "Xóa chức năng thành công";
      } catch (err) {
        console.error("Lỗi xóa:", err);
        alert("Xóa thất bại.");
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
