export default {


    addressDisplay: (state)=>(address)=>{

        const account = state.list[address.publicKey]

        const isLoading = account === undefined;
        const isFound = account !== null;

        return  ( (!isLoading && !isFound) || (account && !account.plainAccount && !account.registration) ) ? address.addressRegistrationEncoded || address.addressEncoded : address.addressEncoded
    }


}