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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="交底人">
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
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否考试">
            <a-select placeholder="请选择" v-decorator="[ 'exam', validatorRules.exam]" @change="handleExamChange">
              <a-select-option value="true">是</a-select-option>
              <a-select-option value="false">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-row>
          <a-col>
            <a-form-item label="内容" :labelCol="{lg: {span: 2}, sm: {span: 2}}" :wrapperCol="{lg: {span: 22}, sm: {span: 22} }">
              <vue-ueditor-wrap placeholder="请输入" v-model="model.content" :config="myConfig" :destroy="true"></vue-ueditor-wrap>
            </a-form-item>
          </a-col>
        </a-row>
        <a-col :span="24" v-if="exam==='true'">
          <a-form-item label="考卷" :labelCol="{lg: {span: 2}, sm: {span: 2}}" :wrapperCol="{lg: {span: 22}, sm: {span: 22} }">
            <a-card>
              <a-row slot="title" v-if="model.page">
                <a-col :span="6" type="flex" align="middle">
                  <a-row style="margin-bottom: 10px">
                    <a-col :span="4">考试标题：</a-col><a-input v-model="model.page.title"></a-input>
                  </a-row>
                  <a-row align="middle">
                    <a-col :span="4">考试简介：</a-col><a-textarea v-model="model.page.introduce"></a-textarea>
                  </a-row>
                </a-col>
                <a-col :span="6" :offset="1" type="flex" align="middle">
                  <a-row style="margin-bottom: 20px" type="flex" >
                    <a-col :span="4">总分：</a-col><a-col :span="4">{{totalScore}} 分</a-col>
                  </a-row>
                  <a-row align="middle" type="flex" >
                    <a-col :span="4">及格分：</a-col><a-input-number v-model="model.page.passScore" ></a-input-number>
                  </a-row>
                </a-col>
              </a-row>
              <a-row>
                <a href="#" @click="handleQuestionBankListModal">题库选题</a>
                <a href="#" :style="{marginLeft: '20px'}" @click="handleQuestionBankModal">新增考题</a>
              </a-row>
              <a-row>
                <a-col v-for="(item, index) in selectionRows" :key="index" :span="24" style="padding: 10px">
                  <a-card>
                    <span slot="title">
                      <a-row>
                        <a-col :span="20">
                          <span class="question-bank-type">
                            {{filterDictText(questionBankTypeDictOptions, item.type)}}
                          </span>
                          {{index+1}}.{{item.question}}（）
                        </a-col>
                        <a-col :span="4">
                          <a-button type="link" style="float: right" @click="handleDelete(item.id, 'question')">删除</a-button>
                        </a-col>
                      </a-row>
                    </span>
                    <a-row :style="{minHeight: '120px'}">
                      <a-col v-if="item.type !== 2">
                        <p v-for="(i, idx) in item.answerList" :key="idx">
                          <span>{{i.naming}}.</span> <span>{{i.answer}}</span>
                        </p>
                      </a-col>
                    </a-row>
                    <a-row>
                      <p>
                        正确答案：
                        <span v-if="item.type !== 2">
                          {{item.answerList | answerListFilter}}
                        </span>
                        <span v-else>
                          {{item.answerList[0].answer}}
                        </span>
                      </p>
                      <p>
                        得分：<a-input-number placeholder="此题得分" v-model="item.score"/>
                      </p>
                    </a-row>
                  </a-card>
                </a-col>
              </a-row>
            </a-card>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
  <questionBankList-modal ref="questionBankListModal" @ok="handleSelectQuestions" :editStatus="true" :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions" :questionBankTypeDictOptions="questionBankTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
  <questionBank-modal ref="questionBankModal" :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions" :questionBankTypeDictOptions="questionBankTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
</a-modal>
</template>

