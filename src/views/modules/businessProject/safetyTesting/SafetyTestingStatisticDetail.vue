<template>
  <a-card>
    <a-row slot="title">
      <a-col :span="22" type="flex" justify="space-around" align="middle">
        <h2 :style="{textAlign: 'center', margin: 0}">
          {{detailInfo.title}}
          <span v-if="userId" :style="{color: (detailInfo.answerScore && detailInfo.answerScore >= detailInfo.passScore) ? 'lightgreen' : 'red'}">{{ detailInfo.answerScore ? (detailInfo.answerScore >= detailInfo.passScore ? '及格': '不及格'): filterDictText(examinationStatusDictOptions, String(detailInfo.status || 0))}}</span>
        </h2>
      </a-col>
      <a-col :span="2">
        <a-button type="link" @click="handleGoBack">
          <a-icon type="left" />返回
        </a-button>
      </a-col>
    </a-row>
    <div v-if="userId">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col>总分：{{detailInfo.totalScore}}</a-col>
        <a-col>得分：{{detailInfo.answerScore|| 0}}</a-col>
        <a-col>考生：{{detailInfo.userName}}</a-col>
        <a-col>考试时间：{{detailInfo.userBeginTime? detailInfo.userBeginTime+'~'+detailInfo.userEndTime : filterDictText(examinationStatusDictOptions, String(detailInfo.status || 0))}}</a-col>
      </a-row>
    </div>
    <div v-else>
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>考试时间：{{detailInfo.beginTime}} ~ {{detailInfo.endTime}}</a-col>
        <a-col>考试时长：{{detailInfo.duration}}分钟</a-col>
        <a-col>总分：{{detailInfo.totalScore}}</a-col>
        <a-col>工种：{{filterDictText(workTypeDictOptions, detailInfo.workType)}}</a-col>
        <a-col>班组：{{filterDictText(workTypeDictOptions, detailInfo.workType)}}</a-col>
        <a-col>考试类型：{{filterDictText(examinationTypeDictOptions, String(detailInfo.type)) }}</a-col>
        <a-col>考试积分：{{detailInfo.getScore || 0}}</a-col>
        <a-col>应考人数：{{detailInfo.userCount || '无'}}</a-col>
        <a-col>参考人数：{{detailInfo.examsCount || 0}}</a-col>
        <a-col>及格人数：{{detailInfo.passCount || 0}}</a-col>
        <a-col>及格率：{{detailInfo.examsCount ? parseInt(detailInfo.passCount/detailInfo.examsCount*100) : 0}}%</a-col>
      </a-row>

      <a-row>
        <a-col>简介：{{detailInfo.introduce}} </a-col>
      </a-row>

      <a-row>
        <a-col>状态：{{filterDictText(examinationStatusDictOptions, String(detailInfo.status || 0))}}</a-col>
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
                {{index+1}}.{{item.question}} （{{item.questionScore}}分）<span v-if="userId" :style="{color: item.success ? 'lightgreen' : 'red'}">{{item.answer ? (item.success  ? '正确' : '错误'): ''}}</span>
              </a-col>
            </a-row>
          </span>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="12">
              <a-row :style="{minHeight: '120px'}">
                <a-col v-if="item.type !== 2">
                  <p v-for="(i, idx) in item.options" :key="idx">
                    <span :style="{color: (item.answer && (item.answer.includes(i.naming)) && userId )? '#1890ff' : '#000000a6'}">{{i.naming}}.{{i.answer}}</span>
                    <!-- <span :style="{color: i.success && userId ? '#1890ff' : '#000000a6'}"></span> -->
                  </p>
                </a-col>
                <a-col v-else>
                  <p :style="{color: item.answer && userId ?'#1890ff':'#000000a6'}">答案：{{item.answer}}</p>
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
            <a-col :span="12" v-if="!userId">
              <p
                style="font-size: 30px;color: orange"
              >正确率：{{(item.passCount + item.errCount) ? parseInt((item.passCount/(item.passCount+item.errCount))*100) : 0}}%</p>
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

    <hr v-if="!userId"/>
    <workersTestingStatisticsListDetail v-if="!userId" :articleId="articleId" />
  </a-card>
</template>

<script>
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";
import WorkersTestingStatisticsListDetail from "./WorkersTestingStatisticsListDetail";
import { getAction } from "@/api/manage";
import moment from "moment";
export default {
  name: "SafetyTestingStatisticdetail",
  components: {
    WorkersTestingStatisticsListDetail
  },
  data() {
    return {
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
      examinationTypeDictOptions: [],
    };
  },
  computed: {
    articleId() {
      return this.$route.params.id;
    },
    userId() {
      return this.$route.query.userid;
    }
  },
  watch:{
    userId(val,old) {
      if(val && val !== old) {
        this.getDeial(this.articleId, val);
      }
    }
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
    this.getDeial(this.articleId);
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
          pagerId: id,
        };
        if(this.$route.query.userid) {
          parameter.userId = this.$route.query.userid
          parameter.sheetId = this.$route.query.sheetId
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
