<template>
<a-card :bordered="false">
  <!-- 查询区域 -->
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :md="6" :sm="8">
          <a-form-item label="工种">
            <j-dict-select-tag placeholder="请选择" v-model="queryParam.workType" title="工种" dictCode="work_type" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="难度">
            <j-dict-select-tag placeholder="请选择" v-model="queryParam.difficulty" title="难度" dictCode="question_bank_ difficulty" />
          </a-form-item>
        </a-col>

        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="题型">
              <j-dict-select-tag placeholder="请选择" v-model="queryParam.type" title="题型" dictCode="question_bank_type	" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建日期">
              <a-range-picker
                
                v-model="queryParam.timeRange"
                style="width: 100%"
                format="YYYY-MM-DD "
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="题干">
              <a-input placeholder="请输入" v-model="queryParam.question"></a-input>
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
    <a-button v-if="!editStatus" @click="handleAdd" type="primary" icon="plus">新增</a-button>
    <a-upload v-if="!editStatus" name="file" :showUploadList="false" :multiple="false" 
      :beforeUpload="frontBeforeUpload"
      @change="frontHandleChange">
          <a-button type="primary" icon="import">导入</a-button>
    </a-upload>

      <a v-if="!editStatus" href="/import.xls" target="_blank">
        <a-button type="primary" icon="download">
          下载模版
        </a-button>
      </a>
    <a-button v-else @click="handleSelectQuestions" type="primary">选择考题</a-button>

  </div>

  <!-- table区域-begin -->
  <div>
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    <a-table ref="table" size="middle" bordered rowKey="id" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading" @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
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
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
  </div>
  <!-- table区域-end -->

  <!-- 表单区域 -->

  <questionBank-modal ref="modalForm" @ok="modalFormOk" :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions" :questionBankTypeDictOptions="questionBankTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
</a-card>
</template>

<script>
import QuestionBankModal from "./QuestionBankModal";
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
  name: "QuestionBank",
  mixins: [JeecgListMixin],
  components: {
    QuestionBankModal,
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
      description: "安全学习统计页面",
      // 表头
      columns: [{
          title: "题干",
          align: "center",
          dataIndex: "question"
        },
        {
          title: "题型",
          align: "center",
          dataIndex: "type",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.questionBankTypeDictOptions, text);
          }
        },
        {
          title: "选项数",
          align: "center",
          dataIndex: "answerList",
          key: "answerList-length",
          customRender: (text, record, index) => {
            return record.type !== 2 ? text.length : '--'
          }
        },
        {
          title: "答案选项",
          align: "center",
          dataIndex: "answerList",
          key: "answerList-success",
          customRender: (text, record, index) => {
            if (record.type !== 2) {
              if (text && text.length) {
                let arr = text.filter(i => {
                  return i.success
                })
                arr = arr.map(i => {
                  return i.naming
                })
                return arr.join('')
              } else {
                return '--'
              }
            } else {
              return '--'
            }

          }
        },
        {
          title: "答案内容",
          align: "center",
          dataIndex: "answerList",
          key: "answerList-answer",
          width: 400,
          customRender: (text, record, index) => {
            if (text && text.length) {
              let arr = text.filter(i => {
                return i.success
              })
              arr = arr.map(i => {
                return i.answer
              })
              return arr.join('、')
            } else {
              return ''
            }
          }
        },
        {
          title: "难度",
          align: "center",
          dataIndex: "difficulty",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.questionBankDifficultyDictOptions, text);
          }
        },
        {
          title: "工种",
          align: "center",
          dataIndex: "workType",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.workTypeDictOptions, text);
          }
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "创建人",
          align: "center",
          dataIndex: "createName"
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
        list: "/bp/questionBank/list",
        delete: "/bp/questionBank/delete",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        importExcelUrl: "bp/questionBank/importExcel"
      },
      questionBankDifficultyDictOptions: [],
      questionBankTypeDictOptions: [],
      workTypeDictOptions: [],
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
  },
  methods: {
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
    },
    // 上传 bofore
    frontBeforeUpload: function(file) {
      return false
    },
    // 上传 change
    frontHandleChange(info) {
      // console.log(info)
      this.upload(info, 'img')
    },
    // upload
    upload(info, name) {
      console.log(info)
      let that = this
      // reader.readAsDataURL(info.file)
      let formData = new FormData()
        formData.append('import', info.file)
        that.axios
          .post('/bp/questionBank/importExcel', formData)
          .then(res => {
            res.success ? that.$message.success(res.message) : that.$message.error(res.message) 
            that.loadData()
          })
          .catch(err => {
            console.log(err)
            that.$message.error('导入失败') 
          })
    },
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
</style>
