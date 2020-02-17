<template>

    <div>
        <div class="row">
            <i class="fa fa-file" />
            <span :class="` ${allowDelete ? '' : 'pointer'}`" @click="handleDownload">{{attachment.name}}</span>
            <i v-if="allowDelete" class="danger fa fa-times pointer" @click="handleDeleteFile"/>
        </div>
        <div class="row">
            <img class="image" v-if="isMimeTypeImage" :src="`data:${attachment.type};base64,${attachment.data.toString('base64')}`" />
        </div>

    </div>

</template>

<script>
import FileSaver from 'file-saver'
export default {

    props:{
        attachment: {default: null},
        allowDelete: {default: false},
    },

    computed:{

        isMimeTypeImage(){

            if (['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp'].includes( this.attachment.type ) )
                return true;

            return false;

        }

    },

    methods:{

        handleDeleteFile(){

            this.$emit('deleteAttachment');

        },

        handleDownload(){

            if (this.allowDelete) return;

            if ( !Blob)
                return alert('FileSaver or Blob are not supported by your Browser');

            const file = new Blob([this.attachment.data], {type: "application/octet-stream" } );

            FileSaver.saveAs( file, this.attachment.name);

            this.$notify({
                type: 'success',
                title: `Your file was downloaded`,
                text: `File <strong>${this.attachment.name}</strong> was downloaded to your computer.`,
            });

        }

    }

}
</script>

<style scoped>

    .row{
        padding-top: 10px;
    }

    .image{
        max-width: 128px;
        max-height: 128px;
    }

</style>