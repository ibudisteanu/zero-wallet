<template>

    <modal ref="modal" title="Decoding" contentClass="" @opened="start" :closing-function="stop" >

        <template slot="body">

            <canvas id="matrixCanvas" ></canvas>

        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";

export default {

    components: {LoadingSpinner, Modal},

    data(){
        return {
            matrixInterval: null,
            publicKey: "",
            balance: "",
            token: "",
            password: "",
            decodedBalance: null,
            cancelCallback: null,
            status: "",
        }
    },

    computed:{

    },

    methods: {

        async showModal(publicKey, balance, token, password ) {

            Object.assign(this.$data, this.$options.data());

            this.publicKey = publicKey
            this.balance = balance
            this.token = token
            this.password = password

            await this.$refs.modal.showModal();
            return this.decodedBalance
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async start(){

            this.startMatrix()

            const data = await PandoraPay.wallet.decodeBalanceWalletAddress( MyTextEncode(JSON.stringify({ publicKey: this.publicKey, balanceEncoded: this.balance, token: this.token })), this.password, (status)=>{
                this.status = status;
            }  )

            this.cancelCallback = data[1]

            const checkBalance = async () => {

                const result = await data[0]()

                if (result[2] && result[2] instanceof Error) {
                    this.$store.dispatch('addToast', {
                        type: 'error',
                        title: `Error decoding your homormorphic balance`,
                        text: `${result[2].message}`,
                    })
                    this.cancelCallback = null
                    return this.closeModal()
                } else if (result[0]){

                    this.$store.dispatch('addToast', {
                        type: 'success',
                        title: `Homormorphic Balance was decoded`,
                        text: `Decoded successfully!`,
                    })

                    this.decodedBalance = result[1]
                    this.cancelCallback = null
                    return this.closeModal()
                }

                setTimeout( () => checkBalance(), 500 )
            }

            setTimeout(  () => checkBalance(), 500 )
        },

        async stop(){

            if (this.cancelCallback)
                await this.cancelCallback()

            this.stopMatrix()

        },

        stopMatrix(){
            clearInterval(this.matrixInterval)
            this.matrixInterval = null
        },

        startMatrix(){

            const c = document.getElementById("matrixCanvas");
            const context = c.getContext('2d');

            c.height = this.$refs.modal.$refs.refModalBody.clientHeight;
            c.width = this.$refs.modal.$refs.refModalBody.clientWidth;


            var letterSize=15;
            var columns=c.width/letterSize;

            const heights=[];
            for(var i=0; i<columns;i++)
                heights[i]=1;

            let lines = [ ]
            let hasText = []

            let middleLine = Math.floor( c.height / letterSize / 2 )

            const createLines = ()=>{
                lines = [
                    "",
                    "DECODING",
                    this.status,
                    "",
                ].reverse()

                let maxLength = 0
                for (const line of lines)
                    if (maxLength < line.length)
                        maxLength = line.length

                maxLength += 2
                for (let i=0; i<lines.length; i++) {
                    const initLength = lines[i].length
                    lines[i] = new Array( Math.floor ( (maxLength - initLength) / 2 ) + 1).join('.') + lines[i]
                    lines[i] = lines[i] + new Array( (maxLength - lines[i].length) + 1).join('.')
                }

                for (let i=0; i<lines.length; i++)
                    lines[i] = createLine(lines[i])

                hasText = []
                for (let i=0; i < heights.length; i++){
                    let foundText = false
                    for (const line of lines )
                        if (line[i] !== ' ') {
                            foundText = true
                            break
                        }
                    hasText[i] = hasText
                }
            }

            function createLine(text ){
                text = new Array( Math.floor( (heights.length - text.length) / 2) +1 ).join(" ")+text
                text = text + new Array(   heights.length - text.length + 1 ).join(" ")
                return text
            }

            function draw(){

                context.fillStyle="rgba(0,0,0,0.05)";
                context.fillRect(0,0,c.width,c.height);

                context.fillStyle= "#0f0";
                context.font= letterSize+"px arial";

                createLines()

                for(let i=0;i<heights.length;i++){

                    let finalCharacter = ''

                    for (let j =0; j < lines.length; j++){
                        if (heights[i]  === middleLine - Math.floor( j - (lines.length / 2) ) && lines[j][i] !== ' ' )
                            finalCharacter = lines[j][i]
                    }

                    if (finalCharacter === '')
                        finalCharacter = selectLetter()

                    context.fillText(finalCharacter.split(""),i*letterSize, heights[i]*letterSize);

                    if (heights[i]*letterSize > c.height){
                        if (Math.random()>0.975) heights[i]=0;
                        else if (hasText[i] && Math.random() > 0.7) heights[i] = 0;
                    }

                    heights[i]++;

                }

            }

            function selectLetter(){
                const selectAsci=Math.floor((Math.random()*94)+33);
                return String.fromCharCode(parseInt(selectAsci));
            }

            this.matrixInterval = setInterval(draw,120);

        }

    }

}

</script>

<style scoped>
    #matrixCanvas{
        width: 100%;
        height: 100%;
    }
</style>
