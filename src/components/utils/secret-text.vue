<template>
    <div>
        <div>
            <span :class="`font-medium-size wordwrap thick ${visible ? '' : 'noselect blurry-text' }`" >
                {{text}}
                <i v-if="visible" class="fa fa-copy cursor" v-tooltip.bottom="visible ? `Copy ${title}` : ''"  @click="copySecret"/>
            </span>
            <span v-if="!visible" class="pd-top-20 centered pointer" @click="visible = true">
                <i class="fa fa-eye fa-2x"></i> Show
            </span>
        </div>
        <div class="centered pd-top-40">
            <span class="danger">Warning: DO NOT share this phrase with anyone! These words can be used to <strong>{{warning}} !</strong></span>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            visible: false,
        }
    },

    props:{
        text: {default: ''},
        title: {default: ''},
        warning: {default: 'STEAL ALL YOUR ACCOUNTS.'},
    },

    methods:{

        copySecret(){

            this.$copyText(this.text).then( e =>
                    this.$notify({
                        type: 'success',
                        title: `Copied to clipboard successfully`,
                        text: `Copied ${title} to clipboard.`,
                    }),
                e =>
                    this.$notify({
                        type: 'error',
                        title: `Clipboard failed`,
                        text: `Failed to copy to clipboard`,
                    })
            );

        }

    }

}
</script>

<style scoped>
    .noselect{
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
    }

    .fa-eye{
        position:relative;
        top: calc(50% - 10px); /* 50% - 3/4 of icon height */
    }

</style>