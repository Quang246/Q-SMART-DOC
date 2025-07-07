<template>
  <div class="report-box row shadow">
    <div class="col-md-5 mb-3 d-flex align-items-center gap-2">
      <label for="fromDate" class="fw-semibold mb-0"
        >Từ ngày</label
      >
      <ArgonInput
        id="fromDate"
        type="date"
        v-model="fromDate"
        class="flex-grow-1"
      />
    </div>

    <div class="col-md-5 mb-3 d-flex align-items-center gap-2">
      <label for="toDate" class="fw-semibold mb-0"
        >Đến ngày</label
      >
      <ArgonInput
        id="toDate"
        type="date"
        v-model="toDate"
         class="flex-grow-1"
      />
    </div>

    <div class="col-md-2 mb-3 gap-2">
      <ArgonButton class="btn btn-info text-white w-100" @click="fetchReport">
        Báo cáo
      </ArgonButton>
    </div>
    <div class="col-md-10"></div>
    <div class="col-md-2 gap-2">
      <ArgonButton class="btn btn-success w-100" @click="downloadExcel">
        Xuất Excel
      </ArgonButton>
    </div>
    <div class="mt-3">
      <table
        v-if="reportData.length > 0"
        class="table table-hover table-bordered text-center"
      >
        <thead class="table-light">
          <tr>
            <th>STT</th>
            <th>Tiêu đề tài liệu</th>
            <th>Lượt xem</th>
            <th>Lượt tải</th>
            <th>Tổng tương tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in reportData" :key="item.document_id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.total_views }}</td>
            <td>{{ item.total_downloads }}</td>
            <td>{{ item.total_interactions }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-center text-danger">Không có dữ liệu.</p>
    </div>
  </div>
</template>

<script>
import ArgonInput from "../UI/ArgonInput.vue";
import ArgonButton from "../UI/ArgonButton.vue";
import axios from "axios";

export default {
  name: "StatisticReport",
  components: { ArgonInput, ArgonButton },
  data() {
    const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
  const dd = String(today.getDate()).padStart(2, '0');

  const toDate = `${yyyy}-${mm}-${dd}`;
  const fromDate = `${yyyy}-${mm}-01`;

  return {
    fromDate,
    toDate,
    reportData: [],
  };
  },
  mounted(){
    this.fetchReport();
  },
  methods: {
    async fetchReport() {
  const params = {
    fromDate: this.fromDate,
    toDate: this.toDate,
  };

  try {
    const res = await axios.get(
      "http://localhost:3000/q-smart-doc/api/statistic",
      { params } // ✅ Đúng cách
    );
    if (res.data.success) {
      this.reportData = res.data.data.items;
    }
  } catch (err) {
    console.error("Lỗi khi tải báo cáo:", err);
  }
}
,
    async downloadExcel() {
        const params = {
    fromDate: this.fromDate,
    toDate: this.toDate,
  };

  try {
    const res = await axios.get(
      'http://localhost:3000/q-smart-doc/api/statistic/export',
      {
        params,
        responseType: 'blob', // 🟡 Quan trọng để xử lý file
      }
    );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "BaoCaoThongKe.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Lỗi khi xuất Excel:", error);
      }
    },
  },
};
</script>

<style scoped>
.report-box {
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
</style>
