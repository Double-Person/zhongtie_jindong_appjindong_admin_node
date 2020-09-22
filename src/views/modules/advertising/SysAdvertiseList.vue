<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" allowClear placeholder="请选择">
                <a-select-option
                  value="1"
                >待发布</a-select-option>
                <a-select-option
                  value="2"
                >已发布</a-select-option>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('广告')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      -->

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
          <a @click="handleEdit(record)" v-if="record.status!==2">编辑</a>

          <a @click="setNum(record)" v-if="record.status==2">设置序号</a>

           <a-divider type="vertical" v-if="record.status==2" />

          <!--1:待发布 2:已发布 start-->
           <a-divider type="vertical" v-if="record.status!==2" />
          <a>
               <a-popconfirm
                 title="确定删除吗?" @confirm="() => delOrResClick(record.id)" v-if="!record.delFlag"
               ><a href="#" v-if="record.status!==2">删除</a>
            </a-popconfirm>
             <a-popconfirm
               title="确定恢复吗?" @confirm="() => delOrResClick(record.id)" v-else
             > <a>恢复</a>
            </a-popconfirm>
          </a>
          <a-divider type="vertical" v-if="record.status!==2" />
          <a>
            <a-popconfirm title="确定发布吗?" @confirm="() => handlePublish(record.id)">
                  <a v-if="record.status == 1">发布</a>
                </a-popconfirm>
            <a-popconfirm title="确定取消发布吗?" @confirm="() => handleCancelPublish(record.id)">
                  <a  v-if="record.status == 2">取消发布</a>
                </a-popconfirm>
          </a>




          <!--<a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => delOrResClick(record.id)" v-if="!record.delFlag">
                  <a v-if="record.status!==2">删除</a>
                </a-popconfirm>
                <a-popconfirm title="确定恢复吗?" @confirm="() => delOrResClick(record.id)" v-else>
                  <a>恢复</a>
                </a-popconfirm>
              </a-menu-item>
              &lt;!&ndash; 状态 1:待发布 2:已发布 start &ndash;&gt;
              <a-menu-item v-if="record.status == 1">
                <a-popconfirm title="确定发布吗?" @confirm="() => handlePublish(record.id)">
                  <a>发布</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.status == 2">
                <a-popconfirm title="确定取消发布吗?" @confirm="() => handleCancelPublish(record.id)">
                  <a>取消发布</a>
                </a-popconfirm>
              </a-menu-item>
              &lt;!&ndash; 状态 1:待发布 2:已发布 end &ndash;&gt;
            </a-menu>
          </a-dropdown>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysAdvertise-modal ref="modalForm" :type="type"  @ok="modalFormOk"></sysAdvertise-modal>

    <a-modal :maskClosable="false" title="设置序号"  v-model="setNumVisible" @ok="setNumModal">
      <div>
        <a-input placeholder="输入序号" v-model="setNumValue" />
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import SysAdvertiseModal from './SysAdvertiseModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate'
import * as Constant from '@/utils/constant'
import { getAction, deleteAction,putAction } from '@/api/manage'

export default {
  name: 'SysAdvertiseList',
  mixins: [JeecgListMixin],
  components: {
    SysAdvertiseModal,
    JDate
  },
  data() {
    return {
      description: '广告管理页面',
      // 表头
      columns: [
        {
          title: '标题',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text, record) => {
            switch (text) {
              case 1:
                return '安全学习'
                break;
              case 2:
                return '安全考试'
                break;
              default:
                return '其他'
                break;
            }
          }
        },

        {
          title: '链接',
          align: 'center',
          dataIndex: 'url'
        },
        {
          title: '序号',
          align: 'center',
          dataIndex: 'sortNum',
          customRender: (text, record) => {
            if(text=='-1' || text==0){
              return ''
            }else{
              return text
            }
          }
        },

        {
          title: '状态',
          align: 'center',
          // dataIndex: 'delFlag'
          customRender: (text, record) => {
            return record.status=='1' ? '待发布' : '已发布'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/system/sysAdvertise/list',
        delete: '/system/sysAdvertise/delete',
        deleteBatch: '/system/sysAdvertise/deleteBatch',
        exportXlsUrl: 'system/sysAdvertise/exportXls',
        importExcelUrl: 'system/sysAdvertise/importExcel',
        publish: "/system/sysAdvertise/publish",
        cancelPublish: "/system/sysAdvertise/cancelPublish",
      },
      type: [
        {id: 1, name: '安全学习'},
        {id: 2, name: '安全考试'},
        {id: 99, name: '其他'},
      ],
      effective: Constant.EFFECTIVE,
      setNumVisible:false,
      setNumId:'',
      setNumValue:''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    // this.searchType()
  },
  watch:{
    setNumVisible(newVal,oldVal){
      if(newVal!==oldVal){
        this.setNumValue='';
      }
    }
  },
  methods: {
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
    // 删除还是恢复
    delOrResClick(id) {
      const url = '/system/sysAdvertise/delete'
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
    },
    // 设置序号
    setNum(val){
      this.setNumVisible=true;
      this.setNumId=val.id;
    },
    setNumModal(){
      const url = '/system/sysAdvertise/edit'
      const params = {
        id:this.setNumId,
        sortNum:this.setNumValue
      }
      if(this.setNumValue==1 || this.setNumValue==2 || this.setNumValue==3 ||this.setNumValue==4 ||this.setNumValue==5 || this.setNumValue==6){
        putAction(url, params).then((res) => {
          if (res.success) {
            this.setNumVisible=false;
            this.loadData();
          }else{
            this.$message.error(res.message)
          }
        })
      }else{
        this.$message.error('请设置序号')
      }


    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>