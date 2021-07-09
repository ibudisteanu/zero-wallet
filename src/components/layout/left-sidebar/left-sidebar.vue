<template>

    <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
        <div class="d-flex align-items-center">
            <div class="toggle-icon-wrapper" style="margin-right: 0">
                <button class="btn navbar-toggler-humburger-icon navbar-vertical-toggle" data-bs-toggle="tooltip" data-bs-placement="left" title="Toggle Navigation"><span class="navbar-toggle-icon"><span class="toggle-line"></span></span></button>
            </div>
            <router-link to="/" class="navbar-brand">
                <div class="d-flex align-items-center py-3">
                    <img class="me-2" :src="require('src/assets/pandora-pay-logo-inline-crop.png').default" alt="PandoraPay" height="42px">
                </div>
            </router-link>
        </div>
        <div class="collapse navbar-collapse">
            <div class="navbar-nav flex-column mb-3">
                <li class="nav-item">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-money-bill-alt"></i>
                        <span class="nav-link-text ps-1">Wallet</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-wallet"></i>
                        <span class="nav-link-text ps-1">Account</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-piggy-bank"></i>
                        <span class="nav-link-text ps-1">Staking</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-money-check-alt"></i>
                        <span class="nav-link-text ps-1">Transfer</span>
                        <i class="nav-chevron fa fa-chevron-down"></i>
                    </div>
                    <ul class="nav collapse show">
                        <li class="nav-item">
                            <a class="nav-link active" href="index.html">
                                <div class="d-flex align-items-center">
                                    <span class="nav-link-text ps-1">Public</span>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="index.html">
                                <div class="d-flex align-items-center">
                                    <span class="nav-link-text ps-1">Anonymously</span>
                                </div>
                            </a>
                        </li>
                    </ul>

                    <div class="d-flex align-items-center">
                        <i class="fa fa-hand-holding-usd"></i>
                        <span class="nav-link-text ps-1">Receive</span>
                        <i class="nav-chevron fa fa-chevron-down"></i>
                    </div>
                    <ul class="nav collapse show" >
                        <li class="nav-item">
                            <a class="nav-link active" href="index.html">
                                <div class="d-flex align-items-center">
                                    <span class="nav-link-text ps-1">Public</span>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="index.html">
                                <div class="d-flex align-items-center">
                                    <span class="nav-link-text ps-1">Anonymously</span>
                                </div>
                            </a>
                        </li>
                    </ul>

                    <div class="d-flex align-items-center">
                        <i class="fa fa-unlock-alt"></i>
                        <span class="nav-link-text ps-1">Encrypt</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-cubes"></i>
                        <span class="nav-link-text ps-1">Explorer</span>
                        <i class="nav-chevron fa fa-chevron-down"></i>
                    </div>
                    <ul class="nav collapse show">
                        <li class="nav-item">
                            <router-link :class="`nav-link ${route.indexOf('/explorer') === 0 ? 'active' : ''}`" to="/explorer">
                                <div class="d-flex align-items-center">
                                    <span class="nav-link-text ps-1">Blocks</span>
                                </div>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${route.indexOf('/explorer/mem-pool') === 0 ? 'selected' : ''}`" to="/explorer/mem-pool">
                                <div class="d-flex align-items-center">
                                    <span class="nav-link-text ps-1">Mem pool</span>
                                </div>
                            </router-link>
                        </li>
                    </ul>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-file-invoice-dollar"></i>
                        <span class="nav-link-text ps-1">Tokens</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-globe-americas"></i>
                        <span class="nav-link-text ps-1">KAD</span>
                    </div>
                </li>
            </div>
        </div>
    </nav>

<!--    <div>-->
<!--        <div class="mobile-menu" @click="showMenu" :style="{display: show ? 'none' : 'inherit' }" >-->
<!--            <i class="fa fa-bars"></i>-->
<!--        </div>-->

<!--        <div v-if="show" class="sidebar" :style="{display: show ? 'inherit' : 'none' }" v-on-clickaway="closeMenu" >-->

<!--            <router-link to="/" :class="`${route === '/'  || route === '/login' ? 'selected' : ''}`">-->
<!--                <i class="fa fa-money-bill-alt" ></i>-->
<!--                <span>Wallet</span>-->
<!--            </router-link>-->

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

<!--            <router-link to="/tokens" :class="`${route.indexOf('/tokens') === 0 ? 'selected' : ''}`"  >-->
<!--                <i class="fa fa-file-invoice-dollar"></i>-->
<!--                <span>Tokens</span>-->
<!--            </router-link>-->

<!--            <router-link to="/kad" :class="`${route === '/kad' ? 'selected' : ''}`"  >-->
<!--                <i class="fa fa-globe"></i>-->
<!--                <span>KAD</span>-->
<!--            </router-link>-->

<!--        </div>-->
<!--    </div>-->
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
const {version} = PandoraPay.enums.wallet.address;

export default {

    mixins: [ clickaway ],

    data(){
        return {
            show: false,
            fullWidth: false,
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

        showMenu(){
            this.show = true;
        },

        closeMenu(){

            if (this.fullWidth) return;

            this.show = false;
            console.log('show false');
        }
    },

    mounted(){

        const refresh = (e)=>{

            //note i need to pass the event as an argument to the function
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width <= 767) {
                this.show = false;
                this.fullWidth = false;
                this.$emit('onUpdateMarginLeft', {marginLeft: '0' });
            }
            else {
                this.show = true;
                this.fullWidth = true;
                this.$emit('onUpdateMarginLeft', {marginLeft: '85px' });
            }


        };

        window.addEventListener("resize", (e)=> refresh(e) );

        refresh(window);
    }

}
</script>

<style scoped>

    .nav-chevron{
        margin-left: 5px;
        font-size: .675rem;
    }

</style>
