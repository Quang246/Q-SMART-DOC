<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container-fluid row">
    <div class="col-md-2">
      <CategoryTree @category-selected="handleCategory" />
    </div>
    <div class="col-md-10">
      <div class="row mb-3">
        <div class="col-md-6">
          <ArgonInput v-model="form.title" placeholder="Tiêu đề" />
        </div>
        <div class="col-md-6">
          <ArgonInput v-model="form.author" placeholder="Tác giả" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-10">
          <ArgonInput
            type="file"
            v-model="form.filePath"
            placeholder="Đường dẫn file (filePath)"
          />
        </div>
        <div class="col-md-2 text-end">
          <argon-button class="" id="btn-upload" @click="upload" type="submit">
            {{ $t("Thêm tài liệu") }}
          </argon-button>
        </div>
      </div>
      <!-- Table hiển thị dữ liệu -->
      <table class="table table-bordered mt-4">
        <thead class="thead-light">
          <tr>
            <th style="width: 40%">Tiêu đề</th>
            <th style="width: 20%">Tác giả</th>
            <th style="white-space: nowrap">Người tạo</th>
            <th style="white-space: nowrap">Người cập nhật</th>
            <th style="white-space: nowrap">Ngày tạo</th>
            <th style="white-space: nowrap">Ngày cập nhật</th>
            <th style="white-space: nowrap">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in docs" :key="doc.documentId">
            <td style="white-space: normal; word-break: break-word">
              {{ doc.title }}
            </td>
            <td>{{ doc.author }}</td>
            <td>{{ doc.createdByUser }}</td>
            <td>{{ doc.updatedByUser }}</td>
            <td>{{ formatDate(doc.createdAt) }}</td>
            <td>{{ doc.updatedAt ? formatDate(doc.updatedAt) : "" }}</td>
            <td>
              <i
                class="bi bi-pencil-square text-primary me-2"
                @click="editDoc(doc.documentId, doc.title, doc.author)"
              ></i>
              <i
                class="bi bi-trash text-danger"
                @click="deleteDoc(doc.documentId)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
      <ArgonPagination
        v-if="docs.length > 0"
        :total-items="totalCount"
        :page-size="pageSize"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
      <div v-if="editModal" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editDocModalLabel">
              Chỉnh sửa tài liệu
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <ArgonInput v-model="editForm.title" placeholder="Tiêu đề" />
              </div>
              <div class="col-md-6">
                <ArgonInput v-model="editForm.author" placeholder="Tác giả" />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-12">
                <ArgonInput type="file" v-model="editForm.filePath" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <argon-button type="button" @click="updateDoc()">
              Cập nhật
            </argon-button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showEditModal()"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Confirm
    :modalActive="confirmDelete"
    @close="confirmDelete = false"
    @agree="deleteDocById(docId)"
  >
    <template #message>
      {{ $t("Bạn có chắc chắn muốn xóa tài liệu này không?") }}
    </template>
  </Confirm>
  <Toast
    v-if="showToast"
    :action="toastAction"
    :message="toastMessage"
    @hide="showToast = false"
  />
</template>

