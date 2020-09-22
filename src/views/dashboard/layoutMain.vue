<template>
<div class="page-header-index-wide">
    <a-row :gutter="24">
        <a-col :sm="12" :md="12" :xl="12">
            <a-row :gutter="24">
                <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '12px' }">
                    <div class="notice-content flex-row flex-align-c flex-justify-b">
                        <a-icon class="icon" type="notification" />
                        <div class="notice-box">
                            <span ref="notice" :style="{left: `${noticeLeft}%`}" style="color:rgba(26,144,255,1);">{{nativeListMessage}}</span>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :sm="12" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
                    <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 12px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                        <template slot="total-header">
                            <div style="display:flex;flex-direction: column;" @click="$router.replace({'path': '/homepage/projectCars', query: {tunnelStatus: '1'}})">
                                <span style="font-size:60px;height:136px;line-height:136px;color:#1A90FF;cursor: pointer;">{{tunnelInCount}}</span>
                                <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #1A90FF;color: rgb(26, 144, 255);">洞内车辆</span>
                            </div>
                        </template>
                    </chart-card>
                </a-col>
                <a-col :sm="12" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
                    <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 12px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                        <template slot="total-header">
                            <div style="display:flex;flex-direction: column;" @click="$router.replace({'path': '/homepage/projectCars', query: {tunnelStatus: '2'}})">
                                <span style="font-size:60px;height:136px;line-height:136px;color:#1A90FF;cursor: pointer;">{{tunnelOutCount}}</span>
                                <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #1A90FF;color: rgb(26, 144, 255);">洞外车辆</span>
                            </div>
                        </template>
                    </chart-card>
                </a-col>
                <a-col :sm="12" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
                    <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 12px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                        <template slot="total-header">
                            <div style="display:flex;flex-direction: column;">
                                <span style="font-size:60px;height:136px;line-height:136px;color:#29C385;">{{todayInCount}}</span>
                                <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #29C385;color: #29C385;">今日进洞车辆</span>
                            </div>
                        </template>
                    </chart-card>
                </a-col>
                <a-col :sm="12" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
                    <chart-card style="position: relative;" :loading="loading" text :bodyStyle="{padding: '6px 12px 6px'}" :styleObj="{'text-align': 'center'}" :displayObj="{content:false,footer:false}">
                        <template slot="total-header">
                            <div style="display:flex;flex-direction: column;">
                                <span style="font-size:60px;height:136px;line-height:136px;color:#29C385;">{{todayOutCount}}</span>
                                <span style="margin-top:6px;font-size: 14px;line-height: 1;height: 14px;position: absolute;padding-left: 10px;border-left: 3px solid #29C385;color: #29C385;">今日出洞车辆</span>
                            </div>
                        </template>
                    </chart-card>
                </a-col>
            </a-row>
        </a-col>
        <a-col :sm="12" :md="12" :xl="12">
            <a-row :gutter="24">
                <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '12px' }">
                    <div class="charts-card">
                        <p>车辆进出洞</p>
                        <ve-histogram :data.sync="chartData" height="278px" :settings.sync="chartSettings"></ve-histogram>
                    </div>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="5">
            <a-card :bordered="false" title="司机异常提醒">
                <a-table size="small" bordered rowKey="id" :columns="columns1" :dataSource="dataSource1" :scroll="{ y: 240 }">
                    <span slot="action" slot-scope="text, record">
                        <a @click="driverHandle(record)">查看详情</a>
                    </span>
                </a-table>
            </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="10" :style="{marginBottom: '20px'}">
            <a-row>
                <a-col :style="{marginBottom: '20px'}">
                    <a-card :bordered="false" title="待审核蓝牙申请">
                        <a-table size="small" bordered rowKey="id" :columns="columns2" :dataSource="dataSource2" :scroll="{ y: 240 }">
                            <template slot="cardtype" slot-scope="text, record, index">
                                <span>{{carTypeMap[record.type || '']}}</span>
                            </template>
                            <span slot="action" slot-scope="text, record">
                                <a v-if="isCheckUser" @click="showModalData(record)">审核</a>
                            </span>
                        </a-table>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
        <a-col :sm="24" :md="24" :xl="9">
            <a-row>
                <a-col :style="{marginBottom: '20px'}">
                    <a-card :bordered="false" title="车辆维护提醒">
                        <a-table size="small" bordered rowKey="id" :columns="columns3" :dataSource="dataSource3" :scroll="{ y: 240 }">
                            <template slot="statustype" slot-scope="text, record, index">
                                <span style="color:#FFA231;font-size:14px;" v-if="record.type == 2">临期</span>
                                <span style="color:#FF3F26;font-size:14px;" v-if="record.type == 3">已过期</span>
                            </template>
                            <template slot="cardtype" slot-scope="text, record, index">
                                <span>{{record.message}}</span>
                            </template>
                            <span slot="action" slot-scope="text, record">
                                <a @click="showModalData(record)">查看详情</a>
                            </span>
                        </a-table>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <!-- model区 -->
    <div class="opinion-modal">
        <project-cars-modal ref="projectCarsModal"></project-cars-modal>
        <project-driver-modal ref="projectDriverModal"></project-driver-modal>
    </div>
