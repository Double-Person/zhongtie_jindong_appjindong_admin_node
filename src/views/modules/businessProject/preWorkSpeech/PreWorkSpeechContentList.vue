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
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>

  <!-- 操作按钮区域 -->
  <div class="table-operator">
    <a-button v-if="!editStatus" @click="handleAdd" type="primary" icon="plus">新增</a-button>
    <a-button v-else @click="handleSelect" type="primary">选择内容</a-button>

  </div>

  <!-- table区域-begin -->
  <div>
    <!-- 原型里没有全选，如果需要全选把下面的内容添加到 a-table 标签 -->
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="editStatus">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
      <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>
    <a-table ref="table" size="middle" bordered rowKey="id" :rowSelection="editStatus ? {selectedRowKeys: selectedRowKeys, onChange: onSelectChange} : null" :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading" @change="handleTableChange">
      <div slot="content" :style="{maxHeight: '60px',maxWidth: '500px',overflow:'hidden',display: 'inline-block'}" v-html="text" slot-scope="text">
        {{text}}
      </div>
      <span slot="action" slot-scope="text, record">
        <router-link :to="{ name: 'preworkspeech-content-@id', params: { id: record.id }}">详情</router-link>
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
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0;" v-html="record.content" >{{record.content}}</p>
    </a-table>
  </div>
  <!-- table区域-end -->

  <!-- 表单区域 -->

  <preWorkSpeechContent-modal ref="modalForm" @ok="modalFormOk" :articleTypeDictOptions="articleTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
</a-card>
</template>

<script>
import PreWorkSpeechContentModal from "./PreWorkSpeechContentModal";
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
    PreWorkSpeechContentModal,
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
      description: "班前讲话内容配置页面",
      // 表头
      columns: [{
          title: "班前讲话内容",
          align: "center",
          dataIndex: "content",
          scopedSlots: {
            customRender: "content"
          }
        },
        // {
        //   title: "类型",
        //   align: "center",
        //   dataIndex: "type",
        //   customRender: (text, record, index) => {
        //     //字典值替换通用方法
        //     return filterDictText(this.articleTypeDictOptions, String(text));
        //   }
        // },
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
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
      url: {
        list: "/bp/speakClass/config/list",
        delete: "/bp/speakClass/config/delete",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      articleTypeDictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    if(this.editStatus) {
      this.columns.pop()
    }
  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--")
      //初始化字典 - 状态
      // initDictOptions('article_status').then((res) => {
      //   if (res.success) {
      //     this.articleStatusDictOptions = res.result;
      //   }
      // });
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
    handleSelect() {
      this.$emit('change', this.cacheSelectionRows)
    }
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
</style>
