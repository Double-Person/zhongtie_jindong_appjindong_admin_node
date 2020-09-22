<template>
<a-card :bordered="false">
  <!-- 查询区域 -->
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :md="6" :sm="8">
            <a-form-item label="标段">
              <a-select placeholder="请选择"
                v-model="queryParam.segmentId">
                <a-select-option v-for="(item, index) in dictOptions" :key="index"  :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset({module: 'score_manager'})" icon="reload" style="margin-left: 8px">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>

  <!-- 操作按钮区域 -->
  <div class="table-operator">
    
  </div>

  <!-- table区域-begin -->
  <div>
    <a-table ref="table" size="middle" bordered rowKey="id"  :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading" @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">修改</a>
      </span>
    </a-table>
  </div>
  <!-- table区域-end -->

  <!-- 表单区域 -->

  <segmentConfig-modal ref="modalForm" @ok="modalFormOk" :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions" :questionBankTypeDictOptions="questionBankTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
</a-card>
</template>

<script>
import segmentConfigModal from "./segmentConfigModal";
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JDate from '@/components/jeecg/JDate'
import {
  JeecgListMixin
} from "@/mixins/JeecgListMixin";
import {
  initDictOptions,
  filterDictText
} from '@/components/dict/JDictSelectUtil'
import {
  getAction
} from '@/api/manage'
export default {
  name: "QuestionBank",
  mixins: [JeecgListMixin],
  components: {
    segmentConfigModal,
    JDictSelectTag,
    JDate
  },
  props: {
    editStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryParam: {
        module: 'score_manager'
      },
      description: "标段配置-分页列表查询",
      // 表头
      columns: [{
          title: "标段",
          align: "center",
          dataIndex: "segmentName"
        },
        {
          title: "设置人",
          align: "center",
          dataIndex: "realName",
          customRender: function(text){
            return text || '--'
          }
        },
        {
          title: "积分汇率（元/积分）",
          align: "center",
          dataIndex: "oneByScore",
          customRender: function(text){
            return text || '--'
          }
        },
        {
          title: "设置时间",
          align: "center",
          dataIndex: "updateTime",
          customRender: function(text){
            return text || '--'
          }
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
        list: "/bp/segmentConfig/list",
      },
      questionBankDifficultyDictOptions: [],
      questionBankTypeDictOptions: [],
      workTypeDictOptions: [],
      dictOptions: [],

    };
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    },
  },
  created() {
    if(this.editStatus) {
      this.columns.pop()
    }
    this.searchType()
  },
  methods: {
    searchType() {
      const url = '/bp/userCenter/adminSegments'
      const params = {}
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result
          this.dictOptions = result.records
        }
      })
    },
    initDictConfig() {
      console.log("--我才是真的方法!--")
      //初始化字典 - 难度
      initDictOptions('question_bank_ difficulty').then((res) => {
        if (res.success) {
          this.questionBankDifficultyDictOptions = res.result.map(i => {
            i.value = Number(i.value)
            return i
          });
        }
      });
      //初始化字典 - 类型
      initDictOptions('question_bank_type').then((res) => {
        if (res.success) {
          this.questionBankTypeDictOptions = res.result.map(i => {
            i.value = Number(i.value)
            return i
          });
        }
      });
      //初始化字典 - 工种
      initDictOptions('work_type').then((res) => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
        }
      });
    },
    handleSelectQuestions() {
      this.$emit('change', this.cacheSelectionRows)
    },
    onDateChange(value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.beginTime=dateString[0];
        this.queryParam.endTime=dateString[1];
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
