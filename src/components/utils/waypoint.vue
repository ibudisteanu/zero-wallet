<template>
  <div ref="ref"/>
</template>

<script>
export default {
  mounted() {
    if (typeof window === "undefined") return;
    window.addEventListener('scroll', this.scrollEvent);
    this.scrollEvent();
  },
  data() {
    return {}
  },
  props: {
    distance: {default: 100},
    checkVisible: {default: false},
    enabled: {default: true},
  },
  //@onScroll
  methods: {
    scrollEvent() {
      if (!this.$refs['ref'] || !this.enabled) return;
      try {
        const divTop = this.$refs['ref'].offsetTop;
        const windowHeight = window.outerHeight || document.body.offsetHeight;
        const diff = divTop - window.scrollY - windowHeight;
        if (diff <= this.distance && (!this.checkVisible || diff > -windowHeight)) {
          this.$emit('shown');
        }
      } catch (err) {
        //console.error("Error loading more data", err);
      }
    },
  },
  watch: {
    enabled: function (newVal, oldVal) {
      if (newVal) this.scrollEvent();
    }
  }
}
</script>