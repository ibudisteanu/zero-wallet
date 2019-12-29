<template>

    <div v-if="open">
        <div class="background" @click="closeModal"> </div>
        <div class="modal" ref="refModal">
            <div class="body">
                <div class="close" @click="closeModal">
                    x
                </div>

                <div class="header" v-if="title">
                    <div class="title">
                        {{this.title}}
                    </div>
                </div>

                <div class="content">
                    <slot/>
                </div>

            </div>
        </div>
    </div>

</template>

<script>

export default{

    data: () => {
        return {
            open: false,
        }
    },

    props:{

        title: {default: 'Modal Title'},

    },

    methods:{

        closeModal(e){

            if( e ) e.stopPropagation();

            this.open = false;

        },

        showModal(e){

            if (e ) e.stopPropagation();

            this.open = true;
        },

    }

}
</script>

<style scoped>

    .modal .content{
        padding: 20px;
        padding-top: 30px;
        margin: 0!important;
    }

    .modal{
        width: 50%;
        height: auto;
        border-radius: 5px;
        max-width: 550px;
        min-width: 450px;
        position: fixed;
        margin: 0 auto;
        border: solid 1px #313131;
        left: 0;
        right: 0;
        background-color: white;
        z-index: 1600;
        top: 50%;
        transform: translateY(-50%);
        text-align: left;
    }

    .body{

    }

    .header{

    }

    .background{
        position: fixed;
        height: 100%;
        width: 100%;
        display: block;
        z-index: 1000;
        top:0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.83);
    }

    .modal .close{
        position: fixed;
        top: -10px;
        right: 10px!important;
        color: #ffc12c;
        cursor: pointer;
        width: 20px;
        height: 20px;    font-size: 22px;
        display: none!important;
        margin-top: 7px;
    }

    .modal .title{
        background-color: #EEEEEE;
        padding: 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
        line-height: 22px;
        text-align: center;
    }



</style>