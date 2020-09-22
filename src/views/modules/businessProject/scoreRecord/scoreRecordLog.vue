<template>
  <a-card :bordered="false">
    <a-row slot="title" v-if="userId">
      <a-col :span="22" type="flex" justify="space-around" align="middle">
        <h2 v-if="userId">积分明细</h2>
      </a-col>
      <a-col :span="2">
        <a-button type="link" @click="handleGoBack">
          <a-icon type="left" />返回
        </a-button>
      </a-col>
    </a-row>
    <a-row v-if="userId" type="flex" justify="space-around" align="middle" style="text-align:center;margin-bottom:40px">
      <a-col :span="4">
        <h2>
          {{userInfo.userName}}
        </h2>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.totalScore || 0}}</p>
        <p>累计积分</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.score ||  0}}</p>
        <p>当前积分</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.exchangeScore || 0}}</p>
        <p>兑换积分</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.rewardScore || 0}}</p>
        <p>奖励积分</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.penalty || 0}}</p>
        <p>扣罚积分</p>
      </a-col>
    </a-row>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import JDictSelectTag from "@/components/dict/JDictSelectTag";
import JSearchSelectTag from "@/components/dict/JDictSelectTag";
import JDate from "@/components/jeecg/JDate";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction } from "@/api/manage";
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";

export default {
  name: "scoreRecordLog",
  mixins: [JeecgListMixin],
  components: {
    JDictSelectTag,
    JSearchSelectTag,
    JDate
  },
  props: {
    articleId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      queryParam: {
        articleId: this.articleId
      },
      columns: [
        {
          title: "积分",
          align: "center",
          dataIndex: "score"
        },
        {
          title: "类型",
          align: "center",
          dataIndex: "scoreType",
          /*customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(
              this.moduleTypeDictOptions,
              String(text)
            );
          }*/
        },
        {
          title: "备注",
          align: "center",
          dataIndex: "reason"
        },
        {
          title: "时间",
          align: "center",
          dataIndex: "createTime"
        },
      ],
      url: {
        noCreate: true,
        list: "/bp/scoreRecord/list",
      },
      dictOptions: [],
      workTypeDictOptions: [],
      moduleTypeDictOptions: []
    };
  },
  computed: {
    userId() {
      return this.$route.params.userid;
    },
    userInfo() {
      return this.$route.query
    },
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    this.initDictConfig();
    this.searchType();
    if(this.userId) {
      this.queryParam.userId = this.userId
    }
    this.loadData();
  },
  activated() {
    if(this.userId) {
      this.queryParam.userId = this.userId
    }
    this.loadData();
  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--");
      //初始化字典 - 状态
      initDictOptions("module_type").then(res => {
        if (res.success) {
          this.moduleTypeDictOptions = res.result;
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
    searchType() {
      const url = "/segment/list";
      const params = {};
      params.delFlag = 0;
      params.status = 1;
      params.field = "id,,name";
      params.pageNo = "1";
      params.pageSize = "2000";
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result;
          this.dictOptions = result.records;
        }
      });
    },
    onDateChange: function(value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0];
      this.queryParam.endTime = dateString[1];
      // if(dateString[0] === dateString[1]) {
          this.queryParam.beginTime += ' 00:00:00'
          this.queryParam.endTime += ' 23:59:59'
        // }
    },
    onDateOk(value) {
      console.log(value);
    },
    handleGoBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
<style lang="less" scoped>
  .bg-gray{
    background: #fafafa;
    padding-top: 15px;
    p{
      &:first-of-type{
        color: orange;
        font-size: 24px;
        margin-bottom: 5px;
      }
    }
  }
</style>