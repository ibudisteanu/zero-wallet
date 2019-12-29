import InitializeParams from "./initialize-params/initialize-params"

const exportObject = {
    initializeParams: InitializeParams,
};

if ( typeof window !== 'undefined')
    window.Wallet = exportObject;

export default exportObject;