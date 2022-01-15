<template>
    <div class="input-toggle-group">
        <input class="form-control" :type="`${viewPassword ? 'text' : 'password'}`" v-model="inputVal">
        <i :class="`fas fa-eye${viewPassword ? '-slash':''} input-toggle`" @click="toggleSeen"></i>
    </div>
</template>

<script>
export default {

    props: ['value'],

    computed:{
        inputVal:{

            get(){
                return this.value;
            },

            set(val){
                this.$emit('input', val);
            },

        }
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

    }

}
</script>

<style scoped>

</style>
