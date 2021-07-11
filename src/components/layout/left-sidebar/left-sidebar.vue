<template>

    <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
        <div class="d-flex align-items-center">
            <router-link to="/" class="navbar-brand">
                <div class="d-flex align-items-center py-3">
                    <img class="me-2" :src="require('src/assets/pandora-pay-logo-inline-crop.png').default" alt="PandoraPay" height="42px">
                </div>
            </router-link>
        </div>
        <div :class="`navbar-collapse collapse ${this.$store.state.page.leftSidebarShow ? 'show' : ''}`">
            <div class="navbar-vertical-content scrollbar">
                <ul class="navbar-nav flex-column mb-3">
                    <li class="nav-item">
                        <router-link to="/" :class="`${route === '/'  || route === '/login' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                            <div class="d-flex align-items-center">
                                <i class="fa fa-money-bill-alt"></i>
                                <span class="nav-link-text ps-1">Account</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :disabled="!isWalletDecrypted" to="/wallet" :class="`${ route === '/wallet' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu" >
                            <div class="d-flex align-items-center">
                                <i class="fa fa-wallet"></i>
                                <span class="nav-link-text ps-1">Wallet</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :disabled="!isWalletDecrypted" to="/staking" :class="`${ route === '/staking' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu" >
                            <div class="d-flex align-items-center">
                                <i class="fa fa-piggy-bank"></i>
                                <span class="nav-link-text ps-1">Staking</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <a class="nav-link" href="#" @click="() => toggleNavElement('transfer')">
                                <i class="fa fa-money-check-alt"></i>
                                <span class="nav-link-text ps-1">Transfer</span>
                                <i :class="`nav-chevron fa fa-chevron-${navElementsShown['transfer'] ? 'up' : 'down' }`"></i>
                            </a>
                        </div>
                        <ul :class="`nav collapse ${navElementsShown['transfer'] ? 'show':''}`">
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <div class="d-flex align-items-center" @click.native="disableNavbarMenu">
                                        <span class="nav-link-text ps-1">Public</span>
                                    </div>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Anonymously</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <a class="nav-link" href="#" @click="() => toggleNavElement('receive')" >
                                <i class="fa fa-hand-holding-usd"></i>
                                <span class="nav-link-text ps-1">Receive</span>
                                <i :class="`nav-chevron fa fa-chevron-${navElementsShown['transfer'] ? 'up' : 'down' }`"></i>
                            </a>
                        </div>
                        <ul :class="`nav collapse ${navElementsShown['receive'] ? 'show':''}`">
                            <li class="nav-item">
                                <router-link :disabled="!isWalletDecrypted" to="/receive" :class="`nav-link ${ route === '/receive' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Public</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Anonymously</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <a class="nav-link" href="#" @click.native="disableNavbarMenu">
                                <i class="fa fa-unlock-alt"></i>
                                <span class="nav-link-text ps-1">Encrypt</span>
                            </a>
                        </div>
                    </li>

                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <a class="nav-link" href="#" @click="() => toggleNavElement('explorer')">
                                <i class="fa fa-cubes"></i>
                                <span class="nav-link-text ps-1">Explorer</span>
                                <i :class="`nav-chevron fa fa-chevron-${navElementsShown['explorer'] ? 'up' : 'down' }`"></i>
                            </a>
                        </div>
                        <ul :class="`nav collapse ${navElementsShown['explorer'] ? 'show':''}`">
                            <li class="nav-item">
                                <router-link :class="`nav-link ${route.indexOf('/explorer') === 0 ? 'active' : ''} nav-link`" to="/explorer" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Blocks</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :class="`nav-link ${route.indexOf('/explorer/mem-pool') === 0 ? 'active' : ''}  nav-link`" to="/explorer/mem-pool" @click="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Mem pool</span>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <router-link :class="`nav-link ${route.indexOf('/tokens') === 0 ? 'active' : ''} nav-link`" to="/tokens" @click.native="disableNavbarMenu">
                            <div class="d-flex align-items-center">
                                <i class="fa fa-file-invoice-dollar"></i>
                                <span class="nav-link-text ps-1">Tokens</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <a class="nav-link" href="#" @click="() => toggleNavElement('kad')">
                                <i class="fa fa-globe-americas"></i>
                                <span class="nav-link-text ps-1">KAD</span>
                                <i :class="`nav-chevron fa fa-chevron-${navElementsShown['kad'] ? 'up' : 'down' }`"></i>
                            </a>
                        </div>
                        <ul :class="`nav collapse ${navElementsShown['kad'] ? 'show':''}`">
                            <li class="nav-item">
                                <router-link :disabled="!isWalletDecrypted" to="#" :class="`nav-link ${ route === '/kad/chat' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Encrypted Chat</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :disabled="!isWalletDecrypted" to="#" :class="`nav-link ${ route === '/kad/dex' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">DEX</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :disabled="!isWalletDecrypted" to="#" :class="`nav-link ${ route === '/kad/p2p/dex' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Peer to Peer Exchange</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :disabled="!isWalletDecrypted" to="#" :class="`nav-link ${ route === '/kad/p2p/bazaar' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Peer to Peer Bazaar</span>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

