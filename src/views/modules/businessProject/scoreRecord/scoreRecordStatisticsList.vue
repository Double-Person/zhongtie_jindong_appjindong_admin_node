<template>
  <a-row :gutter="16">
    <a-col
      :xs="8"
      :sm="8"
      :md="8"
      :lg="8"
      :xl="8"
      :xxl="8"
      style="margin-bottom:20px"
    >
      <a-card :bordered="false">
        <a-row>
          <a-col :span="24">
            <h4>积分统计</h4>
            <!-- 查询区域 -->
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="24">
                  <a-col :span="24">
                    <a-form-item label="标段">
                      <a-select
                        placeholder="请选择"
                        @change="searchSegmentId"
                        :disabled="dictOptions.length <= 1"
                        v-model="queryParam.segmentId"
                      >
                        >
                        <a-select-option
                          v-for="(item, index) in dictOptions"
                          :key="index"
                          :value="item.id"
                          >{{ item.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="日期">
                      <!--                    <j-dict-select-tag placeholder="请选择" v-model="queryParam.workType" title="工种" dictCode="work_type" />-->
                      <!-- <a-select placeholder="请选择"
                        @change="searchDate"
                        >
                        <a-select-option v-for="(item, index) in dateArr" :key="index"  :value="item.id">{{item.name}}</a-select-option>
                      </a-select> -->
                      <a-range-picker
                        v-model="queryParam.timeRange"
                        style="width: 100%"
                        format="YYYY-MM-DD"
                        :placeholder="['开始时间', '结束时间']"
                        @change="onDateChange"
                        @ok="onDateOk"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <a-divider />
            <a-row style="margin-bottom:20px">
              <a-col style="text-align:center;color:orange;font-size:30px">{{
                totalScore
              }}</a-col>
              <a-col style="text-align:center">累计发放积分</a-col>
            </a-row>
            <a-row style="height: 300px">
              <pie
                :dataSource="pipData"
                :height="190"
                style="margin-top: 50px"
              />
            </a-row>
            <a-divider />
          </a-col>

          <a-col :span="24">
            <h4>积分排行榜</h4>
            <a-row
              type="flex"
              justify="space-around"
              align="middle"
              style="margin: 20px;text-align:center"
            >
              <!-- <a-col v-for="(item, index) in rankList" :key="index" :span="8" style="text-align:center">
              <a-avatar :size="50" :src="item.avatar" />
              <p>{{item.realname}}</p>
              <p>{{item.workerType}}</p>
              <p style="color:orange">{{item.score}}</p>
            </a-col>-->
              <a-col
                v-for="(item, index) in rankList"
                :key="index"
                :span="8"
                class="rank-list"
              >
                <a v-if="index == 0" class="rank-list-link">
                  <a-avatar :size="50" :src="item.avatar" />
                  <img
                    src="../../../../static/image/rank1.png"
                    class="rank-img"
                  />
                  <p>{{ item.realname }}</p>
                  <p>{{ item.workerType }}</p>
                  <p style="color:orange">{{ item.score }}</p>
                </a>
                <a v-else-if="index == 1" class="rank-list-link">
                  <a-avatar :size="50" :src="item.avatar" />
                  <img
                    src="../../../../static/image/rank2.png"
                    class="rank-img"
                  />
                  <p>{{ item.realname }}</p>
                  <p>{{ item.workerType }}</p>
                  <p style="color:orange">{{ item.score }}</p>
                </a>
                <a v-else-if="index == 2" class="rank-list-link">
                  <a-avatar :size="50" :src="item.avatar" />
                  <img
                    src="../../../../static/image/rank3.png"
                    class="rank-img"
                  />
                  <p>{{ item.realname }}</p>
                  <p>{{ item.workerType }}</p>
                  <p style="color:orange">{{ item.score }}</p>
                </a>
                <a v-else>
                  <a-avatar :size="50" :src="item.avatar" />
                  <p>{{ item.realname }}</p>
                  <p>{{ item.workerType }}</p>
                  <p style="color:orange">{{ item.score }}</p>
                </a>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" :xxl="16">
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="6" :sm="6">
                <a-form-item label="姓名">
                  <a-input
                    placeholder="请输入"
                    v-model="queryParam.realName"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="6">
                <a-form-item label="工种">
                  <j-dict-select-tag
                    placeholder="请选择"
                    v-model="queryParam.workType"
                    title="工种"
                    dictCode="work_type"
                  />
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="6" :sm="6">
                  <a-form-item label="标段">
                    <a-select
                      placeholder="请选择"
                      v-model="queryParam.segmentId"
                    >
                      <a-select-option
                        v-for="(item, index) in dictOptions"
                        :key="index"
                        :value="item.id"
                        >{{ item.name }}</a-select-option
                      >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="6">
                  <a-form-item label="是否可用">
                    <a-select
                      placeholder="请选择"
                      v-model="queryParam.incumbencyStatus"
                    >
                      <a-select-option
                        v-for="(item, index) in availableList"
                        :key="index"
                        :value="item.id"
                        >{{ item.name }}</a-select-option
                      >
                    </a-select>
                  </a-form-item>
                </a-col>
                <!--<a-col :md="6" :sm="8">
                <a-form-item label="姓名">
                  <a-input placeholder="请输入姓名" v-model="queryParam.biaoti"></a-input>
                </a-form-item>
              </a-col>-->
              </template>
              <a-col :md="6" :sm="8">
                <span
                  style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons"
                >
                  <a-button type="primary" @click="searchQuery" icon="search"
                    >查询</a-button
                  >
                  <a-button
                    type="primary"
                    @click="searchReset"
                    icon="reload"
                    style="margin-left: 8px"
                    >重置</a-button
                  >
                  <a @click="handleToggleSearch" style="margin-left: 8px">
                    {{ toggleSearchStatus ? "收起" : "展开" }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="showSegmentConfigList" type="primary"
            >积分汇率配置</a-button
          >
        </div>

        <!-- table区域-begin -->
        <div>
          <!-- 原型里没有全选，如果需要全选把下面的内容添加到 a-table 标签 -->
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
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit({ ...record, reward: true })">奖励</a>
              <a-divider type="vertical" />
              <a @click="handleEdit({ ...record, reward: false })">扣罚</a>
              <a-divider type="vertical" />
              <router-link
                :to="{
                  name: 'scorerecord-log-@userid',
                  params: { userid: record.id },
                  query: {
                    totalScore: record.totalScore,
                    score: record.score,
                    exchangeScore: record.exchangeScore,
                    score: record.score,
                    rewardScore: record.rewardScore,
                    penalty: record.penalty,
                    userName: record.realname
                  }
                }"
                >积分明细</router-link
              >
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <scoreRecordStatistics-modal ref="modalForm" @ok="modalFormOk" />
        <segmentConfigList-modal
          ref="segmentConfigListModal"
          title="积分汇率配置"
        />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import moment from "moment";
import scoreRecordStatisticsModal from "./scoreRecordStatisticsModal";
import segmentConfigListModal from "./segmentConfigListModal";
import JDictSelectTag from "@/components/dict/JDictSelectTag";
import JSearchSelectTag from "@/components/dict/JDictSelectTag";
import JDate from "@/components/jeecg/JDate";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction } from "@/api/manage";
import Pie from "@/components/chart/Pie";
import {
  filterDictText,
  initDictOptions
} from "@/components/dict/JDictSelectUtil";
export default {
  name: "scoreRecordStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    scoreRecordStatisticsModal,
    segmentConfigListModal,
    JDictSelectTag,
    JSearchSelectTag,
    JDate,
    Pie
  },
  data() {
    return {
      description: "工人学习情况页面",
      // 表头
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "realname"
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "身份证号码",
          align: "center",
          dataIndex: "idNumber"
        },
        {
          title: "累计获取积分",
          align: "center",
          dataIndex: "totalScore"
        },
        {
          title: "当前积分",
          align: "center",
          dataIndex: "score"
        },
        {
          title: "奖励积分",
          align: "center",
          dataIndex: "rewardScore"
        },
        {
          title: "是否可用",
          align: "center",
          dataIndex: "incumbencyStatus",
          customRender: (text, record, index) => {
            if (text == 1) {
              return "是";
            } else {
              return "否";
            }
          }
        },
        {
          title: "标段",
          align: "center",
          width: 200,
          dataIndex: "segmentName"
        },
        {
          title: "工种",
          align: "center",
          dataIndex: "workerType",
          width: 200,
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.workTypeDictOptions, text);
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 400,
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
      url: {
        list: "/bp/userScore/list",
        delete: ""
      },
      workTypeDictOptions: [],
      dictOptions: [],
      pipData: [],
      rankList: [],
      totalScore: 0,
      availableList: [
        { id: "", name: "全部" },
        { id: 1, name: "可用" },
        { id: 2, name: "不可用" }
      ],
      dateArr: [
        { id: 0, name: "本月" },
        { id: 1, name: "本季度" },
        { id: 2, name: "本年" }
      ]
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    this.searchType();
    this.getChartData();
  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--");

      //初始化字典 - 工种
      initDictOptions("work_type").then(res => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
        }
      });
    },
    filterDictText,
    getCurrYear() {
      let date = [];
      let start = moment()
        .startOf("year")
        .format("YYYY-MM-DD HH:mm:ss");
      let end = moment()
        .endOf("year")
        .format("YYYY-MM-DD HH:mm:ss");
      date.push(start);
      date.push(end);
      return date;
    },
    getCurrQuarter() {
      let date = [];
      let start = moment()
        .startOf("quarter")
        .format("YYYY-MM-DD HH:mm:ss");
      let end = moment()
        .endOf("quarter")
        .format("YYYY-MM-DD HH:mm:ss");
      date.push(start);
      date.push(end);
      return date;
    },
    getCurrMonthDays() {
      let date = [];
      let start = moment()
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      let end = moment()
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      date.push(start);
      date.push(end);
      return date;
    },
    searchDate(value) {
      this.getChartData();
    },
    searchSegmentId() {
      this.getChartData();
    },
    showSegmentConfigList() {
      this.$refs.segmentConfigListModal.show();
    },
    searchType() {
      const url = "/bp/userCenter/adminSegments";
      const params = {};
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result;
          this.dictOptions = result.records;
        }
      });
    },
        // 时间回调
    onDateChange: function(value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0];
      this.queryParam.endTime = dateString[1];
      if(dateString[0]) {
      this.queryParam.beginTime += " 00:00:00";
      }
      if(dateString[1]){
        this.queryParam.endTime += " 23:59:59";
      }
      if(!dateString[0]){
        this.queryParam.beginTime = undefined
      }
      if(!dateString[1]){
        this.queryParam.endTime = undefined
      }
      this.searchDate()
    },
    onDateOk(value) {
      console.log(value);
    },
    async getChartData() {
      const { segmentId, beginTime, endTime } = this.queryParam;
      console.log(beginTime);
      let params = {}
      params.segmentId = this.queryParam.segmentId
      params.beginTime = this.queryParam.beginTime
      params.endTime = this.queryParam.endTime
       console.log(params);
      const res = await getAction("/bp/userScore/manager/statistics", params);
      const { studyScore, rewardScore, examsScore, tops } = res.result;
      this.totalScore = studyScore + rewardScore + examsScore;
      this.pipData = [
        { item: "学习发放积分", count: studyScore },
        { item: "后台奖励积分", count: rewardScore },
        { item: "考试发放积分", count: examsScore }
      ];
      this.rankList = tops.filter((i, idx) => {
        return idx <= 2;
      });
      this.rankList = this.rankList.map(i => {
        i.workerType = filterDictText(this.workTypeDictOptions, i.workerType);
        return i;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@assets/less/common.less";
</style>
<style lang="scss">
.rank-list {
  a {
    color: #333;
  }
  .rank-list-link {
    position: relative;
    display: inline-block;
    .rank-img {
      position: absolute;
      width: 28px;
      height: 28px;
      z-index: 1;
      top: 0;
      right: -8px;
    }
  }
}
</style>
