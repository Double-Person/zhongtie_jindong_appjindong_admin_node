<template>
<a-modal :maskClosable="false" :title="title" width="80%" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-row>
        <a-col>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="model.reward ? '奖励积分' : '扣罚积分'">
            <a-input-number placeholder="请输入" v-decorator="['score']" style="width:100%" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="model.reward ? '奖励原因' : '扣罚原因'">
            <a-textarea placeholder="请输入" v-decorator="['remark']" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</a-modal>
</template>

<script>
import {
  httpAction
} from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"

export default {
  name: "scoreRecordStatisticsModal",
  components: {

  },
  data() {
    return {
      base64Img: '',
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
        score: {
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
        remark: {
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
        edit: "/bp/userScore/reward",
      }
    }
  },
  methods: {
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        // this.form.setFieldsValue(pick(this.model, 'id', 'score', 'remark'))
        if (!this.model.reward) {
          this.url.edit = '/bp/userScore/penalty'
          this.title = '积分扣罚'
        } else {
          this.url.edit = '/bp/userScore/reward'
          this.title = '积分奖励'
        }
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
          delete this.model.http
          let formData = Object.assign(this.model, values);
          const {
            remark,
            score,
            id
          } = formData

          httpAction(httpurl, {
            remark,
            score,
            userId: id
          }, method).then((res) => {
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
        }
      })
    },
    handleCancel() {
      this.close()
    },
    // 上传 bofore
    frontBeforeUpload: function (file) {
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
      reader.onload = function () {
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
  }
}
</script>

<style lang="less" scoped>

</style>
