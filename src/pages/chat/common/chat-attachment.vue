<template>

    <div>
        <i class="fa fa-file" />
        <span>{{attachment.name}}</span>

        <i v-if="allowDelete" class="danger fa fa-times pointer" @click="handleDeleteFile"/>
    </div>

</template>

<script>
export default {

    props:{
        attachment: {default: null},
        allowDelete: {default: false},
    },

    methods:{

        handleDeleteFile(){

            this.$emit('deleteAttachment');

        }

    }

}
</script>

<style scoped>
</style>