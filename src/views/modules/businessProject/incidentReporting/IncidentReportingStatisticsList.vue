<template>
<a-row :gutter="16">
  <a-col :span= "6" style="margin-bottom:20px" v-if="!dashBoard">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24">
          <h4>历史统计</h4>
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item label="标段">
                    <a-select placeholder="请选择"
                      @change="getChartData"
                      v-model="queryParam.segmentId">
                      <a-select-option v-for="(item, index) in dictOptions" :key="index"  :value="item.id">{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <a-divider />
          <a-row>
            <a-col :span="6">上报{{statisticTotal.reportCount || 0}}</a-col >
            <a-col :span="6">确认{{statisticTotal.checkCount || 0}}</a-col >
            <a-col :span="6">积分奖励{{statisticTotal.score || 0}}</a-col >
            <a-col :span="6">参与人数{{statisticTotal.userCount || 0}}</a-col >
          </a-row>
            <a-row style="height: 380px;margin-top: 30px">
              <ve-histogram
                ref="registers_creditChart"
                :data.sync="chartData"
                height="400px"
                :settings.sync="chartSettings"
              ></ve-histogram>
            </a-row>
        </a-col>
      </a-row>

    </a-card>
  </a-col>
  <!--:xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="20" :span="dashBoard?24:20"-->
  <a-col :span="dashBoard?'':18">
    <a-card :bordered="false" class="wide-center-title" :title="dashBoard ? '待审核安全隐患' : ''">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper" v-if="!dashBoard">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态">
                <j-dict-select-tag placeholder="请选择" v-model="queryParam.status" title="审核状态" dictCode="audit_status" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上报日期">
                <a-range-picker v-model="queryParam.timeRange" style="width: 100%" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" @change="onDateChange" @ok="onDateOk" />
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
      <div class="table-operator" v-if="!dashBoard"></div>

      <!-- table区域-begin -->
      <div>
        <!-- 原型里没有全选，如果需要全选把下面的内容添加到 a-table 标签 -->
        <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>-->
        <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :size="dashBoard ? 'middle':'middle'"-->
        <a-table class="security-table" :style="dashBoard?'height:400px;':''" ref="table"   :bordered="dashBoard ? false : true" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="dashBoard ? false : ipagination" :loading="loading" @change="handleTableChange">
          <span slot="images" slot-scope="text, record">
            <a @click="handlePreview(text)">查看</a>
            <!-- <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-if="!dashBoard">
              <a>删除</a>
            </a-popconfirm> -->
          </span>
          <span slot="action" slot-scope="text, record">
            <a v-if="record.status == 1" @click="handleEdit(record)">审核</a>
            <a v-else @click="handleEdit(record)">修改审核</a>
            <a-divider type="vertical" v-if="!dashBoard" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-if="!dashBoard">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
      <!-- table区域-end -->

      <!-- 表单区域 -->
      <incidentReportingStatistics-modal ref="modalForm" @ok="modalFormOk" />
    </a-card>
  </a-col>

  <a-modal :maskClosable="false" :visible="previewVisible" :footer="null" @cancel="handleCancel">
    <a-row :gutter="16">
      <a-col :span="previewImage.length>1 ? 12 : 24" v-for="(item, index) in previewImage" :key="index">
        <img style="width: 100%" :src="item" />
      </a-col>
    </a-row>
  </a-modal>
</a-row>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import IncidentReportingStatisticsModal from "./IncidentReportingStatisticsModal";
import JDictSelectTag from "@/components/dict/JDictSelectTag";
import JDate from "@/components/jeecg/JDate";
import {
  JeecgListMixin
} from "@/mixins/JeecgListMixin";
import {
  initDictOptions,
  filterDictText
} from "@/components/dict/JDictSelectUtil";
import {
  getAction
} from '@/api/manage';

export default {
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    IncidentReportingStatisticsModal,
    JDictSelectTag,
    JDate,
    VeHistogram
  },
  props: {
    dashBoard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
     chartSettings: {
        axisSite: { right: ['确认率'] },
        yAxisType:['normal','percent'],
        // metrics: ['确认隐患', '上报隐患','确认率'],
        showLine: ["确认率"]
      },
      chartData: {
        columns: ['月份', '确认隐患', '上报隐患', '确认率'],
        rows: []
      },
      statisticTotal: {},
      // 表头
      columns: [{
          title: "上报人姓名",
          align: "center",
          dataIndex: "userName"
        },
        {
          title: "上报人手机号",
          align: "center",
          dataIndex: "userPhone"
        },
        {
          title: "上报人身份证号码",
          align: "center",
          dataIndex: "idNumber"
        },
        {
          title: "描述",
          align: "center",
          dataIndex: "introduce",
          width: 140
        },
        {
          title: "照片",
          align: "center",
          dataIndex: "images",
          width: 200,
          scopedSlots: {
            customRender: "images"
          }
        },
        {
          title: "上报时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "审核状态",
          align: "center",
          dataIndex: "status",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.auditStatusDictOptions, String(text));
          }
        },
        {
          title: "奖励积分",
          align: "center",
          dataIndex: "changeScore"
        },
        {
          title: "审核备注",
          align: "center",
          dataIndex: "auditRemark"
        },
        {
          title: "审核时间",
          align: "center",
          dataIndex: "updateTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 140,
          scopedSlots: {
            customRender: "action"
          }
        }
      ],
      url: {
        noCreate: true,
        list: "/bp/incidentReporting",
        delete: "/bp/incidentReporting/delete"
      },
      questionBankDifficultyDictOptions: [],
      questionBankTypeDictOptions: [],
      examinationStatusDictOptions: [],
      examinationTypeDictOptions: [],
      workTypeDictOptions: [],
      auditStatusDictOptions: [],
      previewImage: [],
      previewVisible: false,
      dictOptions: []

    };
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  created() {
    if (this.dashBoard) {
      this.queryParam.status = 1
      this.columns = [{
          title: '描述',
          align: "center",
          dataIndex: 'introduce',
          width: 100,
          height: 40
        },
        {
          title: '工点',
          align: "center",
          dataIndex: 'pointName',
          customRender: function (text) {
            return text || '无'
          }
        },
        {
          title: '上报时间',
          align: "center",
          dataIndex: 'createTime'
        },
        {
          title: '上报人',
          align: "center",
          dataIndex: 'userName'
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action"
          }
        }
      ]
    }
    this.loadData();
    this.getChartData()
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
      console.log("--我才是真的方法!--");
      //初始化字典 - 状态
      initDictOptions("audit_status").then(res => {
        if (res.success) {
          this.auditStatusDictOptions = res.result;
        }
      });
    },
    onDateChange: function (value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0];
      this.queryParam.endTime = dateString[1];
              if(dateString[0] === dateString[1]) {
          this.queryParam.beginTime += ' 00:00:00'
          this.queryParam.endTime += ' 23:59:59'
        }
    },
    onDateOk(value) {
      console.log(value);
    },
    handlePreview(images) {
      this.previewImage = images.split('|')
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async getChartData(segmentId) {
      const res = await getAction('/bp/incidentReporting/statistic',{segmentId});
      const { total } = res.result
      this.statisticTotal = total||{};

      this.chartData.rows =res.result.months ? res.result.months.map(i => {
        i['月份'] = i.time.split('-')[1]+'月';
        i['确认隐患'] = i.checkCount;
        i['上报隐患'] = i.reportCount;
        i['确认率'] = (i.checkCount/i.reportCount);
        return i
      }) : []
      if (this.$refs.registers_creditChart) {
        this.$refs.registers_creditChart.resize();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@assets/less/common.less";

  .security-table{

  }
</style>
