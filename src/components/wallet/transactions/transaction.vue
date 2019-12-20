<template>

    <div class="transaction">

        <div class="time">
            <span>{{showDate}}</span> </br>
            <span>{{showTime}}</span>
        </div>

        <div class="amount centered">
            <span v-if="!tx.amount">{{tx.whisper}}</span>
            <span v-if="tx.amount">{{tx.amount}}</span>
            {{tx.currency}}
        </div>

    </div>

</template>

<script>
export default {

    props:{
        tx: null,
    },

    computed:{
        showDate(){

            return new Date(this.tx.timestamp).toLocaleDateString();
        },

        showTime(){
            return new Date(this.tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        },

        amount(){

        }

    },

}
</script>

<style scoped>

    .transaction{
        padding-top: 10px;
        padding-bottom: 10px;
        display: grid;
        grid-template-columns: 80px 1fr;
    }

    .time span{
        display: inline;
    }

    .amount{

    }

</style>