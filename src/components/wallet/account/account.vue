<template>
    <div class="account">

        <account-identicon  :identicon="identicon" :size="60" :outer-size="70"  />
        <div class="pd-top-10">
            <span class="wordwrap thick">{{name}}</span>
            <span class="wordwrap">{{address}}</span>
        </div>

    </div>
</template>

<script>

import AccountIdenticon from "../account/account-identicon";

export default {

    components: { AccountIdenticon },

    props: {
        name: '',
        address: '',
        identicon: '',
    }

}
</script>

<style>

    .account{
        display: grid;
        grid-template-columns: 80px 1fr;
    }

</style>