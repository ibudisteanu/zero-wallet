export default {

    setDark(state, value ){

        state.dark = value;
        if (value) {
            document.getElementsByTagName("html")[0].classList.add('dark');
            if (typeof localStorage !== "undefined") localStorage.setItem('dark', 'true' )
        } else {
            document.getElementsByTagName("html")[0].classList.remove('dark');
            if (typeof localStorage !== "undefined") localStorage.setItem('dark', 'false')
        }

    },

    setBalanceDecoderTableSize(state, value){
        state.balanceDecoderTableSize = Number.parseInt(value)
        localStorage.setItem('balanceDecoderTableSize', value );
    },

    readLocalStorage(state){
        state.dark = ( localStorage.getItem('dark') || 'false' ) === 'true'
        state.balanceDecoderTableSize = Number.parseInt( localStorage.getItem('balanceDecoderTableSize') || '16' )
    },

}