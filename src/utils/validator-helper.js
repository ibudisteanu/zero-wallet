export default {

    validateHex (data, length, title = 'Input')  {

        if (! /^[a-fA-F0-9]+$/.test(data))
            return `${title} is invalid. It should be Hex encoded.`

        if (Buffer.from(data, "hex").length !== length)
            return `${title} size is invalid`

        return ""
    },

    validateBase64 (data, length, title = 'Input') {

        if (! /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(data))
            return `${title} is invalid. It should be Base64 encoded.`

        if (Buffer.from(data, "base64").length !== length)
            return `${title} size is invalid`

        return ""
    },

    validateHash (data)  {
        return this.validateHex(data, PandoraPay.cryptography.HASH_SIZE, "Hash")
    },

    validateAsset (data){
        return this.validateHex(data, PandoraPay.config.coins.ASSET_LENGTH, "Asset")
    },

    validateSignature (data) {
        return this.validateBase64(data, PandoraPay.cryptography.SIGNATURE_SIZE, "Signature")
    },

    validatePublicKey (data) {
        return this.validateBase64(data, PandoraPay.cryptography.PUBLIC_KEY_SIZE, "Public Key")
    },

    validateNumber (number, min, max) {

        const n = Number.parseInt(number, 10)
        if (number != n) return "Number is invalid"

        if (typeof min !== "undefined" && n < min) return `Number should be bigger than ${min}`
        if (typeof max !== "undefined" && n > max) return `Number should be smaller than ${max}`

        return ""
    },

}