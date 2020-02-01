<template>

    <div class="container">
        <div class="boxed centered pd-top-30 pd-bottom-30">

            <span class="title">Account Balance</span> <br/>

            <div v-if="address">

                <loading-spinner v-if="!address.loaded" />

                <div v-if="address.loaded">

                    <div v-for="(balance, token) in balances" >
                    <span class="balance thick" >
                        {{formatMoney( convertToBase(balance) ) }}
                    </span>
                        <span class="currency thick">
                        {{token}}
                    </span>
                        <br/>
                    </div>

                </div>


            </div>

        </div>
    </div>

</template>

<script>
import Utils from "src/utils/utils"
import LoadingSpinner from "../../utils/loading-spinner";

export default {

    components: {LoadingSpinner},

    props: {
        address: null
    },

    computed:{

        balances(){
            return this.address.balances || {"00": 0};
        },

    },

    methods:{

        convertToBase(number){
            return global.PandoraPay._scope.argv.transactions.coins.convertToBase(number);
        },

        formatMoney(amount){
            return Utils.formatMoney(amount);
        }

    }

}
</script>

<style scoped>

    .container{
    }

    .boxed{

    }

    .title{
        font-size: 20px;
    }

    .balance{
        font-size: 30px;
    }

    .currency{
        font-size: 20px;
    }





</style>