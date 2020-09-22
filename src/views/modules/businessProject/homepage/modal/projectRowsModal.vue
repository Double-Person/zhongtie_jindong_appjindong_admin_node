<template>
<a-modal :maskClosable="false" :title="`${!isRows && !isSegment ? (isPoint ? '工点' : '班组'): !isRows && isSegment ? '标段' : '线路'}信息管理`" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel" cancelText="关闭">
    <a-spin tip="Loading..." :spinning="confirmLoading">
        <!-- isRows:{{isRows}}    ----  isSegment:{{isSegment}} -->
        <a-form :form="form">
            <template v-if="isRows">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="线路名称">
                    <a-input placeholder="请输入线路名称" v-decorator="[ 'name', validatorRules.rowname]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统类型">
                    <a-checkbox-group v-model="settingSysType" :defaultValue="settingSysType">
                        <a-checkbox v-for="(item, key) in $store.getters.sysType" :key="key" :value="item.value">{{ item.label }}</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>
            </template>
            <template v-if="!isRows && isSegment">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标段名称">
                    <a-input placeholder="请输入标段名称" v-decorator="[ 'name', validatorRules.segmentname]" />
                </a-form-item>
                <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="总监">
                    <a-select placeholder="请选择总监" v-decorator="[ 'director']" mode="multiple">
                        <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.id">
                        <span style="display: inline-block;width: 100%" :title=" item.realname ">
                            {{ item.realname }}
                        </span>
                        </a-select-option>
                    </a-select>
                </a-form-item> -->
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="监理单位">
                    <a-input placeholder="请输入监理单位" v-decorator="[ 'supervisorCompany', validatorRules.supervisorCompany]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="里程标识">
                    <a-input placeholder="请输入里程标识" v-decorator="[ 'kmFlag', validatorRules.kmFlag]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始里程">
                    <a-input placeholder="请输入开始里程" v-decorator="[ 'startKm', validatorRules.startKm]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束里程">
                    <a-input placeholder="请输入结束里程" v-decorator="[ 'endKm', validatorRules.endKm]" />
                </a-form-item>
                <a-form-item v-if="scopeData.sysType && typeof scopeData.sysType === 'string' && scopeData.sysType.includes('1')" :labelCol="labelCol" :wrapperCol="wrapperCol" label="售卖机编码">
                    <a-input placeholder="请输入自动售货机编码,多个以英文逗号分隔" v-decorator="[ 'machineCode', validatorRules.machineCode]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="appId">
                    <a-input placeholder="请输入appId" v-decorator="[ 'machineAppId']" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="secret">
                    <a-input placeholder="请输入secret" v-decorator="[ 'machineAppSecret']" />
                </a-form-item>
            </template>
            <template v-if="!isRows && !isSegment && isPoint">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工点名称">
                    <a-input placeholder="请输入工点名称" v-decorator="[ 'name', validatorRules.name]" />
                </a-form-item>
                <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工点类型">
                    <a-input placeholder="请输入工点类型" v-decorator="[ 'name', validatorRules.name]" />
                </a-form-item> -->
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="里程标识">
                    <a-input placeholder="请输入里程标识" v-decorator="[ 'kmFlag', validatorRules.kmFlag]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始里程">
                    <a-input placeholder="请输入开始里程" v-decorator="[ 'startKm', validatorRules.startKm]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束里程">
                    <a-input placeholder="请输入结束里程" v-decorator="[ 'endKm', validatorRules.endKm]" />
                </a-form-item>
            </template>
            <template v-if="!isRows && !isSegment && !isPoint">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="班组名称">
                    <a-input placeholder="请输入班组名称" v-decorator="[ 'name', validatorRules.segmentname]" />
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="班长">
                    <a-select
                      showSearch
                      v-decorator="['monitor', validatorRules.monitor ]"
                      placeholder="请输入"
                      :defaultActiveFirstOption="false"
                      :showArrow="false"
                      :filterOption="false"
                      @search="handleSearch"
                      :notFoundContent="null"
                      @change="handleChange"
                    >
                      <a-select-option v-for="d in monitorList" :key="d.id">{{d.realname}}</a-select-option>
                    </a-select> 
                </a-form-item>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工班长电话">
                    <a-input placeholder="工班长电话" v-model="currentMonitor.phone" disabled />
                </a-form-item>
            </template>
        </a-form>
    </a-spin>
</a-modal>
</template>

