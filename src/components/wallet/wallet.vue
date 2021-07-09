<template>

    <div v-if="address">

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Account Details</h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="row g-0 align-items-center py-2 position-relative border-bottom border-200">
                    <div class="col ps-card py-1 position-static">
                        <div class="d-flex align-items-center d-block">
                            <div class="avatar avatar-xxl me-3">
                                <account-identicon :public-key-hash="publicKeyHash" :size="40" :outer-size="8" />
                            </div>
                            <span class="fw-bold d-block text-truncate">
                                {{address.addressEncoded}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!isLoading && !isFound" class="alert alert-warning border-2 d-flex align-items-center" role="alert">
            <div class="bg-white me-3 icon-item"><i class="fa fa-exclamation-triangle"></i></div>
            <p class="mb-0 flex-1">Address doesn't exist!</p>
        </div>

        <balances :publicKeyHash="publicKeyHash" />
        <transactions :publicKeyHash="publicKeyHash" />

    </div>
    <div v-else>
        <div class="container">
            <div class="boxed centered pd-top-30 pd-bottom-30">
                <loading-spinner />
            </div>
        </div>
    </div>

</template>

<script>

import Balances from "./balance/balances";
import Transactions from "src/components/wallet/transactions/transactions";
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {Balances, Transactions, AccountIdenticon, LoadingSpinner},

    props: {
        publicKeyHash: {default: ""}
    },

    computed:{
        address(){
            return this.$store.state.addresses.list[this.publicKeyHash];
        },
        account(){
            return this.$store.state.addresses.accounts[this.publicKeyHash]
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },
    },

    data(){
        return {
        }
    },

    mounted(){
    }

}
</script>

<style scoped>

</style>
