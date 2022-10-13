const base64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/

export default {

    validateHash: (state)=>(data)=>{

        if (! /^[a-fA-F0-9]+$/.test(data))
            return "Hash is invalid. It should be Hex encoded."

        const s = Buffer.from(data, "hex")
        if (s.length !== PandoraPay.cryptography.HASH_SIZE) return "Hash size is invalid"

        return ""
    },

    validateAsset: (state)=>(data)=>{

        if (! /^[a-fA-F0-9]+$/.test(data))
            return "Asset is invalid. It should be Hex encoded."

        const s = Buffer.from(data, "hex")
        if (s.length !== PandoraPay.cryptography.RIPEMD_SIZE) return "Asset size is invalid"

        return ""
    },

    validateSignature: (state)=>(data)=>{

        if (! base64.test(data))
            return "Signature is invalid. It should be Base64 encoded."

        const s = Buffer.from(data, "base64")
        if (s.length !== PandoraPay.cryptography.SIGNATURE_SIZE) return "Signature size is invalid"

        return ""
    },

    validatePublicKey: (state) => (data)=>{

        if (! base64.test(data))
            return "Public Key is invalid. It should be Base64 encoded."

        const s = Buffer.from(data, "base64")
        if (s.length !== PandoraPay.cryptography.PUBLIC_KEY_SIZE) return "Public Key size is invalid"

        return ""
    },

    validateNumber: (state)=>(number, min, max)=>{

        const n = Number.parseInt(number, 10)
        if (number != n) return "Number is invalid"

        if (typeof min !== "undefined" && n < min) return `Number should be bigger than ${min}`
        if (typeof max !== "undefined" && n > max) return `Number should be smaller than ${max}`

        return ""
    },


}