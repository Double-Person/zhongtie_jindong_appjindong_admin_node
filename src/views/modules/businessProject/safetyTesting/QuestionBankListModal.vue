<template>
  <a-modal :maskClosable="false"
    :title="title"
    width="90%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <questionBank ref="questionBank" :editStatus="editStatus" @change="handleChange"/>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {filterDictText} from '@/components/dict/JDictSelectUtil'
  import QuestionBank from './QuestionBank'
  export default {
    name: "QuestionBankModal",
    components: {
      QuestionBank,
    },
    props: {
        editStatus: {
          type: Boolean,
          default: false
        }
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {
        },
        labelCol: {lg: {span: 4}, sm: {span: 4}},
        wrapperCol: {lg: {span: 16}, sm: {span: 16}},

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          question:{rules: [{ required: true, message: '请输入题干!' }]},
          workType:{rules: [{ required: true, message: '请选择工种!' }]},
          difficulty:{rules: [{ required: true, message: '请选择难度!' }]},
          type:{rules: [{ required: true, message: '请选择题型!' }]},
          answerSuccess:{rules: [{ required: true, message: '请输入正确答案!' }]},
          answerNaming:{rules: [{ required: true, message: '请输入选项!' }]},
          tips:{rules: [{ required: true, message: '请输入答案提示!' }]},
        },
        url: {
          add: "/bp/questionBank/add",
          edit: "",
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
        questionBankTypeName: '',
        selectionRows: null,
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
          this.form.setFieldsValue(pick(this.model,'question','type','difficulty','workType','type'))
          if(Object.keys(record).length == 0) {
            this.$refs.questionBank.onClearSelected()
          } else {
            this.$refs.questionBank.onSetSelected(record.selectionRows)
          }
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$emit('ok', this.selectionRows)
        this.close();
      },
      handleCancel () {
        this.close()
      },
      handleChange (selectionRows) {
        this.selectionRows = selectionRows
        this.handleOk()
      },

      handleChangeQuestionBankType (e) {
        this.questionBankTypeName = filterDictText(this.questionBankTypeDictOptions, e);
      },
      handleAddAnswerList (e) {
        let lastCode = this.model.answerList[this.model.answerList.length - 1].naming.charCodeAt()+1
        this.model.answerList.push({
              naming: String.fromCharCode(lastCode),
              answer: "",
              success: false
        })
      },
      handleDeleteAnswerList(naming) {
        let newAnswerList = this.model.answerList.filter(i=>{return i.naming !== naming})
        let namingCode = 'A'.charCodeAt()
        newAnswerList.map(i=>{
          i.naming = String.fromCharCode(namingCode),
          namingCode++
          return i
        })
        this.model.answerList = newAnswerList
        console.log(newAnswerList)
        this.form.setFieldsValue(pick(this.model,'question','type','difficulty','workType','type'))
      },
      handleSuccessAnswer(value) {
        if(this.questionBankTypeName == '简答') {
          this.model.answerList[0].answer = value.data
          this.model.answerList[0].success = true
        } else {
        this.model.answerList = this.model.answerList.map(i=>{
          if(value instanceof Array) {
            if(value.includes(i.naming)) {
              i.success = true
            }
          } else {
            if(i.naming === value) {
              i.success = true
            }
          }
          return i
        })
        }
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
