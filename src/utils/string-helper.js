export default {

    base64ToHex (b) {
        return Buffer.from(b, "base64").toString("hex")
    },

    base64ToString (b) {
        return Buffer.from(b, "base64").toString()
    },

    hexToBase64 (b) {
        return Buffer.from(b, "hex").toString("base64")
    },

    truncateText (string = "", size1 = 8, size2 = 8) {
        if (string.length <= size1 + size2 ) return string
        return string.slice(0, size1)+'...'+string.slice(string.length-size2)
    },

    formatMilliseconds (millisec) {

        const seconds = (millisec / 1000).toFixed(1);
        const minutes = (millisec / (1000 * 60)).toFixed(1);
        const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
        const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) return seconds + " Sec";
        else if (minutes < 60) return minutes + " Min";
        else if (hours < 24) return hours + " Hrs";
        else return days + " Days"

    },

    timeSince (date, longVersion = true ) {

        var seconds = Math.floor((new Date().getTime() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1)
            return interval + (longVersion ? " years" : ' y');

        interval = Math.floor(seconds / 2592000);
        if (interval > 1)
            return interval + (longVersion? " months" : ' mo');
        interval = Math.floor(seconds / 86400);
        if (interval > 1)
            return interval + (longVersion ? " days" : ' d');
        interval = Math.floor(seconds / 3600);
        if (interval > 1)
            return interval + (longVersion ? " hours" : ' h');

        interval = Math.floor(seconds / 60);
        if (interval > 1)
            return interval + (longVersion ? " minutes" : ' m');

        return Math.floor(seconds) + (longVersion? " seconds": ' s');
    },

    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            const str = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i ).toFixed(decimalCount).slice(2) : "");
            let str2 = str.replace(/0+$/,"")
            if (str2.length && str2[str2.length-1] === '.') str2 = str2.substr(0, str2.length-1)

            return str2
        } catch (e) {
            console.log(e)
        }
    },

    formatSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    formatBytes(bytes) {
        return bytes + ' bytes'
    },

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleString()
    },

    generateRandomId( ){
        return Math.random().toString()+Math.random().toString()
    },

    badgeColors(number){
        switch (number % 8){
            case 0: return "primary"
            case 1: return "secondary"
            case 2: return "success"
            case 3: return "info"
            case 4: return "warning"
            case 5: return "danger"
            case 6: return "light"
            case 7: return "dark"
        }
    }
}
