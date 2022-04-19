<template>
  <div class="pointer" v-tooltip.bottom="`${showNetworksMenu ? '' :'Select network'}`" @click.stop="handleToggleNetworksMenu" >

    <i class="fas fa-globe-americas nav-item-icon"></i>
    <span class="badge badge-soft-success">{{ $store.state.network.networkName }}</span>
    <i class="fas fa-chevron-down"></i>

    <div class="menu">
      <div :class="`dropdown-menu dropdown-menu-end py-0 ${showNetworksMenu ? 'show': ''}`" style="right: 5.4375rem; margin-top: 15px">
        <div class="bg-white dark__bg-1000 rounded-2 py-2">
          <a class="dropdown-item" href="#">MAIN Net</a>
          <a class="dropdown-item" href="#">DEV Net</a>
          <a class="dropdown-item" href="#">TEST Net</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      showNetworksMenu: false,
    }
  },
  methods: {
    handleToggleNetworksMenu(){
      this.$emit('closeOtherMenus')
      this.showNetworksMenu = !this.showNetworksMenu
    },
    closeMenu(){
      this.showNetworksMenu = false
    }
  }
}
</script>

<style scoped>

.nav-item-icon {
  font-size: 16px;
}

.fa-chevron-down {
  font-size: 10px;
}

</style>