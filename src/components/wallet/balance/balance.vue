<template>

    <div class="container">
        <div class="boxed centered">

            <span class="title">Account Balance</span> <br/>

            <span class="balance thick">{{balance}}</span> <span class="currency thick">{{currency}}</span> <br/>

            <balance-buttons></balance-buttons>

        </div>
    </div>

</template>

<script>

import BalanceButtons from "./balance-buttons"

export default {

    components: {BalanceButtons},

    computed:{

        balance(){
            return '0.00';
        },

        currency(){
            return 'USD';
        }

    }

}
</script>

<style scoped>

    .container{
    }

    .boxed{
        padding-top: 40px;
        padding-bottom: 40px;
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