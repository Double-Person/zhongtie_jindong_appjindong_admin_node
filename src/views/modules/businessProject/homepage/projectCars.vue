<template>
<div class="page-header-index-wide">
    <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
            <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 24px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                <template slot="total-header">
                    <div style="display:flex;flex-direction: column;">
                        <span style="font-size:60px;height:136px;line-height:136px;color:#1A90FF;">{{tunnelInCount}}</span>
                        <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #1A90FF;color: rgb(26, 144, 255);">洞内车辆</span>
                    </div>
                </template>
            </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
            <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 24px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                <template slot="total-header">
                    <div style="display:flex;flex-direction: column;">
                        <span style="font-size:60px;height:136px;line-height:136px;color:#1A90FF;">{{tunnelOutCount}}</span>
                        <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #1A90FF;color: rgb(26, 144, 255);">洞外车辆</span>
                    </div>
                </template>
            </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
            <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 24px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                <template slot="total-header">
                    <div style="display:flex;flex-direction: column;">
                        <span style="font-size:60px;height:136px;line-height:136px;color:#FF2121;">{{notNormalCount}}</span>
                        <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #FF2121;color: #FF2121;">非正常运营车辆</span>
                    </div>
                </template>
            </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
            <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 24px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                <template slot="total-header">
                    <div style="display:flex;flex-direction: column;">
                        <span style="font-size:60px;height:136px;line-height:136px;color:#29C385;">{{normalCount}}</span>
                        <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #29C385;color: #29C385;">正常运营车辆</span>
                    </div>
                </template>
            </chart-card>
        </a-col>
    </a-row>
    <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="24">
                    <a-col :md="3" :sm="6">
                        <a-form-item>
                            工程范围：<span v-if="scopeData.isParent">{{scopeData.title || ''}}</span><span v-if="scopeData.isSecond">{{scopeData.parentLineTitle || ''}}/{{scopeData.title || ''}}</span><span v-if="!scopeData.isSecond && !scopeData.isParent">-</span>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4" :sm="8">
                        <div style="display:flex;align-items: center;">
                            <span style="white-space: nowrap;">设备名称/编号：</span>
                            <a-form-item :style="{marginBottom:0}" style="flex-grow: 1;">
                                <a-input placeholder="请输入名称/编号" v-model="queryParam.name"></a-input>
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col :md="4" :sm="8">
                        <a-form-item label="车辆状态">
                            <a-select v-model="queryParam.vehicelStatus" allowClear placeholder="请选择">
                                <a-select-option v-for="(item, index) in vehicelStatusSelest" :value="item.itemValue" :key="index">{{item.itemText}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4" :sm="8">
                        <!-- {{queryParam.tunnelStatus}} -->
                        <a-form-item label="在洞状态">
                            <a-select v-model="queryParam.tunnelStatus" @change="changeTunnelStatus" allowClear placeholder="请选择">
                                <a-select-option v-for="(item, index) in tunnelStatusSelest" :value="item.itemValue" :key="index">{{item.itemText}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4" :sm="8">
                        <a-form-item label="车辆类型">
                            <a-select v-model="queryParam.type" allowClear placeholder="请选择">
                                <a-select-option v-for="(item, index) in cardTypeSelect" :value="item.itemValue" :key="index">{{item.itemText}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4" :sm="8">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                            <a-button type="primary" @click="searchQueryBefore" icon="search">搜索</a-button>
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
        <!-- <div class="table-operator">
              <router-link to="/article/add">
                <a-button type="primary" icon="plus">添加工点</a-button>
              </router-link>
            </div> -->

        <!-- table区域-begin -->
        <div>
            <a-row :gutter="24">
                <a-col :md="6" :sm="24">
                    <right-handle class="no-pad" @change="rightHandleChange"  @loadData="setQueryStatistical"></right-handle>
                </a-col>
                <a-col :md="18" :sm="24">
                    <div class="card-list" ref="content">
                        <a-list :grid="{gutter: 24, lg: 4, md: 4, sm: 4, xs: 4}" :dataSource="dataSource">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <template v-if="item === null">
                                    <a-button class="new-btn" type="dashed">
                                        <a-icon type="plus" />
                                        新增产品
                                    </a-button>
                                </template>
                                <template v-else>
                                    <a-card :hoverable="true">
                                        <div slot="cover">
                                            <div style="width:100%;padding-bottom:66%;position:relative;background-size:cover;background-repeat: no-repeat;background-position: center;" :style="{'background-image':`url(${item.imgUrl.split(',')[0] || ''})`}">
                                                <span class="car-status" :class="[carStatusMap[`${item.vehicelStatus}`]['class']]">{{carStatusMap[`${item.vehicelStatus}`]['text']}}</span>
                                            </div>
                                        </div>
                                        <!-- <a-card-meta>
                                            <div style="margin-bottom: 3px" slot="title">{{ item.title }}</div>
                                            <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" />
                                            <div class="meta-content" slot="description">{{ item.content }}</div>
                                        </a-card-meta> -->
                                        <a-card-meta>
                                            <div slot="title">
                                                <div class="flex-row flex-align-c flex-justify-b">
                                                    <span style="font-size: 14px;">{{item.name}}</span>
                                                    <div style="line-height: 0;">
                                                        <a-avatar style="height:16px;width:16px;margin-right:4px;" slot="avatar" :src="item.driverOneImg" />
                                                        <a-avatar style="height:16px;width:16px;" slot="avatar" v-if="item.driverTwoImg" :src="item.driverTwoImg" />
                                                    </div>
                                                </div>
                                            </div>
                                        </a-card-meta>
                                        <p></p>
                                        <a-card-meta>
                                            <div slot="description" style="font-size:12px;">车辆编号：{{item.number}}</div>
                                            <div slot="description" style="font-size:12px;">车辆类型：{{carTypeMap[item.type || '']}}</div>
                                            <!-- <a-avatar style="height:20px;width:36px;" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" /> -->
                                        </a-card-meta>
                                        <p></p>
                                        <a-card-meta>
                                            <div slot="description" class="flex-row">
                                                <div class="driver-type" :class="{'type-1': !isExplosionProof(item), 'type-3': isExplosionProof(item)}">{{driverTypeMap['3']}}</div>
                                                <div class="driver-type type-2">{{driverTypeMap[`${item.tunnelStatus}`]}}</div>
                                            </div>
                                        </a-card-meta>
                                        <!-- <a-card-meta style="position: relative;">
                                            <div slot="description">
                                                <img alt="example" class="cars-review-img" src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" />
                                            </div>
                                        </a-card-meta> -->
                                        <template class="ant-card-actions" slot="actions">
                                            <span @click="showModalData(item)">详情</span>
                                            <a-popover trigger="click" placement="bottom" :overlayStyle="{ width: '300px' }">
                                                <template slot="content">
                                                    <div class="qrcode-content flex-row flex-align-c flex-justify-b" :id="'qrcode-notice' + index" style="width:143px;margin: 0 auto;"></div>
                                                </template>
                                                <span class="header-notice" @click="showQrcode(item, index)">
                                                    二维码
                                                </span>
                                            </a-popover>
                                            <span v-if="isCheckUser && item.vehicelStatus == '1'" @click="showModalData(item)">审批</span>
                                            <a-popconfirm v-if="item.vehicelStatus != '6' && item.vehicelStatus != '4'" title="确定删除吗?" @confirm="() => delOrResClick(item.id)">
                                                <span>删除</span>
                                            </a-popconfirm>
                                        </template>
                                    </a-card>
                                </template>
                            </a-list-item>
                        </a-list>
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- model区 -->
        <div class="opinion-modal">
            <project-cars-modal ref="projectCarsModal" @update="loadData(1)"></project-cars-modal>
        </div>
    </a-card>
</div>
</template>

<script>
// import SysArticleModal from './SysArticleModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate'
import QRCode from 'qrcodejs2';
import * as Constant from '@/utils/constant'
import { getAction, deleteAction } from '@/api/manage'
import ChartCard from '@/components/ChartCard'
import rightHandle from './components/rightHandle'
import projectCarsModal from './modal/projectCarsModal'
export default {
  name: 'projectRows',
  mixins: [JeecgListMixin],
  components: {
    // SysArticleModal,
    rightHandle,
    projectCarsModal,
    ChartCard,
    JDate
  },
  data() {
    return {
      isCheckUser: false,
      scopeData: {

      },
      carTypeMap: {
                "1": "挖掘机",
                "2": "装载机",
                "3": "自卸车（运渣车）",
                "4": "机械臂",
                "5": "罐车"
            },
      cardTypeSelect: [{
          itemText: '全部',
          itemValue: ''
      },{
          itemText: '挖掘机',
          itemValue: '1'
      },{
          itemText: '装载机',
          itemValue: '2'
      },{
          itemText: '自卸车（运渣车）',
          itemValue: '3'
      },{
          itemText: '机械臂',
          itemValue: '4'
      },{
          itemText: '罐车',
          itemValue: '5'
      }],
      tunnelStatusSelest: [
        {
          itemText: '全部',
          itemValue: ''
        },{
            itemText: '洞内',
            itemValue: '1'
        },{
            itemText: '洞外',
            itemValue: '2'
        }
      ],
      vehicelStatusSelest: [
        {
          itemText: '全部',
          itemValue: ''
        },{
            itemText: '审批中',
            itemValue: '1'
        },{
            itemText: '审批驳回',
            itemValue: '2'
        },
        {
            itemText: '蓝牙安装中',
            itemValue: '3'
        },
        {
            itemText: '维护临期',
            itemValue: '4'
        },
        {
            itemText: '维护已过期',
            itemValue: '5'
        },
        {
            itemText: '正常运营',
            itemValue: '6'
        },
      ],
      description: '文章管理页面',
      dealVisible: false,
      viewData: {userName:'1'},
      contentTatol: {
        "normalCount": 0,

"notNormalCount": 0,

"tunnelInCount": 0,

"tunnelOutCount": 0
      },
      driverTypeMap: {
          '1': '洞内',
          '2': '洞外',
          '3': '防爆'
      },
      carStatusMap: {
          '1': {
              text: '审批中',
              class: 'type-1'
          },
          '2': {
              text: '审批驳回',
              class: 'type-4'
          },
          '3': {
              text: '蓝牙安装中',
              class: 'type-2'
          },
          '4': {
              text: '维护临期',
              class: 'type-5'
          },
          '5': {
              text: '维护已过期',
              class: 'type-3'
          },
          '6': {
              text: '正常运营',
              class: 'type-6'
          }
      },
      type: [],
      columns: [{
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
        }],
      recommend: Constant.RECOMMEND,
      effective: Constant.EFFECTIVE,
      url: {
        noCreate: true,
        // list: '/vehicle/list',
        delete: '/system/sysArticle/delete',
        deleteBatch: '/system/sysArticle/deleteBatch',
        exportXlsUrl: 'system/sysArticle/exportXls',
        importExcelUrl: 'system/sysArticle/importExcel'
      },
      routerTunnelStatus: null,
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    isExplosionProof(){
       return (item)=>{
           if(typeof item.explosionProofEnd === 'string'){
               return new Date(item.explosionProofEnd).getTime() < new Date().getTime();
           }
       }
    },
    normalCount(){
        const {normalCount} = this.contentTatol;
        return normalCount || '0';
    },
    notNormalCount(){
        const {notNormalCount} = this.contentTatol;
        return notNormalCount || '0';
    },
    tunnelInCount(){
        const {tunnelInCount} = this.contentTatol;
        return tunnelInCount || '0';
    },
    tunnelOutCount(){
        const {tunnelOutCount} = this.contentTatol;
        return tunnelOutCount || '0';
    }
  },
  created() {
      this.watchQuery();
      this.ipagination.pageSize = 1000;
  },
  mounted(){
      this.isRoleInfo();
  },
  methods: {
    changeTunnelStatus(val){
        this.queryParam.tunnelStatus = val;
        this.$forceUpdate();
    },
    watchQuery(){
        const role = this.$store.getters.role;
        this.isAdmin = role.includes('admin');
        if(!this.isAdmin){
            const { lineId = '' } = this.$store.getters.userInfo;
            this.queryParam.lineId = lineId.split(',')[0];
            console.log(this.queryParam.lineId);
            setInterval(()=>{
                const {query: {tunnelStatus}} = this.$route;
                if(this.routerTunnelStatus !== tunnelStatus && !!tunnelStatus && ['1','2'].includes(tunnelStatus)){
                    this.url.list = '/vehicle/list';
                    this.queryParam.tunnelStatus = tunnelStatus;
                    this.routerTunnelStatus = tunnelStatus;
                    this.loadData(1);
                    console.log(tunnelStatus, this.queryParam.tunnelStatus, 'this.queryParam.tunnelStatus')
                }
            },500);
        }
    },
    isRoleInfo(){
        const role = this.$store.getters.role;
        console.log(role,'isRoleInfo');
        this.isCheckUser = role.includes('jlzj');
        this.$refs.projectCarsModal.isCheckUser = role.includes('jlzj');
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
        console.log(role.includes('admin'), 'this.isAdmin = role.includ')
        if(!this.isAdmin){
            this.url.list = '/vehicle/list';
            this.queryParam.lineId = line.lineId;
        }
        // console.log(this.$route, 'this.$routerthis.$router')
        if(this.isAdmin && this.$route.query.tunnelStatus){
            this.$message.success('您存在多条线路，请手动选择某条线路进行查看。')
        }
    },
    queryStatistical(lineId="", segmentId=""){
        const url = '/line/query_statistical';
        getAction(url, {lineId,segmentId}).then(res => {
           if (res.success) {
               this.contentTatol = res.result;
            }
        });
    },
    delOrResClick(id){
        const url = '/vehicle/delete';
        deleteAction(url, {id}).then(res => {
           if (res.success) {
              this.loadData(1);
            }
        });
    },
    showQrcode(item, index){
        this.$nextTick(()=>{
            setTimeout(()=>{
                const qrcode = document.getElementById('qrcode-notice' + index);
                qrcode.innerHTML = '';
                if(qrcode){
                    this.qrcode = new QRCode('qrcode-notice' + index, {
                        width: 143,
                        height: 143,
                        text: `jd://${item.id}`,
                        colorDark: '#000',
                        colorLight: '#fff'
                    })
                }
            },100)
        })
    },
    showModalData(scopeData){
        this.$refs.projectCarsModal.edit(scopeData);
    },
    rightHandleChange(dataRef){
      console.log(dataRef);
      if(!this.url.list){
        this.url.list = '/vehicle/list';
        this.ipagination.pageSize = 1000;
      }
      if(dataRef.evt === 'delete'){
        console.log(dataRef.evt)
      } else {
        if(dataRef.evt === 'add'){
          const scope = dataRef.scope;
          if(scope.isParent){
            this.queryParam.lineId = scope.id;
            this.queryParam.segmentId = '';
            this.loadData(1);
            this.queryStatistical(scope.id, '');
          }
          if(scope.isSecond){
              this.queryParam.lineId = '';
            this.queryParam.segmentId = scope.id;
            this.loadData(1);
            this.queryStatistical('', scope.id);
          }
          this.scopeData = scope;
        } else {
          if(dataRef.evt === 'edit'){
            console.log(dataRef.scope)
          } else {
            if(dataRef.isParent){
              this.queryParam.lineId = dataRef.id || '';
              this.queryStatistical(dataRef.id);
            }
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~@assets/less/common.less';

.card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
}

/deep/ .ant-list-item {
    .ant-card-body {
        padding: 8px 12px 16px 12px;
    }
}

.car-status {
    display: inline-block;
    box-sizing: border-box;
    font-size: 12px;
    position: absolute;
    top: 12px;
    left: 0;
    height: 28px;
    border-radius: 0 28px 28px 0;
    color: #ffffff;
    padding: 6px 8px 8px 6px;

    &.type-1,
    &.type-2,
    &.type-6 {
        background: #1A90FF;
    }

    &.type-3 {
        background: #FF3F26;
    }

    &.type-4,
    &.type-5 {
        background: #FFA231;
    }
}

.driver-type {
    position: relative;
    font-size: 12px;
    width: 42px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 20px;
    overflow: hidden;

    &+.driver-type {
        margin-left: 4px;
    }

    &.type-1 {
        color: #57B311;
        background: #E5F0DD;
    }

    &.type-2 {
        color: #BE8B13;
        background: #F2ECDF;
    }

    &.type-3 {
        color: #FF3F26;
        background: rgb(255, 237, 236);

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: #FF3F26;
            transform: rotate(25deg) translateY(10px);
        }
    }
}

.green {
    color: #bcc99c;
}

/deep/ .ant-list-empty-text {
    min-height: 400px;
    line-height: 400px;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

.flex-justify-b {
    justify-content: space-between;
}

.flex-align-c {
    align-items: center;
}

.flex-justify-c {
    justify-content: center;
}

.poplog-body {
    padding-right: 16px;
    padding-top: 9px;

    .content-left {
        width: 60%;
        margin-right: 5%;

        .right-user-img-box {
            margin-right: 10px;

            img {
                border-radius: 50%;
            }
        }
    }

    .content-right {
        width: 35%;

        .right-review-img-box {
            margin: 50px 50px 0 0
        }
    }

    .cars-files-box {
        .files-tag {
            border: 1px solid rgb(215, 215, 215);
            margin-right: 10px;
            padding: 0 6px;
        }

        .files-time {
            margin-left: 100px;
        }
    }

    .poplog-item {
        display: flex;
        font-size: 13px;
    }

    .poplog-tit {
        // width: 90px;
        color: rgb(102, 102, 102)
    }

    .poplog-content {
        flex: 1;
    }

    .poplog-img {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .img-item {
            margin: 10px 20px 10px 0;
            height: 65px;
            width: 65px;

            img {
                height: 65px;
                width: 65px;
            }
        }
    }
}

.poplog-label {
    padding: 8px 30px;
    margin-top: 12px;
    margin-bottom: 12px;
    display: inline-block;
    border: 1px dashed #dedede;

}

.max-line {
    background: rgb(231, 231, 231);
    height: 1px;
    width: 100%;
    margin: 14px 0 4px 0;
}

.poplog-label.first {
    margin-top: 0;
}

.ant-card-actions {
    background: #f7f9fa;

    li {
        float: left;
        text-align: center;
        margin: 12px 0;
        color: rgba(0, 0, 0, 0.45);
        width: 50%;

        &:not(:last-child) {
            border-right: 1px solid #e8e8e8;
        }

        a {
            color: rgba(0, 0, 0, .45);
            line-height: 22px;
            display: inline-block;
            width: 100%;

            &:hover {
                color: #1890ff;
            }
        }
    }
}

.new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
}

.meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.cars-user-img {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    margin-right: 6px;
}

.cars-review-img {
    height: 40px;
    width: 40px;
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
