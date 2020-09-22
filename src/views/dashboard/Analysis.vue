<template>
<div class="page-header-index-wide">
    <a-button v-if="layoutPage.length === 2" type="primary" style="margin-bottom:20px;" @click="handleClickToggle">{{currentPage.gottleName}}</a-button>
    <component v-bind:is="currentPage.path"></component>
</div>
</template>

<script>
import layoutMain from './layoutMain'
import actionMain from './actionMain'
export default {
    name: "Analysis",
    components: { 
        layoutMain,
        actionMain
    },
    computed: {
        currentPage(){
            return this.layoutPage[0]; 
        }
    },
    data() {
        return {
            layoutPage: [{
                path: 'layoutMain',
                gottleName: '智慧进洞首页'
            },{
                path: 'actionMain',
                gottleName: '安全积分首页'
            }]
        }
    },
    created() {
        this.isPageRouter();
    },
    methods: {
        isPageRouter(){
             const {sysType} = this.$store.getters.userInfo;
             if(typeof sysType === 'string' && sysType.length > 0){
                 const power = sysType.split(',');
                 if(power.length == 1){
                    if(power.includes('1')){
                        this.handleClickToggle();
                    }
                    this.layoutPage.pop();
                 }
             }
        },
        handleClickToggle(){
            this.layoutPage = [this.layoutPage[0], this.layoutPage[this.layoutPage.length - 1]] = [this.layoutPage[this.layoutPage.length - 1], this.layoutPage[0]];
        }
    }
}
</script>

<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

.flex-justify-b {
    justify-content: space-between;
}

.flex-align-c {
    align-items: center;
}

.flex-justify-c {
    justify-content: center;
}
</style>
