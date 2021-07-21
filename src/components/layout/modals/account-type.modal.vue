<template>

    <modal ref="modal" title="Create a new Account">

        <template slot="body">

            <p>
                Select either a <strong>Transparent</strong> or an <strong>Anonymous account</strong>
            </p>

            <div class="pt-2 d-inline-block">

                <div class="card-group">
                    <div class="card overflow-hidden pointer" @click="()=>select(0)">
                        <div class="card-img-top">
                            <img class="img-fluid" src="https://www.datadriveninvestor.com/wp-content/uploads/2020/02/bc-compressor.jpg" alt="Card image cap">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Transparent</h5>
                            <p class="card-text">
                                Address is public <br/>
                                All amounts are transparent <br/>
                                Staking <br/>
                                Cold Staking <br/>
                            </p>
                        </div>
                    </div>
                    <div class="card overflow-hidden">
                        <div class="card-img-top">
                            <img class="img-fluid" src="https://www.crypto-news.net/wp-content/uploads/2018/06/bigstock-Technology-Security-207471322.jpg" alt="Card image cap">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Anonymous</h5>
                            <p class="card-text">
                                Unlinkable Transactions <br/>
                                Confidential Amounts <br/>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </template>

    </modal>

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

    .card-img-top img {
    }

</style>
