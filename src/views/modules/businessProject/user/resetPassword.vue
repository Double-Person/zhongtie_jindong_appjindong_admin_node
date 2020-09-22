<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
         <!-- <a-col :md="4" :sm="8">
            <a-row type="flex" style="flex-wrap: nowrap;" justify="space-around" align="middle">
              <a-form-item label="ID">
                <a-input placeholder="请输入ID" v-model="queryParam.id"></a-input>
              </a-form-item>
            </a-row>
          </a-col>-->
          <a-col :md="5" :sm="8">
            <a-row type="flex" style="flex-wrap: nowrap;"  justify="space-around" align="middle">
                <a-row type="flex" style="flex-wrap: nowrap;" justify="space-around" align="middle">
                  <a-form-item label="姓名">
                    <a-input placeholder="请输入姓名" v-model="queryParam.realname"></a-input>
                  </a-form-item>
                </a-row>
            </a-row>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <router-link to="/article/add">
        <a-button type="primary" icon="plus">添加标段</a-button>
      </router-link>
    </div> -->

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
        <span slot="pointId" slot-scope="text, record">
          <span >{{record.pointName}}</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm
                  title="确定重置密码?"
                  @confirm="() => resetOrResClick(record)"
                >
                  <a>重置密码</a>
                </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!-- <sysArticle-modal ref="modalForm" @ok="modalFormOk"></sysArticle-modal> -->
  </a-card>
</template>

<script>
// import SysArticleModal from './SysArticleModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import * as Constant from '@/utils/constant'
import { getAction } from '@/api/manage';
import {
  filterDictText,
  initDictOptions
} from '@/components/dict/JDictSelectUtil'

export default {
  name: 'projectRows',
  mixins: [JeecgListMixin],
  components: {

  },
  data() {
    return {
      description: '重制密码页面',
      // 表头
      columns: [
        {
          title: 'ID',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '工点',
          align: 'center',
          dataIndex: 'pointName'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          customRender:function (text) {
             if(text===1){
               return '男'
             }else if(text===2){
               return '女'
             }else{
               return text;
             }
          }
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '身份证号码',
          align: 'center',
          dataIndex: 'idNumber'
        },
         {
          title: '工种',
          align: 'center',
          dataIndex: 'workerType',
           customRender: (text, record, index) => {
             //字典值替换通用方法
             return filterDictText(this.workTypeDictOptions, text);
           }
         },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      type: [],
      url: {
        list: '/sys/user/resetpwd_list'
      },
      workTypeDictOptions:[]
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {

  },
  methods: {
    initDictConfig() {
      console.log("--我才是真的方法!--")

      //初始化字典 - 工种
      initDictOptions('work_type').then((res) => {
        if (res.success) {
          this.workTypeDictOptions = res.result;
        }
      });
    },
    // 重置
    resetOrResClick({username}) {
      const url = '/sys/user/reset_password'
      const params = {}
      params.username = username
      return getAction(url, params).then(res => {
        if (res.success) {
          // console.log(res)
          this.searchQuery()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>