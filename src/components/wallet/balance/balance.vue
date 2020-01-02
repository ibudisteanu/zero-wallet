<template>

    <div class="container">
        <div class="boxed centered pd-top-30 pd-bottom-30">

            <span class="title">Account Balance</span> <br/>

            <span class="balance thick">{{balance}}</span> <span class="currency thick">{{currency}}</span> <br/>

        </div>
    </div>

</template>

<script>

export default {

    components: {},

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