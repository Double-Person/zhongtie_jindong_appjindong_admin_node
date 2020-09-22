<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="商品">
                <a-input placeholder="请输入" v-model="queryParam.goodsName"></a-input>
              </a-form-item>
            </a-col>
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
        <span slot="goodsImage" slot-scope="text">
          <img :src="text" alt="" style="width: 100px;height: 60px">
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
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
import {getAction, putAction} from '@/api/manage'
export default {
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    JDictSelectTag,
    JDate
  },
  data() {
    return {
      dictOptions: [],
      description: "商品统计",
      // 表头
      columns: [
        {
          title: "商品编号",
          align: "center",
          dataIndex: "goodsId",
          width: 300
        },
        {
          title: "商品",
          align: "center",
          dataIndex: "goodsName"
        },
        {
          title: "售卖数量",
          align: "center",
          dataIndex: "quantity",
          customRender: (text, record, index) => {
            return Number(record.exchangeNumber) + Number(record.otherBuyNumber)
          }
        },
        {
          title: "积分兑换数量",
          align: "center",
          dataIndex: "exchangeNumber",
          customRender: (text, record, index) => {
            return text || 0
          }
        },
        {
          title: "支付宝/微信售卖数量",
          align: "center",
          dataIndex: "otherBuyNumber",
          customRender: (text, record, index) => {
            return text || 0
          }
        },
        {
          title: "标段",
          align: "center",
          dataIndex: "segmentName",
          customRender: (text, record, index) => {
            return text || '--'
          }
        },
        {
          title: "图片",
          align: "center",
          dataIndex: "goodsImage",
          scopedSlots: { customRender: "goodsImage" }
        }
      ],
      url: {
        list: "/bp/goods/list",
      },
      articleStatusDictOptions: [],
      articleTypeDictOptions: [],
      workTypeDictOptions: []
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
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
        //初始化字典 - 状态
        initDictOptions('article_status').then((res) => {
          if (res.success) {
            this.articleStatusDictOptions = res.result;
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
    handlePublish: function (id) {
      if(!this.url.publish){
        this.$message.error("请设置url.publish属性!")
        return
      }
      var that = this;
      putAction(that.url.publish, {id: id}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleCancelPublish: function (id) {
      if(!this.url.cancelPublish){
        this.$message.error("请设置url.cancelPublish!")
        return
      }
      var that = this;
      putAction(that.url.cancelPublish, {id: id}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
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
      },
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>