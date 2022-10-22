export default {

    setScreenInformation(state ){
        if (typeof window !== "undefined" ){
            console.log(window.innerWidth)
            state.mobile = window.innerWidth < 760
            state.tablet = window.innerWidth < 1024
        }
    },

    setDark(state, value ){

        state.dark = value;

        document.getElementsByTagName("html")[0].classList[value ? 'add' : 'remove']('dark');
        localStorage.setItem('dark', value ? 'true' : 'false' )

    },

    setBalanceDecryptorTableSize(state, value){
        state.balanceDecryptorTableSize = Number.parseInt(value)
        localStorage.setItem('balanceDecryptorTableSize', value );
    },

    readLocalStorage(state){
        state.dark = ( localStorage.getItem('dark') || 'false' ) === 'true'
        state.balanceDecryptorTableSize = Number.parseInt( localStorage.getItem('balanceDecryptorTableSize') || '18' )
        state.expert = ( localStorage.getItem('expert') || 'false' ) === 'true'
    },

    setExpert(state, value){
        state.expert = value

        localStorage.setItem('expert', value ? 'true' : 'false' )
    }

}