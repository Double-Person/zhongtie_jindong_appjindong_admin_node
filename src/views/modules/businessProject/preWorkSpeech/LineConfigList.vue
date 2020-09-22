<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->

    <lineConfig-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>
import LineConfigModal from "./LineConfigModal";
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JDate from '@/components/jeecg/JDate'
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'

export default {
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    LineConfigModal,
    JDictSelectTag,
    JDate
  },
  data() {
    return {
      description: "班前讲话统计页面",
      queryParam: {
        module: 'speak_class'
      },
      // 表头
      columns: [
        {
          title: "线路",
          align: "center",
          dataIndex: "lineName"
        },
        {
          title: "扫码最大距离",
          align: "center",
          dataIndex: "maxScanDistance"
        },
        {
          title: "设置人",
          align: "center",
          dataIndex: "realName"
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/bp/lineConfig/list",
        delete: "/bp/speakClass/delete",
        // deleteBatch: "/bp/userStatistics/deleteBatch",
        // exportXlsUrl: "bp/userStatistics/exportXls",
        // importExcelUrl: "bp/userStatistics/importExcel"
      },
      // articleStatusDictOptions: [],
      articleTypeDictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
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
      onDateChange: function (value, dateString) {
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