<template>
<section>
    <a-modal :maskClosable="false" v-model="visible" width="50%" @ok="dealCarsModalOk" @cancel="dealCancel" class="viewModal">
        <!-- 审批中    -->
        <div class="poplog-body">
            <div class="flex-row flex-justify-b">
                <div class="content-left auto flex-row" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-user-img flex-row">
                        <img :src="scopeDataInfo.vehicleVO.driverOneImg || scopeDataInfo.vehicleVO.driverTwoImg">
                    </div>
                    <div class="flex-col" style="margin-left:24px;">
                        <div class="poplog-item">
                            <div class="poplog-title">{{scopeDataInfo.vehicleVO.driverOneName || scopeDataInfo.vehicleVO.driverTwoName}} (<span>1575659815456</span>)</div>
                        </div>
                        <div class="poplog-item">
                            <div class="poplog-tit">车辆名称：</div>
                            <div class="poplog-content">{{scopeDataInfo.vehicleVO.name}}</div>
                        </div>
                        <div class="poplog-item">
                            <div class="poplog-tit">车辆编号：</div>
                            <div class="poplog-content">{{scopeDataInfo.vehicleVO.number}}</div>
                        </div>
                        <div class="poplog-item">
                            <div class="poplog-tit">车辆类型：</div>
                            <div class="poplog-content">{{carTypeMap[scopeDataInfo.vehicleVO.type || '']}}</div>
                        </div>
                        <div class="poplog-item">
                            <div class="poplog-tit">标段：</div>
                            <div class="poplog-content">{{scopeDataInfo.vehicleVO.segmentName}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first" style="margin-top:12px;">他的车辆<div class="driver-type" :class="{'type-1': !isExplosionProof(scopeDataInfo.vehicleVO), 'type-3': isExplosionProof(scopeDataInfo.vehicleVO)}">防爆</div></div>
                    <div class="poplog-item">
                        <div class="poplog-tit">车辆类型：</div>
                        <div class="poplog-content">{{carTypeMap[scopeDataInfo.vehicleVO.type || '']}}</div>
                    </div>
                    <!-- <div class="poplog-item">
                        <div class="poplog-tit">防爆类型：</div>
                        <div class="poplog-content"></div>
                    </div> -->
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="poplog-label">他的驾驶证</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">有效日期：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{scopeDataInfo.vehicleVO.driverOneEnd}}</div>
                    </div>
                    <div class="flex-row">
                        <img width="100%" :src="scopeDataInfo.vehicleVO.driverOneImg">
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</section>
</template>

<script>
import {
    getAction,
    postAction
} from "@/api/manage";
export default {
    name: "projectCarsModal",
    props: {
        queryParam: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    computed: {
        isExplosionProof(){
            return (item)=>{
                if(typeof item.explosionProofEnd === 'string'){
                    return new Date(item.explosionProofEnd).getTime() < new Date().getTime();
                }
            }
        },
        splitType(){
            return (href, hasName)=>{
                if(typeof href === 'string'){
                    const strArr = href.split('/').slice(-1);
                    if(strArr.length > 0){
                        const [filename,filetype] = strArr[0].split('.')
                        if(filetype){
                            if(!hasName){
                                return filetype;
                            } else {
                                return [filename, filetype];
                            }
                        }
                    }
                }
            }
        },
        countnDay(){
            return (days)=>{
                const nowDate = new Date(new Date().toLocaleDateString()).getTime();
                const daysDate = new Date(days).getTime();
                const last = parseInt((daysDate - nowDate) / (3600 * 24 * 1000));
                return {
                    time: last > 0 ? `有效期剩${last}天` : '维护过期',
                    status: last > 0
                };
            }
        }
    },
    data() {
        return {
            carTime: '',
            checkResult: '',
            remark: '',
            carTypeMap: {
                "1": "挖掘机",
                "2": "装载机",
                "3": "自卸车（运渣车）",
                "4": "机械臂",
                "5": "罐车"
            },
            checkResultMap: {
                '1': {
                    class: 'green',
                    text: '合格'
                },
                '2': {
                    class: 'red',
                    text: '不合格'
                },
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
            viewData: {
                userName: "1"
            },
            scopeDataInfo: {
                vehicleVO: {}
            },
            vehiclevoInfo: {

            },
            vehiclevoMap:{
                '1': '进洞',
                '2': '出洞'
            },
            visible: false,
            url: "/vehicle/queryById"
        };
    },
    created() {

    },
    methods: {
        parseTime(time, cFormat) {
            if (arguments.length === 0) {
                return null
            }
            const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
            let date
            if (typeof time === 'object') {
                date = time
            } else {
                if (typeof time === 'string') {
                time = Number(time)
                }
                if (('' + time).length === 10) time = parseInt(time) * 1000
                date = new Date(time)
            }
            const formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
                let value = formatObj[key]
                // Note: getDay() returns 0 on Sunday
                if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
                }
                if (result.length > 0 && value < 10) {
                value = '0' + value
                }
                return value || 0
            })
            return time_str
        },
        formatTime(time, option) {
            time = +time * 1000
            const d = new Date(time)
            const now = Date.now()

            const diff = (now - d) / 1000

            if (diff < 30) {
                return '刚刚'
            } else if (diff < 3600) {
                // less 1 hour
                return Math.ceil(diff / 60) + '分钟前'
            } else if (diff < 3600 * 24) {
                return Math.ceil(diff / 3600) + '小时前'
            } else if (diff < 3600 * 24 * 2) {
                return '1天前'
            }
            if (option) {
                return parseTime(time, option)
            } else {
                return (
                d.getMonth() +
                1 +
                '月' +
                d.getDate() +
                '日' +
                d.getHours() +
                '时' +
                d.getMinutes() +
                '分'
                )
            }
        },
        getQueryObject(url) {
            url = url == null ? window.location.href : url
            const search = url.substring(url.lastIndexOf('?') + 1)
            const obj = {}
            const reg = /([^?&=]+)=([^?&=]*)/g
            search.replace(reg, (rs, $1, $2) => {
                const name = decodeURIComponent($1)
                let val = decodeURIComponent($2)
                val = String(val)
                obj[name] = val
                return rs
            })
            return obj
        },
        openWindow(href){
            window.open(href);
        },
        showCarInfo() {
            const url = 'tunnelLog/list';
            const id = this.scopeDataInfo.vehicleVO.id;
            if (id) {
                this.visible = true;
                getAction(url, {
                    vehicleId:id,
                }).then(res => {
                    if (res.success) {
                        console.log(res.result);
                        this.vehiclevoInfo = res.result;
                        this.visibleInfo = true;
                    }
                });
            }
        },
        dealCarsModalOk() {
            if(this.scopeDataInfo.vehicleVO.vehicelStatus == '1'){
                const url = '/order/blutetooth_result';
                const checkResult = this.checkResult;
                const remark = this.remark;
                if(checkResult){
                    postAction(url, {vehicleId: this.scopeDataInfo.vehicleVO.id,checkResult: this.checkResult, remark: this.remark}).then(res=>{
                        if(res.success){
                           this.$emit('update')
                           this.visible = false;
                           console.log(res, '审核通过'); 
                        }
                    })
                } else {
                    this.$message.error('请选择审核结论');
                }
            }
        },
        dealCancel(){
            this.scopeDataInfo = {vehicleVO: {}};
            this.$emit('cancel')
        },
        handleSelectChange() {},
        show() {
            this.visible = true;
        },
        edit(record) {
            if (record.id) {
                this.visible = true;
                getAction(this.url, {
                    id: record.id
                }).then(res => {
                    if (res.success) {
                        console.log(res.result);
                        this.scopeDataInfo = res.result;
                        this.show();
                    }
                });
            }
        },
        close() {
            this.$emit("close");
            this.visible = false;
        },
        handleSubmit() {},
        handleCancel() {
            this.close();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@assets/less/common.less";

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
        background: #1a90ff;
    }

    &.type-3 {
        background: #ff3f26;
    }

    &.type-4,
    &.type-5 {
        background: #ffa231;
    }
}

.driver-type {
    font-size: 12px;
    width: 42px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 20px;

    &+.driver-type {
        margin-left: 4px;
    }

    &.type-1 {
        color: #57b311;
        background: #e5f0dd;
    }

    &.type-2 {
        color: #be8b13;
        background: #f2ecdf;
    }

    &.type-3 {
        color: #ff3f26;
        background: rgb(255, 237, 236);
    }
}

.green {
    color: #bcc99c;
}

.red {
    color: rgb(252, 13, 27);
}

.warning {
    color: #ffa231;
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

        .poplog-user-img {
            margin-bottom: 12px;
            &,
            & img {
                width: 120px;
                height: 120px;
                border-radius: 120px;
            }
        }

        &.auto {
            width: 100%;
        }

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
            margin: 50px 50px 0 0;
        }
    }

    .cars-files-box {
        .files-tag {
            border: 1px solid rgb(215, 215, 215);
            margin-right: 10px;
            padding: 0 6px;

            span {
                line-height: 1;
            }
        }

        .files-time {
            margin-left: 100px;
        }
    }

    .poplog-item {
        display: flex;
        font-size: 13px;
    }

    .poplog-time-item {
        .poplog-time-content {
            .poplog-time-box {
                padding: 10px;
                box-shadow: 2px 1px 10px #d8d8d8;
                border-radius: 10px;

                .poplog-list {
                    span {
                        font-size: 12px;
                    }

                    p {
                        font-size: 14px;
                        font-weight: 500;
                        color: rgb(253, 103, 33);
                        margin-bottom: 0;

                        &.error {
                            color: rgb(252, 13, 27);
                        }
                    }
                }
            }

            .gap {
                .tip {
                    border-left: 1px solid #ffffff;
                    margin-left: 10px;
                    height: 40px;
                }

                span {
                    font-size: 12px;
                    color: #999;
                }
            }

            &:not(:nth-last-child(1)) {
                .gap {
                    .tip {
                        border-left: 1px solid #b5adad;
                    }
                }
            }

        }
    }
    .poplog-title{
        font-size: 24px;
        color: rgb(102, 102, 102);
        span{
            font-size: 13px;
        }
    }

    .poplog-tit {
        // width: 90px;
        color: rgb(102, 102, 102);
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
            height: 100px;
            width: 200px;

            img {
                height: 100px;
                width: 200px;
            }
        }
    }
}

.poplog-label {
    position: relative;
    padding: 8px 30px;
    margin-top: 12px;
    margin-bottom: 12px;
    display: inline-block;
    border: 1px dashed #dedede;

    .tip {
        position: absolute;
        left: 160%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #333;
        font-size: 14px;
    }
}

.max-line {
    background: rgb(231, 231, 231);
    height: 1px;
    width: 100%;
    margin: 14px 0 4px 0;
}

.poplog-label.first {
    margin-top: 0;
    position: relative;
    .driver-type{
        position: absolute;
        right: -70%;
        top: 100%;
        transform: translate(-50%, -150%);
    }
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
            color: rgba(0, 0, 0, 0.45);
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
