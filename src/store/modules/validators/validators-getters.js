export default {

    validateSignature: (state)=>(data)=>{

        try{
            let s
            try{
                s = Buffer.from(data, "base64")
            }catch(e){
                throw "Signature is invalid. It should be Base64 encoded."
            }
            if (s.length !== PandoraPay.cryptography.SIGNATURE_SIZE) throw "Signature size is invalid"
        }catch(e){
            return e.toString()
        }

        return ""
    },

    validatePublicKey: (state) => (data)=>{
        try{
            let s
            try{
                s = Buffer.from(data, "base64")
            }catch(e){
                throw "Signature is invalid. It should be Base64 encoded."
            }
            if (s.length !== PandoraPay.cryptography.PUBLIC_KEY_SIZE) throw "Public Key size is invalid"
        }catch(e){
            return e.toString()
        }

        return ""
    },

}