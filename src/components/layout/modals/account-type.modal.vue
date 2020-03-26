<template>

    <div>
        <modal ref="modal" title="Account type"  >

            <span class="thick">Select Account Type</span> <br/>

            <div class="centered pd-top-40">

                <div class="col-xs-6">
                    <span class="thick" >Transparent</span>
                    Address is public.
                    All amounts are transparent.
                    Staking
                    Cold Staking
                </div>
                <div class="col-xs-6">
                    <span class="thick">Zether</span>
                    Address is Anonymous
                    All amounts are confidential (hidden)
                    Transfers are anonymous using Ring Confidential signatures
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
            selected: -1,
        }
    },

    methods: {

        async showModal() {
            await this.$refs.modal.showModal();
            return {
                selected: this.selected,
            };
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

    }

}

</script>

<style scoped>

</style>