<script>
import QuestionBankModal from "../safetyTesting/QuestionBankModal";
import QuestionBankListModal from '../safetyTesting/QuestionBankListModal';
import JDate from '@/components/jeecg/JDate'
import {
  httpAction,
  getAction
} from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
import {
  filterDictText
} from '@/components/dict/JDictSelectUtil'
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  name: "SafetyTestingStatisticsModal",
  components: {
    VueUeditorWrap,
    QuestionBankListModal,
    QuestionBankModal,
    JDate
  },
  props: {
    questionBankDifficultyDictOptions: {
      type: Array,
      default: []
    },
    questionBankTypeDictOptions: {
      type: Array,
      default: []
    },
    examinationTypeDictOptions: {
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
      exam: 'false',
      monitorList: [],
      clearModal: false,
      title: "操作",
      visible: false,
      uploadLoading: false,

      model: {
        img:'',
        content: '',
        page: {}
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
        passScore: {
          rules: [{
            required: true,
            message: '请输入及格分!'
          }]
        },
        type: {
          rules: [{
            required: true,
            message: '请选择考试类型!'
          }]
        },
        beginTime: {
          rules: [{
            required: true,
            message: '请输入考试开始时间!'
          }]
        },
        introduce: {
          rules: [{
            required: true,
            message: '请输入考试简介!'
          }]
        },
        minStudyTime: {
          rules: [{
            required: true,
            message: '请输入考试时长!'
          }]
        },
        exam: {
          rules: [{
            required: true,
            message: '请选择是否考试!'
          }]
        },
        monitor: {
          rules: [{
            required: true,
            message: '请选择交底人!'
          }]
        }
      },
      url: {
        add: "/bp/safeTechDisclosure",
        edit: "/bp/safeTechDisclosure/edit",
        info: "/bp/safeTechDisclosure/detail"
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
      selectionRows: [],
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "realName"
        },
        {
          title: "标段",
          align: "center",
          dataIndex: "segmentId"
        },
        {
          title: "工种",
          align: "center",
          dataIndex: "workerType"
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      examinationType: null
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
  computed:{
    totalScore() {
      return this.totalScoreFn()
    }
  },
  created(){
    this.handleSearch()
  },
  methods: {
    filterDictText,
    totalScoreFn() {
      let totalScore = 0
      this.selectionRows.forEach(i=>{
        i.score && (totalScore += i.score)
      })
      return totalScore
    },
    handleSelectQuestions(selectionRows) {
      this.selectionRows = selectionRows
    },
    handleQuestionBankModal() {
      this.$refs.questionBankModal.add();
      this.$refs.questionBankModal.title = "新增安全考试";
      this.$refs.questionBankModal.disableSubmit = false;
    },
    handleQuestionBankListModal() {
      if(!this.selectionRows.length) {
        this.$refs.questionBankListModal.add();
      } else {
        console.log(this.selectionRows)
        this.$refs.questionBankListModal.edit({selectionRows: this.selectionRows});
      }
      this.$refs.questionBankListModal.title = "题库选题";
      this.$refs.questionBankListModal.disableSubmit = false;
    },
    add() {
      this.edit({});
    },
    async edit(record) {
      this.form.resetFields();
      if(record.beginTime && record.endTime) {
          var beginTime = moment(record.beginTime);
          var endTime = moment(record.endTime);
          record.minStudyTime = endTime.diff(beginTime, 'minute')
      }
      record.exam && (record.exam = String(record.exam))
      this.exam = record.exam
      if(record.id) {
        const result = await this.getInfo(record.id)
        console.log(result)
        if(result.result.pageDetail) {
          this.selectionRows = result.result.pageDetail.questionAnswers.map(i=>{
            i.answerList =i.options
            i.id = i.questionId
            i.score = i.questionScore
            return i
          })
          let { title, passScore, introduce } = result.result.pageDetail
          record.page = {title, passScore, introduce }
        }
      }
      this.model = Object.assign({page:{}}, record);
      this.visible = true;
      this.$nextTick(() => {
        if(this.model.type) {
          this.model.type = String(this.model.type)
        }
        this.form.setFieldsValue(pick(this.model, 'title', 'workType', 'studyScore','passScore', 'type','beginTime','endTime', 'minStudyTime','monitor', 'exam'))

        if(Object.keys(record).length == 0) {
          this.selectionRows = []
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
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          if(this.selectionRows.length) {
            let examinationItemList = this.selectionRows.map(i => {
              return {
                questionId: i.id,
                score: i.score
              }
            })
            formData.page.examinationItemList = examinationItemList
            formData.page.totalScore = this.totalScore
          }

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
        }
      })
    },
    handleCancel() {
      this.close()
    },
    handleDelete(id, type) {
      if(type=='question') {
        this.selectionRows = this.selectionRows.filter(i=>{return i.id !== id})
      }
    },
    handleExamChange(value,option) {
      console.log(value,option)
      this.exam = value
    },
    async getInfo(id) {
      const result = await getAction(this.url.info, {id: id})
      return result
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
</style>
