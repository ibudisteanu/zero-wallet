<template>

    <modal ref="modal" title="Wallet Seed" >

        <span class="font-medium-size wordwrap pd-bottom-40 thick" >{{seed}}</span>

        <div class="centered">
            <span class="danger">Warning: DO NOT share this phrase with anyone! These words can be used to steal all your accounts.</span>
        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"

export default {

    components: {Modal},

    data(){
        return {
            seed: '',
        }
    },

    methods: {

        showModal(seed) {
            this.seed = seed;
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

    }

}
</script>

<style scoped>
    span{
        display: inline-block
    }
    .wordwrap{
        display: block;
    }
</style>