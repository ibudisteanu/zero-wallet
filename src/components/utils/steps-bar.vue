<template>
    <div class="progress-div">

        <div class="progress-container">

            <div class="progress"></div>

            <template v-for="(item, index) in length">
                <div :class="`circle ${active === index+1 ? 'active' : ''}`">
                    {{item}}
                </div>
                {{texts[index]}}
            </template>

        </div>

    </div>
</template>
<script>
export default {

    props: {
        length: {default: 5},
        active: {default: 0},
        texts: {default: () => []},
    },

    data () {
        return {
        }
    },
}
</script>
<style scoped>

    .progress-div{
        padding-bottom: 20px;
    }

    .progress-container {
        display: flex;
        justify-content: space-between;
        position: relative;
        max-width: 100%;
    }

    .progress-container::before {
        content: ""; /* Mandatory with ::before */
        background-color: #e0e0e0;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        height: 4px;
        width: 100%;
        z-index: -1;
    }

    .progress {
        background-color: #3498db;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        height: 4px;
        width: 0%;
        z-index: -1;
        transition: 0.4s ease;
    }

    .circle {
        background-color: #fff;
        color: #999;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #e0e0e0;
        transition: 0.4s ease;
    }

    .circle.active {
        border-color: #3498db;
    }

</style>