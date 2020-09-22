<template>
<a-modal :maskClosable="false" :title="title" width="90%" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">

  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-row>
        <a-col :span="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="考试标题">
            <a-input placeholder="请输入" v-decorator="['title', validatorRules.title ]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学习积分">
            <a-input-number placeholder="请输入" v-decorator="['getScore', validatorRules.getScore ]" style="width:100%" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种">
            <a-select placeholder="请选择" v-decorator="[ 'workType', validatorRules.workType]">
              <a-select-option v-for="(item, index) in workTypeDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="及格分">
            <a-input-number placeholder="请输入" v-decorator="['passScore', validatorRules.passScore ]" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
            <a-select placeholder="请选择" v-decorator="[ 'type', validatorRules.type]" @change="handleExaminationTypeChange">
              <a-select-option v-for="(item, index) in examinationTypeDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="考试开始时间">
            <j-date placeholder="请选择" v-decorator="[ 'beginTime', validatorRules.beginTime]" showTime dateFormat="YYYY-MM-DD HH:mm:ss" style="width:100%"></j-date>
          </a-form-item>

          <a-form-item v-if="examinationType == 2 || examinationType == 3" :labelCol="labelCol" :wrapperCol="wrapperCol" label="考试结束时间">
            <j-date placeholder="请选择" v-decorator="[ 'endTime', validatorRules.beginTime]" showTime dateFormat="YYYY-MM-DD HH:mm:ss" style="width:100%"></j-date>
          </a-form-item>
          <a-form-item v-else :labelCol="labelCol" :wrapperCol="wrapperCol" label="考试时长">
            <a-input-number placeholder="请输入" v-decorator="['duration', validatorRules.duration ]" /> 分钟
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="考试简介">
            <a-textarea placeholder="请输入考试简介" v-decorator="['introduce', validatorRules.introduce ]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="考卷" :labelCol="{lg: {span: 2}, sm: {span: 2}}" :wrapperCol="{lg: {span: 22}, sm: {span: 22} }">
            <a-card :title="`总分 ${totalScore} 分`">
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
        <a-col :span="24" v-show="examinationType != 3" >
          <a-form-item label="考试工人" :labelCol="{lg: {span: 2}, sm: {span: 2}}" :wrapperCol="{lg: {span: 22}, sm: {span: 22} }">
            <a-card>
              <span slot="title">
                <a href="#" @click="handleWorkersListModal">添加工人</a>
              </span>

              <a-table
                :columns="columns"
                :dataSource="selectionRowsWorkers"
              >
                <template slot="action" slot-scope="text, record">
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </a-table>
            </a-card>
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-spin>
  <questionBankList-modal ref="questionBankListModal" @ok="handleSelectQuestions" :editStatus="true" :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions" :questionBankTypeDictOptions="questionBankTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
  <questionBank-modal ref="questionBankModal" :questionBankDifficultyDictOptions="questionBankDifficultyDictOptions" :questionBankTypeDictOptions="questionBankTypeDictOptions" :workTypeDictOptions="workTypeDictOptions" />
  <workersList-modal  ref="workersListModal" @ok="handleSelectWorkers" :editStatus="true"/>
</a-modal>
</template>

<script>
import QuestionBankModal from "./QuestionBankModal";
import QuestionBankListModal from './QuestionBankListModal';
import WorkersListModal from './WorkersListModal';
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
    QuestionBankListModal,
    QuestionBankModal,
    WorkersListModal,
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
      clearModal: false,
      title: "操作",
      visible: false,
      model: {
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
        getScore: {
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
        duration: {
          rules: [{
            required: true,
            message: '请输入考试时长!'
          }]
        },
      },
      url: {
        add: "/bp/examinationPaper/add",
        edit: "/bp/examinationPaper/edit",
        info: "/bp/examinationPaper/info"
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
      selectionRowsWorkers: [],
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "realname",
          customRender: function(text,record,index) {
            return record.realname || record.realName
          }
        },
        {
          title: "标段",
          align: "center",
          dataIndex: "segmentName"
        },
        {
          title: "工种",
          align: "center",
          dataIndex: "workerType",
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.workTypeDictOptions, String(text));
          }
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
    handleSelectWorkers(selectionRows) {
      this.selectionRowsWorkers = selectionRows
    },
    handleQuestionBankModal() {
      this.$refs.questionBankModal.add();
      this.$refs.questionBankModal.title = "新增安全考试";
      this.$refs.questionBankModal.disableSubmit = false;
    },
    handleWorkersListModal() {
      if(!this.selectionRowsWorkers.length) {
        this.$refs.workersListModal.add();
      } else {
        console.log(this.selectionRowsWorkers)
        this.$refs.workersListModal.edit({selectionRows: this.selectionRowsWorkers});
      }
      this.$refs.workersListModal.title = "选择学员";
      this.$refs.workersListModal.disableSubmit = false;
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
          record.duration = endTime.diff(beginTime, 'minute')
      }
      if(record.id) {
        const result = await this.getInfo(record.id)
        console.log(result)
        this.selectionRows = result.result.questionAnswers.map(i=>{
          i.answerList =i.options
          i.id = i.questionId
          i.score = i.questionScore
          return i
        })
        this.selectionRowsWorkers = result.result.userList.map(i=>{
          i.workerType = i.workType
          i.id = i.userId
          return i
        })
        this.handleExaminationTypeChange(record.type)
      }
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        if(this.model.type) {
          this.model.type = String(this.model.type)
        }
        this.form.setFieldsValue(pick(this.model, 'title', 'workType', 'getScore','passScore', 'type','beginTime','endTime', 'duration','introduce'))
        if(Object.keys(record).length == 0) {
          this.selectionRows = []
          this.selectionRowsWorkers = []
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


          let examinationItemList = this.selectionRows.map(i => {
            return {
              questionId: i.id,
              score: i.score
		        }
          })
          let examinationUserList = this.selectionRowsWorkers.map(i => {
            return {
              userId: i.id || i.userId
            }
          })
          formData.examinationItemList = examinationItemList
          formData.examinationUserList = examinationUserList

          formData.totalScore = this.totalScore


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
      this.selectionRowsWorkers = this.selectionRowsWorkers.filter(i=>{return i.id !== id})
    },
    handleExaminationTypeChange(value,option) {
      console.log(value,option)
      this.examinationType = value
    },
    async getInfo(id) {
      const result = await getAction(this.url.info, {pagerId: id})
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
</style>
