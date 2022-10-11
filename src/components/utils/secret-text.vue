<template>
  <div>
    <div :class="`fs-0 fw-bold alert alert-primary`" >
      <div :class="`${visible ? '' : 'noselect blurry-text' }`">
        <span v-if="!showBadges" class="text-break">
            {{text}}
        </span>
        <template v-else>
          <span v-for="(word, i) in text.split(' ')" :class="`badge badge-soft-success mx-1 ${visible ? '' : 'noselect blurry-text' }`" :key="`word_${i}`">
            {{ word }}
          </span>
        </template>
        <i :class="`fas fa-copy ps-1 ${visible ? 'cursor-pointer' :''}`" v-tooltip.bottom="visible ? `Copy ${title}` : ''"  @click="visible ? copySecret() : null"/>
      </div>
      <div v-show="!visible" class="position-absolute top-50 start-50 translate-middle cursor-pointer" @click="visible = true"  v-tooltip.bottom="'Show the secret!'">
        <i class="fas fa-eye fs-3"></i> Show
      </div>
    </div>
    <alert-box type="warning" >
      <h5 class="alert-heading fw-semi-bold">WARNING!</h5>
      <slot name="warning"/>
    </alert-box>
  </div>
</template>

<script>
import AlertBox from "src/components/utils/alert-box"
export default {

  components: {AlertBox},

  data() {
    return {
      visible: false,
    }
  },

  props: {
    text: {default: ''},
    showBadges: {default: false},
    title: {default: ''},
  },

  methods: {

    async copySecret() {
      try{
        await this.$copyText(this.text)
        this.$store.dispatch('addToast', {
          type: 'success',
          title: `Copied to clipboard successfully`,
          text: `Copied ${this.title} to clipboard.`
        })
      }catch(e){
        this.$store.dispatch('addToast', {
          type: 'error',
          title: `Clipboard failed`,
          text: `Failed to copy to clipboard`
        })
      }
    }

  }

}
</script>

<style scoped>
.noselect{
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Edge, Opera and Firefox */
}

.fa-eye{
  position:relative;
  top: calc(50% - 10px); /* 50% - 3/4 of icon height */
}

.blurry-text {
  text-shadow: 0 0 15px black;
  color: transparent;
}

.dark .blurry-text {
  text-shadow: 0 0 15px white;
  color: transparent;
}
</style>
