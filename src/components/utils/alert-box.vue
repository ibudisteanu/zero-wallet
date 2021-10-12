<template>
    <div :class="`alert alert-${getBackground} border-2 d-flex align-items-center`" role="alert">
        <div class="bg-white me-3 icon-item">
            <i :class="`fa ${getIcon}`"></i>
        </div>
        <p class="mb-0 flex-1 "><slot/></p>
    </div>
</template>

<script>
export default {

    props: {
        type: {default: "error"},
        dismissibleTimeout: {default: 0},
        dismissibleText: {default: false}
    },

    computed:{
        getIcon(){
            if (this.type === "warning") return "fa-exclamation-triangle"
            if (this.type === "error") return "fa-exclamation-circle"
            if (this.type === "info") return "fa-info"
            if (this.type === "success") return "fa-check"
            return ""
        },

        getBackground(){
            if (this.type === "warning") return "warning"
            if (this.type === "error") return "danger"
            if (this.type === "info") return "info"
            if (this.type === "success") return "success"
            return ""
        }
    },

    watch:{
        dismissibleText: {
            immediate: true,
            handler: function (to, from) {
                if (to === from) return
                setTimeout(()=> this.$emit('onDismissible'), this.dismissibleTimeout )
            }
        }
    }

}
</script>
