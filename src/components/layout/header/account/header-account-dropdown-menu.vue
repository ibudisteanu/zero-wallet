<template>

    <ul class="dd-menu">

        <li>My accounts</li>

        <li v-for="(address) in addresses" :class="`address ${ address.address === mainAddress  ? 'focused' : ''} ` " @click="setMainAddress(address.address)" >
            <account-identicon :identicon="address.identicon" :size="20" :outer-size="18" > </account-identicon>
            <div>
                <span>{{address.name}}</span> <br/>
                <span class="disabled">{{address.address.substr(0, 20)+'...'}}</span>
            </div>
        </li>

        <li class="divider"></li>

        <li @click="createAccount">Create account</li>
        <li @click="importAccount">Import account</li>
        <li class="divider"></li>
        <li>View Mnemonic</li>
    </ul>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"

export default {

    components: {AccountIdenticon},

    computed: {
        addresses(){
            return this.$store.state.addresses;
        },

        mainAddress(){
            return this.$store.state.mainAddress;
        }

    },

    methods:{

        async createAccount(){

            const out = await global.apacache.wallet.manager.createNewAddress();

        },

        async setMainAddress(address){

            this.$store.commit('setMainAddress', address );

        },

        importAccount(){

        }

    }

}
</script>

<style scoped>

    .address{
        display: grid;
        grid-template-columns: 50px 1fr;
    }

    .focused{
        background-color: #edffec;
    }

    .dd-menu {
        left: -160px;

        position: absolute;
        top: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0;
        margin: 2px 0 0 0;
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.1);
        background-color: #ffffff;
        list-style-type: none;

        z-index: 100;
    }

    .dd-menu li {
        padding: 10px 20px;
        cursor: pointer;
        white-space: nowrap;
    }

    .dd-menu li:hover {
        background-color: #f6f6f6;
    }

    .dd-menu li a {
        display: block;
        margin: -10px -20px;
        padding: 10px 20px;
    }

    .dd-menu li.divider{
        padding: 0;
        border-bottom: 1px solid #cccccc;
    }

</style>