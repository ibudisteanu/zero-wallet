<template>
    <div class="account">

        <account-identicon  :identicon="address.identicon" :size="60" :outer-size="20" />
        <div class="pd-top-10">
            <span class="wordwrap ">{{address.name}}</span> <br/>
            <span>{{type}}</span> <br/>
            <div class="pd-top-20">
                Address: <br/>
                <span class="wordwrap thick">{{address.address}} </span> <i class="fa fa-copy pointer"  @click="copyAddress(address.address)"/> <br/> <br/>
            </div>
        </div>

    </div>
</template>

<script>

import AccountIdenticon from "../account/account-identicon";

export default {

    components: { AccountIdenticon },

    props: {
        address: {default: null},
    },

    computed:{
        type(){
            if (this.address.type === 0) return 'Transparent';
            if (this.address.type === 1) return 'Zether';
        }
    },

    methods: {
        copyAddress(address){

            this.$copyText(address).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${address} copied to clipboard`,
                }),
                e =>
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )

        }
    },

}
</script>

<style>

    .account{
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-column-gap: 10px;
    }

    .account span{
        display: inline-block;
    }

    .account i{
        display: inline-block;
    }

</style>