<template>
<a-card :bordered="false">
  <!-- 查询区域 -->
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <!--<a-col :md="6" :sm="8">
          <a-form-item label="类型">
            <j-dict-select-tag placeholder="请选择" v-model="queryParam.type" title="类型" dictCode="article_type" />
          </a-form-item>
        </a-col>-->
        <a-col :md="6" :sm="8">
          <a-form-item label="标题">
            <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="活动开始时间">
            <a-range-picker  v-model="queryParam.timeRange" style="width: 100%" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" @change="onDateChange" @ok="onDateOk" />
          </a-form-item>
        </a-col>
        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="工种">
              <j-dict-select-tag placeholder="请选择" v-model="queryParam.workType" title="工种" dictCode="work_type" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag v-model="queryParam.status" title="状态" dictCode="article_status"/>
              </a-form-item>
            </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-item label="学习人数">
              <a-row>
                <a-col :span="11">
                  <a-input placeholder="请输入" v-model="queryParam.minStudyCount"></a-input>
                </a-col>
                <a-col :span="2" style="text-align:center">
                  至
                </a-col>
                <a-col :span="11">
                  <a-input placeholder="请输入" v-model="queryParam.maxStudyCount"></a-input>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="及格率">
              <a-row>
                <a-col :span="9">
                  <a-input placeholder="请输入" v-model="queryParam.passRateStart"></a-input>
                </a-col>
                <a-col :span="1" style="text-align:center">
                  %
                </a-col>
                <a-col :span="4" style="text-align:center">
                  至
                </a-col>
                <a-col :span="9">
                  <a-input placeholder="请输入" v-model="queryParam.passRateEnd"></a-input>
                </a-col>
                <a-col :span="1" style="text-align:center">
                  %
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </template>
        <a-col :md="6" :sm="8">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
    <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
  </div>
  <!-- table区域-begin -->
  <div>
    <!-- 原型里没有全选，如果需要全选把下面的内容添加到 a-table 标签 -->
    <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
    <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
    <a-table ref="table" size="middle" bordered rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading" @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <router-link :to="{ name: 'safetechdisclosurestatistic-detail-@id', params: { id: record.id }}">详情</router-link>
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

  <safeTechDisclosureStatistics-modal
      ref="modalForm"
      @ok="modalFormOk"
      :examinationTypeDictOptions="examinationTypeDictOptions"
      :workTypeDictOptions="workTypeDictOptions"
      :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions"
      :questionBankTypeDictOptions="questionBankTypeDictOptions"/>
</a-card>
</template>

<script>
import SafeTechDisclosureStatisticsModal from "./SafeTechDisclosureStatisticsModal";
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JDate from '@/components/jeecg/JDate'
import {
  JeecgListMixin
} from "@/mixins/JeecgListMixin";
import {
  initDictOptions,
  filterDictText
} from '@/components/dict/JDictSelectUtil'

export default {
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    SafeTechDisclosureStatisticsModal,
    JDictSelectTag,
    JDate
  },
  data() {
    return {
      // 表头
      columns: [
        // {
        //   title: "#",
        //   dataIndex: "",
        //   key: "rowIndex",
        //   width: 60,
        //   align: "center",
        //   customRender: function(t, r, index) {
        //     return parseInt(index) + 1;
        //   }
        // },
        {
          title: "安全技术交底标题",
          align: "center",
          dataIndex: "title"
        },
        // {
        //   title: "类型",
        //   align: "center",
        //   dataIndex: "type",
        //   customRender: (text, record, index) => {
        //
        //     return filterDictText(this.articleTypeDictOptions, String(text));
        //   }
        // },
        {
          title: "学习积分",
          align: "center",
          dataIndex: "studyScore",
          customRender: (text, record, index) => {

            return text || 0
          }
        },
        {
          title: "学习人数",
          align: "center",
          dataIndex: "studyCount",
          customRender: (text, record, index) => {

            return text || 0
          }
        },
        {
          title: "评论数",
          align: "center",
          dataIndex: "commentCount",
          customRender: (text, record, index) => {

            return text || 0
          }
        },
        {
          title: "考试人数",
          align: "center",
          dataIndex: "examsCount",
          customRender: (text, record, index) => {
            return text || 0
          }
        },
        {
          title: "及格人数",
          align: "center",
          dataIndex: "passCount",
          customRender: (text, record, index) => {

            return text || 0
          }
        },
        {
          title: "及格率",
          align: "center",
          dataIndex: "passRate",
          customRender: (text, record, index) => {

            return text || '0.00%'
          }
        },
       /* {
          title: "工班长",
          align: "center",
          dataIndex: "monitorName"
        },*/
        {
          title: "工种",
          align: "center",
          dataIndex: "workType",
          customRender: (text, record, index) => {

            return filterDictText(this.workTypeDictOptions, String(text));
          }
        },
        {
          title: "是否考试",
          align: "center",
          dataIndex: "exam",
          customRender: (text, record, index) => {

            return text ? '是' : '否'
          }
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime",
          key: "hdsh"
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
      url: {
        list: "/bp/safeTechDisclosure",
        delete: "/bp/safeTechDisclosure/delete",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      // articleStatusDictOptions: [],
      articleTypeDictOptions: [],
      questionBankDifficultyDictOptions: [],
      questionBankTypeDictOptions: [],
      examinationStatusDictOptions: [],
      examinationTypeDictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--")
//初始化字典 - 状态
      initDictOptions("examination_status2").then(res => {
        if (res.success) {
          this.examinationStatusDictOptions = res.result;
        }
      });
      //初始化字典 - 难度
      initDictOptions("question_bank_difficulty").then(res => {
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
      //初始化字典 - 类型
      initDictOptions("examination_type").then(res => {
        if (res.success) {
          this.examinationTypeDictOptions = res.result;
        }
      });
      //初始化字典 - 类型
      initDictOptions('article_type').then((res) => {
        if (res.success) {
          this.articleTypeDictOptions = res.result;
        }
      });
      //初始化字典 - 工种
      initDictOptions('work_type').then((res) => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
        }
      });
    },
    onDateChange: function (value, dateString) {
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
