<template>
    <div>
        <div class="pb-4">
            <div :class="`fw-bold ${visible ? '' : 'noselect blurry-text' } text-break`" >
                {{text}}
                <i v-if="visible" class="fa fa-copy pointer" v-tooltip.bottom="visible ? `Copy ${title}` : ''"  @click="copySecret"/>
            </div>
            <div v-if="!visible" class="pt-4 text-center pointer" @click="visible = true">
                <i class="fa fa-eye fs-3"></i> Show
            </div>
        </div>
        <alert-box type="warning">
            Warning: DO NOT share this phrase with anyone! These words can be used to <strong>{{warning}}</strong>
        </alert-box>
    </div>
</template>

<script>
import AlertBox from "src/components/utils/alert-box"
export default {

    components: {AlertBox},

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
