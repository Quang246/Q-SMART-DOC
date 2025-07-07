<!-- eslint-disable no-undef -->
<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

// Đăng ký các thành phần biểu đồ cần thiết
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)
// eslint-disable-next-line no-undef
const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  dataPoints: {
    type: Array,
    required: true,
  },
})

// Reactive chart data với computed
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Số lượt xem tài liệu',
      data: props.dataPoints,
      borderColor: '#7b2cbf',         // tím than
      backgroundColor: '#d0b3ff',     // tím nhạt cho điểm
      pointBackgroundColor: '#7b2cbf',
      pointRadius: 5,
      fill: false,
      tension: 0.4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Biểu đồ lượt xem tài liệu theo ngày',
      font: {
        size: 18,
        weight: 'bold',
      },
      color: '#333',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Ngày',
        color: '#666',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Lượt xem',
        color: '#666',
      },
      beginAtZero: true,
    },
  },
}
</script>
