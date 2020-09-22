<template>
<a-modal :maskClosable="false" :title="title" width="90%" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">

  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-row>
        <a-col :span="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题">
            <a-input placeholder="请输入" v-decorator="['title', validatorRules.title ]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学习积分">
            <a-input-number placeholder="请输入" v-decorator="['studyScore', validatorRules.studyScore ]" style="width:100%" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学习时长">
            <a-input-number placeholder="请输入" v-decorator="['minStudyTime', validatorRules.minStudyTime ]"/> 分钟
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种">
            <a-select placeholder="请选择" v-decorator="[ 'workType', validatorRules.workType]">
              <a-select-option v-for="(item, index) in workTypeDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="封面">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :beforeUpload="frontBeforeUpload"
              @change="frontHandleChange"
            >
              <img v-if="model.img" :src="model.img" style="height:100px;max-width:300px" />
              <div v-else>
                <div class="ant-upload-text">点击上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工班长">
            <a-select
              showSearch
              v-decorator="['monitor', validatorRules.monitor ]"
              placeholder="请输入"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleSearch"
              :notFoundContent="null"
            >
              <a-select-option v-for="d in monitorList" :key="d.id">{{d.realname}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="班前讲话内容" :labelCol="{lg: {span: 2}, sm: {span: 2}}" :wrapperCol="{lg: {span: 22}, sm: {span: 22} }">
            <a-button type="primary" @click="handleQuestionBankListModal">添加</a-button>
            <a-card>
              <a-row>
                <a-col v-for="(item, index) in selectionRows" :key="index" :span="24" style="padding: 10px">
                  <a-card>
                      <a-row>
                        <a-col :span="20">
                          <vue-ueditor-wrap v-model="item.content" :config="myConfig" :destroy="true"></vue-ueditor-wrap>
                        </a-col>
                        <a-col :span="4">
                          <a-button type="link" style="float: right;color:red" @click="handleDelete(item.id)">删除</a-button>
                        </a-col>
                      </a-row>
                  </a-card>
                </a-col>
              </a-row>
            </a-card>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="施工信息" :labelCol="{lg: {span: 2}, sm: {span: 2}}" :wrapperCol="{lg: {span: 22}, sm: {span: 22} }">
            <a-textarea placeholder="请输入" v-decorator="['constructionInfo', validatorRules.introduce ]" />
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-spin>
  <preWorkSpeechContentList-modal ref="PreWorkSpeechContentListModal" @ok="handleSelect" :editStatus="true" :workTypeDictOptions="workTypeDictOptions" />
</a-modal>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import PreWorkSpeechContentListModal from './PreWorkSpeechContentListModal';
import JDate from '@/components/jeecg/JDate'
import {
  httpAction,
  getAction
} from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
// import {
//   JeecgListMixin
// } from "@/mixins/JeecgListMixin";
import {
  filterDictText
} from '@/components/dict/JDictSelectUtil'

export default {
  name: "SafetyTestingStatisticsModal",
  // mixins: [JeecgListMixin],
  components: {
    PreWorkSpeechContentListModal,
    VueUeditorWrap,
    JDate
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
  data() {
    return {
      monitorList:[],
      base64Img:'',
      uploadLoading: false,
      title: "操作",
      visible: false,
      model: {
        img:'',
        content: ''
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
        studyScore: {
          rules: [{
            required: true,
            message: '请输入学习积分!'
          }]
        },
        minStudyTime: {
          rules: [{
            required: true,
            message: '请输入学习时长!'
          }]
        },
        type: {
          rules: [{
            required: true,
            message: '请选择类型!'
          }]
        },
        constructionInfo: {
          rules: [{
            required: true,
            message: '请输入!'
          }]
        },
        monitor: {
          rules: [{
            required: true,
            message: '请输入工班长!'
          }]
        },
      },
      url: {
        add: "/bp/speakClass/add",
        edit: "/bp/speakClass/edit",
        info: "/bp/speakClass/info"
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        serverUrl: process.env.VUE_APP_BASE_API + '/system/ueditor/action',
        readonly: true
      },
      selectionRows: []
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
    filterDictText,
    handleSelect(selectionRows) {
      this.selectionRows = selectionRows
    },
    handleQuestionBankListModal() {
      if(!this.selectionRows.length) {
        this.$refs.PreWorkSpeechContentListModal.add();
      } else {
        this.$refs.PreWorkSpeechContentListModal.edit({selectionRows: this.selectionRows});
      }
      this.$refs.PreWorkSpeechContentListModal.title = "选择班前讲话内容";
      this.$refs.PreWorkSpeechContentListModal.disableSubmit = false;
    },
    add() {
      this.edit({});
    },
    async edit(record) {
      if(record.id) {
        const result = await this.getInfo(record.id)
        this.selectionRows = result.result.contentList.map(i=>{
          i.id =i.refArticleId
          return i
        })
      } else {
        this.selectionRows = []
      }
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.handleSearch()
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'title', 'workType', 'studyScore', 'type', 'minStudyTime','img','constructionInfo','monitorName','monitor'))
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
          if(this.model.delId) {
            delete this.model.id
          }
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);


          let contentList = this.selectionRows.map(i => {
            return {
              refArticleId: i.id
		        }
          })
          if(contentList.length == 0) {
            this.$message.warning('请选择班前讲话内容！')
            this.confirmLoading = false;
            return
          }
          formData.contentList = contentList
          console.log(formData)
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
    handleDelete(id) {
      this.selectionRows = this.selectionRows.filter(i=>{return i.id !== id})
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
    handleSearch(value) {
      // this.form.resetFields();

      getAction('/sys/user/user_list', {
            realname: value || '',
            roleCode: 'foreman',
            dataRole: 3,
            pageSize: 999999
          })
          .then(res => {
            this.monitorList = res.result.records
          })
          .catch(err => {
            console.log(err)
          })
    },
    async getInfo(id) {
      const result = await getAction(this.url.info, {articleId: id})
      return result
    }
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
