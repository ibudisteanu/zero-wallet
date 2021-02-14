<template>

    <div>
        <modal ref="modal" title="Account type"  >

            <div class="">
                <span class="thick">Select an Account Type</span>
                <span>Select either a Transparent or an Anonymous account</span>
            </div>

            <div class="pd-top-20 options">

                <div class="category pointer link" @click="select(0)">
                    <i class="fa fa-money-bill-alt"></i>
                    <span class="thick" >Transparent</span>
                    <span>Address is public.</span>
                    <span>All amounts are transparent.</span>
                    <span>Staking</span>
                    <span>Cold Staking</span>
                </div>

            </div>

        </modal>
    </div>

</template>

<script>
import Modal from "src/components/utils/modal"

export default {

    components: {Modal},

    data(){
        return {
            selectedType: -1,
        }
    },

    methods: {

        select(type){
            this.selectedType = type;
            this.closeModal();
        },

        async showModal() {

            Object.assign(this.$data, this.$options.data());
            await this.$refs.modal.showModal();

            if (this.selectedType === -1)
                this.$notify({
                    type: 'error',
                    title: 'Account type was not selected',
                    text: 'You have to select an account type'
                });

            return {
                selectedType: this.selectedType,
            };
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

    }

}

</script>

<style scoped>

    .options{
        display: inline-block;
    }

    .category, .category > i, .category > span{
        display: block;
    }

    .category > i {
        font-size: 40px;
    }

</style>