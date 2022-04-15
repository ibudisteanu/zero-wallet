export default {

    setScreenInformation(state ){
        if (typeof screen !== "undefined" ){
            state.mobile = screen.width < 760
            state.tablet = screen.width < 1024
        }
    },

    setDark(state, value ){

        state.dark = value;
        if (value) {
            document.getElementsByTagName("html")[0].classList.add('dark');
            localStorage.setItem('dark', 'true' )
        } else {
            document.getElementsByTagName("html")[0].classList.remove('dark');
            localStorage.setItem('dark', 'false')
        }

    },

    setBalanceDecryptorTableSize(state, value){
        state.balanceDecryptorTableSize = Number.parseInt(value)
        localStorage.setItem('balanceDecryptorTableSize', value );
    },

    readLocalStorage(state){
        state.dark = ( localStorage.getItem('dark') || 'false' ) === 'true'
        state.balanceDecryptorTableSize = Number.parseInt( localStorage.getItem('balanceDecryptorTableSize') || '18' )
    },

}