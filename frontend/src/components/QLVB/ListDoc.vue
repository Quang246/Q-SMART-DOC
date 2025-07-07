<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container-fluid row">
    <div class="col-md-3">
      <CategoryTree @category-selected="handleCategory" />
    </div>
    <div class="col-md-9">
      <div class="position-relative">
        <Argon-input
          v-model="form.title"
          placeholder="Bạn muốn tìm kiếm tài liệu gì..."
          @keyup="onKeyUp"
        />

        <ul
          v-if="suggestions.length"
          class="list-group position-absolute w-100 zindex-dropdown"
        >
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :class="['list-group-item', { active: index === selectedIndex }]"
            @click="chooseSuggestion(suggestion)"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
      <table class="table table-bordered mt-4">
        <thead class="thead-light">
          <tr>
            <th class="text-center" style="width: 30%">Tiêu đề</th>
            <th class="text-center" style="width: 15%">Tác giả</th>
            <th class="text-center" style="width: 40%">Đường dẫn file</th>
            <th class="text-center" style="white-space: nowrap">Ngày tạo</th>
            <th class="text-center" style="white-space: nowrap">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in docs" :key="doc.documentId">
            <td
              class="text-start"
              style="white-space: normal; word-break: break-word"
            >
              {{ doc.title }}
            </td>
            <td
              class="text-start"
              style="white-space: normal; word-break: break-word"
            >
              {{ doc.author }}
            </td>
            <td
              class="text-start"
              style="white-space: normal; word-break: break-word"
            >
              {{ getFileName(doc.filePath) }}
            </td>
            <td>{{ formatDate(doc.createdAt) }}</td>
            <td>
              <i
                class="bi bi-eye text-success me-2"
                @click="viewDoc(doc.documentId)"
                title="Xem tài liệu"
              ></i>
              <i
                class="bi bi-download text-primary"
                @click="downloadDoc(doc.documentId)"
                title="Tải xuống tài liệu"
              ></i>
            </td>
          </tr>
          <tr v-if="docs.length === 0">
            <td colspan="5" class="text-center text-danger py-2">
              Không tìm thấy tài liệu phù hợp!
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
    </div>
  </div>
  <Toast
    v-if="showToast"
    :action="toastAction"
    :message="toastMessage"
    @hide="showToast = false"
  />
  <div v-if="pdfUrl" class="modal-overlay">
    <div class="modal-content">
      <div class="text-end mb-2">
        <argon-button @click="pdfUrl = ''" color="danger" size="sm">
          Đóng
        </argon-button>
      </div>
      <iframe :src="pdfUrl" class="pdf-frame"></iframe>
    </div>
  </div>
</template>

<script>
import CategoryTree from "../Category/CategoryTree.vue";
import ArgonInput from "../UI/ArgonInput.vue";
import ArgonButton from "../UI/ArgonButton.vue";
import axiosInstance from "@/config";
import axios from "axios";
import Toast from "../UI/Toast.vue";
import ArgonPagination from "../UI/ArgonPagination.vue";
import { format } from "date-fns";
export default {
  components: {
    CategoryTree,
    ArgonInput,
    ArgonButton,
    Toast,
    ArgonPagination,
  },
  data() {
    return {
      pdfUrl: "",
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
        filePath: {},
      },
      confirmDelete: false,
      selectedId: "",
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      suggestions: [],
      selectedIndex: -1,
      isSearchingByCategory: false,
    };
  },
  methods: {
    handleCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.form.categoryId = categoryId;
      this.searchDoc();
    },
    getFileName(path) {
      if (!path) return "";
      return path.split("/").pop();
    },
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    async searchDoc(page = 1) {
  try {
    this.currentPage = page;
    this.isSearchingByCategory = true; // đánh dấu đang tìm theo category
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
async search(page = 1) {
  try {
    this.currentPage = page;
    this.isSearchingByCategory = false; // đánh dấu đang tìm kiếm toàn bộ
    const response = await axiosInstance.get("/documents/getAllDoc", {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      params: {
        page: this.currentPage,
        pageSize: this.pageSize,
        title: this.form.title,
      },
    });
    this.docs = response.data.data;
    this.totalCount = response.data.pagination.totalCount;
  } catch (error) {
    this.showToast = true;
    this.toastAction = "error";
    this.toastMessage =
      error.response?.data?.message || "Lỗi không xác định!";
  }
},

    async viewDoc(docId) {
      try {
        const response = await axiosInstance.get(
          `/documentAction/view/${docId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (response.data.fileUrl) {
          this.pdfUrl = response.data.fileUrl;
          this.$nextTick(() => {
            const iframe = document.querySelector("iframe");
            iframe?.scrollIntoView({ behavior: "smooth" });
          });
        }
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage =
          error.response?.data?.message || "Lỗi khi tải tài liệu!";
      }
    },
    async downloadDoc(docId) {
      try {
        // Gọi API backend để lấy URL và tên file
        const response = await axiosInstance.get(
          `/documentAction/download/${docId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        const { url, fileName } = response.data;

        // Gọi tiếp đến Cloudinary để lấy file dạng blob
        const fileResponse = await axios.get(url, {
          responseType: "blob",
        });

        // Tạo URL tải và gán tên file
        const blob = new Blob([fileResponse.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName || "downloaded_file";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage =
          error.response?.data?.message || "Lỗi khi tải tài liệu!";
        console.error(error);
      }
    },
    handlePageChange(page) {
  this.currentPage = page;
  if (this.isSearchingByCategory) {
    this.searchDoc(page);
  } else {
    this.search(page);
  }
},

    async fetchSuggestions() {
      const query = this.form.title.trim();
      if (!query) {
        this.suggestions = [];
        return;
      }

      try {
        const res = await axiosInstance.get(
          `/ai-suggest?q=${encodeURIComponent(query)}`
        );
        this.suggestions = res.data;
        this.selectedIndex = -1;
      } catch (err) {
        console.error("Lỗi:", err);
        this.suggestions = [];
      }
    },

    moveDown() {
      if (this.selectedIndex < this.suggestions.length - 1) {
        this.selectedIndex++;
      }
    },

    moveUp() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    onKeyUp(e) {
      const key = e.key;
      if (key === " " || key === "Backspace") {
        this.fetchSuggestions();
      } else if (key === "ArrowDown") {
        this.moveDown();
      } else if (key === "ArrowUp") {
        this.moveUp();
      } else if (key === "Enter") {
        this.selectSuggestion();
        this.suggestions = [];
      }
    },
    selectSuggestion() {
      if (this.selectedIndex >= 0) {
        this.form.title = this.suggestions[this.selectedIndex];
      }
      this.suggestions = [];
      this.search();
    },

    chooseSuggestion(sug) {
      this.form.title = sug;
      this.suggestions = [];
    },
  },
};
</script>

<style scoped>
.container-fluid{
  padding: 0;
}
.row {
  padding: 0;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 80vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
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
table {
  font-size: small;
}
.list-group {
  text-align: start;
}
.suggestion-list {
  max-height: 200px;
  border-radius: 0 0 0.5rem 0.5rem;
}

.list-group-item.active,
.list-group-item:hover {
  background-color: #f1f1f1;
  color: #000;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 1000px;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.pdf-frame {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  border: none;
}
.mt-3 {
  padding: 0;
}
</style>