<script>
import CategoryTree from "../Category/CategoryTree.vue";
import ArgonInput from "../UI/ArgonInput.vue";
import ArgonButton from "../UI/ArgonButton.vue";
import axiosInstance from "@/config";
import Toast from "../UI/Toast.vue";
import ArgonPagination from "../UI/ArgonPagination.vue";
import { format } from "date-fns";
import Confirm from "../UI/Confirm.vue";
export default {
  components: {
    CategoryTree,
    ArgonInput,
    ArgonButton,
    Toast,
    Confirm,
    ArgonPagination,
  },
  data() {
    return {
      selectedCategoryId: "",
      accessToken: localStorage.getItem("accessToken"),
      showToast: false,
      toastAction: "",
      toastMessage: "",
      docs: [],
      form: {
        title: "",
        author: "",
        categoryId: this.selectedCategoryId,
        filePath: "",
      },
      editModal: false,
      editForm: {
        documentId: "",
        title: "",
        author: "",
        filePath: "",
      },
      confirmDelete: false,
      selectedId: "",
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
    };
  },
  methods: {
    handleCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.form.categoryId = categoryId;
      this.searchDoc();
    },
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    async upload() {
      try {
        const response = await axiosInstance.post(
          "/documents/createdoc",
          {
            title: this.form.title,
            author: this.form.author,
            categoryId: this.selectedCategoryId,
            filePath: this.form.filePath,
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (response.status) {
          this.showToast = true;
          this.toastAction = "success";
          this.toastMessage = response.data.message;
        }
        this.searchDoc();
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        if (this.form.title === "") {
          this.toastMessage = error.response?.data?.message[0];
        } else if (this.form.author === "") {
          this.toastMessage = error.response?.data?.message[0];
        } else if (this.form.filePath === "") {
          this.toastMessage = error.response?.data?.message[0];
        } else {
          this.toastMessage = error.response?.data?.message;
        }
      }
    },
    async searchDoc() {
      try {
        const response = await axiosInstance.get("/documents/getDocby", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            categoryId: this.selectedCategoryId,
            title: "",
            author: "",
            fromDate: "",
            toDate: "",
            page: this.currentPage,
            pageSize: this.pageSize,
          },
        });
        this.docs = response.data.data;
        this.totalCount = response.data.pagination.totalCount;
      } catch (error) {
        this.docs = [];
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage =
          error.response?.data?.message || "Lỗi không xác định!";
      }
    },
    async updateDoc() {
      try {
        const response = await axiosInstance.post(
          `/documents/updateDocby/${this.editForm.documentId}`,
          {
            title: this.editForm.title,
            author: this.editForm.author,
            filePath: this.editForm.filePath,
            categoryId: this.editForm.categoryId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (response.status === 201) {
          this.showToast = true;
          this.toastAction = "success";
          this.toastMessage = "Cập nhật tài liệu thành công";
          this.editModal = false;
          this.searchDoc();
        }
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        if (error.response?.data?.message.length > 1) {
          this.toastMessage = error.response?.data?.message;
        } else {
          this.toastMessage =
            error.response?.data?.message[0] || "Lỗi khi cập nhật tài liệu";
        }
      }
    },
    deleteDoc(documentId) {
      this.confirmDelete = true;
      this.selectedId=documentId;
      // try {
      //   const response = await axiosInstance.delete(
      //     `documents/deleteDocby/${documentId}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${this.accessToken}`,
      //       },
      //     }
      //   );
      //   this.showToast = true;
      //   this.toastAction = "success";
      //   this.toastMessage = response.data.message;
      //   this.searchDoc();
      // } catch (error) {
      //   this.docs = [];
      //   this.showToast = true;
      //   this.toastAction = "error";
      //   this.toastMessage =
      //     error.response?.data?.message || "Lỗi không xác định!";
      // }
    },
    async deleteDocById(documentId){
      documentId=this.selectedId;
      try {
        const response = await axiosInstance.delete(
          `documents/deleteDocby/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        this.showToast = true;
        this.toastAction = "success";
        this.toastMessage = response.data.message;
        this.searchDoc();
      } catch (error) {
        this.docs = [];
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage =
          error.response?.data?.message || "Lỗi không xác định!";
      }
    },
    editDoc(docId, title, author) {
      this.editModal = true;
      this.editForm = {
        documentId: docId,
        title: title,
        author: author,
        filePath: "",
      };
    },
    async showEditModal() {
      this.editModal = false;
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.searchDoc();
    },
  },
};
</script>

<style scoped>
.row {
  padding: 0;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-header,
.modal-footer {
  border-bottom: none;
  border-top: none;
  padding-bottom: 0;
}

.modal-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-body .row {
  margin-bottom: 1rem;
}

/* Hiệu ứng hiển thị */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
