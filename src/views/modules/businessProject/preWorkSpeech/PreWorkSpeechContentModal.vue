<template>
  <a-modal :maskClosable="false"
    :title="title"
    width="80%"
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
          label="工种">
            <a-select placeholder="请选择工种" v-decorator="[ 'workType', validatorRules.workType]">
              <a-select-option v-for="(item, index) in workTypeDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
        </a-form-item>
		    <a-form-item
          label="班前讲话内容"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 18}, sm: {span: 24} }"
        >
          <vue-ueditor-wrap v-model="model.content" :config="myConfig" :destroy="true"></vue-ueditor-wrap>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "PreWorkSpeechContentModal",
    components: {
      VueUeditorWrap
    },
    props: {
        articleTypeDictOptions: {
          type: Array,
          default: []
        },
        workTypeDictOptions: {
          type: Array,
          default: []
        },
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {
          content: ''
        },
        labelCol: {lg: {span: 4}, sm: {span: 4}},
        wrapperCol: {lg: {span: 6}, sm: {span: 17}},

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          title:{rules: [{ required: true, message: '请输入标题!' }]},
          workType:{rules: [{ required: true, message: '请输入工种!' }]},
          studyScore:{rules: [{ required: true, message: '请输入学习积分!' }]},
          type:{rules: [{ required: true, message: '请选择类型!' }]},
          minStudyTime:{rules: [{ required: true, message: '请输入至少学习时长!' }]},
        },
        url: {
          add: "/bp/speakClass/config/add",
          edit: "/bp/speakClass/config/edit",
        },
        myConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          serverUrl: process.env.VUE_APP_BASE_API + '/system/ueditor/action'
        }
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'title','workType','studyScore','type','minStudyTime'))
		  //时间格式化
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
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化

            console.log(formData)
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
      },


    }
  }
</script>

<style lang="less" scoped>

</style>