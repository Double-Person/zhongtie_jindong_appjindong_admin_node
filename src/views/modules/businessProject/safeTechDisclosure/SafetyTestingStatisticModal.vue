<template>
<a-modal :maskClosable="false" :title="detailInfo.title" width="90%" :visible="visible" :footer="null" @cancel="visible=false">
  <!-- <a-card> -->
    <div >
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>考试时间：{{detailInfo.beginTime}} ~ {{detailInfo.endTime}}</a-col>
        <a-col>总分：{{detailInfo.totalScore}}</a-col>
        <a-col>简介：{{detailInfo.introduce}} </a-col>
        <a-col>班组：{{filterDictText(workTypeDictOptions, detailInfo.workType)}}</a-col>
      </a-row>
    </div>

    <a-row>
      <a-col
        v-for="(item, index) in detailInfo.questionAnswers"
        :key="index"
        :span="24"
        style="padding: 10px"
      >
        <a-card>
          <span slot="title">
            <a-row>
              <a-col :span="20">
                <span
                  class="question-bank-type"
                >{{filterDictText(questionBankTypeDictOptions, item.type)}}</span>
                {{index+1}}.{{item.question}}（） （{{item.questionScore}}分）<span v-if="userId" :style="{color: item.success ? 'lightgreen' : 'red'}">{{item.success ? '正确' : '错误'}}</span>
              </a-col>
            </a-row>
          </span>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="12">
              <a-row :style="{minHeight: '120px'}">
                <a-col v-if="item.type !== 2">
                  <p v-for="(i, idx) in item.options" :key="idx">
                    <span :style="{color: i.success && userId ? '#1890ff' : '#000000a6'}">{{i.naming}}.</span>
                    <span :style="{color: i.success && userId ? '#1890ff' : '#000000a6'}">{{i.answer}}</span>
                  </p>
                </a-col>
              </a-row>
              <a-row>
                <p>
                  标准答案：
                  <span v-if="item.type !== 2">{{item.options | answerListFilter}}</span>
                  <span v-else>{{item.options[0].answer}}</span>
                </p>
                <p v-if="userId">
                  得分：{{item.score}}
                </p>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row v-if="userId" type="flex" justify="space-around" align="middle" style="margin-top:10px">
        <a-col >
          <!-- <a-button type="primary" shape="round" size="large" style="width: 400px">打印</a-button> -->
        </a-col>
    </a-row>
  <!-- </a-card> -->
</a-modal>
</template>

<script>
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";
import { getAction } from "@/api/manage";
import moment from "moment";
export default {
  name: "SafetyTestingStatisticdetail",
  components: {
  },
  data() {
    return {
      visible: false,
      detailInfo: {},
      url: {
        info: "/bp/examinationPaper/info"
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
      workTypeDictOptions: [],
      examinationStatusDictOptions: [],
      questionBankTypeDictOptions: [],
      examinationTypeDictOptions: []
    };
  },
  filters: {
    answerListFilter(answerList) {
      let successList = answerList.filter(i => {
        return i.success;
      });
      successList = successList.map(i => {
        return i.naming;
      });
      return successList.join("");
    }
  },
  created() {
    this.initDictConfig();
  },
  methods: {
    filterDictText,
    initDictConfig() {
      console.log("--我才是真的方法!--");
      //初始化字典 - 状态
      initDictOptions("examination_status2").then(res => {
        if (res.success) {
          this.examinationStatusDictOptions = res.result;
        }
      });
      //初始化字典 - 类型
      initDictOptions("examination_type").then(res => {
        if (res.success) {
          this.examinationTypeDictOptions = res.result;
        }
      });
      //初始化字典 - 工种
      initDictOptions("work_type").then(res => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
        }
      });
      //初始化字典 - 难度
      initDictOptions("question_bank_ difficulty").then(res => {
        if (res.success) {
          this.questionBankDifficultyDictOptions = res.result.map(i => {
            i.value = Number(i.value);
            return i;
          });
        }
      });
      //初始化字典 - 类型
      initDictOptions("question_bank_type").then(res => {
        if (res.success) {
          this.questionBankTypeDictOptions = res.result.map(i => {
            i.value = Number(i.value);
            return i;
          });
        }
      });
    },
    getDeial(id, userId) {
      const that = this,
        httpurl = this.url.info,
        parameter = {
          pagerId: id
        };
        if(userId) {
          parameter.userId = userId
        }
      getAction(httpurl, parameter)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message);
            that.detailInfo = res.result;
            var beginTime = moment(that.detailInfo.beginTime);
            var endTime = moment(that.detailInfo.endTime);
            that.detailInfo.duration = endTime.diff(beginTime, "minute");
          } else {
            that.$message.warning(res.message);
          }
        })
        .catch(error => {
          that.$message.error("接口请求失败，请刷新后重试！");
        });
    },
    handleGoBack() {
      if(this.userId || this.$route.query.dashboard) {
        this.$router.go(-1);
      } else {
        this.$router.push({name: 'safetytesting-statistics'})
      }
    },
    show(articleId) {
      this.visible = true
      this.getDeial(articleId);
    }
  }
};
</script>

<style lang="less" scoped>
.question-bank-type {
  background: orange;
  color: #ffffff;
  display: inline-block;
  margin-right: 10px;
  padding: 0 4px;
}
</style>
