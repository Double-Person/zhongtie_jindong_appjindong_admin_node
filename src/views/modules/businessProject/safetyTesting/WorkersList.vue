<template>
<a-card :bordered="false">
  <!-- 查询区域 -->
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :md="6" :sm="8">
          <a-form-item label="性别">
            <j-dict-select-tag placeholder="请选择" v-model="queryParam.sex" title="性别" dictCode="gender" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="工种">
            <j-dict-select-tag placeholder="请选择" v-model="queryParam.workerType" title="工种" dictCode="work_type" />
          </a-form-item>
        </a-col>
        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="ID">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
        </template>
        <a-col :md="6" :sm="8">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset({dataRole: 3})" icon="reload" style="margin-left: 8px">重置</a-button>
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
    <a-button v-else @click="handleSelectWorkers" type="primary">选择完成</a-button>
  </div>

  <!-- table区域-begin -->
  <div>
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    <a-table ref="table" size="middle" bordered rowKey="id" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading" @change="handleTableChange">

      <p slot="segmentName" slot-scope="text, record" style="width:300px">
        {{record.segmentName}}/{{record.pointName}}
      </p>
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

</a-card>
</template>

<script>
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
      queryParam: {
        dataRole: 3
      },
      // 表头
      columns: [
        // {
        //   title: "ID",
        //   align: "center",
        //   dataIndex: "id"
        // },
        {
          title: "姓名",
          align: "center",
          dataIndex: "realname"
        },
        {
          title: "标段/工点",
          align: "center",
          dataIndex: "segmentName",
          width: '300px',
          scopedSlots: { customRender: "segmentName" }
        },
        {
          title: "性别",
          align: "center",
          dataIndex: "sex_dictText"
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
          title: "工种",
          align: "center",
          dataIndex: "workerType",
          customRender: (text, record, index) => {

            return filterDictText(this.workTypeDictOptions, String(text));
          }
        }
      ],
      url: {
        list: "/sys/user/user_list",
        delete: "",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      genderDictOptions: [],
      questionBankTypeDictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    // if(this.editStatus) {
    //   this.columns.pop()
    // }
  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--")
      //初始化字典 - 性别
      initDictOptions('gender').then((res) => {
        if (res.success) {
          this.genderDictOptions = res.result.map(i => {
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
    handleSelectWorkers() {
      this.$emit('change', this.cacheSelectionRows)
    }
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
</style>
