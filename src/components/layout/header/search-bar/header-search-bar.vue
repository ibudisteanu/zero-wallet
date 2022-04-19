<template>
  <div class="search-box">
    <div class="position-relative ">
      <input class="form-control search-input fuzzy-search" type="search" placeholder="Address, Tx, Block, Asset" v-model="search" v-on:keyup.enter="searchNow">
      <i class="fa fa-search fa-w-16 search-box-icon"></i>
    </div>
    <div class="btn-close-falcon-container position-absolute end-0 top-50 translate-middle shadow-none">
      <div class="btn-close-falcon" aria-label="Close" v-if="search"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
    }
  },
  methods: {

    async searchNow(){

      try{
        if (!isNaN(this.search))
          return this.$router.push('/explorer/block/'+this.search)
      }catch(err){

      }

      try{
        await PandoraPay.addresses.decodeAddress(this.search)
        return this.$router.push('/address/'+this.search)
      }catch(err){

      }

      try{
        const hex = Buffer.from(this.search, "hex" )

        if (hex.length === PandoraPay.config.coins.ASSET_LENGTH)
          return this.$router.push('/explorer/asset/'+this.search)

        if (hex.length === PandoraPay.cryptography.HASH_SIZE)
          return this.$router.push('/explorer/tx/'+this.search)

      }catch(err){

      }

    },
  }
}
</script>

<style scoped>

.search-box{
  max-width: 21rem;
  width: 100%;
}

</style>