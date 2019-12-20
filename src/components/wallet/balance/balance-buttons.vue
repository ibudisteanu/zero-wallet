<template>

    <div class="buttons-row">

        <div class="btn">
            <div class="btn-round" @mouseover="hover('send')" @mouseleave="hover('')" >
                <i class="fa fa-long-arrow-down"></i>
            </div>
            <span > {{hovered !== 'send' ? '&nbsp;' : 'Send'}}</span>
        </div>

        <div class="btn">
            <div class="btn-round" @mouseover="hover('receive')" @mouseleave="hover('')">
                <i class="fa fa-long-arrow-up"></i>
            </div>
            <span > {{hovered !== 'receive' ? '&nbsp;' : 'Receive'}}</span>
        </div>
        <div class="btn">
            <div class="btn-round" @mouseover="hover('qrcode')" @mouseleave="hover('')">
                <i class="fa fa-qrcode"></i>
            </div>
            <span > {{hovered !== 'qrcode' ? '&nbsp;' : 'Scan QR'}}</span>
        </div>
        <div class="btn">
            <div class="btn-round" @mouseover="hover('savePrivateKey')" @mouseleave="hover('')">
                <i class="fa fa-save"></i>
            </div>
            <span > {{hovered !== 'savePrivateKey' ? '&nbsp;' : 'Save Key'}}</span>
        </div>

    </div>

</template>

<script>
export default {

    data(){
        return {
            hovered: '',
        }
    },

    methods:{
        hover(which){
            this.hovered = which;
        }
    }

}
</script>

<style scoped>

    .buttons-row{
        text-align: center;
        padding-top: 20px;
    }

    .buttons-row .btn{
        display: inline-block;
        text-align: center;
    }

    .btn-round{
        font-size: 20px;
        margin-bottom: 10px;
        margin-right: 15px;
    }

    .btn-round i{
        margin-top: 18px;
    }

</style>