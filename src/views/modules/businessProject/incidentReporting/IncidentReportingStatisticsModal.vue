<template>
<a-modal :maskClosable="false" :title="title" width="80%" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">

  <a-spin :spinning="confirmLoading">
    <a-row>
        <h3>反馈内容</h3>
        <a-col :span="8">
          工点：{{model.pointName||'-'}}
        </a-col>
        <a-col :span="8">
          反馈人：{{model.userName||'-'}}
        </a-col>
        <a-col :span="8">
          提交时间：{{model.createTime||'-'}}
        </a-col>
    </a-row>
    <a-row :gutter="16" style="margin-top:20px">
      <a-card >
        <p>{{model.introduce}}</p>
        <a-col v-for="(item, index) in model.images.split('|')" :key="index" :span="4" style="margin-bottom: 20px">
          <img :src="item" style="width: 100%;height:200px">
        </a-col>
      </a-card>
    </a-row>
    <a-divider />
    <a-form :form="form">
      <a-row>
        <h3>审核结果</h3>
        <a-col>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" >
            <a-radio-group v-decorator="['status', validatorRules.status ]" @change="statusChange" :disabled="model.status==2">
              <a-radio :value="2">反馈属实</a-radio>
              <a-radio :value="3">无法确认</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖励反馈人">
            <a-col :span="20">
              <a-input-number placeholder="请输入" v-decorator="['changeScore']" style="width:100%" :disabled="model.status==2"/>
            </a-col>
            <a-col :span="4">分</a-col>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-textarea placeholder="请输入" v-decorator="['auditRemark']" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-spin>
</a-modal>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import {
  httpAction
} from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
import JUpload from '@/components/jeecg/JUpload'


export default {
  name: "SafetyLearningStatisticsModal",
  components: {
    VueUeditorWrap,
    JUpload
  },
  data() {
    return {
      base64Img:'',
      uploadLoading: false,
      title: "现场反馈审核",
      visible: false,
      model: {
        images: ''
      },
      labelCol: {
        lg: {
          span: 2
        },
        sm: {
          span: 2
        }
      },
      wrapperCol: {
        lg: {
          span: 12
        },
        sm: {
          span: 12
        }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        status: {
          rules: [{
            required: true,
            message: '请选择状态!'
          }]
        },
        title: {
          rules: [{
            required: true,
            message: '请输入标题!'
          }]
        },
        workType: {
          rules: [{
            required: true,
            message: '请输入工种!'
          }]
        },
        changeScore: {
          rules: [{
            required: true,
            message: '请输入学习积分!'
          }]
        },
        type: {
          rules: [{
            required: true,
            message: '请选择类型!'
          }]
        },
        auditRemark: {
          rules: [{
            required: true,
            message: '请输入至少学习时长!'
          }]
        },
        img: {
          rules: [{
            required: true,
            message: '请上传封面!'
          }]
        }
      },
      url: {
        add: "",
        edit: "/bp/incidentReporting/audit",
      },
      status:''
    }
  },
  methods: {
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      console.log(this.model)
      this.status = this.model.status
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'status', 'changeScore', 'auditRemark'));
      });
    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'post';
          }
          let formData = Object.assign(this.model, values);
          formData.status=this.status;

          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
        } else {
          console.log(err)
          that.$message.warning(err);
          that.confirmLoading = false;

        }
      })
    },
    handleCancel() {
      this.close()
    },
// 上传 bofore
    frontBeforeUpload: function(file) {
      return false
    },
    // 上传 change
    frontHandleChange(info) {
      // console.log(info)
      this.upload(info, 'img')
    },
    // upload
    upload(info, name) {
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(info.file)
      reader.onload = function() {
        that.base64Img = reader.result
        that.base64Img = encodeURI(that.base64Img)
        // encodeURI(URIstring)
        that.axios
          .post('/common/uploadbase64img', {
            folder: 'admin/',
            base64Img: that.base64Img
          })
          .then(res => {
            console.log(res)
            // that.model.img = res.result
            that.$set(that.model, 'img', res.result)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    statusChange(e){
      this.status=e.target.value;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
