<template>

    <div v-if="open || openAlways">
        <div class="background" @click="closeModal"> </div>
        <div class="modal" ref="refModal">
            <div class="body">

                <div class="close" @click="closeModal" v-if="closeButton">
                    <i class="fa fa-times"></i>
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
            promise: null,
            resolver: null,
        }
    },

    props:{

        title: {default: 'Modal Title'},
        closeButton: { default: true },
        openAlways: {default: false},

    },

    methods:{

        closeModal(e){

            if ( e ) e.stopPropagation();

            this.open = false;
            this.resolver(this);

            this.$emit('closed');

        },

        showModal(e){

            if ( e ) e.stopPropagation();

            this.promise = new Promise((resolve)=>{
                this.resolver = resolve;
            });

            this.open = true;
            this.$emit('opened');

            return this.promise;
        },

    }

}
</script>

<style scoped>

    .modal .content{
        padding: 20px;
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
        right: 10px!important;
        cursor: pointer;
        width: 20px;
        height: 20px;
        font-size: 22px;
    }

    .modal .title{
        background-color: #EEEEEE;
        padding: 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
        line-height: 22px;
        text-align: center;
    }


    /*
    ##Device = Low Resolution Tablets, Mobiles (Landscape)
    ##Screen = B/w 481px to 767px
    */

    @media (min-width: 481px) and (max-width: 767px) {

        .modal{
            width: 80%;
            min-width: 0;
            padding: 10px;
        }

    }

    /*
      ##Device = Most of the Smartphones Mobiles (Portrait)
      ##Screen = B/w 320px to 479px
    */

    @media (max-width: 480px) {

        .modal{
            width: 95%;
            min-width: 0;
            padding: 10px;
        }

    }

</style>