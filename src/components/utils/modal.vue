<template>

    <div :class="`${open ? 'modal fade show' : ''}`" :style="` ${open ? 'display: flex !important; z-index: '+this.zIndex : 'display: none'}`">

        <template v-if="open">

          <div class="modal-backdrop fade show" @click="handleClickBackground"></div>

          <div class="modal-dialog modal-dialog-centered" :style="`z-index: ${this.zIndex}`">
            <div class="modal-content position-relative">
              <div class="position-absolute top-0 end-0 mt-2 me-2 z-index-1">
                <button v-if="closeButton" class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" @click="closeModal"></button>
              </div>
              <div class="modal-body p-0" ref="refModalBody">
                <div v-if="title" class="rounded-top-lg py-3 ps-3 pe-6 bg-light">
                  <h5 class="mb-1 text-truncate">{{title}}</h5>
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

        </template>


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
        contentClass: {default: 'p-3 p-sm-4'},
        closingFunction: {default: null},
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

        async closeModal(e){

            if ( e ) e.stopPropagation();

            this.$emit('closed');

            if (this.closingFunction)
                await this.closingFunction()

            this.open = false;
            if (this.resolver) {
                this.resolver(this);
                this.promise = null;
                this.resolver = null;
            }
            this.$store.commit('incrementModalIndex', - 1 )

        },

        showModal(e){

            if ( e ) e.stopPropagation();

            Object.assign(this.$data, this.$options.data.apply(this))
            this.zIndex = 1060 + this.$store.state.page.modalIndex

            this.promise = new Promise((resolve)=>{
                this.resolver = resolve;
            });

            this.open = true;

            this.$store.commit('incrementModalIndex', 1 )

            setTimeout ( ()=>{
                this.$emit('opened');
            }, 10)

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
