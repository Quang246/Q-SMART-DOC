<template>
  <div style="max-width: 350px; height: 350px;">
    <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import axiosInstance from '@/config'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default {
  name: 'PieChart',
  components: {
    Pie,
  },
  data() {
    return {
      chartData: null,
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Tỷ lệ tài liệu theo định dạng file',
          },
        },
      },
    }
  },
  mounted() {
    this.loadChartData()
  },
  methods: {
    async loadChartData() {
      try {
        const res = await axiosInstance.get('/documents/stats/file-types', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        const fileTypes = res.data

        this.chartData = {
          labels: fileTypes.map((item) => item.type),
          datasets: [
            {
              label: 'Số lượng',
              backgroundColor: ['#00BFFF', '#FFD700', '#FF69B4'],
              data: fileTypes.map((item) => parseInt(item.count)),
            },
          ],
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', err)
      }
    },
  },
}
</script>
