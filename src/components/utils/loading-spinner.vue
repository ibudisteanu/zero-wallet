<template>
  <i class="fas fa-spinner fa-spin" v-tooltip.bottom="title"></i>
</template>

<script>
export default {
  props: {
    title: {default: ""},
    center: {default: false},
  },
}
</script>

<style scoped>
.fa-spin {
  font-size: 20px;
}
</style>
