<template>
<section>
    <a-modal :maskClosable="false" :visible="visible" width="50%"  @cancel="dealCancel" class="viewModal">
        <!-- 审批中    -->
        <div class="poplog-body" v-if="scopeDataInfo.vehicleVO.vehicelStatus == '1'">
            <div class="flex-row flex-justify-b">
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first">车辆信息</div>
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
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right flex-row">
                    <div class="flex-col right-review-img-box">
                        <div id="qrcode" />
                        
                    </div>
                    <img class="right-qrcode-img" height="95" width="95" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">证明文件</div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.explosionProofImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</span>
                            </div>
                            <!-- explosionProofImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.explosionProofImg)">防爆改装证明.{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.testCertificateImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</span>
                            </div>
                            <!-- testCertificateImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.testCertificateImg)">车辆检验证明.{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div v-for="(item, index) in scopeDataInfo.vehicleVO.certifies" :key="index" class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(item.imgUrl)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(item.imgUrl)}}</span>
                            </div>
                            <!-- otherCertificateImg -->
                            <a-button type="link" @click="openWindow(item.imgUrl)">其他证明.{{splitType(item.imgUrl)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(item.startTime).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(item.endTime).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">司机</div>
                    <div class="flex-row">
                        <div class="flex-col flex-align-c right-user-img-box">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverOneImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverOneName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['time']}}</span>
                        </div>
                        <div class="flex-col flex-align-c right-user-img-box" v-if="scopeDataInfo.vehicleVO.driverTwoImg">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverTwoImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverTwoName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverTwoEnd">{{countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['time']}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class v-if="isCheckUser">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="poplog-label">审批</div>
                    <a-form>
                        <a-form-item label="结论" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                            <a-select v-model="checkResult" placeholder="请选择结论">
                                <a-select-option value="1">合格</a-select-option>
                                <a-select-option value="2">不合格</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="备注" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                            <a-textarea v-model="remark" :autosize="{ minRows: 2, maxRows: 6 }" />
                        </a-form-item>
                    </a-form>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.maintains &&scopeDataInfo.vehicleVO.maintains.length > 0">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b">
                        <div class="poplog-label">车辆维护历史</div>
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">车辆维护日期</span>
                            <a-date-picker placeholder="请选择日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item">
                        <!-- {{filterMaintain(scopeDataInfo.vehicleVO.maintains)}} -->
                        <div class="poplog-time-content" v-for="(maintain, index) in filterMaintain(scopeDataInfo.vehicleVO.maintains)" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护有效期：{{maintain.maintainStart}}-{{maintain.maintainEnd}}</span>
                                    <p v-if="maintain.isFrist" :class="[countnDay(maintain.maintainEnd)['status']? '' : 'error']">{{countnDay(maintain.maintainEnd)['time']}}</p>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护人：{{maintain.maintainUser}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护单位：{{maintain.maintainCompany}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护类型：{{[1,2,3].includes(maintain.certifyType)?'证明维护':'普通维护'}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c">
                                    <span>维护证明：</span>
                                    <div class="flex-col">
                                        <a-button v-for="(img, indexs) in maintain.imgUrl.split(',')" :key="indexs" style="margin-left:-15px;margin-top: -7px;" type="link" @click="openWindow(img)">{{splitType(img, true)[0]}}.{{splitType(img, true)[1]}} <span style="color:rgba(0, 0, 0, 0.65);margin-left:10px;">{{parseTime(new Date(maintain.maintainStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(maintain.maintainEnd).getTime(),'{y}-{m}-{d}')}}</span></a-button>
                                    </div>   
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{maintain.maintainTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 审批驳回 -->
        <div class="poplog-body" v-if="scopeDataInfo.vehicleVO.vehicelStatus == '2'">
            <div class="flex-row flex-justify-b">
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first">车辆信息</div>
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
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right flex-row">
                    <div class="flex-col right-review-img-box">
                        <div id="qrcode"/>
                    </div>
                    <img class="right-qrcode-img" height="95" width="95" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">证明文件</div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.explosionProofImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</span>
                            </div>
                            <!-- explosionProofImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.explosionProofImg)">防爆改装证明.{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.testCertificateImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</span>
                            </div>
                            <!-- testCertificateImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.testCertificateImg)">车辆检验证明.{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div v-for="(item, index) in scopeDataInfo.vehicleVO.certifies" :key="index" class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(item.imgUrl)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(item.imgUrl)}}</span>
                            </div>
                            <!-- otherCertificateImg -->
                            <a-button type="link" @click="openWindow(item.imgUrl)">其他证明.{{splitType(item.imgUrl)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(item.startTime).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(item.endTime).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">司机</div>
                    <div class="flex-row">
                        <div class="flex-col flex-align-c right-user-img-box">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverOneImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverOneName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['time']}}</span>
                        </div>
                        <div class="flex-col flex-align-c right-user-img-box" v-if="scopeDataInfo.vehicleVO.driverTwoImg">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverTwoImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverTwoName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverTwoEnd">{{countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['time']}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">审批</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批人：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkerName">{{scopeDataInfo.checkerName}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">结论：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkResult" :class="[checkResultMap[`${scopeDataInfo.checkResult}`]['class']]">{{checkResultMap[`${scopeDataInfo.checkResult}`]['text']}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">备注：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.remark">{{scopeDataInfo.remark}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批日期：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.createTime">{{scopeDataInfo.createTime}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.maintains &&scopeDataInfo.vehicleVO.maintains.length > 0">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b">
                        <div class="poplog-label">车辆维护历史</div>
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">车辆维护日期</span>
                            <a-date-picker placeholder="请选择日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item">
                        <!-- {{filterMaintain(scopeDataInfo.vehicleVO.maintains)}} -->
                        <div class="poplog-time-content" v-for="(maintain, index) in filterMaintain(scopeDataInfo.vehicleVO.maintains)" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护有效期：{{maintain.maintainStart}}-{{maintain.maintainEnd}}</span>
                                    <p v-if="maintain.isFrist" :class="[countnDay(maintain.maintainEnd)['status']? '' : 'error']">{{countnDay(maintain.maintainEnd)['time']}}</p>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护人：{{maintain.maintainUser}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护单位：{{maintain.maintainCompany}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护类型：{{[1,2,3].includes(maintain.certifyType)?'证明维护':'普通维护'}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c">
                                    <span>维护证明：</span>
                                    <div class="flex-col">
                                        <a-button v-for="(img, indexs) in maintain.imgUrl.split(',')" :key="indexs" style="margin-left:-15px;margin-top: -7px;" type="link" @click="openWindow(img)">{{splitType(img, true)[0]}}.{{splitType(img, true)[1]}} <span style="color:rgba(0, 0, 0, 0.65);margin-left:10px;">{{parseTime(new Date(maintain.maintainStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(maintain.maintainEnd).getTime(),'{y}-{m}-{d}')}}</span></a-button>
                                    </div>   
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{maintain.maintainTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 蓝牙安装中    -->
        <div class="poplog-body" v-if="scopeDataInfo.vehicleVO.vehicelStatus == '3'">
            <div class="flex-row flex-justify-b">
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first">车辆信息</div>
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
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right flex-row">
                    <div class="flex-col right-review-img-box">
                        <div id="qrcode" />
                        
                    </div>
                    <img class="right-qrcode-img" height="95" width="95" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">证明文件</div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.explosionProofImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</span>
                            </div>
                            <!-- explosionProofImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.explosionProofImg)">防爆改装证明.{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.testCertificateImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</span>
                            </div>
                            <!-- testCertificateImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.testCertificateImg)">车辆检验证明.{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div v-for="(item, index) in scopeDataInfo.vehicleVO.certifies" :key="index" class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(item.imgUrl)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(item.imgUrl)}}</span>
                            </div>
                            <!-- otherCertificateImg -->
                            <a-button type="link" @click="openWindow(item.imgUrl)">其他证明.{{splitType(item.imgUrl)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(item.startTime).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(item.endTime).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">司机</div>
                    <div class="flex-row">
                        <div class="flex-col flex-align-c right-user-img-box">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverOneImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverOneName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['time']}}</span>
                        </div>
                        <div class="flex-col flex-align-c right-user-img-box" v-if="scopeDataInfo.vehicleVO.driverTwoImg">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverTwoImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverTwoName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverTwoEnd">{{countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['time']}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">审批</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批人：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkerName">{{scopeDataInfo.checkerName}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">结论：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkResult" :class="[checkResultMap[`${scopeDataInfo.checkResult}`]['class']]">{{checkResultMap[`${scopeDataInfo.checkResult}`]['text']}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">备注：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.remark">{{scopeDataInfo.remark}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批日期：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.createTime">{{scopeDataInfo.createTime}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.maintains &&scopeDataInfo.vehicleVO.maintains.length > 0">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b">
                        <div class="poplog-label">车辆维护历史</div>
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">车辆维护日期</span>
                            <a-date-picker placeholder="请选择日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item">
                        <!-- {{filterMaintain(scopeDataInfo.vehicleVO.maintains)}} -->
                        <div class="poplog-time-content" v-for="(maintain, index) in filterMaintain(scopeDataInfo.vehicleVO.maintains)" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护有效期：{{maintain.maintainStart}}-{{maintain.maintainEnd}}</span>
                                    <p v-if="maintain.isFrist" :class="[countnDay(maintain.maintainEnd)['status']? '' : 'error']">{{countnDay(maintain.maintainEnd)['time']}}</p>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护人：{{maintain.maintainUser}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护单位：{{maintain.maintainCompany}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护类型：{{[1,2,3].includes(maintain.certifyType)?'证明维护':'普通维护'}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c">
                                    <span>维护证明：</span>
                                    <div class="flex-col">
                                        <a-button v-for="(img, indexs) in maintain.imgUrl.split(',')" :key="indexs" style="margin-left:-15px;margin-top: -7px;" type="link" @click="openWindow(img)">{{splitType(img, true)[0]}}.{{splitType(img, true)[1]}} <span style="color:rgba(0, 0, 0, 0.65);margin-left:10px;">{{parseTime(new Date(maintain.maintainStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(maintain.maintainEnd).getTime(),'{y}-{m}-{d}')}}</span></a-button>
                                    </div>   
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{maintain.maintainTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 维护临期    -->
        <div class="poplog-body" v-if="scopeDataInfo.vehicleVO.vehicelStatus == '4'">
            <div class="flex-row flex-justify-b">
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first">车辆信息</div>
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
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right flex-row">
                    <div class="flex-col right-review-img-box">
                        <div id="qrcode" />
                        <a-button type="primary" style="margin-top:10px;" @click="showCarInfo">查看出洞信息</a-button>
                    </div>
                    <img class="right-qrcode-img" height="95" width="95" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="poplog-label">证明文件</div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.explosionProofImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</span>
                            </div>
                            <!-- explosionProofImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.explosionProofImg)">防爆改装证明.{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</a-button>
                        </div>
                        <div class="files-time flex-row flex-align-c flex-justify-b" style="width:100%;"><span>{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}')}}</span>  <span class="red">{{countnDay(parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}'))['time']}}</span></div>
                    </div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.testCertificateImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</span>
                            </div>
                            <!-- testCertificateImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.testCertificateImg)">车辆检验证明.{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</a-button>
                        </div>
                        <div class="files-time flex-row flex-align-c flex-justify-b" style="width:100%;"><span>{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}')}}</span> <span class="red">{{countnDay(parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}'))['time']}}</span></div>
                    </div>
                    <div v-for="(item, index) in scopeDataInfo.vehicleVO.certifies" :key="index" class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(item.imgUrl)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(item.imgUrl)}}</span>
                            </div>
                            <!-- otherCertificateImg -->
                            <a-button type="link" @click="openWindow(item.imgUrl)">其他证明.{{splitType(item.imgUrl)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(item.startTime).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(item.endTime).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">司机</div>
                    <div class="flex-row">
                        <div class="flex-col flex-align-c right-user-img-box">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverOneImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverOneName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['time']}}</span>
                        </div>
                        <div class="flex-col flex-align-c right-user-img-box" v-if="scopeDataInfo.vehicleVO.driverTwoImg">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverTwoImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverTwoName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverTwoEnd">{{countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['time']}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">审批</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批人：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkerName">{{scopeDataInfo.checkerName}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">结论：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkResult" :class="[checkResultMap[`${scopeDataInfo.checkResult}`]['class']]">{{checkResultMap[`${scopeDataInfo.checkResult}`]['text']}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">备注：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.remark">{{scopeDataInfo.remark}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批日期：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.createTime">{{scopeDataInfo.createTime}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.bluetoothImg">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">蓝牙</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">蓝牙编号：</div>
                        <div class="poplog-content" style="color:rgb(27,27,27);" v-if="scopeDataInfo.vehicleVO.bluetoothCode">{{scopeDataInfo.vehicleVO.bluetoothCode}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.bluetoothImg.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.maintains &&scopeDataInfo.vehicleVO.maintains.length > 0">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b">
                        <div class="poplog-label">车辆维护历史</div>
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">车辆维护日期</span>
                            <a-date-picker placeholder="请选择日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item">
                        <!-- {{filterMaintain(scopeDataInfo.vehicleVO.maintains)}} -->
                        <div class="poplog-time-content" v-for="(maintain, index) in filterMaintain(scopeDataInfo.vehicleVO.maintains)" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护有效期：{{maintain.maintainStart}}-{{maintain.maintainEnd}}</span>
                                    <p v-if="maintain.isFrist" :class="[countnDay(maintain.maintainEnd)['status']? '' : 'error']">{{countnDay(maintain.maintainEnd)['time']}}</p>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护人：{{maintain.maintainUser}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护单位：{{maintain.maintainCompany}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护类型：{{[1,2,3].includes(maintain.certifyType)?'证明维护':'普通维护'}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c">
                                    <span>维护证明：</span>
                                    <div class="flex-col">
                                        <a-button v-for="(img, indexs) in maintain.imgUrl.split(',')" :key="indexs" style="margin-left:-15px;margin-top: -7px;" type="link" @click="openWindow(img)">{{splitType(img, true)[0]}}.{{splitType(img, true)[1]}} <span style="color:rgba(0, 0, 0, 0.65);margin-left:10px;">{{parseTime(new Date(maintain.maintainStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(maintain.maintainEnd).getTime(),'{y}-{m}-{d}')}}</span></a-button>
                                    </div>   
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{maintain.maintainTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="poplog-body" v-if="scopeDataInfo.vehicleVO.vehicelStatus == '5'">
            <div class="flex-row flex-justify-b">
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first">车辆信息</div>
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
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right flex-row">
                    <div class="flex-col right-review-img-box">
                        <div id="qrcode" />
                        <!-- <a-button type="link" style="margin-bottom:5px;">下载</a-button> -->
                        <a-button type="primary" style="margin-top:10px;"  @click="showCarInfo">查看出洞信息</a-button>
                    </div>
                    <img class="right-qrcode-img" height="95" width="95" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="poplog-label">证明文件</div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.explosionProofImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</span>
                            </div>
                            <!-- explosionProofImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.explosionProofImg)">防爆改装证明.{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</a-button>
                        </div>
                        <div class="files-time flex-row flex-align-c flex-justify-b" style="width:100%;"><span>{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}')}}</span>  <span class="red">{{countnDay(parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}'))['time']}}</span></div>
                    </div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.testCertificateImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</span>
                            </div>
                            <!-- testCertificateImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.testCertificateImg)">车辆检验证明.{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</a-button>
                        </div>
                        <div class="files-time flex-row flex-align-c flex-justify-b" style="width:100%;"><span>{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}')}}</span> <span class="red">{{countnDay(parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}'))['time']}}</span></div>
                    </div>
                    <div v-for="(item, index) in scopeDataInfo.vehicleVO.certifies" :key="index" class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(item.imgUrl)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(item.imgUrl)}}</span>
                            </div>
                            <!-- otherCertificateImg -->
                            <a-button type="link" @click="openWindow(item.imgUrl)">其他证明.{{splitType(item.imgUrl)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(item.startTime).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(item.endTime).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">司机</div>
                    <div class="flex-row">
                        <div class="flex-col flex-align-c right-user-img-box">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverOneImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverOneName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['time']}}</span>
                        </div>
                        <div class="flex-col flex-align-c right-user-img-box" v-if="scopeDataInfo.vehicleVO.driverTwoImg">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverTwoImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverTwoName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverTwoEnd">{{countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['time']}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">审批</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批人：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkerName">{{scopeDataInfo.checkerName}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">结论：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkResult" :class="[checkResultMap[`${scopeDataInfo.checkResult}`]['class']]">{{checkResultMap[`${scopeDataInfo.checkResult}`]['text']}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">备注：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.remark">{{scopeDataInfo.remark}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批日期：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.createTime">{{scopeDataInfo.createTime}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.bluetoothImg">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">蓝牙</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">蓝牙编号：</div>
                        <div class="poplog-content" style="color:rgb(27,27,27);" v-if="scopeDataInfo.vehicleVO.bluetoothCode">{{scopeDataInfo.vehicleVO.bluetoothCode}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.bluetoothImg.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.maintains &&scopeDataInfo.vehicleVO.maintains.length > 0">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b">
                        <div class="poplog-label">车辆维护历史</div>
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">车辆维护日期</span>
                            <a-date-picker placeholder="请选择日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item">
                        <!-- {{filterMaintain(scopeDataInfo.vehicleVO.maintains)}} -->
                        <div class="poplog-time-content" v-for="(maintain, index) in filterMaintain(scopeDataInfo.vehicleVO.maintains)" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护有效期：{{maintain.maintainStart}}-{{maintain.maintainEnd}}</span>
                                    <p v-if="maintain.isFrist" :class="[countnDay(maintain.maintainEnd)['status']? '' : 'error']">{{countnDay(maintain.maintainEnd)['time']}}</p>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护人：{{maintain.maintainUser}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护单位：{{maintain.maintainCompany}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护类型：{{[1,2,3].includes(maintain.certifyType)?'证明维护':'普通维护'}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c">
                                    <span>维护证明：</span>
                                    <div class="flex-col">
                                        <a-button v-for="(img, indexs) in maintain.imgUrl.split(',')" :key="indexs" style="margin-left:-15px;margin-top: -7px;" type="link" @click="openWindow(img)">{{splitType(img, true)[0]}}.{{splitType(img, true)[1]}} <span style="color:rgba(0, 0, 0, 0.65);margin-left:10px;">{{parseTime(new Date(maintain.maintainStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(maintain.maintainEnd).getTime(),'{y}-{m}-{d}')}}</span></a-button>
                                    </div>   
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{maintain.maintainTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 正常运营 -->
        <div class="poplog-body" v-if="scopeDataInfo.vehicleVO.vehicelStatus == '6'">
            <div class="flex-row flex-justify-b">
                <div class="content-left" v-if="scopeDataInfo.vehicleVO">
                    <div class="poplog-label first">车辆信息</div>
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
                    <div class="poplog-item" v-if="scopeDataInfo.vehicleVO.imgUrl">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.imgUrl.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right flex-row">
                    <div class="flex-col right-review-img-box">
                        <div id="qrcode" />
                        <a-button type="primary" style="margin-top:10px;" @click="showCarInfo">查看出洞信息</a-button>
                    </div>
                    <img class="right-qrcode-img" height="95" width="95" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">证明文件</div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.explosionProofImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</span>
                            </div>
                            <!-- explosionProofImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.explosionProofImg)">防爆改装证明.{{splitType(scopeDataInfo.vehicleVO.explosionProofImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.explosionProofEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(scopeDataInfo.vehicleVO.testCertificateImg)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</span>
                            </div>
                            <!-- testCertificateImg -->
                            <a-button type="link" @click="openWindow(scopeDataInfo.vehicleVO.testCertificateImg)">车辆检验证明.{{splitType(scopeDataInfo.vehicleVO.testCertificateImg)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(scopeDataInfo.vehicleVO.testCertificateEnd).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                    <div v-for="(item, index) in scopeDataInfo.vehicleVO.certifies" :key="index" class="cars-files-box flex-row flex-align-c flex-justify-b" v-if="splitType(item.imgUrl)">
                        <div class="flex-row flex-align-c">
                            <div class="files-tag">
                                <span>{{splitType(item.imgUrl)}}</span>
                            </div>
                            <!-- otherCertificateImg -->
                            <a-button type="link" @click="openWindow(item.imgUrl)">其他证明.{{splitType(item.imgUrl)}}</a-button>
                        </div>
                        <div class="files-time">{{parseTime(new Date(item.startTime).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(item.endTime).getTime(),'{y}-{m}-{d}')}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">司机</div>
                    <div class="flex-row">
                        <div class="flex-col flex-align-c right-user-img-box">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverOneImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverOneName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverOneEnd">{{countnDay(scopeDataInfo.vehicleVO.driverOneEnd)['time']}}</span>
                        </div>
                        <div class="flex-col flex-align-c right-user-img-box" v-if="scopeDataInfo.vehicleVO.driverTwoImg">
                            <img class="right-user-img" height="40" width="40" :src="scopeDataInfo.vehicleVO.driverTwoImg" />
                            <span>{{scopeDataInfo.vehicleVO.driverTwoName}}</span>
                            <span :class="[!countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['status']?'red':'warning']" v-if="scopeDataInfo.vehicleVO.driverTwoEnd">{{countnDay(scopeDataInfo.vehicleVO.driverTwoEnd)['time']}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class>
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">审批</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批人：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkerName">{{scopeDataInfo.checkerName}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">结论：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.checkResult" :class="[checkResultMap[`${scopeDataInfo.checkResult}`]['class']]">{{checkResultMap[`${scopeDataInfo.checkResult}`]['text']}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">备注：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.remark">{{scopeDataInfo.remark}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-tit">审批日期：</div>
                        <div class="poplog-content" v-if="scopeDataInfo.createTime">{{scopeDataInfo.createTime}}</div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.bluetoothImg">
                <div class="max-line"></div>
                <div class="content-left">
                    <div class="poplog-label">蓝牙</div>
                    <div class="poplog-item">
                        <div class="poplog-tit">蓝牙编号：</div>
                        <div class="poplog-content" style="color:rgb(27,27,27);" v-if="scopeDataInfo.vehicleVO.bluetoothCode">{{scopeDataInfo.vehicleVO.bluetoothCode}}</div>
                    </div>
                    <div class="poplog-item">
                        <div class="poplog-content poplog-img">
                            <div class="img-item" v-for="(item, index) in scopeDataInfo.vehicleVO.bluetoothImg.split(',')" :key="index">
                                <img :src="item" :preview="[item]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class v-if="scopeDataInfo.vehicleVO.maintains &&scopeDataInfo.vehicleVO.maintains.length > 0">
                <div class="max-line"></div>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b">
                        <div class="poplog-label">车辆维护历史</div>
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">车辆维护日期</span>
                            <a-date-picker placeholder="请选择日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item">
                        <!-- {{filterMaintain(scopeDataInfo.vehicleVO.maintains)}} -->
                        <div class="poplog-time-content" v-for="(maintain, index) in filterMaintain(scopeDataInfo.vehicleVO.maintains)" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护有效期：{{maintain.maintainStart}}-{{maintain.maintainEnd}}</span>
                                    <p v-if="maintain.isFrist" :class="[countnDay(maintain.maintainEnd)['status']? '' : 'error']">{{countnDay(maintain.maintainEnd)['time']}}</p>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护人：{{maintain.maintainUser}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护单位：{{maintain.maintainCompany}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>维护类型：{{[1,2,3].includes(maintain.certifyType)?'证明维护':'普通维护'}}</span>
                                </div>
                                <div class="poplog-list flex-row flex-align-c">
                                    <span>维护证明：</span>
                                    <div class="flex-col">
                                        <a-button v-for="(img, indexs) in maintain.imgUrl.split(',')" :key="indexs" style="margin-left:-15px;margin-top: -7px;" type="link" @click="openWindow(img)">{{splitType(img, true)[0]}}.{{splitType(img, true)[1]}} <span style="color:rgba(0, 0, 0, 0.65);margin-left:10px;">{{parseTime(new Date(maintain.maintainStart).getTime(),'{y}-{m}-{d}')}}-{{parseTime(new Date(maintain.maintainEnd).getTime(),'{y}-{m}-{d}')}}</span></a-button>
                                    </div>   
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{maintain.maintainTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template slot="footer">
            <a-button @click="dealCancel">返回</a-button>
            <a-button
                v-if="isCheckUser && scopeDataInfo.vehicleVO.vehicelStatus == '1'"
                type="primary"
                @click="dealCarsModalOk">
                确定
            </a-button>
        </template>
    </a-modal>
    <a-modal :maskClosable="false" v-model="visibleInfo" width="50%" @cancel="vehiclevoInfo = {}" class="viewModal">
        <div class="poplog-body">
            <div class>
                <div class="content-left auto">
                    <div class="flex-row flex-align-c flex-justify-b" style="margin:20px 0 20px;">
                        <div class="flex-row flex-align-c">
                            <span style="margin-right:5px;">进出洞日期</span>
                            <a-date-picker placeholder="请选择进出洞日期" />
                        </div>
                    </div>
                    <div class="poplog-time-item" v-if="vehiclevoInfo.records">
                        <div class="poplog-time-content" v-for="(item, index) in vehiclevoInfo.records" :key="index">
                            <div class="poplog-time-box">
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span style="color:rgb(15 127 18);font-size: 16px;font-weight:500;">{{vehiclevoMap[`${item.status}`]}}</span>
                                    <!-- <p class="error">维护已过期</p> -->
                                </div>
                                <div class="poplog-list flex-row flex-align-c flex-justify-b">
                                    <span>工点：{{item.pointName}}</span>
                                </div>
                            </div>
                            <div class="gap flex-row flex-align-c flex-justify-b">
                                <div class="tip"></div>
                                <span>{{item.createTime}}</span>
                            </div>
                        </div>
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
import QRCode from 'qrcodejs2';
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
        filterMaintain(){
            return (maintain) => {
                const filters = [];
                const time = [];
                let hasFrist = false;
                maintain.map(item=>{
                    const { maintainTime, certifyType } = item;
                    if(!!certifyType && time.includes(maintainTime)){
                        const find = time.findIndex(res=>res === maintainTime);
                        const nowImg = filters[find]['imgUrl'];
                        filters[find]['imgUrl'] = `${nowImg},${item.imgUrl}`;
                    } else {
                        const newo = Object.assign({}, item);
                        // console.log(!hasFrist, !certifyType)
                        if(!hasFrist && !newo['certifyType']){
                            newo.isFrist = true;    
                            hasFrist = true;
                        }
                        filters.push(newo);
                        time.push(maintainTime);
                    }
                })
                return filters;
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
            isCheckUser: false,
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
            visibleInfo: false,
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
        createQrCode(code) {
            console.log(code)
            document.getElementById('qrcode').innerHTML = '';
            this.qrcode = new QRCode('qrcode', {
                width: 143,
                height: 143,
                text: `jd://${code}`,
                colorDark: '#000',
                colorLight: '#fff'
            })
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
            this.visible = false;
            this.checkResult = '';
            this.remark = '';
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
                        setTimeout(() => {
                            if (this.scopeDataInfo.vehicleVO && this.scopeDataInfo.vehicleVO.id) {
                                this.createQrCode(this.scopeDataInfo.vehicleVO.id)
                            }
                        }, 100)
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

.right-qrcode-img {
    display: none;
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
.warning{
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
