<template>
    <div class="input-toggle-group">
        <input class="form-control" :type="`${viewPassword ? 'text' : 'password'}`" :value="value" @input="emit" v-on:keyup.native.enter="()=>$emit('enter', null )" >
        <i :class="`fas fa-eye${viewPassword ? '-slash':''} input-toggle`" @click="toggleSeen"></i>
    </div>
</template>

<script>
export default {

    props: {
      value: {default: ""}
    },

    computed:{
    },

    data(){
        return {
            viewPassword: false,
        }
    },

    methods:{

        toggleSeen(){
            this.viewPassword = !this.viewPassword;
        },

        emit(e){
          this.$emit('changed', e.target.value)
        }

    }

}
</script>

<style scoped>

</style>
