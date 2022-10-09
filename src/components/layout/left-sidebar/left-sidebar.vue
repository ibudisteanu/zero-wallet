<template>

  <nav class="navbar navbar-light navbar-vertical navbar-expand-xl" @click.stop>
    <div class="d-flex align-items-center">
      <router-link to="/" class="navbar-brand">
        <div class="d-flex align-items-center py-3">
          <img class="me-2 logo" :src="require(`src/assets/logo-inline${$store.state.settings.dark?'':''}.png`).default" :alt="name">
        </div>
      </router-link>
    </div>
    <div :class="`navbar-collapse collapse ${this.$store.state.page.leftSidebarShow ? 'show' : ''}`">
      <div class="navbar-vertical-content scrollbar">

        <ul class="navbar-nav flex-column mt-3 mb-3">
          <li class="nav-item">
            <router-link to="/" :class="`${route === '/'  || route === '/login' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
              <div class="d-flex align-items-center">
                <i class="fas fa-money-bill-alt"></i>
                <span class="nav-link-text ps-1">Account</span>
              </div>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :disabled="!isWalletLogged" to="/wallet" :class="`${ route === '/wallet' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
              <div class="d-flex align-items-center">
                <i class="fas fa-wallet"></i>
                <span class="nav-link-text ps-1">Wallet</span>
              </div>
            </router-link>
          </li>
          <li class="nav-item">
            <div class="d-flex align-items-center">
              <router-link :disabled="!isWalletLogged" to="/txs/private/send" :class="`${ route === '/txs/private/send' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
                <i class="fas fa-money-check-alt"></i>
                <span class="nav-link-text ps-1">Private Transfer</span>
              </router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="d-flex align-items-center">
              <router-link :disabled="!isWalletLogged" to="/receive" :class="`${ route === '/receive' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
                <i class="fas fa-hand-holding-usd"></i>
                <span class="nav-link-text ps-1">Private Receive</span>
              </router-link>
            </div>
          </li>

          <li class="nav-item">
            <div class="d-flex align-items-center">
              <template v-if="!encrypted">
                <router-link to="/set-password" :class="`nav-link ${route.indexOf('/set-password') === 0 ? 'active' : ''}`" @click.native="disableNavbarMenu">
                  <i class="fas fa-lock"></i>
                  <span class="nav-link-text ps-1">Set Password</span>
                </router-link>
              </template>
              <template v-else>
                <router-link to="/remove-password" :class="`nav-link ${route.indexOf('/remove-passwor') === 0 ? 'active' : ''}`" @click.native="disableNavbarMenu">
                  <i class="fas fa-unlock-alt"></i>
                  <span class="nav-link-text ps-1">Remove Password</span>
                </router-link>
              </template>
            </div>
          </li>

          <li class="nav-item">
            <div class="d-flex align-items-center">
              <span :class="`nav-link cursor-pointer ${route.indexOf('/explorer') === 0 ? 'active' : ''}`" @click.native="e => toggleNavElement( e,'explorer')">
                <i class="fas fa-cubes"></i>
                <span class="nav-link-text px-1">Explorer</span>
                <i :class="`nav-chevron fas fa-chevron-${navElementsShown['explorer'] ? 'up' : 'down' }`"></i>
              </span>
            </div>
            <ul :class="`nav collapse ${navElementsShown['explorer'] ? 'show':''}`">
              <li class="nav-item">
                <router-link :class="`nav-link ${route === '/explorer' ? 'active' : ''}`" to="/explorer" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-cube"/>
                    <span class="nav-link-text ps-1">Blocks</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :class="`nav-link ${route.indexOf('/explorer/mempool') === 0 ? 'active' : ''}`" to="/explorer/mempool" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-list-ol"/>
                    <span class="nav-link-text ps-1">Mem pool</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :class="`nav-link ${route.indexOf('/explorer/assets') === 0 ? 'active' : ''} nav-link`" to="/explorer/assets" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-file-invoice-dollar"></i>
                    <span class="nav-link-text ps-1">Assets</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <div class="d-flex align-items-center">
              <span :class="`nav-link cursor-pointer ${route.indexOf('/advanced-txs') === 0 ? 'active' : ''}`" @click.native="e => toggleNavElement(e,'advanced-txs')">
                <i class="fas fa-money-check"></i>
                <span class="nav-link-text px-1">Advanced Transfers</span>
                <i :class="`nav-chevron fas fa-chevron-${navElementsShown['advanced-txs'] ? 'up' : 'down' }`"></i>
              </span>
            </div>
            <ul :class="`nav collapse ${navElementsShown['advanced-txs'] ? 'show':''}`">
              <li class="nav-item">
                <router-link :disabled="!isWalletLogged" :class="`nav-link ${ route.indexOf( '/advanced-txs/private/conditional-payment' ) === 0 ? 'active' : ''} nav-link`" to="/advanced-txs/private/conditional-payment" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-balance-scale"></i>
                    <span class="nav-link-text ps-1">Private Conditional Payment</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :class="`nav-link ${ route.indexOf( '/advanced-txs/sign-resolution-conditional-payment' ) === 0 ? 'active' : ''} nav-link`" to="/advanced-txs/sign-resolution-conditional-payment" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-signature"></i>
                    <span class="nav-link-text ps-1">Sign Resolution</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :disabled="!isWalletLogged" :class="`nav-link ${ route.indexOf('/advanced-txs/public/resolution-conditional-payment') === 0 ? 'active' : ''} nav-link`" to="/advanced-txs/public/resolution-conditional-payment" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-gavel"/>
                    <span class="nav-link-text ps-1">Resolution Conditional Tx</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :disabled="!isWalletLogged" :class="`nav-link ${ route.indexOf('/advanced-txs/import-link') === 0 ? 'active' : ''} nav-link`" to="/advanced-txs/import-link" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fa fa-terminal"/>
                    <span class="nav-link-text ps-1">Import Link</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link :class="`nav-link ${route.indexOf('/settings') === 0 ? 'active' : ''} nav-link`" to="/settings" @click.native="disableNavbarMenu">
              <div class="d-flex align-items-center">
                <i class="fas fa-wrench"></i>
                <span class="nav-link-text ps-1">Settings</span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

</template>

<script>
import consts from "consts/consts"

export default {

  data() {
    return {
      toggle: false,
      navElementsShown: {
        explorer: true,
        "advanced-txs": true,
      },
    }
  },

  computed: {

    name() {
      return consts.name
    },

    encrypted() {
      return this.$store.state.wallet.isEncrypted;
    },

    route() {
      return this.$route.fullPath || '';
    },

    walletAddress() {
      return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
    },

    isWalletLogged() {
      return !(this.$store.state.wallet.initialized && !this.$store.state.wallet.loaded)
    },

  },

  methods: {

    toggleNavElement(e, key) {
      if (!this.navElementsShown[key]) this.navElementsShown[key] = true
      else this.navElementsShown[key] = false
    },
    disableNavbarMenu(e) {
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

.logo {
  height: 42px;
}
</style>
