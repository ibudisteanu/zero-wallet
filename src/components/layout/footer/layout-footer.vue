<template>
    <div class="footer">

        <div class="boxed">
            <div class="row pd-bottom-10">
                <span>Consensus Established</span>
                <span>Block Height #0</span>
            </div>
            <div class="row">
                <span>© 2019 {{entity}}</span>
            </div>
        </div>

    </div>
</template>

<script>
import consts from 'consts/consts';
export default {

    computed:{

        entity(){
            return consts.entity;
        }

    },

}
</script>

<style scoped>
    .footer{
        padding-top: 50px;
    }

    .row{
        text-align: center;
    }

    .row span{
        display:inline-block;
    }

</style>