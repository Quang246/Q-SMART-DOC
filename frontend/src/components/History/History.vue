<template>
  <div class="history-container">
    <div v-for="item in history" :key="item.date" class="date-group">
      <div class="date-header text-start">{{ formatDate(item.date) }}</div>
      <div class="actions">
        <div
          v-for="action in item.actions"
          :key="action.actionTime"
          class="action-item"
        >
          <div class="action-info">
            <span class="time">{{ formatTime(action.actionTime) }}</span>
            <span class="text">
              Bạn đã {{ action.actionType === "view" ? "xem" : "tải" }} tài
              liệu: {{ action.documentTitle }}
            </span>
          </div>
          <button class="action-btn" @click="handleAction(action)">
            {{ action.actionType === "view" ? "Xem lại" : "Tải lại" }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="pdfUrl" class="modal-overlay">
  <div class="modal-content">
    <div class="text-end mb-2">
      <argon-button @click="pdfUrl = ''" class="btn mb-0 btn-danger btn-sm null null">Đóng</argon-button>
    </div>
    <iframe :src="pdfUrl" class="pdf-frame"></iframe>
  </div>
</div>
  </div>
</template>

<script>
import axiosInstance from "@/config";
import axios from "axios";

export default {
  name: "LichSuTuongTacTaiLieu",
  data() {
    return {
      history: [],
      accessToken: localStorage.getItem("accessToken"),
      userId: localStorage.getItem("userid"),
      pdfUrl: "",
    };
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory() {
      try {
        const res = await axiosInstance.get(
          `/statistic/view-by-date/${this.userId}`
        );
        this.history = res.data;
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatTime(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
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
    handleAction(action) {
      if (action.actionType === "view") {
        this.viewDoc(action.documentId);
      } else if (action.actionType === "download") {
        this.downloadDoc(action.documentId);
      }
    },
  },
};
</script>

<style scoped>
.history-container {
  padding: 20px;
  /* max-width: 800px; */
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.date-group {
  margin-bottom: 25px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.date-header {
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 12px;
  position: relative;
}

.date-header::before {
  content: "📅";
  margin-right: 8px;
}

.actions {
  padding-left: 10px;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: #f7f9fc;
  border-radius: 6px;
  transition: transform 0.2s;
}

.action-item:hover {
  transform: scale(1.02);
  background: #eef3f8;
}

.action-info {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #34495e;
}

.time {
  color: #3498db;
  font-weight: 600;
}

.action-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  width: 80px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #2980b9;
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
</style>
