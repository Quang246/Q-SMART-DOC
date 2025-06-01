<template>
  <nav v-if="totalPages > 1" aria-label="Pagination">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="changePage(currentPage - 1)">
            {{$t('<<')}}
        </button>
      </li>

      <li
        v-for="item in pagesToShow"
        :key="itemKey(item)"
        class="page-item"
        :class="{ active: item === currentPage }"
      >
        <template v-if="item === '...'">
          <span class="page-link">...</span>
        </template>
        <template v-else>
          <button class="page-link" @click="changePage(item)">
            {{ item }}
          </button>
        </template>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="changePage(currentPage + 1)">
          >>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "ArgonPagination",
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  emits: ["page-change"],
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
    pagesToShow() {
      const pages = [];
      if (this.totalPages <= 3) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        let start = this.currentPage;
        if (start > this.totalPages - 2) {
          start = this.totalPages - 2;
        }
        start = Math.max(1, start);

        for (let i = 0; i < 3; i++) {
          const pageNum = start + i;
          if (pageNum <= this.totalPages) pages.push(pageNum);
        }

        const lastInBlock = pages[pages.length - 1];
        if (lastInBlock < this.totalPages) {
          pages.push("...");
          pages.push(this.totalPages);
        }
      }
      return pages;
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit("page-change", page);
      }
    },
    itemKey(item) {
      return item === "..." ? `dots-${Math.random()}` : item;
    },
  },
};
</script>

<style scoped>
.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}
</style>
