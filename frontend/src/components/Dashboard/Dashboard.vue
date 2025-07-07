<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <CardInfo
        color="success"
        icon="file-earmark-text"
        title="Số tài liệu"
        :value="totalDoc"
      />
      <CardInfo
        color="dark-purple"
        icon="eye"
        title="Số lượt xem"
        :value="totalView"
      />
      <CardInfo
        color="warning"
        icon="cloud-arrow-down"
        title="Số lượt tải xuống"
        :value="totalDown"
      />
      <CardInfo
        color="danger"
        icon="graph-up"
        title="Số lượt truy cập"
        :value="totalAccess"
      />
    </div>

    <!-- New imported books & Readers violated -->
    <div class="row mb-4">
      <div class="col-md-7">
        <!-- <DataTable
          :title="'Tài liệu mới'"
          :headers="bookHeaders"
          :rows="newBooks"
        /> -->
        <div class="card">
          <div class="card-header fw-bold">TÀI LIỆU MỚI</div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th
                    class="text-center"
                    style="font-size: small"
                    v-for="header in bookHeaders"
                    :key="header"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  style="font-size: small"
                  v-for="doc in newBooks"
                  :key="doc.documentId"
                >
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
                  <td class="text-center">
                    {{ formatDate(doc.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-5 chart-card">
        <LineChart :labels="labels" :dataPoints="dataPoints" />
      </div>
    </div>
    <div class="row">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header fw-bold">TÀI LIỆU ĐƯỢC TRUY CẬP NHIỀU NHẤT</div>
        <div class="table-responsive">
          <table class="table table-bordered table-striped mb-0">
            <thead class="table-light">
              <tr>
                <th
                  style="font-size: small"
                  v-for="header in violatedHeaders"
                  :key="header"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style="font-size: small"
                v-for="doc in statisticDoc.slice(0, 5)"
                :key="doc.document_id"
              >
                <td
                  class="text-center"
                  style="white-space: normal; word-break: break-word"
                >
                  {{ doc.document_id }}
                </td>
                <td
                  class="text-start"
                  style="white-space: normal; word-break: break-word"
                >
                  {{ doc.title }}
                </td>
                <td class="text-center">
                  {{ doc.total_interactions }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <PieChart />
    </div>
  </div>
  </div>
</template>

<script>
import CardInfo from "./CardInfo.vue";
import axiosInstance from "@/config";
import { format } from "date-fns";
import LineChart from "./LineChart.vue";
import PieChart from "./PieChart.vue";
export default {
  components: { CardInfo, LineChart, PieChart },
  data() {
    return {
      bookHeaders: ["Tên Tài Liệu", "Tác Giả", "Ngày Tạo"],
      violatedHeaders: ["Mã Tài Liệu", "Tên Tài Liệu", "Số Lượt Truy Cập"],
      borrowingHeaders: [
        "#",
        "Name Reader",
        "Name Book",
        "Expiry Date",
        "Create date",
      ],
      newBooks: [],
      statisticDoc: [],
      borrowedReaders: [
        [35, "Piter", "sdadasdsad", "2020-07-27", "2020-05-02"],
        [36, "Piter", "sdadasdsad", "2020-07-29", "2020-05-02"],
        [31, "Tom", "sdadasdsad", "2020-05-19", "2020-05-02"],
      ],
      token: localStorage.getItem("accessToken"),
      totalDoc: "",
      totalView: "",
      totalDown: "",
      totalAccess: "",
      labels: [],
      dataPoints: [],
    };
  },
  mounted() {
    this.loadData();
    this.searchDoc();
    this.fetchViewStats();
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatDateStatistic(date) {
      return format(new Date(date), "dd/MM");
    },
    async loadData() {
      try {
        const response = await axiosInstance.get("/statistic", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.statisticDoc = response.data.data.items;
        this.totalView = response.data.data.summary.total_views;
        this.totalDown = response.data.data.summary.total_downloads;
        this.totalAccess = response.data.data.summary.total_interactions;
      } catch (error) {
        console.log();
      }
    },
    async searchDoc() {
      try {
        const response = await axiosInstance.get("/documents/getAllDoc", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            page: "1",
            pageSize: "5",
          },
        });
        this.newBooks = response.data.data;
        this.totalDoc = response.data.pagination.totalCount;
      } catch (error) {
        this.showToast = true;
        this.toastAction = "error";
        this.toastMessage =
          error.response?.data?.message || "Lỗi không xác định!";
      }
    },
    async fetchViewStats() {
      try {
        const fromDate = this.getNDaysAgo(6);
        const toDate = this.getNDaysAgo(0);

        const response = await axiosInstance.get("/statistic/view-by-date", {
          params: { fromDate, toDate },
        });

        const data = response.data;
        this.labels = data.map((item) =>
          this.formatDateStatistic(item.view_date)
        );
        this.dataPoints = data.map((item) => item.view_count);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê lượt xem:", error);
      }
    },
    getNDaysAgo(n) {
      const date = new Date();
      date.setDate(date.getDate() - n);
      return date.toISOString().split("T")[0];
    },
  },
};
</script>

<style scoped>
.container-fluid {
  padding: 0;
}
.chart-card {
  background-color: #ffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
}
</style>
