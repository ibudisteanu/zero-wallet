<template>
    <div>
        <div :class="`fs-0 fw-bold alert alert-primary`" >
            <div :class="`${visible ? '' : 'noselect blurry-text' }  text-break`">
                {{text}}
                <i v-if="visible" class="fa fa-copy pointer " v-tooltip.bottom="visible ? `Copy ${title}` : ''"  @click="copySecret"/>
            </div>
            <div v-show="!visible" class="position-absolute top-50 start-50 translate-middle pointer " @click="visible = true"  v-tooltip.bottom="'Show the secret!'">
                <i class="fa fa-eye fs-3"></i> Show
            </div>
        </div>
        <alert-box type="warning" >
            <h5 class="alert-heading fw-semi-bold">WARNING!</h5>
            DO NOT share this phrase with anyone! These words can be used to <strong>{{warning}}</strong>
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

            this.$copyText(this.text).then(
                e => this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Copied ${this.title} to clipboard.`,
                }),
                e => this.$store.dispatch('addToast', {
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
