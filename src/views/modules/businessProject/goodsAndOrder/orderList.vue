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
          <a-form-item label="订单编号">
            <a-input placeholder="请输入" v-model="queryParam.orderNo"></a-input>
          </a-form-item>
        </a-col>
        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <!--<a-form-item label="状态">
              <j-dict-select-tag placeholder="请选择" v-model="queryParam.status" title="状态" dictCode="article_status" />
            </a-form-item>-->
            <a-form-item label="标段">
              <a-select placeholder="请选择"
                        v-model="queryParam.segmentId">
                <a-select-option v-for="(item, index) in dictOptions" :key="index"  :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="时间">
              <a-range-picker  v-model="queryParam.timeRange" style="width: 100%" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" @change="onDateChange" @ok="onDateOk" />
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
    <a-button @click="()=>{this.visible2=false;this.visible=true}" type="primary" >订单校验</a-button>
    <a-button @click="getOrderProfit" type="primary">计算微信/支付宝收益</a-button>

  </div>

  <!-- table区域-begin -->
  <div>
    <a-table ref="table" size="middle" bordered rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading" @change="handleTableChange">
    </a-table>
  </div>
  <!-- table区域-end -->

  <!-- 表单区域 -->

  <a-modal :maskClosable="false" v-model="visible" :width="visible2 ? '80%' : '50%'" onOk="handleOk" :closable="false">
    <template slot="title">
      <a-row style="text-align: center" v-if="visible2">
        {{visibleSegmentName}}同步到 <span style="color: red">{{orderSyncList.length}}</span> 条新订单
      </a-row>
      <a-row style="text-align: center" v-else>
        请选择需要同步订单的标段
      </a-row>
    </template>
    <a-row type="flex" :gutter="16" v-if="visible2">
      <a-col v-for="(item, index) in orderSyncList" :key="index" :span="8" style="margin-bottom: 20px">
        <a-card>
          <span slot="title">
            <a-row type="flex" justify="space-between">
              <a-col>订单号：{{item.orderNo}}</a-col>
              <a-col>
                <a-button type="link" style="color:red" @click="orderSyncListDelete(item.orderNo)">删除</a-button>
              </a-col>
            </a-row>
          </span>
          <p>商品名称：{{item.goodsName}}</p>
          <p>支付时间：{{item.payTime}}</p>
          <p>支付方式：{{machinePayType(item.payType)}}</p>
          <p>订单总价：{{item.price}}元</p>
          <p>商品数量：{{item.quantity}}</p>
        </a-card>
      </a-col>
    </a-row>
    <a-row type="flex" :gutter="16" justify="center" v-else style="height: 100px">
          <a-col>标段</a-col>
          <a-col :span="8">
            <a-select style="width:100%" placeholder="请选择"
                        v-model="visibleSegmentId">
                <a-select-option v-for="(item, index) in dictOptions" :key="index"  :value="item.id">{{item.name}}</a-select-option>
              </a-select>
          </a-col>
    </a-row>
    <template slot="footer">
      <a-row style="text-align: center">
        <a-button  v-if="visible2" key="submit" type="primary" :loading="loading" @click="handleOk">
          添加到系统
        </a-button>
        <a-button @click="getOrderSync" v-if="!visible2" :loading="iconLoading">开始同步订单</a-button>
        <a-button @click="visible=false" v-if="!visible2" >取消</a-button>

      </a-row>
    </template>
  </a-modal>
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
import {
  getAction,
  postAction,
  putAction
} from '@/api/manage'
export default {
  name: "UserStatisticsList",
  mixins: [JeecgListMixin],
  components: {
    // SafetyLearningStatisticsModal,
    JDictSelectTag,
    JDate
  },
  data() {
    return {
      iconLoading: false,
      visible: false,
      visible2: false,
      visibleSegmentId: '',
      // 表头
      columns: [{
          title: "订单编号",
          align: "center",
          dataIndex: "orderNo",
        },
        {
          title: "商品名称",
          align: "center",
          dataIndex: "goodsName"
        },
        {
          title: "设备号",
          align: "center",
          dataIndex: "machineId"
        },
        {
          title: "设备名称",
          align: "center",
          dataIndex: "machineName"
        },
        {
          title: "货道号",
          align: "center",
          dataIndex: "shelfId"
        },
        {
          title: "支付人",
          align: "center",
          dataIndex: "payPerson"
        },
        {
          title: "支付方式",
          align: "center",
          dataIndex: "payType",
          customRender: (text, record, index) => {
            if(text==1){
              return '积分'
            }else if(text==10){
              return '支付宝'
            }else if(text==20){
              return '微信支付'
            }
          }
        },
        {
          title: "商品数量",
          align: "center",
          dataIndex: "quantity"

        },
        {
          title: "订单总价(元)",
          align: "center",
          dataIndex: "price"
        },
        {
          title: "出货方式",
          align: "center",
          dataIndex: "deliveryType",
          customRender: (text, record, index) => {
            if(text==0){
              return '单商品'
            }else if(text==1){
              return '多商品'
            }
          }
        },
        {
          title: "标段",
          align: "center",
          dataIndex: "segmentName",
          customRender: (text, record, index) => {
            return text || '--'
          }
        }
      ],
      url: {
        list: "/bp/order/list",
      },
      articleStatusDictOptions: [],
      articleTypeDictOptions: [],
      workTypeDictOptions: [],
      orderSyncList: [],
      dictOptions: [],
    };
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    },
    visibleSegmentName: function(){
      var arr = this.dictOptions.filter(i=>{ return i.id ==this.visibleSegmentId})
      return arr[0].name
    }
  },
  created() {
    this.searchType()
  },
  methods: {
    machinePayType(text){
      if(text==1){
              return '积分'
            }else if(text==10){
              return '支付宝'
            }else if(text==20){
              return '微信支付'
            }
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
    handlePublish: function (id) {
      if (!this.url.publish) {
        this.$message.error("请设置url.publish属性!")
        return
      }
      var that = this;
      putAction(that.url.publish, {
        id: id
      }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleCancelPublish: function (id) {
      if (!this.url.cancelPublish) {
        this.$message.error("请设置url.cancelPublish!")
        return
      }
      var that = this;
      putAction(that.url.cancelPublish, {
        id: id
      }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    // 时间回调
    onDateChange: function(value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0];
      this.queryParam.endTime = dateString[1];
      if(dateString[0]) {
      this.queryParam.beginTime += " 00:00:00";
      }
      if(dateString[1]){
        this.queryParam.endTime += " 23:59:59";
      }
    },
    onDateOk(value) {
      console.log(value);
    },
    async getOrderProfit() {
      const result = await getAction('/bp/order/profit')
      const h = this.$createElement;
      this.$info({
        title: '计算微信/支付宝收益',
        content: h('div', {
          style: {
            textAlgin: 'center'
          }
        }, [
          h('p', {
            style: {
              color: 'red',
              fontSize: '30px'
            }
          }, `${result.result.price || 0}元`),
          h('p', ['从', h('span', {
            style: {
              color: '#1890FF'
            }
          }, result.result.count || 0), '笔订单中计算出总收益']),
        ]),
        okText: '确定',
        onOk() {},
      });
    },
    async getOrderSync() {
      this.iconLoading = true
      const result = await postAction('/bp/order/sync',{
        segmentId: this.visibleSegmentId
      })
      this.iconLoading = false
      if(result.success && result.result.records.length) {
      this.visible2 = true
      this.orderSyncList = result.result.records
      } else {
        this.$message.error(result.message || '没有获取到新的订单信息')
      }
    },
    orderSyncListDelete(id) {
      this.orderSyncList = this.orderSyncList.filter(i=>{
        return id !== i.orderNo
      })
    },
    handleOk() {
      postAction('/bp/order/saveSyncOrder',{
        orderNoList: this.orderSyncList.map(i=>{return i.orderNo})
      }).then(res=>{
        if(res.success) {
          this.$message.success('添加到系统成功')
          this.visible = false
          this.loadData()
        } else {
          this.$message.error(res.message || '添加到系统失败')
        }
      })
    },
    handleCancel() {},
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
</style>
