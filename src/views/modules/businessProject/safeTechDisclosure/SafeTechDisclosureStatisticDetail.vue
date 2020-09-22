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
      <p>创建人：{{detailInfo.createName}}</p>
      <p>工种：{{filterDictText(workTypeDictOptions, detailInfo.workType)}}</p>
    </a-col>
    <a-col :lg="lg" :md="md" :sm="sm" :xs="xs">
      <p>交底人：{{detailInfo.monitorName}}</p>
      <p>创建时间：{{detailInfo.createTime}}</p>
      <p>是否考试：{{detailInfo.exam ? '是' : '否'}}</p>
    </a-col>
    <a-col :lg="lg" :md="md" :sm="sm" :xs="xs">
      <p>学习人数：{{detailInfo.studyCount}}</p>
      <p>参考人数：{{detailInfo.examsCount}}</p>
      <p>及格人数：{{detailInfo.passCount}}</p>
    </a-col>
    <a-col :lg="lg" :md="md" :sm="sm" :xs="xs">
      <a-button type="primary" v-if="detailInfo.exam" @click="showSafetyTestingStatisticModal">
        查看试卷
      </a-button>
    </a-col>
  </a-row>

  <a-row>
    <vue-ueditor-wrap v-model="detailInfo.content" :config="myConfig" :destroy="true" :readonly="true"></vue-ueditor-wrap>
  </a-row>

  <hr v-if="!userId"/>
  <workersLearningStatisticsListDetail v-if="!userId" :articleId="articleId" />
  <safetyTestingStatistic-Modal ref="safetyTestingStatisticModal"/>
</a-card>
</template>

<script>
import WorkersLearningStatisticsListDetail from "./WorkersLearningStatisticsListDetail";
import SafetyTestingStatisticModal from "./SafetyTestingStatisticModal"
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";

import VueUeditorWrap from 'vue-ueditor-wrap'
import {
  getAction
} from '@/api/manage'

export default {
  name: 'SafeTechDisclosureStatisticdetail',
  components: {
    WorkersLearningStatisticsListDetail,
    SafetyTestingStatisticModal,
    VueUeditorWrap
  },
  data() {
    return {
      detailInfo: {
      },
      url: {
        info: "/bp/safeTechDisclosure/detail"
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
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          serverUrl: process.env.VUE_APP_BASE_API + '/system/ueditor/action',
          readonly: true
      },
      workTypeDictOptions: []

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
    getDeial(id) {
      const that = this,
        httpurl = this.url.info,
        parameter = {
          id: id
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
    },
    initDictConfig() {
      
      //初始化字典 - 工种
      initDictOptions("work_type").then(res => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
        }
      });
     
    },
    showSafetyTestingStatisticModal() {
      this.$refs.safetyTestingStatisticModal.show(this.detailInfo.examinationPagerId)
    }
  }
}
</script>

<style lang="" scoped>

</style>
