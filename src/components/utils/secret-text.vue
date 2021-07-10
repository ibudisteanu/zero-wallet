<template>
    <div>
        <div class="pb-4">
            <div :class="`fs-bold ${visible ? '' : 'noselect blurry-text' }`" >
                {{text}}
                <i v-if="visible" class="fa fa-copy pointer" v-tooltip.bottom="visible ? `Copy ${title}` : ''"  @click="copySecret"/>
            </div>
            <div v-if="!visible" class="pt-4 text-center pointer" @click="visible = true">
                <i class="fa fa-eye fa-2x"></i> Show
            </div>
        </div>
        <div class="alert alert-warning border-2 d-flex align-items-center" role="alert">
            <div class="bg-white me-3 icon-item"><i class="fa fa-exclamation-triangle"></i></div>
            <p class="mb-0 flex-1">Warning: DO NOT share this phrase with anyone! These words can be used to <strong>{{warning}}</strong></p>
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
                        text: `Copied ${this.title} to clipboard.`,
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