<script>
import {
    getAction,
    postAction,
    putAction
} from '@/api/manage'
import pick from 'lodash.pick'
export default {
    name: 'ProjectRowsModal',
    props: {
        isRows: {
            type: Boolean,
            default: false
        },
        isSegment: {
            type: Boolean,
            default: false
        },
        isPoint: {
            type: Boolean,
            default: false
        },
        queryParam: {
            type: Object,
            default: () => {
                return {}
            }
        },
        scopeData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    computed: {

    },
    data() {
        return {
            dictOptions: [{
                label: '监理总监1',
                value: '1'
            },{
                label: '监理总监2',
                value: '2'
            }],
            visible: false,
            model: {},
            settingSysType: [],
            form: this.$form.createForm(this),
            confirmLoading: false,
            validatorRules: {
                name: {
                    rules: [{
                        required: true,
                        message: '请输入工点名称!',
                    }],
                },
                // director: {
                //     rules: [{
                //         required: true,
                //         message: '请选择总监!',
                //     }],
                // },
                supervisorCompany: {
                    rules: [{
                        required: true,
                        message: '请选择监理单位!',
                    }],
                },
                rowname: {
                    rules: [{
                        required: true,
                        message: '请输入线路名称!',
                    }],
                },
                segmentname: {
                    rules: [{
                        required: true,
                        message: '请输入标段名称!',
                    }],
                },
                kmFlag: {
                    rules: [{
                        required: true,
                        message: '请输入里程标识!',
                    }],
                },
                startKm: {
                    rules: [{
                        required: true,
                        message: '请输入开始里程!',
                    }],
                },
                endKm: {
                    rules: [{
                        required: true,
                        message: '请输入结束里程!',
                    }],
                },
                machineCode: {
                    rules: [{
                        required: true,
                        message: '请输入自动售货机编码,多个以英文逗号分隔!',
                    }],
                },
                monitor: {
                    rules: [{
                        required: true,
                        message: '请输入班长!',
                    }],
                }
            },
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 5
                },
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 16
                },
            },
            url: '',
            isEdit: false,
            monitorList: [],
            currentMonitor: {}
        }
    },
    created() {
        this.getDictOptions();
    },
    methods: {
        handleChange(value) {
          console.log(value)
          const monitorList = this.monitorList.filter(i=>{
            return i.id == value
          })
          this.currentMonitor = monitorList[0] || {}
        },
        handleSearch(value) {
          getAction('/sys/user/user_list', {
                realname: value || '',
                roleCode: 'foreman',
                segmentId: this.queryParam.segmentId,
                pointId: this.queryParam.pointId,
                pageSize: 999999
              })
              .then(res => {
                this.monitorList = res.result.records
              })
              .catch(err => {
                console.log(err)
              })
        },
        getDictOptions(){
            const url = '/segment/chief';
            getAction(url).then((res)=>{
                if(res.success){
                    this.dictOptions = res.result;
                }
            })
        },
        show(isRows, isSegment, isPoint) {
            this.visible = true;
            this.form.resetFields();
            if(isRows){
              this.url = '/line/add'
            } else if(isSegment) {
              this.url = '/segment/add'
            } else if(isPoint) {
              this.url = '/point/add'
            } else {
              this.url = '/bp/workTeam/add'
            }
            this.isEdit=false
            console.log(isRows, this.url)
        },
        async edit(record, isRows, isSegment, isPoint) {
            console.log(record, isRows, isSegment, '编辑');
            this.form.resetFields();
            this.model = Object.assign({}, record);
            if (this.model.sysType) {
                this.settingSysType = this.model.sysType.split(',');
            }
            // if (this.model.director) {
            //     this.model.director = this.model.director.split(',');
            // } else {
            //     this.model.director = [];
            // }
            this.isEdit = true;
            // console.log(this.settingSysType)
            this.url = `/${isRows ? 'line' : isSegment ? 'segment' : isPoint ? 'bp/workTeam': 'point' }/edit`;
            this.visible = true;
            this.handleSearch()
            this.currentMonitor.phone = record.monitorPhone
            this.$nextTick(() => {
                this.form.setFieldsValue(pick(this.model, 'name', 'supervisorCompany', 'kmFlag', 'startKm', 'endKm', 'monitor', 'machineCode', 'machineAppSecret', 'machineAppId'));
                // this.form.setFieldsValue({director:[...this.model.director]});
                this.confirmLoading = false;
            });
        },
        close() {
            this.$emit('close');
            this.visible = false;
        },
        handleSubmit() {
            // 触发表单验证
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (this.settingSysType.length === 0 && this.isRows) {
                        this.$message.error('请选择系统类型');
                        return;
                    }
                    // console.log(values)
                    this.confirmLoading = true;
                    let params = Object.assign({
                        segmentId: this.queryParam.segmentId,
                        lineId: this.queryParam.lineId,
                        pointId: this.queryParam.pointId,
                    }, values)
                    // if(values.director && Array.isArray(values.director)){
                    //     params.director = values.director.join(',');
                    // }
                    if (this.url === `/${this.isRows ? 'line' : this.isSegment ? 'segment' : this.scopeData.isPoint? 'bp/workTeam':'point' }/edit`) {
                        params.id = this.model.id;
                    }
                    params.sysType = this.settingSysType.join(',');
                    if (this.queryParam.segmentId || this.isRows || this.isSegment) {
                        console.log(this.isRows, this.isSegment, this.url)
                        if (!this.isEdit) {
                            postAction(this.url, params).then((res) => {
                                this.successCallBack(res);
                            }).finally(() => {
                                this.confirmLoading = false;
                            })
                        } else {
                            putAction(this.url, params).then((res) => {
                                this.successCallBack(res);
                            }).finally(() => {
                                this.confirmLoading = false;
                            })
                        }
                    } else {
                        this.$message.error('参数错误!');
                        this.visible = true;
                    }
                }
            })
        },
        successCallBack(res) {
            if (res.success) {
                this.$message.success(res.message);
                this.handleCancel();
                this.$emit('ok');
                this.$emit('update');
            } else {
                this.$message.warning(res.message);
            }
        },
        handleCancel() {
            this.close()
        }
    }
}
</script>

<style scoped>

</style>
