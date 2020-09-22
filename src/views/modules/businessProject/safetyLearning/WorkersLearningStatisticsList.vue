<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
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
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="姓名">
                <a-input
                  placeholder="请输入"
                  v-model="queryParam.name"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
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
    <div class="table-operator"></div>

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
              name: 'safetylearning-worker-detail-@userid',
              params: { userid: record.userId },
              query: {
                studyCount: record.studyCount,
                favoriteCount: record.favoriteCount,
                commentCount: record.commentCount,
                score: record.score,
                userName: record.userName
              }
            }"
            >查看所学文章</router-link
          >
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!-- <userStatistics-modal ref="modalForm" @ok="modalFormOk"></userStatistics-modal> -->
  </a-card>
</template>

<script>
// import UserStatisticsModal from "./modules/UserStatisticsModal";
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
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    // UserStatisticsModal
    JDictSelectTag,
    JSearchSelectTag,
    JDate
  },
  data() {
    return {
      description: "用户统计管理页面",
      // 表头
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "userName"
        },
        {
          title: "标段",
          align: "center",
          dataIndex: "segmentName"
        },
        {
          title: "学习总时长(分钟)",
          align: "center",
          dataIndex: "duration"
        },
        {
          title: "学习积分",
          align: "center",
          dataIndex: "score"
        },
        {
          title: "学习文章量",
          align: "center",
          dataIndex: "studyCount"
        },
        {
          title: "收藏文章量",
          align: "center",
          dataIndex: "favoriteCount"
        },
        {
          title: "评论条数",
          align: "center",
          dataIndex: "commentCount"
        },
        {
          title: "点赞量",
          align: "center",
          dataIndex: "likeCount"
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
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        noCreate: true,
        list: "/bp/safeLearning/situation"
        // delete: "/bp/userStatistics/delete",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      dictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    },
    query() {
      return this.$route.query;
    }
  },
  created() {
    this.searchType();
    if (this.query) {
      this.queryParam = this.query;
    }
    this.loadData();
  },
  watch: {
    $route(to, from) {
      if (from.path == "/dashboard/analysis" && this.$route.query.segmentId) {
        this.queryParam.segmentId = this.$route.query.segmentId;
        this.loadData();
      }
    }
  },
  methods: {
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
      initDictOptions("article_status").then(res => {
        if (res.success) {
          this.articleStatusDictOptions = res.result;
        }
      });
      //初始化字典 - 类型
      initDictOptions("article_type").then(res => {
        if (res.success) {
          this.articleTypeDictOptions = res.result;
        }
      });
      //初始化字典 - 工种
      initDictOptions("work_type").then(res => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
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
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
