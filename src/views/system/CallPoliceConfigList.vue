<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="标段">
              <a-select placeholder="请选择" v-model="queryParam.segmentId" @change="searchPoint">
                <a-select-option
                  v-for="(item, index) in dictOptions"
                  :key="index"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="工点"  >
              <a-select placeholder="请选择" v-model="queryParam.pointId" :disabled="!queryParam.segmentId">
                <a-select-option
                  v-for="(item, index) in pointDictOptions"
                  :key="index"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--<a-col :span="6">
            <a-form-item label="内容">
              <a-input placeholder="请输入内容" v-model="queryParam.msgContent"></a-input>
            </a-form-item>
          </a-col>-->

          <a-col :span="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
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
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <callPoliceConfig-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { getAction } from "@/api/manage";

import CallPoliceConfigModal from "./modules/CallPoliceConfigModal";
import { doReleaseData, doReovkeData } from "@/api/api";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { text } from "body-parser";

export default {
  name: "SysAnnouncementList",
  mixins: [JeecgListMixin],
  components: {
    CallPoliceConfigModal
  },
  data() {
    return {
      // 查询条件
      queryParam: {},
      // 表头
      columns: [
        {
          title: "一键报警接收人",
          align: "center",
          dataIndex: "receiverName"
        },
        {
          title: "一键报警接收人电话",
          align: "center",
          dataIndex: "receiverPhone"
        },
        {
          title: "所辖工程范围",
          align: "center",
          dataIndex: "segmentNameAndPointName",
          customRender: function(text, record, index) {
            return record.segmentName + record.pointName;
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
        list: "/bp/callPoliceConfig/list"
      },
      pointDictOptions: [],
      dictOptions: []
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    this.searchType();
  },
  methods: {
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
    searchPoint(segmentId) {
      if(this.queryParam.pointId){
        this.queryParam.pointId='';
      }
      this.segmentId = segmentId;
      const url = "/point/list";
      const params = { segmentId };
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result;
          this.pointDictOptions = result.records;
        }
      });
    },
    //执行发布操作
    releaseData: function(id) {
      console.log(id);
      var that = this;
      doReleaseData({ id: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData(1);
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    //执行撤销操作
    reovkeData: function(id) {
      var that = this;
      doReovkeData({ id: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData(1);
        } else {
          that.$message.warning(res.message);
        }
      });
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>