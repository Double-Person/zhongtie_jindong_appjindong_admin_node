<template>
  <a-row :gutter="24">
    <projectRowsModal ref="modalForm" :scopeData="scopeData" :queryParam="queryParam" :isRows="isRows" :isSegment="isSegment" :isPoint="!scopeData.isPoint " @ok="loadData(1)" @update="updateModal"></projectRowsModal>
    <a-col :md="8" :sm="24">
       <div class="table-operator" style="margin-bottom:20px;" v-if="isAdmin">
          <a-button type="primary" icon="plus" @click="showModal(true)">添加线路</a-button>
       </div>
       <right-handle ref="rightHandle" @loadData="setQueryStatistical" :defaultExpandedKeys="defaultExpandedKeys" :scopeData="scopeData" :isAdmin="isAdmin"  @change="rightHandleChange" @changeExpandedKeys="changeExpandedKeys"></right-handle>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item>
                  <a-input :placeholder="`请输入${isCurrent? '标段': (scopeData.isPoint ?'班组':'工点')}名称`" v-model="queryParam.name"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQueryBefore" icon="search">查询</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button v-if="scopeData.isParent && isAdmin" type="primary" icon="plus" @click="showModal(false, true)">添加标段</a-button>
          <a-button v-if="scopeData.isSecond && isAdmin" type="primary" icon="plus" @click="showModal(false, false, true)">添加工点</a-button>
          <a-button v-if="scopeData.isPoint && isAdmin" type="primary" icon="plus" @click="showModal(false, false, false)">添加班组</a-button>
        </div>

        <!-- table区域-begin -->
        <div>

          <a-table
            v-if="isCurrent"
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
            <span v-if="isAdmin" slot="action" slot-scope="text, record">
              <a @click="saveHandleEdit(record, false, true)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => delOrResClick(record.id, 'segment')">
                  <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>

          <a-table
            v-if="!isCurrent"
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
            <span v-if="isAdmin" slot="action" slot-scope="text, record">
              <a @click="saveHandleEdit(record, false, false, scopeData.isPoint)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => {delOrResClick(record.id, 'point')}">
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
      isPoint: false,
      isCurrent: true,
      // 表头
      columns: [
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
          dataIndex: 'director',
          width:50, 
          textWrap: 'no-wrap',
          ellipsis: true,
          customRender: function(text) {
            if(Array.isArray(text) && text.length>0){
              return text.join(', ')
            }
            return '-';
          }
        },
        {
          title: '车辆数',
          align: 'center',
          dataIndex: 'vehicleNum',
          customRender: function(text) {
            return text || 0;
          }
        },
        {
          title: '洞内车辆',
          align: 'center',
          dataIndex: 'tunnelVehicleNum',
          customRender: function(text) {
            return text || 0;
          }
        },
        {
          title: '司机数',
          align: 'center',
          dataIndex: 'driverNum',
          customRender: function(text) {
            return text || 0;
          }
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
        // list: '/segment/list',
        delete: '/system/sysArticle/delete',
        deleteBatch: '/system/sysArticle/deleteBatch',
        exportXlsUrl: 'system/sysArticle/exportXls',
        importExcelUrl: 'system/sysArticle/importExcel',
      },
      isAdmin: false,
      defaultExpandedKeys: []
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  created() {
      this.isRoleInfo()
  },
  methods: {
    isRoleInfo(){
        const role = this.$store.getters.role;
        this.isAdmin = role.includes('admin');
    },
    showModal(isRows, isSegment, isPoint){
      this.isRows = isRows;
      this.isSegment = isSegment;
      this.isPoint = isPoint;
      this.$refs.modalForm.show(isRows, isSegment, isPoint);
    },
    saveHandleEdit(record, isRows, isSegment, isPoint){
      this.isRows = isRows;
      this.isSegment = isSegment;
      this.handleEdit(record, isRows, isSegment, isPoint)
    },
    updateModal(){
      console.log('updateModal')
      if(!this.scopeData.isPoint) {
        this.$refs.rightHandle.loadTree();
        !this.defaultExpandedKeys.length && (this.scopeData = {});
      }
    },
    clearDataInit(){
      this.queryParam.lineId = '';
      this.queryParam.segmentId = '';
      this.queryParam.pointId='';
      this.scopeData = {};
      this.$refs.rightHandle.loadTree();
      this.queryParam.pageNo= 1;
      this.queryParam.pageSize= 10;
      this.dataSource = [];
    },
    rightHandleChange(dataRef){

      if(dataRef.evt === 'delete'){
        this.clearDataInit()
      } else {
        if(dataRef.evt === 'add'){
          const scope = dataRef.scope;
          if(scope.isParent){
            this.isCurrent = true;
            this.url.list = '/segment/list';
            this.columns= [
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
                dataIndex: 'directorNames',
                customRender: function(text) {
                  if(Array.isArray(text) && text.length>0){
                    return text.join(', ')
                  }
                  return '-';
                }
              },
              {
                title: '车辆数',
                align: 'center',
                dataIndex: 'vehicleNum',
                customRender: function(text) {
                  return text || 0;
                }
              },
              {
                title: '洞内车辆',
                align: 'center',
                dataIndex: 'tunnelVehicleNum',
                customRender: function(text) {
                  return text || 0;
                }
              },
              {
                title: '司机数',
                align: 'center',
                dataIndex: 'driverNum',
                customRender: function(text) {
                  return text || 0;
                }
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
            ];
            this.queryParam.lineId = scope.id;
            this.loadData(1);
          }
          if(scope.isSecond){
            this.isCurrent = false;
            this.url.list = '/point/list';
            this.columns= [
              {
                title: '工点名称',
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
                title: '工点类型',
                align: 'center',
                dataIndex: 'type'
              },
              {
                title: '洞内车辆',
                align: 'center',
                dataIndex: 'tunnelVehicleNum'
              },
              {
                title: '工点数',
                align: 'center',
                dataIndex: 'workPointNum'
              },
              {
                title: '读卡器编号',
                align: 'center',
                dataIndex: 'cardReaderNum'
              },
              {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                scopedSlots: { customRender: 'action' }
              }
            ];
            this.queryParam.segmentId = scope.id;
            this.loadData(1);
          }
          if(scope.isPoint){
            this.isCurrent = false;
            this.url.list = '/bp/workTeam/list';
            this.columns= [
              {
                title: '班组',
                align: 'center',
                dataIndex: 'name'
              },
              {
                title: '工班长',
                align: 'center',
                dataIndex: 'monitorName'
              },
              {
                title: '工班长电话号码',
                align: 'center',
                dataIndex: 'monitorPhone'
              },
              {
                title: '班组人数',
                align: 'center',
                dataIndex: 'memberCount'
              },
              {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                scopedSlots: { customRender: 'action' }
              }
            ];
            this.queryParam.pointId  = scope.id;
            this.loadData(1);
          }
          this.scopeData = scope;
        } else {
          if(dataRef.evt === 'edit'){
            const {isParent, isSecond}  = this.scopeData;
            if(isParent){
              this.isRows = true;
              this.isSegment = false;
              this.scopeData.name = this.scopeData.lineName;
              // this.scopeData.name = this.scopeData.lineName;
              this.handleEdit(this.scopeData, this.isRows, this.isSegment);
            }
            if(isSecond){
              this.isRows = false;
              this.isSegment = true;
              this.scopeData.name = this.scopeData.segmentName;
              this.handleEdit(this.scopeData, this.isRows, this.isSegment);
            }
          }
        }
      }
    },
    changeExpandedKeys(expandedKeys){
      this.defaultExpandedKeys = expandedKeys
    },
    searchQueryBefore(){
       const role = this.$store.getters.role;
       this.isAdmin = role.includes('admin');
        console.log(this.queryParam)
        if(this.isAdmin && !this.queryParam.lineId){
            this.$message.success('您存在多条线路，请手动选择某条线路进行查看。')
        } else {
           this.searchQuery(this.queryParam.lineId, this.queryParam.segmentId || '')
        }
    },
    setQueryStatistical(treeData){
        const [line] = treeData;
        const role = this.$store.getters.role;
        this.isAdmin = role.includes('admin');
        console.log(line, 'this.isAdmin = role.includ')
        if(!this.isAdmin){
            this.url.list = '/segment/list';
            this.queryParam.lineId = line.lineId;
        }
    },
    // 删除还是恢复
    delOrResClick(id, type) {
      let url;
      if(this.scopeData.isParent || type === 'segment'){
        url = '/segment/delete'
      }
      if(this.scopeData.isSecond || type === 'point'){
        url = '/point/delete'
      }
      if(this.scopeData.isPoint){
        url = '/bp/workTeam/delete'
      }
      console.log(type,url, '测试删除失败')
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
<style scoped lang="scss">
@import '~@assets/less/common.less';
/deep/ .ant-table-fixed {
    table-layout: fixed;
  }

  /deep/ .ant-table-tbody > tr > td {
    word-wrap: break-word;
    word-break: break-all;
  }
</style>