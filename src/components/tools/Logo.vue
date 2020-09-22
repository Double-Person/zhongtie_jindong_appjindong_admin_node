<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!-- <img src="~@/assets/logo.svg" alt="logo"> -->
      <img src="../../assets/logo--.png" alt="logo">
      <h1 v-if="showTitle" style="font-size:14px;">{{ isPageRouter }}</h1>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Logo',
    props: {
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    data(){
      return {
        sysTypeMap:{
          '1':'安全积分管理系统',
          '2':'智慧进洞管理系统'
        }
      }
    },
    computed: {
        isPageRouter(){
           const {sysType} = this.$store.getters.userInfo;
             if(typeof sysType === 'string' && sysType.length > 0){
                 const power = sysType.split(',');
                 if(power.length === 1){
                   return this.sysTypeMap[power[0]];
                 } else {
                   return '综合管理系统';
                 }
             }
             return '管理系统';
        }
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  /*缩小首页布 局顶部的高度*/
  $height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: $height !important;
      line-height: $height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: #1890ff;
    }
  }
</style>