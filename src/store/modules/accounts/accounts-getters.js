export default {


    addressDisplay: (state)=>(address)=>{

        const account = state.list[address.publicKey]

        const isLoading = account === undefined;
        const isFound = account !== null;

        console.log(isLoading, isFound)
        return  ( (!isLoading && !isFound) || (account && !account.plainAccount && !account.registered) ) ? address.addressRegistrationEncoded : address.addressEncoded
    }


}