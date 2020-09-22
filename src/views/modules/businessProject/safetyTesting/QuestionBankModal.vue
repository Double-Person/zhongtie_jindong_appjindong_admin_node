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
          label="题干">
          <a-textarea placeholder="请输入题干" v-decorator="['question', validatorRules.question ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="题型">
          <a-select placeholder="请选择题型" v-decorator="[ 'type', validatorRules.type]" @change="handleChangeQuestionBankType">
              <a-select-option v-for="(item, index) in questionBankTypeDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="难度">
          <a-select placeholder="请选择难度" v-decorator="[ 'difficulty', validatorRules.difficulty]">
              <a-select-option v-for="(item, index) in questionBankDifficultyDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="工种">
            <a-select placeholder="请选择工种" v-decorator="[ 'workType', validatorRules.workType]">
              <a-select-option v-for="(item, index) in workTypeDictOptions" :value="item.value" :key="index">{{item.text}}</a-select-option>
            </a-select>
        </a-form-item>
        <div v-if="questionBankTypeName !== '简答'">
          <a-form-item
              v-for="(item, index) in model.answerList" :key="index"
              :labelCol="labelCol"
              :wrapperCol="{lg: {span: 16}, sm: {span: 16}}"
              :label="item.naming">
              <a-input v-model="item.answer"/>
              <!-- <a-input v-decorator="[item.naming, validatorRules.answerNaming ]"/> -->
              <a-button type="link" class="answerlist-delete" v-if="index > 1" @click="handleDeleteAnswerList(item.naming)">删除</a-button>
          </a-form-item>
          <a-row style="margin-bottom: 24px;">
              <a-col :offset="4">
                <a-button type="link" icon="plus" @click="handleAddAnswerList">添加选项</a-button>
              </a-col>
          </a-row>
        </div>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="正确答案">
          <div v-if="questionBankTypeName !== '简答'">
            <a-select v-model="defaultAnswerSelectValue" :mode="questionBankTypeName === '多选' ?'multiple':'default'"  placeholder="请选择正确答案" @change="handleSuccessAnswer">
              <a-select-option v-for="(item, index) in model.answerList" :value="item.naming" :key="index">{{item.answer}}</a-select-option>
            </a-select>
          </div>
          <div v-else>
            <a-input v-model="defaultAnswerInputValue" placeholder="请输入"></a-input>
          </div>
        </a-form-item>
        <a-form-item
          v-if="questionBankTypeName == '简答'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="答案提示">
          <a-textarea placeholder="请输入答案提示" v-decorator="['tips', validatorRules.tips ]" />
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
  import {filterDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: "QuestionBankModal",
    components: {
      VueUeditorWrap
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
        workTypeDictOptions: {
          type: Array,
          default: []
        },
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
          edit: "/bp/questionBank/edit",
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
      add () {
        this.edit(
          {
            answerList: [
            {
              naming: "A",
              answer: "",
              success: false
            },
            {
              naming: "B",
              answer: "",
              success: false
            }
          ]
          }
        );
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.handleChangeQuestionBankType(this.model.type)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'question','type','difficulty','workType','type', 'id','answerList', 'tips'))
          let arr = this.model.answerList.filter(i=>{
            return i.success
          })
          this.defaultAnswerSelectValue = arr.map(i=>{return i.naming})
          this.defaultAnswerInputValue = this.model.answerList[0].answer
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
            if(this.defaultAnswerInputValue && this.questionBankTypeName == '简答') {
              this.model.answerList[0].answer = this.defaultAnswerInputValue
              this.model.answerList[0].success = true 
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
          i.success = false
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