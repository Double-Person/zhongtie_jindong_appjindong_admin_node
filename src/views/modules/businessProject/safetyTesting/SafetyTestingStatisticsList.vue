<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
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
            <a-form-item label="活动开始时间">
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
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag
                  placeholder="请选择"
                  v-model="queryParam.status"
                  title="状态"
                  dictCode="examination_status2"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="标题">
                <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="及格率">
                <a-row>
                  <a-col :span="3">大于</a-col>
                  <a-col :span="18">
                    <a-input-number
                      placeholder="请输入"
                      v-model="queryParam.passRate"
                      style="width: 100%"
                    ></a-input-number>
                  </a-col>
                  <a-col :span="3">%</a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
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
    <div class="table-operator" v-if="!testingModal">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
       <span slot="action" slot-scope="text, record" v-if="testingModal">
          <a @click="handleTestingModalSelect(record)">选择</a>
        </span>
        <span slot="action" slot-scope="text, record" v-else>
          <router-link :to="{ name: 'safetytesting-detail-@id', params: { id: record.id }} ">详情</router-link>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->

    <safetyTestingStatistics-modal
      ref="modalForm"
      @ok="modalFormOk"
      :examinationTypeDictOptions="examinationTypeDictOptions"
      :workTypeDictOptions="workTypeDictOptions"
      :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions"
      :questionBankTypeDictOptions="questionBankTypeDictOptions"
    />
  </a-card>
</template>

<script>
import SafetyTestingStatisticsModal from "./SafetyTestingStatisticsModal";
import JDictSelectTag from "@/components/dict/JDictSelectTag";
import JDate from "@/components/jeecg/JDate";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";
import moment from "moment";

export default {
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    SafetyTestingStatisticsModal,
    JDictSelectTag,
    JDate
  },
  props: {
    testingModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      description: "安全考试统计页面",
      // 表头
      columns: [
        {
          title: "安全考试标题",
          align: "center",
          dataIndex: "title"
        },
        {
          title: "考试类型",
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
          title: "考试积分",
          align: "center",
          dataIndex: "getScore"
        },
        {
          title: "应考人数",
          align: "center",
          dataIndex: "userCount",
          customRender: (text, record, index) => {
            return text || '无';
          }
        },
        {
          title: "参考人数",
          align: "center",
          dataIndex: "examsCount",
          customRender: (text, record, index) => {
            return text || 0;
          }
        },
        {
          title: "及格人数",
          align: "center",
          dataIndex: "passCount",
          customRender: (text, record, index) => {
            return text || 0;
          }
        },
        {
          title: "及格率",
          align: "center",
          dataIndex: "passRate",
          customRender: (text, record, index) => {
            return Number(text.slice(0,text.length-1)).toFixed(2)+'%'
          }
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
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "考试开始时间",
          align: "center",
          dataIndex: "beginTime"
        },
        {
          title: "考试结束时间",
          align: "center",
          dataIndex: "endTime"
        },
        {
          title: "考试时长(分钟)",
          align: "center",
          dataIndex: "duration",
          customRender: (text, record, index) => {
            var beginTime = moment(record.beginTime);
            var endTime = moment(record.endTime);
            return endTime.diff(beginTime, "minute");
          }
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "status",
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
        list: "/bp/examinationPaper/list?module=safety_examination",
        delete: "/bp/examinationPaper/delete"
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      questionBankDifficultyDictOptions: [],
      questionBankTypeDictOptions: [],
      examinationStatusDictOptions: [],
      examinationTypeDictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    handleTestingModalSelect(record) {
      this.$emit('testingModalSelect', record)
    },
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
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>