<template>
    <div class="account">

        <account-identicon  :identicon="identicon" :size="60" :outer-size="60"  />
        <div class="pd-top-10">
            <span class="wordwrap ">{{name}}</span>
            <span class="wordwrap thick">{{address}}</span>
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
        grid-template-columns: 100px 1fr;
    }

</style>