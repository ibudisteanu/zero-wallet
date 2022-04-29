<template>

    <nav class="navbar navbar-light navbar-vertical navbar-expand-xl" @click.stop >
        <div class="d-flex align-items-center">
            <router-link to="/" class="navbar-brand">
                <div class="d-flex align-items-center py-3">
                  <img class="me-2 logo" :src="require(`src/assets/logo-inline${$store.state.settings.dark?'':''}.png`).default" :alt="name">
                </div>
            </router-link>
        </div>
        <div :class="`navbar-collapse collapse ${this.$store.state.page.leftSidebarShow ? 'show' : ''}`">
            <div class="navbar-vertical-content scrollbar">
                <ul class="navbar-nav flex-column mb-3">
                    <li class="nav-item">
                        <router-link to="/" :class="`${route === '/'  || route === '/login' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-money-bill-alt"></i>
                                <span class="nav-link-text ps-1">Account</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :disabled="!isWalletLogged" to="/wallet" :class="`${ route === '/wallet' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu" >
                            <div class="d-flex align-items-center">
                                <i class="fas fa-wallet"></i>
                                <span class="nav-link-text ps-1">Wallet</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <router-link :disabled="!isWalletLogged" to="/txs/private/send" :class="`${ route === '/txs/private/send' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu" >
                                <i class="fas fa-money-check-alt"></i>
                                <span class="nav-link-text ps-1">Private Transfer</span>
                            </router-link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <router-link :disabled="!isWalletLogged" to="/receive" :class="`${ route === '/receive' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu" >
                                <i class="fas fa-hand-holding-usd"></i>
                                <span class="nav-link-text ps-1">Private Receive</span>
                            </router-link>
                        </div>
                    </li>

                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <template v-if="!encrypted">
                                <router-link to="/set-password" class="nav-link" @click.native="disableNavbarMenu">
                                    <i class="fas fa-lock"></i>
                                    <span class="nav-link-text ps-1">Set Password</span>
                                </router-link>
                            </template>
                            <template v-else>
                                <router-link to="/remove-password" class="nav-link" @click.native="disableNavbarMenu">
                                    <i class="fas fa-unlock-alt"></i>
                                    <span class="nav-link-text ps-1">Remove Password</span>
                                </router-link>
                            </template>
                        </div>
                    </li>

                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <router-link to="#" class="nav-link" @click.native="e => toggleNavElement( e,'explorer')">
                                <i class="fas fa-cubes"></i>
                                <span class="nav-link-text px-1">Explorer</span>
                                <i :class="`nav-chevron fas fa-chevron-${navElementsShown['explorer'] ? 'up' : 'down' }`"></i>
                            </router-link>
                        </div>
                        <ul :class="`nav collapse ${navElementsShown['explorer'] ? 'show':''}`">
                            <li class="nav-item">
                                <router-link :class="`nav-link ${route.indexOf('/explorer') === 0 ? 'active' : ''} nav-link`" to="/explorer" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-cube" />
                                        <span class="nav-link-text ps-1">Blocks</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :class="`nav-link ${route.indexOf('/explorer/mempool') === 0 ? 'active' : ''}  nav-link`" to="/explorer/mempool" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-list-ol" />
                                        <span class="nav-link-text ps-1">Mem pool</span>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <router-link :class="`nav-link ${route.indexOf('/explorer/assets') === 0 ? 'active' : ''} nav-link`" to="/explorer/assets" @click.native="disableNavbarMenu">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <span class="nav-link-text ps-1">Assets</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :class="`nav-link ${route.indexOf('/settings') === 0 ? 'active' : ''} nav-link`" to="/settings" @click.native="disableNavbarMenu">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-wrench"></i>
                                <span class="nav-link-text ps-1">Settings</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <div class="d-flex align-items-center">
                            <router-link to="#" class="nav-link" @click.native="e => toggleNavElement(e,'kad')">
                                <i class="fas fa-globe-americas"></i>
                                <span class="nav-link-text px-1">KAD</span>
                                <i :class="`nav-chevron fas fa-chevron-${navElementsShown['kad'] ? 'up' : 'down' }`"></i>
                            </router-link>
                        </div>
                        <ul :class="`nav collapse ${navElementsShown['kad'] ? 'show':''}`">
                            <li class="nav-item">
                                <router-link :disabled="!isWalletLogged" to="#" :class="`nav-link ${ route === '/kad/chat' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Encrypted Chat</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :disabled="!isWalletLogged" to="#" :class="`nav-link ${ route === '/kad/dex' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">DEX</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :disabled="!isWalletLogged" to="#" :class="`nav-link ${ route === '/kad/p2p/dex' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
                                    <div class="d-flex align-items-center">
                                        <span class="nav-link-text ps-1">Peer to Peer Exchange</span>
                                    </div>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :disabled="!isWalletLogged" to="#" :class="`nav-link ${ route === '/kad/p2p/bazaar' ? 'selected' : ''} nav-link`" @click.native="disableNavbarMenu">
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

</template>

<script>
import consts from "consts/consts"

export default {

    data(){
        return {
            toggle: false,
            navElementsShown: {},
        }
    },

    computed:{

        name(){
          return consts.name
        },

        encrypted(){
            return this.$store.state.wallet.isEncrypted;
        },

        route(){
            return this.$router.currentRoute.path || '';
        },

        walletAddress(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
        },

        isWalletLogged(){
            return !(this.$store.state.wallet.initialized && !this.$store.state.wallet.loaded )
        },

    },

    methods:{

        toggleNavElement(e, key){
            if (!this.navElementsShown[key]) this.navElementsShown[key] = true
            else this.navElementsShown[key] = false
        },
        disableNavbarMenu(e){
            this.$store.commit('setLeftSidebarShow', false)
        }
    },


}
</script>

<style scoped>
@media (min-width: 1200px) {
  .navbar-vertical {
    z-index: auto;
  }
}
.logo{
    height: 42px;
}
</style>
