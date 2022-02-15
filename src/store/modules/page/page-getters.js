export default {

    convertBase64ToHex: state => base64 => {
        return Buffer.from(base64, "base64").toString("hex")
    },

}