<template>
  <a-card :bordered="false">
    <a-row slot="title" v-if="userId">
      <a-col :span="22" type="flex" justify="space-around" align="middle">
        <h2 v-if="userId">工人学习文章</h2>
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
        <p>{{userInfo.studyCount || 0}}</p>
        <p>学习班前讲话</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.commentCount || 0}}</p>
        <p>评论班前讲话</p>
      </a-col>
      <a-col class="bg-gray" :span="3">
        <p>{{userInfo.score || 0}}</p>
        <p>获得积分</p>
      </a-col>
    </a-row>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col v-if="articleId">
            <h2>学员学习情况</h2>
          </a-col>
          <a-col :md="6" :sm="8">
            <!--<a-form-item label="类型">
              <j-dict-select-tag
                placeholder="请选择"
                v-model="queryParam.status"
                title="类型"
                dictCode="examination_status2"
              />
            </a-form-item>-->
            <a-form-item label="状态">
              <j-dict-select-tag
                placeholder="请选择"
                v-model="queryParam.status"
                title="状态"
                dictCode="learning_status"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="学习时间">
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
                  v-model="queryParam.workType"
                  title="工种"
                  dictCode="work_type"
                />
              </a-form-item>
            </a-col>

           <!-- <a-col :md="6" :sm="8">-->
              <!--<a-form-item label="状态">
                <j-dict-select-tag
                  placeholder="请选择"
                  v-model="queryParam.type"
                  title="状态"
                  dictCode="examination_type"
                />
              </a-form-item>-->
            <!--  <a-form-item label="标段">
                <a-select placeholder="请选择"
                          v-model="queryParam.segmentId">
                  <a-select-option v-for="(item, index) in dictOptionsBiao" :key="index"  :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>-->
          <!--  </a-col>-->
            <a v-if="articleId">
              <a-col :md="6" :sm="8">
                <a-form-item label="姓名">
                  <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
                </a-form-item>
              </a-col>
            </a>
            <a v-else>
              <a-col :md="6" :sm="8">
                <a-form-item label="标题">
                  <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
                </a-form-item>
              </a-col>
            </a>

          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset({ pagerId: articleId, articleId, userId})"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
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
      <a-button type="primary" icon="download"  v-if="userId" @click="handleExportXls('班前讲话')">导出</a-button>
      <a-button type="primary" icon="download"  v-else @click="handleExportXls('班前讲话-学员学习情况')">导出</a-button>
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
            :to="{ name: 'safetytesting-detail-@id', params: { id: articleId }, query: {userid: record.userId}}"
          >查看考卷</router-link>
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
      filters: {userId:this.$route.params.userid},
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "realName"
        },
        {
          title: "标段",
          align: "center",
          dataIndex: "segmentName"
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
          title: "学习时长(分钟)",
          align: "center",
          dataIndex: "duration"
        },
        {
          title: "获得积分",
          align: "center",
          dataIndex: "score"
        },
        {
          title: "学习状态",
          align: "center",
          dataIndex: "status",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.learningStatusDictOptions, String(text));
          }
        },
        {
          title: "评论数",
          align: "center",
          dataIndex: "commentCount"
        },
        {
          title: "扫码地址",
          align: "center",
          dataIndex: "address"
        },
        {
          title: "学习时间",
          align: "center",
          dataIndex: "updateTime"
        }
      ],
      url: {
        noCreate: true,
        list: "",
        /*exportXlsUrl: "/bp/speakClass/situation/record/exportXls"*/
        exportXlsUrl:'/bp/speakClass/detail/record/exportXls'
      },
      dictOptions: [],
      workTypeDictOptions: [],
      learningStatusDictOptions:[],
      dictOptionsBiao:[],
    };
  },
  computed: {
    userId() {
      return this.$route.params.userid;
    },
    userInfo() {
      return this.$route.query;
    },
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    this.initDictConfig();
    this.searchType();
    this.searchTypeBiao();
    if (this.userId) {
      this.url.list = '/bp/speakClass/situation/record';
      this.url.exportXlsUrl = '/bp/speakClass/situation/record/exportXls'
      this.queryParam.userId = this.userId
      this.columns = [
        {
          title: "安全学习标题",
          align: "center",
          dataIndex: "articleTitle"
        },
       /* {
          title: "类型",
          align: "center",
          dataIndex: "type"
        },*/
        {
          title: "学习时长(分钟)",
          align: "center",
          dataIndex: "duration"
        },
        {
          title: "获得学习积分",
          align: "center",
          dataIndex: "score"
        },
        {
          title: "评论条数",
          align: "center",
          dataIndex: "commentCount"
        },
        {
          title: "工班长",
          align: "center",
          dataIndex: "monitorName"
        },
        {
          title: "扫码地址",
          align: "center",
          dataIndex: "address"
        },
        {
          title: "学习时间",
          align: "center",
          dataIndex: "studyTime"
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "status",
          customRender: (text, record, index) => {
            return filterDictText(this.learningStatusDictOptions, String(text));
          }
        }
      ]
    } else {
      this.url.list = '/bp/speakClass/info/study'
    }
    if(this.articleId) {
      this.queryParam.pagerId = this.articleId
      this.queryParam.articleId= this.articleId
    }
    this.loadData();
  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--");
      //初始化字典 - 状态
      initDictOptions("learning_status").then(res => {
        if (res.success) {
          this.learningStatusDictOptions = res.result;
        }
      });
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
    searchTypeBiao(){
      const url = '/bp/userCenter/adminSegments'
      const params = {}
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result
          this.dictOptionsBiao = result.records
        }
      })
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
