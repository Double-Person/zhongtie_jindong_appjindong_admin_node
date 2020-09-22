<template>
  <a-row :gutter="24">
    <projectRowsModal ref="modalForm" :queryParam="queryParam" :isRows="isRows" :isSegment="isSegment" @ok="loadData(1)" @update="updateModal"></projectRowsModal>
    <a-col :md="8" :sm="24">
       <div class="table-operator" style="margin-bottom:20px;">
          <a-button type="primary" icon="plus" @click="showModal(true)">添加线路</a-button>
       </div>
       <right-handle ref="rightHandle" @change="rightHandleChange"></right-handle>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item>
                  <a-input placeholder="请输入工点名称" v-model="queryParam.title"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <!-- <a-button
                    type="primary"
                    @click="searchReset"
                    icon="reload"
                    style="margin-left: 8px"
                  >重置</a-button> -->
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button type="primary" icon="plus" @click="showModal(false, false)">添加工点</a-button>
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
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record, false)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => delOrResClick(record.id)">
                  <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <!-- <sysArticle-modal ref="modalForm" @ok="modalFormOk"></sysArticle-modal> -->
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
// import SysArticleModal from './SysArticleModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import projectRowsModal from './modal/projectRowsModal'
import * as Constant from '@/utils/constant'
import { getAction, deleteAction } from '@/api/manage'
import rightHandle from './components/rightHandle'
export default {
  name: 'projectRows',
  mixins: [JeecgListMixin],
  components: {
    rightHandle,
    projectRowsModal
  },
  data() {
    return {
      scopeData: {},
      isRows: false,
      isSegment: false,
      // 表头
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key: 'rowIndex',
        //   width: 60,
        //   align: 'center',
        //   customRender: function(t, r, index) {
        //     return parseInt(index) + 1
        //   }
        // },
        {
          title: '标段名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '起始里程',
          align: 'center',
          dataIndex: 'startKm'
        },
        {
          title: '结束里程',
          align: 'center',
          dataIndex: 'endKm'
        },
        {
          title: '监理单位',
          align: 'center',
          dataIndex: 'supervisorCompany'
        },
        {
          title: '总监',
          align: 'center',
          dataIndex: 'director'
        },
        {
          title: '车辆数',
          align: 'center',
          dataIndex: 'vehicleNum'
        },
        {
          title: '洞内车辆',
          align: 'center',
          dataIndex: 'tunnelVehicleNum'
        },
        {
          title: '司机数',
          align: 'center',
          dataIndex: 'driverNum'
        },
        {
          title: '工点数',
          align: 'center',
          dataIndex: 'workPointNum'
        },
        {
          title: '读卡器数',
          align: 'center',
          dataIndex: 'cardReaderNum'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      type: [],
      recommend: Constant.RECOMMEND,
      effective: Constant.EFFECTIVE,
      url: {
        noCreate: true, 
        // list: '/point/list',
        delete: '/system/sysArticle/delete',
        deleteBatch: '/system/sysArticle/deleteBatch',
        exportXlsUrl: 'system/sysArticle/exportXls',
        importExcelUrl: 'system/sysArticle/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  created() {
      console.log(this.scopeData)
  },
  methods: {
    updateModal(){
      this.$refs.rightHandle.loadTree();
      this.scopeData = {};
    },
     showModal(isRows, isSegment){
      this.isRows = isRows;
      this.isSegment = isSegment;
      console.log(this.scopeData, 'this.scopeData')
      if((this.scopeData.isSecond) || isRows){
        this.$refs.modalForm.show(isRows, isSegment);
      } else {
        this.$message.error('请先选择标段!');
      }
    },
    rightHandleChange(dataRef){
      console.log(dataRef);
      if(!this.url.list){
        this.url.list = '/point/list';
      }
      if(dataRef.evt === 'delete'){
        console.log(dataRef.evt)
      } else {
        if(dataRef.evt === 'add'){
          const scope = dataRef.scope;
          if(scope.isSecond){
            this.queryParam.segmentId = scope.id;
            this.loadData(1);
          }
          this.scopeData = scope;
        } else {
          if(dataRef.evt === 'edit'){
            console.log(dataRef.scope)
          } else {
            if(dataRef.isParent){
              this.queryParam.lineId = dataRef.id || '';
            }
          }
        }
      }
    },
    // 删除还是恢复
    delOrResClick(id) {
      const url = '/point/delete'
      const params = {}
      params.id = id
      return deleteAction(url, params).then(res => {
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