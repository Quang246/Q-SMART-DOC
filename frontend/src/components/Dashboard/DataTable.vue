<template>
  <div class="card">
    <div class="card-header fw-bold">{{ title }}</div>
    <div class="table-responsive">
      <table class="table table-bordered table-striped mb-0">
        <thead class="table-light">
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td v-for="(col, colIndex) in row" :key="colIndex">{{ col }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    headers: Array,
    rows: Array,
  },
};
</script>
