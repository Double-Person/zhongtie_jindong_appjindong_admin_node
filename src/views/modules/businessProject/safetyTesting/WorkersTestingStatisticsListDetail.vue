<template>
  <a-card :bordered="false">
    <a-row slot="title" v-if="userId">
      <a-col :span="22" type="flex" justify="space-around" align="middle">
        <h2 v-if="userId">工人考试情况</h2>
      </a-col>
      <a-col :span="2">
        <a-button type="link" @click="handleGoBack">
          <a-icon type="left" />返回
        </a-button>
      </a-col>
    </a-row>
    <a-row
      v-if="userId"
      type="flex"
      justify="space-around"
      align="middle"
      style="text-align:center;margin-bottom:40px"
    >
      <a-col :span="4">
        <h2>
          {{ userInfo.userRealName }}
        </h2>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{ userInfo.actualExamsCount }}/{{ userInfo.examsCount }}</p>
        <p>实际/应该参加考试场次</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>
          {{
            userInfo.examsCount
              ? parseInt(
                  (userInfo.actualExamsCount / userInfo.examsCount) * 100
                )
              : 0
          }}%
        </p>
        <p>参考出勤率</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{ userInfo.passCount }}/{{ userInfo.allActualExamsCount }}</p>
        <p>及格/参考</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>
          {{
            userInfo.actualExamsCount
              ? parseInt((userInfo.passCount / userInfo.allActualExamsCount) * 100)
              : 0
          }}%
        </p>
        <p>及格率</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{ userInfo.score }}</p>
        <p>获得积分</p>
      </a-col>
    </a-row>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" v-if="userId">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col v-if="articleId">
            <h2>考生情况</h2>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="类型">
              <j-dict-select-tag
                placeholder="请选择"
                v-model="queryParam.type"
                title="类型"
                dictCode="examination_type"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <!-- <a-form-item label="考试时间">
              <a-range-picker

                v-model="queryParam.timeRange"
                style="width: 100%"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item> -->
            <a-form-item label="时间">
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
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="工种">
                <j-dict-select-tag
                  placeholder="请选择"
                  v-model="queryParam.articleWorkType"
                  title="工种"
                  dictCode="work_type"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag
                  placeholder="请选择"
                  v-model="queryParam.answerStatus"
                  title="状态"
                  dictCode="examination_status"
                />
              </a-form-item>
            </a-col>
            <!--            <a-col :md="6" :sm="8">-->
            <!--&lt;!&ndash;              <a-form-item label="考试情况">&ndash;&gt;-->
            <!--&lt;!&ndash;                <j-dict-select-tag&ndash;&gt;-->
            <!--&lt;!&ndash;                  placeholder="请选择"&ndash;&gt;-->
            <!--&lt;!&ndash;                  v-model="queryParam.answerStatus"&ndash;&gt;-->
            <!--&lt;!&ndash;                  title="考试情况"&ndash;&gt;-->
            <!--&lt;!&ndash;                  dictCode="examination_status"&ndash;&gt;-->
            <!--&lt;!&ndash;                />&ndash;&gt;-->
            <!--&lt;!&ndash;              </a-form-item>&ndash;&gt;-->
            <!--            </a-col>-->
            <a-col :md="6" :sm="8">
              <a-form-item label="标题">
                <a-input
                  placeholder="请输入"
                  v-model="queryParam.title"
                ></a-input>
              </a-form-item>
            </a-col>
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
                @click="searchReset({ pagerId: articleId, userId })"
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

    <div class="table-page-search-wrapper" v-else>
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col v-if="articleId">
            <h2>考生情况</h2>
          </a-col>
          <!--          <a-col :md="6" :sm="8">-->
          <!--              <a-form-item label="学习状态">-->
          <!--                <j-dict-select-tag  placeholder="请选择" v-model="queryParam.status" title="学习状态" dictCode="article_status"/>-->
          <!--              </a-form-item>-->
          <!--            </a-col>-->
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="考试状态">
              <j-dict-select-tag
                placeholder="请选择"
                v-model="queryParam.status"
                title="考试状态"
                dictCode="examination_status2"
              />
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-item label="考试时间">
              <a-range-picker
                showTime
                v-model="queryParam.timeRange"
                style="width: 100%"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="工种">
                <j-dict-select-tag
                  placeholder="请选择"
                  v-model="queryParam.workType"
                  title="工种"
                  dictCode="work_type"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="标段">
                <a-select placeholder="请选择" v-model="queryParam.segmentId">
                  <a-select-option
                    v-for="(item, index) in dictOptions"
                    :key="index"
                    :value="item.id"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="考试情况">
                <j-dict-select-tag
                  placeholder="请选择"
                  v-model="queryParam.answerStatus"
                  title="考试情况"
                  dictCode="examination_status3"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="姓名">
                <a-input
                  placeholder="请输入姓名"
                  v-model="queryParam.realName"
                ></a-input>
              </a-form-item>
            </a-col>
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
                @click="searchReset({ pagerId: articleId, userId })"
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button
        type="primary"
        icon="download"
        @click="handleExportXls('安全考试')"
        >导出</a-button
      >
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
        <span slot="action" slot-scope="text, record">
          <router-link
            :to="{
              name: 'safetytesting-detail-@id',
              params: { id: articleId },
              query: { userid: record.userId, sheetId: record.sheetId }
            }"
            >查看考卷</router-link
          >
        </span>
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
import moment from 'moment';
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";

