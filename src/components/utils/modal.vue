<template>

    <div class="modal fade show" v-if="open" style="display: block">

        <div class="modal-backdrop fade show" @click="closeModal"></div>

        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-index-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" @click="closeModal"></button>
                </div>
                <div class="modal-body p-0">
                    <div v-if="title" class="rounded-top-lg py-3 ps-4 pe-6 bg-light">
                        <h5 class="mb-1" id="modalExampleDemoLabel">{{title}}</h5>
                    </div>
                    <div class="p-4 pb-20">
                        <slot/>
                    </div>
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
    },

    methods:{

        closeModal(e){

            if ( e ) e.stopPropagation();

            this.open = false;
            if (this.resolver) {
                this.resolver(this);
                delete this.promise;
                delete this.resolver;
            }

            this.$store.commit('setModalOpened', false)

            this.$emit('closed');

        },

        showModal(e){

            if ( e ) e.stopPropagation();

            this.promise = new Promise((resolve)=>{
                this.resolver = resolve;
            });

            this.open = true;
            this.$emit('opened');

            this.$store.commit('setModalOpened', true)

            return this.promise;
        },

    }

}
</script>

<style scoped>
    .modal-dialog{
        z-index: 1070;
    }
</style>
