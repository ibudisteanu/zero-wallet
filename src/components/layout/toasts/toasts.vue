<template>
  <div class="position-fixed bottom-0 first-0">
    <div class="px-1 py-2 pt-0 px-sm-3 py-sm-2 toast-div" v-for="(toast, key ) in list"
         :key="`toast_${key}`">
      <div class="toast show">
        <div :class="`toast-header ${getTitleBackground(toast)}`">
          <strong class="me-auto">{{ toast.title }}</strong>
          <small v-if="toast.time" class="text-muted">{{ toast.time }}</small>
          <button class="ms-2 btn-close cursor-pointer " type="button" @click="() => closeToast(toast)"></button>
        </div>
        <div class="toast-body">
          <i v-if="getIcon(toast)" :class="`fa ${getIcon(toast)} fs-2 p-2 pt-0`"></i>
          {{ toast.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  computed: {
    list() {
      return this.$store.state.toasts.list.reverse()
    }
  },

  methods: {
    closeToast(toast) {
      this.$store.commit('removeToast', toast.id)
    },
    getTitleBackground(toast) {
      if (toast.type === "info") return 'bg-primary text-white';
      if (toast.type === "error") return 'bg-danger text-white';
      if (toast.type === "success") return 'bg-success text-white';
      if (toast.type === "warning") return 'bg-warning text-white';
      return ''
    },
    getIcon(toast) {
      if (toast.type === "warning") return "fa-exclamation-triangle"
      if (toast.type === "error") return "fa-exclamation-circle"
      if (toast.type === "info") return "fa-info"
      if (toast.type === "success") return "fa-check"
      return ''
    }
  }

}
</script>

<style scoped>
.toast-div {
  z-index: 1040
}
</style>
