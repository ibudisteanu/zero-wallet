<template>

    <div>
        <modal ref="modal" title="Account type"  >

            <div class="">
                <span class="thick">Select an Account Type</span> <br/>
                <span>Select either a Transparent or an Anonymous account</span> <br/>
            </div>

            <div class="pd-top-20 options">

                <div class="col-xs-6 category pointer link" @click="select(0)">
                    <i class="fa fa-money-bill-alt"></i>
                    <span class="thick" >Transparent</span>
                    <span>Address is public.</span>
                    <span>All amounts are transparent.</span>
                    <span>Staking</span>
                    <span>Cold Staking</span>
                </div>

                <div class="col-xs-6 category pointer link" @click="select(1)">
                    <i class="fa fa-eye-slash "></i>
                    <span class="thick">Zether</span>
                    <span>Address is Anonymous</span>
                    <span>All amounts are confidential (hidden)</span>
                    <span>Transfers are anonymous using Ring Confidential signatures</span>
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