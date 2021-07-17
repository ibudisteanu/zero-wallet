<template>
    <div :class="`alert alert-${getBackground} border-2 d-flex align-items-center mb-0`" role="alert">
        <div class="bg-white me-3 icon-item">
            <i :class="`fa ${getIcon}`"></i>
        </div>
        <p class="mb-0 flex-1"><slot/></p>
    </div>
</template>

<script>
export default {
    props: {
        type: {default: "error"},
    },

    computed:{
        getIcon(){
            if (this.type === "warning") return "fa-exclamation-triangle"
            if (this.type === "error") return "fa-exclamation-circle"
            return ""
        },

        getBackground(){
            if (this.type === "warning") return "warning"
            if (this.type === "error") return "danger"
            return ""
        }
    },

}
</script>
