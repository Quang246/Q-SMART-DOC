<template>
  <div class="col-md-3">
    <div :class="['card', 'text-white', `bg-${color}`, 'mb-3']">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h5 class="card-title">{{ value }}</h5>
          <p class="card-text">{{ title }}</p>
        </div>
        <i :class="`bi bi-${icon} fs-1`"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: String,
    icon: String,
    title: String,
    value: Number,
  },
};
</script>
