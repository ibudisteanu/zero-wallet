<template>
  <div :class="`alert alert-${getBackground} border-2 d-flex align-items-center`" role="alert">
    <div :class="`bg-${getIconBackground} me-3 icon-item`">
      <span :class="`fas fa-${getIcon}-circle text-white fs-3`"></span>
    </div>
    <p class="mb-0 flex-1 ">
      <slot/>
    </p>
  </div>
</template>

<script>
export default {

  props: {
    type: {default: "error"},
    dismissibleTimeout: {default: 0},
    dismissibleText: {default: false}
  },

  computed: {

    getIconBackground() {
      if (this.type === "warning") return "warning"
      if (this.type === "error") return "danger"
      if (this.type === "info") return "info"
      if (this.type === "success") return "success"
      return ""
    },

    getIcon() {
      if (this.type === "warning") return "exclamation"
      if (this.type === "error") return "times"
      if (this.type === "info") return "info"
      if (this.type === "success") return "check"
      return ""
    },

    getBackground() {
      if (this.type === "warning") return "warning"
      if (this.type === "error") return "danger"
      if (this.type === "info") return "info"
      if (this.type === "success") return "success"
      return ""
    }
  },

  watch: {
    dismissibleText: {
      immediate: true,
      handler: function (to, from) {
        if (to === from) return
        setTimeout(() => this.$emit('onDismissible'), this.dismissibleTimeout)
      }
    }
  }

}
</script>
