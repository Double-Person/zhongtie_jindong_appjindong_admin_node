<template>
<a-modal :maskClosable="false" :title="title" width="90%" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">

  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-row>
        <a-col>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="线路名">
            <h2>{{model.lineName}}</h2>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="班前讲话扫码有效距离">
            <a-input-number placeholder="请输入" v-decorator="['maxScanDistance', validatorRules.maxScanDistance ]" />m
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</a-modal>
</template>

<script>
import {
  httpAction,
  getAction
} from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"

export default {
  name: "LineConfigModal",
  data() {
    return {
      title: "操作",
      visible: false,
      model: {
      },
      labelCol: {
        lg: {
          span: 4
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        lg: {
          span: 20
        },
        sm: {
          span: 20
        }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        maxScanDistance: {
          rules: [{
            required: true,
            message: '请输入!'
          }]
        },
      },
      url: {
        add: "",
        edit: "/bp/lineConfig/config",
      },

    }
  },
  filters: {
    answerListFilter(answerList) {
      let successList = answerList.filter(i => {
        return i.success
      })
      successList = successList.map(i => {
        return i.naming
      })
      return successList.join('')
    }
  },
  methods: {
    add() {
      this.edit({});
    },
    async edit(record) {
      this.model = Object.assign({}, record);
      this.visible = true;
      console.log(this.model)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'maxScanDistance'))
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
            httpurl += this.url.edit;
            method = 'post';
          let formData = Object.assign(this.model, values);
  
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
              that.close();
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        } else {
          this.$message.error('请填写完整')
        }
      })
    },
    handleCancel() {
      this.close()
    },
  }
}
</script>

<style lang="less" scoped>
.question-bank-type {
  background: orange;
  color: #ffffff;
  display: inline-block;
  margin-right: 10px;
  padding: 0 4px;
}
  .avatar-uploader > .ant-upload {
    width:104px;
    height:40px;
    margin-bottom: 0;
  }
</style>
