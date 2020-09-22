<template>
  <a-modal :maskClosable="false"
    :title="title"
    width="500px"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标段">
          <a-input v-decorator="['segmentName']"  placeholder="请输入" disabled></a-input >
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="积分汇率">
          1元=<a-input-number v-decorator="['oneByScore', validatorRules.oneByScore ]"  placeholder="请输入"></a-input-number >积分
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {filterDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: "QuestionBankModal",
    components: {
    },
    data () {
      return {
        defaultAnswerSelectValue:[],
        defaultAnswerInputValue:'',
        title:"操作",
        visible: false,
        model: {
        },
        labelCol: {lg: {span: 4}, sm: {span: 4}},
        wrapperCol: {lg: {span: 16}, sm: {span: 16}},

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          oneByScore:{rules: [{ required: true, message: '请输入每日最大获取积分!' }]}
        },
        url: {
          edit: "/bp/segmentConfig/config",
        },
        myConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          serverUrl: process.env.VUE_APP_BASE_API + '/system/ueditor/action'
        },
        questionBankTypeName: ''
      }
    },
    methods: {
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'segmentId','segmentName','oneByScore'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            httpurl+=this.url.edit;
            method = 'post';
            let formData = Object.assign(this.model, values);
            
            console.log(formData)
            formData.module ='score_manager'
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
        })
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style lang="less" scoped>
.answerlist-delete{
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    color: red;
}
</style>