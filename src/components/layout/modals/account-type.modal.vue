<template>

    <div>
        <modal ref="modal" title="Create a new Account">

            <p>
                <strong>Select an Account Type</strong><br/>
                Select either a <strong>Transparent</strong> or an <strong>Anonymous account</strong>
            </p>

            <div class="pt-2 options">

                <a class="category pointer" @click="select(0)" href="#" >

                    <i class="fa fa-money-bill-alt fa-3x"></i>

                    <span class="thick" >Transparent</span>
                    <span>Address is public.</span>
                    <span>All amounts are transparent.</span>
                    <span>Staking</span>
                    <span>Cold Staking</span>
                </a>

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

</style>