<!--    <div>-->
<!--        <div class="mobile-menu" @click="showMenu" :style="{display: show ? 'none' : 'inherit' }" >-->
<!--            <i class="fa fa-bars"></i>-->
<!--        </div>-->

<!--        <div v-if="show" class="sidebar" :style="{display: show ? 'inherit' : 'none' }" v-on-clickaway="closeMenu" >-->

<!--            <router-link :disabled="!isWalletDecrypted" to="/account" :class="`${ route === '/account' ? 'selected' : ''}`">-->
<!--                <i class="fa fa-wallet" ></i>-->
<!--                <span>Account</span>-->
<!--            </router-link>-->

<!--            <router-link :disabled="!isWalletDecrypted" to="/staking" :class="`${route === '/staking' ? 'selected' : ''}`" >-->
<!--                <i class="fa fa-piggy-bank"></i>-->
<!--                <span>Staking</span>-->
<!--            </router-link>-->

<!--            <router-link :disabled="!isWalletDecrypted" to="/send" :class="`${route === '/send' ? 'selected' : ''}`" >-->
<!--                <i class="fa fa-money-check-alt"></i>-->
<!--                <span>Send</span>-->
<!--            </router-link>-->

<!--            <router-link :disabled="!isWalletDecrypted" to="/receive" :class="`${route === '/receive' ? 'selected' : ''}`" >-->
<!--                <i class="fa fa-hand-holding-usd"></i>-->
<!--                <span>Receive</span>-->
<!--            </router-link>-->

<!--            <router-link :disabled="!isWalletDecrypted" to="/set-password" v-if="!encrypted" :class="`${route === '/set-password' ? 'selected' : ''}`"  >-->
<!--                <i class="fa fa-unlock-alt"></i>-->
<!--                <span>Encrypt</span>-->
<!--            </router-link>-->

<!--            <router-link :disabled="!isWalletDecrypted" to="/remove-password" v-if="encrypted" :class="`${route === '/remove-password' ? 'selected' : ''}`"  >-->
<!--                <i class="fa fa-lock"></i>-->
<!--                <span>Decrypt</span>-->
<!--            </router-link>-->
<!--        </div>-->
<!--    </div>-->
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
const {version} = PandoraPay.enums.wallet.address;
import Vue from 'vue';
export default {

    mixins: [ clickaway ],

    data(){
        return {
            toggle: false,
            navElementsShown: {},
        }
    },

    computed:{

        sendUrl(){
            if (!this.address) return '';

            if (this.address.version === version.VERSION_TRANSPARENT) return '/send/transparent/transfer';
        },

        encrypted(){
            return this.$store.state.wallet.encrypted;
        },

        route(){
            return this.$router.currentRoute.path;
        },

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash];
        },

        conversationsNewNotifications(){

            if (!this.address) return 0;
            return this.$store.getters.conversationsNewNotifications(this.address.publicKey)

        },

        isWalletDecrypted(){
            if (this.$store.state.wallet.loaded && !this.$store.state.wallet.loggedIn ) return false;
            return true;
        },

    },

    methods:{
        toggleNavElement(key){
            if (!this.navElementsShown[key]) Vue.set(this.navElementsShown, key, true)
            else Vue.set(this.navElementsShown, key, false)
        },
        disableNavbarMenu(){
            console.log("menu closed")
            this.$store.commit('setLeftSidebarShow', false)
        }
    },

    mounted(){

    }

}
</script>

<style scoped>


</style>
