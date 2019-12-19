<template>

    <div class="boxed centered">

        <span class="title">Account Balance</span> <br/>

        <span class="balance thick">{{balance}}</span> <span class="currency thick">{{currency}}</span> <br/>

    </div>

</template>

<script>
export default {

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

    .boxed{
        padding-top: 40px;
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