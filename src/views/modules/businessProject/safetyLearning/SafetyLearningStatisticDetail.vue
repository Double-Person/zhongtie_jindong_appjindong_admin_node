<template>
<a-card>
  <a-row slot="title">
    <a-col :span="22">
      <span>
        {{detailInfo.title}}
      </span>
    </a-col>
    <a-col :span="2">
      <a-button type="link" @click="handleGoBack">
        <a-icon type="left" />返回</a-button>
    </a-col>
  </a-row>

  <a-row>
    <a-col :lg="lg" :md="md" :sm="sm" :xs="xs">
      <p>封面：<img :src="detailInfo.img" alt="封面" style="max-width:300px;max-height:30px;display:inline-block"></p>
      <p>创建人：{{detailInfo.creatorName}}</p>
      <p>工种：{{filterDictText(workTypeDictOptions, detailInfo.workType)}}</p>
    </a-col>
    <a-col :lg="lg" :md="md" :sm="sm" :xs="xs">
      <p>点赞量：{{detailInfo.likeCount}}</p>
      <p>收藏量：{{detailInfo.favoriteCount}}</p>
      <p>学习人数：{{detailInfo.studyCount}}</p>
    </a-col>
  </a-row>

  <a-row>
    <vue-ueditor-wrap v-model="detailInfo.content" :config="myConfig" :destroy="true" :readonly="true"></vue-ueditor-wrap>
  </a-row>

  <hr />
  <workersLearningStatisticsListDetail :articleId="articleId" />
</a-card>
</template>

<script>
import WorkersLearningStatisticsListDetail from "./WorkersLearningStatisticsListDetail";
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";
import VueUeditorWrap from 'vue-ueditor-wrap';
import {
  getAction
} from '@/api/manage';

export default {
  name: 'SafetyLearningStatisticdetail',
  components: {
    WorkersLearningStatisticsListDetail,
    VueUeditorWrap
  },
  data() {
    return {
      detailInfo: {
      },
      url: {
        info: "/bp/safeLearning/info"
      },
      lg: {
        span: 6
      },
      md: {
        span: 10
      },
      sm: {
        span: 12
      },
      xs: {
        span: 24
      },
      myConfig: {
          zIndex: 1,
          zIndex: 1,
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          serverUrl: process.env.VUE_APP_BASE_API + '/system/ueditor/action',
          readonly: true
      },
      workTypeDictOptions:[]

    }
  },
  computed: {
    articleId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getDeial(this.articleId)
    this.initDictConfig()

  },
  methods: {
        filterDictText,
      initDictConfig() {
        console.log("--我才是真的方法!--")
        //初始化字典 - 工种
        initDictOptions('work_type').then((res) => {
          if (res.success) {
            this.workTypeDictOptions = res.result;
          }
        });
      },
    getDeial(id) {
      const that = this,
        httpurl = this.url.info,
        parameter = {
          articleId: id,
          getInteractive: 0
        };
      getAction(httpurl, parameter).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.detailInfo = res.result
        } else {
          that.$message.warning(res.message);
        }
      }).catch((error) => {
        that.$message.error('接口请求失败，请刷新后重试！');
      })
    },
    handleGoBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="" scoped>

</style>
