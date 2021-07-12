<template>
    <div>

        <span class="gray">Extra message</span>
        <div :class="`extra-message-row ${identicon ? 'identicon':''}`">


            <account-identicon v-if="identicon" :identicon="identicon" size="35" outer-size="8" :version="version" />
            <select v-model="extraEncryptionOption">
                <option v-for="(encryptionOption, id) in encryptionOptions"
                        :key="`extra-encryption-${id}`"
                        :value="encryptionOption.value">
                    {{encryptionOption.text}}
                </option>
            </select>

            <input type="text" v-model="extraMessage">

        </div>
    </div>
</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon"
const {version} = PandoraPay.enums.wallet.address;

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
            extraEncryptionOption: null,
        }
    },

    computed:{

        encryptionOptions(){
            const out = [ {
                text: 'public message',
                value: '',
            }];
            for (let i=0; i < this.destinations.length; i++)
                if (this.destinations[i].addressModel && this.destinations[i].addressModel.publicKey)
                    out.push( {
                        text: this.destinations[i].addressModel.calculateAddress(),
                        value: this.destinations[i].address,
                    } );
            return out;
        },

        identicon(){
            const out = this.selectedDestinationAddressModel;
            if (out) return out.identiconImg();
        },

        selectedDestinationAddressModel(){
            for (const destination of this.destinations)
                if (this.extraEncryptionOption === destination.address)
                    return destination.addressModel;
        }

    },

    watch: {
        extraMessage (to, from) {
            return this.$emit('changed', {
                extraMessage: to,
            });
        },
        extraEncryptionOption (to, from) {
            return this.$emit('changed', {
                extraEncryptionOption: this.selectedDestinationAddressModel ? this.selectedDestinationAddressModel.publicKey : '',
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
