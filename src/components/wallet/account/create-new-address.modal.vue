<template>

  <modal ref="modal" title="Create New Address">

    <template v-slot:body>

        <div class="form-group">
          <label>Account Name</label>
          <input type="text" class="form-control" v-model="name"/>
        </div>

        <div class="form-check pt-4">
          <input class="form-check-input" id="staked" type="checkbox" v-model="staked" />
          <label class="form-check-label" for="staked">Staked</label>
        </div>

        <div class="form-check pt-2">
          <input class="form-check-input" id="spendRequired" type="checkbox" v-model="spendRequired" />
          <label class="form-check-label" for="spendRequired">Spend Key Required</label>
        </div>

    </template>

    <template v-slot:footer>
      <button class="btn btn-falcon-primary" type="button" @click="handleCreateNewAddress">
        <i class="fas fa-plus"></i> Create New Address
      </button>
      <button class="btn btn-outline-primary" type="button" @click="closeModal">
        <i class="fas fa-ban"></i> Close
      </button>
    </template>

  </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import UtilsHelper from "src/utils/utils-helper";

export default {

  components: { Modal },

  data(){
    return {
      staked: false,
      spendRequired: false,
      name: '',
      error: '',
    }
  },

  computed:{
  },

  methods:{

    showModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
      return this.$refs.modal.showModal();
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    async handleCreateNewAddress(){

      try{

        const password = await this.$store.state.page.refWalletPasswordModal.showModal()
        if (password === null ) return

        this.$store.state.page.refLoadingModal.showModal();

        await UtilsHelper.sleep(50 )

        const out = await PandoraPay.wallet.manager.addNewWalletAddress(password, this.name, this.staked, this.spendRequired);
        if (!out) throw "Result is false"

        this.$store.dispatch('addToast',{
          type: 'success',
          title: 'Address has been added successfully',
          text: 'A new address has been added and saved in your wallet'
        });

        this.closeModal()
      }catch(err){
        this.$store.dispatch('addToast',{
          type: 'error',
          title: 'Error creating an address',
          text: 'An error was encountered: ' + err.toString()
        });
        console.error(err);
      }finally{
        this.$store.state.page.refLoadingModal.closeModal();
      }

    },

  },

}
</script>

<style scoped>

</style>