</div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import projectCarsModal from '@/views/modules/businessProject/homepage/modal/projectCarsModal'
import projectDriverModal from '@/views/modules/businessProject/homepage/modal/projectDriverModal'
import {
    getLoginfo,
    getVisitInfo
} from '@/api/api'
import { getAction, postAction } from '@/api/manage'
import { setInterval } from 'timers'

export default {
    name: "Analysis",
    components: {
        ChartCard,
        VeHistogram,
        projectCarsModal,
        projectDriverModal
    },
    computed: {
        nativeListMessage(){
            const nativeList = this.nativeList;
            const result = [];
            if(nativeList.length > 0 && !!nativeList[0]){
                nativeList.map(res=>{
                    const {bluetoothCode,segmentName,pointName,status} = res;
                    result.push(`编号${bluetoothCode}${status === 1 ? '进入': '出洞'}${segmentName}${pointName}`);
                })
            }
            return result.join(' ');
        },
        todayInCount() {
            const {
                todayInCount
            } = this.contentTatol;
            return todayInCount || '0';
        },
        todayOutCount() {
            const {
                todayOutCount
            } = this.contentTatol;
            return todayOutCount || '0';
        },
        tunnelInCount() {
            const {
                tunnelInCount
            } = this.contentTatol;
            return tunnelInCount || '0';
        },
        tunnelOutCount() {
            const {
                tunnelOutCount
            } = this.contentTatol;
            return tunnelOutCount || '0';
        }
    },
    data() {
        this.chartSettings = {
                metrics: ['历史进洞车辆', '历史出洞车辆', '当前在洞车辆'],
                showLine: ['当前在洞车辆']
            }
        return {
            isCheckUser: false,
            carTypeMap: {
                "1": "挖掘机",
                "2": "装载机",
                "3": "自卸车（运渣车）",
                "4": "机械臂",
                "5": "罐车"
            },
            chartData: {
                columns: ['标段', '历史进洞车辆', '历史出洞车辆', '当前在洞车辆'],
                rows: [
                    { '标段': '', '历史进洞车辆': 0, '历史出洞车辆': 0, '当前在洞车辆': 0 }
                ]
            },
            loading: true,
            center: null,
            loginfo: {},
            visitFields: ['ip', 'visit'],
            visitInfo: [],
            dataSource1: [],
            columns1: [
              {
                title: '异常提醒',
                align:"center",
                dataIndex: 'message'
              },
              {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                width:100,
                scopedSlots: { customRender: 'action' },
              }
            ],
            dataSource2: [],
            columns2: [
              {
                title: '编号',
                align:"center",
                width:100,
                dataIndex: 'number'
              },
              {
                title: '车辆类型',
                align:"center",
                width:100,
                scopedSlots: {customRender: "cardtype"}
              },
              {
                title: '申请时间',
                align:"center",
                width:100,
                dataIndex: 'createTime'
              },
              {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                width:100,
                scopedSlots: { customRender: 'action' },
              }
            ],
            dataSource3: [],
            columns3: [
              {
                title: '车辆信息',
                align:"center",
                width:100,
                scopedSlots: {customRender: "cardtype"}
              },
              {
                title: '维护信息',
                align:"center",
                width:100,
                dataIndex: 'title'
              },
              {
                title: '状态',
                align:"center",
                width:100,
                scopedSlots: {customRender: "statustype"}
              },
              {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                width:100,
                scopedSlots: { customRender: 'action' },
              }
            ],
            contentTatol: {
            "todayInCount": 0,
            "todayOutCount": 0,
            "tunnelInCount": 0,
            "tunnelOutCount": 0
            },
            nativeList: [],
            nativeMove: false,
            noticeLeft: 150,
            noticeTimer: null
        }
    },
    created() {
        setTimeout(() => {
            this.loading = !this.loading
        }, 1000)
        // postAction('tunnelLog/add', {status: '1', pointId:'ceb8bcb7ee4a80af262a347669229680',segmentId: "1000", vehicleId: "ae31a784619c468197e016155bd64adf", 'bluetoothCode': '127567'}).then(res=>{
        //     if(res.success){
        //         console.log(res, 'this.getIndexInfo');
        //     }
        // })
        this.initLogInfo();
        this.getBlutetooh();
        this.getCardList();
        this.getDriver();
        this.getNative();
        this.getIndexInfo();
        this.getStatistical();
    },
    mounted(){
        this.isRoleInfo();
    },
    destroyed(){
        this.noticeTimer = null;
    },
    methods: {
        handleClickToggle(){
            this.layoutPage = 'home-two';
        },
        isRoleInfo(){
            const role = this.$store.getters.role;
            this.isCheckUser = role.includes('jlzj');
            this.$refs.projectCarsModal.isCheckUser = role.includes('jlzj');
        },
        getIndexInfo(){
            const url = '/tunnelLog/index_info';
            getAction(url).then(res=>{
                if(res.success){
                    console.log(res, 'this.getIndexInfo')
                    this.contentTatol = res.result;
                }
            })
        },
        getStatistical(){
            const url = '/tunnelLog/segment_statistical';
            getAction(url).then(res=>{
                if(res.success){
                    console.log(res.result, 'this.index_log')
                    const result = res.result;
                    if(result.length > 0){
                        result.map(res=>{
                            const {tunnelInCount,tunnelOutCount,currentTunnelIn,segmentName} = res;
                            res['标段'] = segmentName;
                            res['历史进洞车辆'] = tunnelInCount;
                            res['历史出洞车辆'] = tunnelOutCount;
                            res['当前在洞车辆'] = currentTunnelIn;
                        })
                        this.chartData.rows = result;
                    }
                    // chartData: {
                    //     columns: ['日期', '历史进洞车辆', '历史出洞车辆', '当前在洞车辆'],
                    //     rows: [
                    //         { '日期': '1/1', '历史进洞车辆': 1393, '历史出洞车辆': 1093, '当前在洞车辆': 1000 },
                    //         { '日期': '1/2', '历史进洞车辆': 3530, '历史出洞车辆': 3230, '当前在洞车辆': 120 },
                    //         { '日期': '1/3', '历史进洞车辆': 2923, '历史出洞车辆': 2623, '当前在洞车辆': 0.76 },
                    //         { '日期': '1/4', '历史进洞车辆': 1723, '历史出洞车辆': 1423, '当前在洞车辆': 0.49 },
                    //         { '日期': '1/5', '历史进洞车辆': 3792, '历史出洞车辆': 3492, '当前在洞车辆': 0.323 },
                    //         { '日期': '1/6', '历史进洞车辆': 4593, '历史出洞车辆': 4293, '当前在洞车辆': 0.78 }
                    //     ]
                    // },
                }
            })
        },
        getNative(){
            const url = '/tunnelLog/index_log';
            this.noticeTimer = setInterval(()=>{
                if(!this.nativeMove){
                    this.nativeMove = true;
                    getAction(url).then(res=>{
                        if(res.success){
                            const nativeList = res.result;
                            console.log(!!nativeList[0], 'nativeListnativeListnativeList')
                            if(!!nativeList[0]){
                                // const test = [{bluetoothCode: '123',segmentName: '测试标段',pointName: '测试工点',status: 1}];
                                // console.log(this.$refs.notice.style, 'this.$refs.notice')
                                // console.log(this.getCss(this.$refs.notice.style,'width'))
                                this.animate(this.$refs.notice, -100, 1, 100, this, ()=>{
                                    console.log('align-content-end');
                                    this.nativeList = [];
                                    this.noticeLeft = 150;
                                    this.nativeMove = false;
                                });
                                this.nativeList = nativeList;
                            } else {
                                this.nativeMove = false;
                            }
                        } else {
                            this.nativeMove = false;
                        }
                    })
                }
            }, 20000);
        },
        animate(el, target, step, dtime, _this, calll) {
            /**
             * 参数说明：
             * - el       表示操作的元素对象
             * - target   表示移动的目标距离 单位 %
             * - step     表示步长，即每次移动的距离 单位 px
             * - dtime    表示移动的间隔时间 单位 ms
             */

            // 步长和间隔时间设置了默认值
            step = step || 10;
            dtime = dtime || 30;

            // 判断是否开启定时器，如果有就清除
            if (el.timeId) {
                clearInterval(el.timeId);
                el.timeId = null;
            };

            // 开启一个定时器，并将定时器挂载道当前元素上
            el.timeId = setInterval(()=> {
                /**
                 * 获取盒子移动前的水平方向的位置（当前位置） - 偏移的位置
                 * - 可以使用 el.offsetLeft 获取，但会将外边距也获取到，不精准，不采用
                 * - 这里移动实现方式是改变 left的值，保持统一，还是使用 el.style.left 获取
                 * - 使用 el.style.left 有个弊端是，若元素对象上最初没有 left 属性时，获取返回的是 NAN
                 * - 这种情况只有在第一次会出现，故最开始的时候，还需要判断返回的值，若为 NAN，则重置为 0；如下
                 */
                const noticeLeft = _this.noticeLeft;
                var current = parseInt(noticeLeft);
                current = current ? current : 0;

                // 判断目标距离是否小于当前位置，若小于将 步长 变为 负数，让元素反着移动
                if (current > target) {
                step = -Math.abs(step);
                }

                // 当目标距离与当前位置的差距小于步长时，直接当目标的水平位置设置为目标距离，并清除定时器后跳出函数
                if (Math.abs(current - target) < Math.abs(step)) {
                clearInterval(el.timeId);
                _this.noticeLeft = target;
                calll && calll();
                return;
                }

                // 定时器每执行一次，就让元素移动一个 步长
                _this.noticeLeft = (current * 100 + step *100)/100;
            }, dtime)
        },
        getDriver(){
            const url = '/messageInfo/list';
            const params = {pageNo:'1', pageSize: '10', type: '5'};
            console.log( this.$store.getters)
            getAction(url, params).then(res=>{
                if(res.success){
                    this.dataSource1 = res.result.records;
                    console.log(this.dataSource1, 'this.dataSource1')
                }
            })
        },
        getCardList(){
            const url = '/messageInfo/list';
            const params = {pageNo:'1', pageSize: '10', type: '4'};
            console.log( this.$store.getters)
            getAction(url, params).then(res=>{
                if(res.success){
                    this.dataSource3 = res.result.records;
                }
            })
        },
        getBlutetooh(){
            const url = '/order/blutetooh_list';
            const  params = {state:'1',pageNo: '1'};
            const role = this.$store.getters.role;
            console.log('getBlutetooh', this.$store.getters)
            if(!role.includes('jlzj')){
                const userinfo = this.$store.getters.userInfo;
                params.applicant= userinfo.id || '';
            }
            getAction(url, params).then(res=>{
                if(res.success){
                    this.dataSource2 = res.result.records;
                    console.log(res.result)
                }
            })
        },
        driverHandle(record){
            console.log(record, 'driverHandle')
            this.$refs.projectDriverModal.edit({id: record.vehicleId});
        },
        showModalData(scopeData){
            console.log(scopeData);
            this.isRoleInfo();
            this.$refs.projectCarsModal.edit({id: scopeData.vehicleId});
        },
        initLogInfo() {
            getLoginfo(null).then((res) => {
                if (res.success) {
                    Object.keys(res.result).forEach(key => {
                        res.result[key] = res.result[key] + ""
                    })
                    this.loginfo = res.result;
                }
            })
            getVisitInfo().then(res => {
                if (res.success) {
                    console.log("aaaaaa", res.result)
                    this.visitInfo = res.result;
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
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

.circle-cust {
    position: relative;
    top: 28px;
    left: -100%;
}

.notice-content {
    position: relative;
    height: 40px;
    background: rgba(230, 237, 245, 1);
    padding: 13px 16px 13px 35px;
    overflow: hidden;

    .icon {
        position: absolute;
        top: 50%;
        left: 16px;
        color: #1A90FF;
        transform: translateY(-50%);
    }

    // @keyframes rowup {
    //     0% {
    //         -webkit-transform: translate3d(-100%, 0, 0);
    //         transform: translate3d(-100%, 0, 0);
    //     }

    //     100% {
    //         -webkit-transform: translate3d(-100%, 0, 0);
    //         transform: translate3d(-100%, 0, 0);
    //         display: none;
    //     }
    // }

    .notice-box {
        width: 100%;
        height: 100%;
        line-height: 1;
        overflow: hidden;
        position: relative;
        span {
            display: inline-block;
            position: absolute;
            width: 100%;
            height: 100%;
            // -webkit-animation: 8s rowup linear 1 normal;
            // animation: 8s rowup linear 1 normal;
        }
    }
}

.charts-card {
    padding: 20px 16px;
    background: #ffffff;
    box-sizing: border-box;

    p {
        color: #323233;
        font-size: 20px;
        font-weight: bold;
    }

    .bar-and-line {
        padding: 0 !important;
    }
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
</style>
