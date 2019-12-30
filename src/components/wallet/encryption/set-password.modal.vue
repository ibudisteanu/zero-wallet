<template>

    <modal ref="modal" title="Set a password" >


        <span class="disabled" >Password</span> <br/>
        <input type="password" class="label" v-model="password">

        <span class="disabled" >Retype Password</span> <br/>
        <input type="password" class="label" v-model="retypePassword">

        <input type="submit" value="Set Password" :disabled="password.length === 0 || retypePassword.length === 0" @click="setPassword">

        <span class="thick pd-top-40 pd-bottom-40">Info: Write down your password.</span>

        <div class="centered">
            <span class="danger">Warning: In case you lose your password, you will need your <strong>seed to recover your seed accounts!</strong>. Imported accounts generated from a different seed can not be recovered by using your seed.</span>
        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"

export default {

    components: {Modal},

    data(){
        return {
            password: '',
            retypePassword: '',
        }
    },

    methods: {

        showModal() {
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        setPassword(){

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