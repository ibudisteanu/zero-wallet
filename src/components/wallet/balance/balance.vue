<template>

    <div class="container">
        <div class="boxed centered pd-top-30 pd-bottom-30">

            <span class="title">Account Balance</span> <br/>

            <div v-if="address">

                <loading-spinner v-if="!address.loaded" />

                <div v-else>

                    <div v-for="(balance, token) in balances"
                         :key="`balance-token-${token}`">
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
import LoadingSpinner from "src/components/utils/loading-spinner";

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
            return PandoraPay._scope.argv.transactions.coins.convertToBase(number);
        },

        formatMoney(amount){
            return kernel.helpers.StringHelper.formatMoney(amount);
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