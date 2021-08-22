<template>

    <div class="modal fade show" v-if="open" :style="`display: flex !important; z-index: ${this.zIndex}`">

        <div class="modal-backdrop fade show" @click="handleClickBackground"></div>

        <div class="modal-dialog modal-dialog-centered" :style="`z-index: ${this.zIndex}`">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-index-1">
                    <button v-if="closeButton" class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" @click="closeModal"></button>
                </div>
                <div class="modal-body p-0">
                    <div v-if="title" class="rounded-top-lg py-3 ps-3 pe-6 bg-light">
                        <h5 class="mb-1">{{title}}</h5>
                    </div>
                    <div v-if="hasBodySlot" :class="`${contentClass} pb-20 d-inline-block w-100`">
                        <slot name="body"/>
                    </div>
                </div>
                <div v-if="hasFooterSlot" class="modal-footer bg-light">
                    <slot name="footer"/>
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
            zIndex: 1060
        }
    },

    props:{
        title: {default: 'Modal Title'},
        closeButton: { default: true },
        contentClass: {default: 'p-3 p-sm-4'}
    },

    computed:{
        hasBodySlot () {
            return !!this.$slots['body']
        },
        hasFooterSlot () {
            return !!this.$slots['footer']
        }
    },

    methods:{

        handleClickBackground(e){
            if ( e ) e.stopPropagation();
            if (!this.closeButton) return

            return this.closeModal()
        },

        closeModal(e){

            if ( e ) e.stopPropagation();

            this.open = false;
            if (this.resolver) {
                this.resolver(this);
                delete this.promise;
                delete this.resolver;
            }

            this.$store.commit('incrementModalIndex', - 1 )

            this.$emit('closed');

        },

        showModal(e){

            if ( e ) e.stopPropagation();

            Object.assign(this.$data, this.$options.data());
            this.zIndex = 1060 + this.$store.state.page.modalIndex

            this.promise = new Promise((resolve)=>{
                this.resolver = resolve;
            });

            this.open = true;
            this.$emit('opened');

            this.$store.commit('incrementModalIndex', 1 )

            return this.promise;
        },

    }

}
</script>

<style scoped>


    .modal-dialog { /* Width */
        max-width: 100%;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    .modal-content{
        width: 520px;
    }

</style>
