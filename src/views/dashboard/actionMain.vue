<template>
  <div class="page-header-index-wide page-header-index-wide-center" >
    <div class="left-sider-integral "  >
      <a-col class="rank-col">
        <a-card :bordered="false" title="积分排行榜" class="wide-center-title">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="4">标段</a-col>
            <a-col :span="20">
              <a-select placeholder="请选择"
              :disabled="dictOptions.length<=1"
                        style="width:100%"
                        @change="dictChange"
                        v-model="segmentId">
                <a-select-option
                  v-for="(item, index) in dictOptions" :key="index"  :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <!-- style="height: 830px;"-->
          <div  class="mescroll" id="mescroll" :style="{height:height-75+'px'}">
            <div class="no-user-data" v-if="rankList.length==0">
              暂无数据
            </div>
            <a-row
              v-else
              v-for="(item, index) in rankList"
              :key="index"
              type="flex"
              justify="space-between"
              align="middle"
              style="margin-top:20px;"
            >
              <a-col :span="2">
                <a class="rank-relative rank-relative-one" v-if="index==0">1</a>
                <a class="rank-relative rank-relative-two" v-else-if="index==1">2</a>
                <a class="rank-relative rank-relative-three" v-else-if="index==2">3</a>
                <a class="rank-relative" v-else>{{index+1}}</a>
              </a-col>
              <a-col :span="4">
                <a-avatar :size="35" icon="user" :src="item.avatar" />
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col class="rank-name">{{item.realname}}</a-col>
                  <a-col>{{item.group}}</a-col>
                </a-row>
              </a-col>
              <a-col :span="7" style="text-align:right; color:#FBA232">
                {{item.totalScore}}
                <a-icon type="pay-circle" theme="filled" />
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </div>
    <div class="right-content">
      <a-row :gutter="16">
        <a-col :span="13">
          <a-row  style="min-width: 558px;">
            <a-col :style="{marginBottom: '20px'}">
              <a-card :bordered="false" title="安全学习" class="wide-center-title">
                <a-row>
                  <ve-histogram
                    ref="registers_creditChart"
                    :data.sync="chartData"
                    height="380px"
                    :settings.sync="chartSettings"
                    :events="tenDepChartEvents"
                  ></ve-histogram>
                </a-row>
              </a-card>
            </a-col>
            <a-col>
              <a-card :bordered="false" title="积分兑换排行榜" class="goods wide-center-title">
                <a-row  :gutter="16" type="flex" :style="{height:height-530+'px'}"  id="mescrollExchange" class="mescroll"
                >
                  <a-col
                    class="goods-exchangeList"
                    v-for="(item, index) in exchangeList"
                    :key="index"
                    :style="{textAlign:'center',margin: '0 5px'}"

                  >
                    <img class="goods-Image" :src="item.goodsImage || publicPath+'logo_home_banner.png'" @error="showDefaultImage"/>
                    <p class="goods-name">{{item.goodsName}}</p>
                    <p class="goods-exchangeNumber">兑换{{item.exchangeNumber}}份</p>
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="11"  style="min-width: 485px;overflow: auto" :style="{height:height+44+'px'}">
          <a-row>
            <a-col :style="{marginBottom: '20px'}">
              <incidentReportingStatisticsList :dashBoard="true" />
            </a-col>
            <a-col>
              <a-card :bordered="false" title="待开展活动" class="wide-center-title">
                <a-table
                  :columns="columns2"
                  :dataSource="dataSource2"
                  style="height: 400px;"
                  :pagination="false"
                >
                  <span slot="action" slot-scope="text, record">
                    <router-link
                      :to="{ name: (record.module == 'safety_examination' ? 'safetytesting':'safetechdisclosurestatistic')+'-detail-@id', params: { id: record.id },query:{dashboard:true}}"
                    >查看详情</router-link>
                  </span>
                </a-table>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import MeScroll  from 'mescroll.js';
  import IncidentReportingStatisticsList from '@/views/modules/businessProject/incidentReporting/IncidentReportingStatisticsList'
  import VeHistogram from 'v-charts/lib/histogram.common'
  import {
    initDictOptions,
    filterDictText
  } from '@/components/dict/JDictSelectUtil'
  import {
    getAction
  } from '@/api/manage'

  export default {
    name: "Analysis",
    components: {
      IncidentReportingStatisticsList,
      VeHistogram
    },
    data() {
      var self = this;
      this.tenDepChartEvents = {
        click: function(e) {
          self.tenDepChartClicked(e);
        }
      }
      return {
        moduleTypeDictOptions: [],
        chartSettings: {
          metrics: ["学习人数", "学习时长", "平均学习时长"],
          showLine: ["平均学习时长"]
        },
        chartData: {
          columns: ["标段", "学习人数", "学习时长", "平均学习时长"],
          rows: []
        },
        columns2: [
          {
            title: "活动",
            align: "center",
            dataIndex: "module",
            customRender: (text, record, index) => {
              //字典值替换通用方法
              return filterDictText(
                this.moduleTypeDictOptions,
                String(text)
              );
            }
          },
          {
            title: "时间",
            align: "center",
            dataIndex: "time"
          },
          {
            title: "人物",
            align: "center",
            dataIndex: "realName"
          },
          {
            title: "操作",
            dataIndex: "action",
            align: "center",
            scopedSlots: {
              customRender: "action"
            }
          }
        ],
        dataSource1: [],
        dataSource2: [],
        dataSource: [],
        center: null,
        rankList: [],
        exchangeList: [],
        loginfo: {},
        visitFields: ["ip", "visit"],
        visitInfo: [],
        dictOptions: [],
        url: [
          "/bp/home/activity/tobe?top=20", // 待开展活动
          /*'/bp/home/score/top', // 积分TOP*/
          "/bp/home/study/segmentStatistics", // 用户学习统计-根据标段
          "/bp/home/study/workeStatistics", // 用户学习统计-根据工种
         /* "/bp/home/goods/exchange/top"*/
        ],

        height: document.documentElement.clientHeight,
        pageIndex: 1,
        pageSize: 30,
        segmentId:'',
        chartRecordsList:[],

        pageIndexExchange:1,
        pageSizeExchange:12,
        workTypeDictOptions: [],
        chartData2: [],
        publicPath: process.env.BASE_URL
      };
    },
    created() {
      this.init();
      this.getScore();
      this.searchType();
      this.searchType()
      this.initDictConfig();
      this.getExchange();
    },
    methods: {
      showDefaultImage(event){
        event.target.src = this.publicPath+'logo_home_banner.png';
      },
      initDictConfig() {
        console.log("--我才是真的方法!--");
        //初始化字典 - 状态
        initDictOptions("module_type").then(res => {
          if (res.success) {
            this.moduleTypeDictOptions = res.result;
          }
        });
        //初始化字典 - 工种
        initDictOptions('work_type').then((res) => {
          if (res.success) {
            this.workTypeDictOptions = res.result;
          }
        });

      },
      tenDepChartClicked(e){
        console.log(e)

        for(let i in this.chartRecordsList){
          if(filterDictText(this.workTypeDictOptions,String(this.chartRecordsList[i].workType))==e.name) {
            this.$router.push({path:'/safetylearning/workers',query: {segmentId:this.flagSegmentId,workType:this.chartRecordsList[i].workType}})
          } else if(this.chartRecordsList[i].segmentName==e.name){
            this.flagSegmentId = this.chartRecordsList[i].segmentId
            getAction('/bp/home/study/workeStatistics',{segmentId: this.chartRecordsList[i].segmentId}).then(
              rs=>{
                if(rs.result.records){
                  this.chartRecordsList=rs.result.records
                this.chartData.rows = rs.result.records.map(i => {
                  i["标段"] = filterDictText(
                        this.workTypeDictOptions,
                        String(i.workType)
                      ); // 工种
                  i["学习人数"] = i.memberCount;
                  i["学习时长"] = i.duration;
                  i["平均学习时长"] = i.duration / i.memberCount;
                  return i;
                });
                } else {
                  this.chartData.rows = []
                }

              }
            )
          }
        }
      },
      // 获取文章类型
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
      dictChange(val){
        this.segmentId=val;
        this.getScore();
        this.mescroll.destroy();
      },
      async init() {
        const requestList = this.url.map(i => {
          return getAction(i);
        });
        const result = await Promise.all(requestList);
        this.dataSource2 = result[0].result.records;
        this.chartRecordsList=result[1].result.records;
        this.chartData.rows = result[1].result.records.map(i => {
          i["标段"] = i.segmentName;
          i["学习人数"] = i.memberCount;
          i["学习时长"] = i.duration;
          i["平均学习时长"] = i.duration / i.memberCount;
          return i;
        });
        
        if (this.$refs.registers_creditChart) {
          this.$refs.registers_creditChart.resize();
        }
      },
      getScore(){
        this.axios.get('/bp/home/score/top',{
          params:{
            pageNo:this.pageIndex,
            pageSize:this.pageSize,
            segmentId:this.segmentId
          }
        }).then(res => {
          this.rankList = res.result.records;

          let htmlContent=`<span class="load-text">加载中</span>`;
          this.mescroll=new MeScroll("mescroll", {
            down:{
              use:false
            },
            up:{
              callback: this.upCallback,
              auto: false,
              page:{
                size:this.pageSize,
                num:1,
              },
              htmlNodata:'<p></p>',
              htmlLoading:'',
              isBounce:false
            }
          })
        })
      },
      upCallback(page){
        console.log('上拉加载')

        let self = this;
        setTimeout(() => {
          self.getListData(page.num, page.size, function(curPageData) {
            if (page.num === 1) {
              self.rankList = [];
            }
            self.rankList = self.rankList.concat(curPageData);
            self.mescroll.endSuccess(curPageData.length);

          },function(){
            self.mescroll.endErr();
          })
        },1000)
      },
      getListData(pageNum, pageSize, successCallback, errorCallback){
        this.axios.get('/bp/home/score/top',{
          params:{
            pageNo:pageNum,
            pageSize:pageSize,
            segmentId:this.segmentId
          }
        }).then(res => {
          let List=res.result.records;
          if(List){
            let listData = [];
            for (let i = 0; i < List.length; i++) {
              console.log(i,List.length)
              if (i === List.length) {
                break;
              }
              listData.push(List[i]);
            }
            successCallback && successCallback(listData);// 成功回调
          }else{
            successCallback && successCallback([]);// 成功回调
          }
        })
      },
      getExchange(){
        this.axios.get('/bp/home/goods/exchange/top',{
          params:{
            pageNo:this.pageIndexExchange,
            pageSize:this.pageSizeExchange,
          }
        }).then(res => {
          this.exchangeList = res.result.records;

          this.mescroll=new MeScroll("mescrollExchange", {
            down:{
              use:false
            },
            up:{
              callback: this.upCallbackExchange,
              auto: false,
              page:{
                size:this.pageSizeExchange,
                num:1,
              },
              htmlNodata:'<p></p>',
              htmlLoading:'',
              isBounce:false
            }
          })
        })
      },
      upCallbackExchange(page){
        console.log('上拉加载')

        let self = this;
        setTimeout(() => {
          self.getListDataExchange(page.num, page.size, function(curPageData) {
            if (page.num === 1) {
              self.exchangeList = [];
            }
            self.exchangeList = self.exchangeList.concat(curPageData);
            self.mescroll.endSuccess(curPageData.length);

          },function(){
            self.mescroll.endErr();
          })
        },1000)
      },
      getListDataExchange(pageNum, pageSize, successCallback, errorCallback){
        this.axios.get('/bp/home/goods/exchange/top',{
          params:{
            pageNo:pageNum,
            pageSize:pageSize,
          }
        }).then(res => {
          let List=res.result.records;
          if(List){
            let listData = [];
            for (let i = 0; i < List.length; i++) {
              console.log(i,List.length)
              if (i === List.length) {
                break;
              }
              listData.push(List[i]);
            }
            successCallback && successCallback(listData);// 成功回调
          }else{
            successCallback && successCallback([]);// 成功回调
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../static/css/mescroll.min.css';

  .page-header-index-wide-center{
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    .left-sider-integral{
      position: absolute;
      min-width: 248px;
      /*overflow-y: scroll;*/
      .rank-name{
        margin-left:10px;
        width:80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .right-content{
      padding-left: 260px;
    }
  }
  .circle-cust {
    position: relative;
    top: 28px;
    left: -100%;
  }

  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }

    p {
      line-height: 42px;
      margin: 0;

      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }

  .rank-col {
    // height: 980px;
    overflow: hidden;
  }

  .goods-name {

    font-size: 14px;
    color: rgba(50, 50, 51, 1);
    margin: 0
  }

  .goods-exchangeNumber {
    font-size: 12px;

    color: rgba(255, 162, 49, 1);
  }

  .goods-exchangeList {
    width: 120px;
  }

  .goods-Image {
    width: 100%;
    height: 120px;
  }
  .rank-relative{
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width:30px;
    height: 30px;
    display: inline-block;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    color:rgba(50,50,51,1);
    &-one{
      background-image: url('../../static/image/rank1.png');
    }
    &-two{
      background-image: url('../../static/image/rank2.png');
    }
    &-three{
      background-image: url('../../static/image/rank3.png');
    }
  }
  .no-user-data{
    text-align: center;
    justify-content:center;//子元素水平居中
    align-items:center;//子元素垂直居中
    display:flex;
    height: inherit;
  }
</style>
<style lang="less">
  // .goods {
  .ant-card-body {
    padding: 16px;
    overflow-y: scroll;

    &::-webkit-scrollbar {

      display: none
    }
  }
  // }
  .wide-center-title{
    .ant-card-head-title{
      font-weight: bold;
    }
  }
  .page-header-index-wide-center{
    .ant-card-head{
      border-bottom:none;
    }
  }
  .mescroll{
    width: auto!important;
    .mescroll-upwarp{
      background: #fff;
      padding: 0;
      min-height:0;
    }
  }
</style>