export default {
  name: "UserStatisticsList",
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
      queryParam: {},
      filters: {
        module: this.$route.params.userid ? "safety_examination" : ""
      },
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "realName"
        },
        {
          title: "工种",
          align: "center",
          dataIndex: "workType",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.workTypeDictOptions, String(text));
          }
        },
        {
          title: "考试得分",
          align: "center",
          dataIndex: "answerScore"
        },
        {
          title: "获得积分",
          align: "center",
          dataIndex: "getScore"
        },
        // {
        //   title: "学习状态",
        //   align: "center",
        //   dataIndex: "status"
        // },
        {
          title: "考试状态",
          align: "center",
          dataIndex: "answerStatus",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(
              this.examinationStatusDictOptions,
              String(text)
            );
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        noCreate: true,
        list: "/bp/answerSheet/list/bypager",
        info: "/bp/examinationPaper/examsStatistics/list",
        // delete: "/bp/userStatistics/delete",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        exportXlsUrl: "/bp/examinationPaper/examsStatistics/info/exportXls"
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      examinationStatusDictOptions: [],
      dictOptions: [],
      workTypeDictOptions: [],
      userInfo: {}
    };
  },
  computed: {
    userId() {
      return this.$route.params.userid;
    },
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    this.initDictConfig();
    this.searchType();
    if (this.articleId) {
      this.queryParam.pagerId = this.articleId;
      this.url.exportXlsUrl =
        "/bp/examinationPaper/examsStatistics/pager/exportXls";
    }
    if (this.userId) {
      this.queryParam.module = "safety_examination";
      this.queryParam.userId = this.userId;
      this.columns = [
        {
          title: "安全考试标题",
          align: "center",
          dataIndex: "title"
        },
        {
          title: "类型",
          align: "center",
          dataIndex: "type",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(
              this.examinationTypeDictOptions,
              String(text)
            );
          }
        },
        {
          title: "考试得分",
          align: "center",
          dataIndex: "answerScore"
        },
        {
          title: "考试状态",
          align: "center",
          dataIndex: "answerStatus",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(
              this.examinationStatusDictOptions,
              String(text)
            );
          }
        },
        {
          title: "获得学习积分",
          align: "center",
          dataIndex: "getScore"
        },
        {
          title: "考试开始时间",
          align: "center",
          dataIndex: "userBeginTime"
        },
        {
          title: "考试结束时间",
          align: "center",
          dataIndex: "userEndTime"
        },
        {
          title: "考试时长(分钟)",
          align: "center",
          dataIndex: "duration",
          customRender:(text,record)=>{
            var beginTime = moment(record.userBeginTime);
            var endTime = moment(record.userEndTime);
            return endTime.diff(beginTime, "minute")>0?endTime.diff(beginTime, "minute"):'不满一分钟';
          }
        }
      ];
      this.getInfo();
    }
    this.loadData();
  },
  methods: {
    async getInfo() {
      const result = await getAction(this.url.info, {
        module: "safety_examination",
        userId: this.userId
      });
      console.log(result);
      this.userInfo = result.result.records[0];
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
    },
    onDateOk(value) {
      console.log(value);
    },

    initDictConfig() {
      console.log("--我才是真的方法!--");
      //初始化字典 - 状态
      initDictOptions("examination_status").then(res => {
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
.bg-gray {
  background: #fafafa;
  padding-top: 15px;
  p {
    &:first-of-type {
      color: orange;
      font-size: 24px;
      margin-bottom: 5px;
    }
  }
}
</style>
