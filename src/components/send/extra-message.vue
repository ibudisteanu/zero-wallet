<template>
    <div>
        <span class="disabled">Extra message</span> <br/>

        <div :class="`extra-message-row ${destinationAddressIdenticon ? 'identicon':''}`">

            <account-identicon v-if="destinationAddressIdenticon" :identicon="destinationAddressIdenticon" size="35" outer-size="8" :type="type" />
            <select v-model="extraEncryptionOption">
                <option v-for="(encryptionOption, id) in encryptionOptions"
                        :key="`extra-encryption-${id}`"
                        :value="encryptionOption">
                    {{encryptionOption}}
                </option>
            </select>

            <input type="text" v-model="extraMessage">

        </div>
    </div>
</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon"
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;
export default {

    components: {AccountIdenticon},

    props: {
        destinations: {default: null},
        type: {default: 0},
    },

    data(){
        return {
            error: '',
            extraMessage: '',
            extraEncryptionOption: 'public message',
        }
    },

    computed:{

        encryptionOptions(){
            const out = [ 'public message' ];
            for (let i=0; i < this.destinations.length; i++)
                out.push(this.destinations[i].destinationAddress );
            return out;
        },

        destinationAddressIdenticon(){
            try{
                if (this.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return PandoraPay.cryptography.addressValidator.validateAddress( this.extraEncryptionOption ).identiconImg();
            }catch(err){
            }
        },

    },

    watch: {
        'extraMessage' (to, from) {
            return this.$emit('changed', {
                extraMessage: to,
            });
        },
        'extraEncryptionOption' (to, from) {
            return this.$emit('changed', {
                extraEncryptionOption: to,
            });
        },
    },

}
</script>


<style scoped>
    .extra-message-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 10px;
    }
    .identicon {
        grid-template-columns: 50px 1fr 1fr;
    }
</style>