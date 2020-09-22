<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <!-- <a-form-item label="账号">
              <a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>
            </a-form-item> -->
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名查询" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="标段">
               <a-select placeholder="请选择"
                      v-model="queryParam.segmentName">
                      <a-select-option v-for="(item, index) in dictOptions" :key="index"  :value="item.id">{{item.name}}</a-select-option>
               </a-select>
            </a-form-item>
          </a-col>


          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="性别">
              <a-select v-model="queryParam.sex" placeholder="请选择性别查询">
                <a-select-option value="">请选择性别查询</a-select-option>
                <a-select-option value="1">男性</a-select-option>
                <a-select-option value="2">女性</a-select-option>
              </a-select>
            </a-form-item>
              <!-- <a-form-item label="邮箱">
                <a-input placeholder="请输入邮箱查询" v-model="queryParam.email"></a-input>
              </a-form-item> -->
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="手机号码">
                <a-input placeholder="请输入手机号码查询" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择用户状态查询">
                  <a-select-option value="">请选择用户状态</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">解冻</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" v-has="'user:add'" type="primary" icon="plus">添加用户</a-button>
      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            删除
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            冻结
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            解冻
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">


        <template slot="nationslot" slot-scope="text, record, index">
          <span>{{nationList[record.nation]}}</span>
        </template>

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="record.avatar" icon="user"/>
          </div>
        </template>


        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="handleChangePassword(record.username)">密码</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==1">
                <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.id,2)">
                  <a>冻结</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==2">
                <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.id,1)">
                  <a>解冻</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定修改工作状态吗?" @confirm="() => handleincumbency(record,1)">
                  <a>工作状态修改</a>
                </a-popconfirm>
              </a-menu-item>

              <!-- <a-menu-item>
                <a href="javascript:;" @click="handleAgentSettings(record.username)">代理人</a>
              </a-menu-item> -->

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>
  </a-card>
</template>

<script>
  import UserModal from './modules/UserModal'
  import PasswordModal from './modules/PasswordModal'
  import {putAction} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import UserRecycleBinModal from './modules/UserRecycleBinModal'
  import {
    getAction
  } from '@/api/manage';

  export default {
    name: "UserList",
    mixins: [JeecgListMixin],
    components: {
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      UserRecycleBinModal
    },
    data() {
      return {
        recycleBinVisible: false,
        description: '这是用户管理页面',
        nationList:['汉族','满族','蒙古族','回族','藏族','维吾尔族','苗族','彝族','壮族','布依族','侗族','瑶族','白族','土家族','哈尼族','哈萨克族','傣族','黎族','傈僳(音：素)族','佤族','畲族','高山族','拉祜(音：护)族','水族','东乡族','纳西族','景颇族','柯尔克孜族','土族','达斡(音：握)尔族','仫(音：目)佬族','羌族','布朗族','撒拉族','毛南族','仡佬族','锡伯族','阿昌族','普米族','朝鲜族','塔吉克族','怒族','乌孜别克族','俄罗斯族','鄂温克族','德昂族','保安族','裕固族','京族','塔塔尔族','独龙族','鄂伦春族','赫哲族','门巴族','珞巴族','基诺族'],
        queryParam: {},
        dictOptions: [],
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
          {
            title: '用户账号',
            align: "center",
            dataIndex: 'username',
            width: 120
          },
          {
            title: '真实姓名',
            align: "center",
            width: 100,
            dataIndex: 'realname',
          },
          // {
          //   title: '角色',
          //   align: "center",
          //   width: 100,
          //   dataIndex: 'realname',
          // },
           {
            title: '民族',
            align: "center",
            width: 100,
            dataIndex: 'nation',
            scopedSlots: {customRender: "nationslot"}
          },
          {
            title: '头像',
            align: "center",
            width: 120,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },

          {
            title: '性别',
            align: "center",
            width: 80,
            dataIndex: 'sex_dictText',
            sorter: true
          },
          {
            title: '生日',
            align: "center",
            width: 180,
            dataIndex: 'birthday'
          },
          {
            title: '手机号码',
            align: "center",
            width: 80,
            dataIndex: 'phone'
          },
          {
            title: '地址',
            align: "center",
            width: 100,
            dataIndex: 'address'
          },
          {
            title: '身份证号码',
            align: "center",
            width: 100,
            dataIndex: 'idNumber'
          },
          {
            title: '邮箱',
            align: "center",
            dataIndex: 'email'
          },
          {
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'status_dictText'
          },
          {
            title: '工作状态',
            align: "center",
            width: 150,
            dataIndex: 'incumbencyStatus',
            customRender: (text, record) => {
              if(text==1){
                return '在职'
              }else if(text==0){
                return '离职'
              }
            }
          },
         /* {
            title: '创建时间',
            align: "center",
            width: 150,
            dataIndex: 'createTime',
            sorter: true
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 200
          }

        ],
        url: {
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
      this.searchType();
    },
    methods: {
      async searchType() {
        const url = '/bp/userCenter/adminSegments'
        const params = {};
        const dictOptions = await getAction(url, params);
        if (dictOptions.success) {
          let result = dictOptions.result;
          this.dictOptions = result.records;
        }
      },
      getAvatarView: function (avatar) {
        return this.url.imgerver + "/" + avatar;
      },
      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        } else {
          let ids = "";
          let that = this;
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "确认操作",
            content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status) {
        let that = this;
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      handleAgentSettings(username){
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "用户代理人设置";
      },
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      },
      onChangeIncumbency(val){
        console.log(val)

      },
      handleincumbency(val){
        console.log(val)
        let params={
          id:val.id,
          incumbencyStatus:val.incumbencyStatus==1?'0':'1',
        }
        putAction('/sys/user/edit/incumbency', params).then((res) => {
          if (res.success) {
            this.loadData();
          }else{
            this.$message.warning(res.message);
          }
        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>