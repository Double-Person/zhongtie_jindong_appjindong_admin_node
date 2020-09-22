<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>

    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户账号" v-decorator="[ 'username', validatorRules.username]" :readOnly="!!model.id"/>
        </a-form-item>

        <!-- <template v-if="model.id">
          <a-form-item label="登陆密码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input type="password" placeholder="请输入登陆密码" v-decorator="[ 'password', validatorRules.password]" />
          </a-form-item>

          <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input type="password" @blur="handleConfirmBlur" placeholder="请重新输入登陆密码" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
          </a-form-item>
        </template> -->

        <!--线路分配-->
        <a-form-item label="线路分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">
          <!-- {{checkedDepartKeys}} -->
          <a-input-search
            placeholder="点击右侧按钮选择线路"
            v-decorator="[ 'checkedDepartNameString', validatorRules.checkedDepartNameRules]"
            disabled
            @search="onSearch">
            <a-button slot="enterButton" icon="search">选择</a-button>
          </a-input-search>
          <!--class="checkedDepartName-class"-->
        <!--  <a-input   v-decorator="[ 'checkedDepartNameString', validatorRules.checkedDepartNameString]" />-->
        </a-form-item>

         <a-form-item label="角色分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!roleDisabled" >
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择用户角色"
            v-model="selectedRole">
            <a-select-option v-for="(role,roleindex) in roleList" :key="roleindex.toString()" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :beforeUpload="frontBeforeUpload"
            :showUploadList="false"
            :action="uploadAction"
            :data="{'isup':1}"
            :headers="headers"
            @change="handleChange"
          >
            <img v-if="picUrl" :src="picUrl" alt="头像" style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 100%"
            placeholder="请选择生日"
            v-decorator="['birthday', {initialValue:!model.birthday?null:moment(model.birthday,dateFormat)}]"/>
        </a-form-item>

        <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入邮箱" v-decorator="[ 'email', validatorRules.email]" />
        </a-form-item>

        <!-- <a-form-item label="工作流引擎" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag  v-decorator="['activitiSync', {}]" placeholder="请选择是否同步工作流引擎" :type="'radio'" :triggerChange="true" dictCode="activiti_sync"/>
        </a-form-item> -->

        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="请输入用户名称" v-decorator="[ 'realname', validatorRules.realname]" />
        </a-form-item>

        <!-- <a-form-item label="标段" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-select v-decorator="[ 'segmentId', {}]" placeholder="请选择标段">
            <a-select-option v-for="(item, index) in projectRowsSource" :key="index" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="工点" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-select v-decorator="[ 'pointId', {}]" placeholder="请选择工点">
            <a-select-option v-for="(item, index) in projectTipsSource" :key="index" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item> -->

        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'sex', {}]" placeholder="请选择性别">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入手机号码" :disabled="isDisabledAuth('user:form:phone')" v-decorator="[ 'phone', validatorRules.phone]" />
        </a-form-item>

        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入地址"  v-decorator="[ 'address']" />
        </a-form-item>

        <a-form-item label="身份证号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入身份证号码"  v-decorator="[ 'idNumber', validatorRules.idnumber]" />
        </a-form-item>

        <a-form-item label="民族" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'nation']" placeholder="请选择民族">
            <a-select-option v-for="(item, index) in nationList" :key="index" :value="`${index}`">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="工种" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'workerType']" placeholder="请选择工种">
            <a-select-option v-for="(item, index) in workTypeDictOptions" :key="index" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="紧急联系人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入紧急联系人姓名"  v-decorator="[ 'emergencyContact']" />
        </a-form-item>

        <a-form-item label="紧急联系人手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入紧急联系人手机号"  v-decorator="[ 'emergencyContactTel']" />
        </a-form-item>

        <a-form-item label="紧急联系人关系" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'emergencyContactRelationship']" placeholder="请选择紧急联系人关系">
            <a-select-option value="1">母亲</a-select-option>
            <a-select-option value="2">父亲</a-select-option>
            <a-select-option value="3">哥哥</a-select-option>
            <a-select-option value="4">姐姐</a-select-option>
            <a-select-option value="5">弟弟</a-select-option>
            <a-select-option value="6">妹妹</a-select-option>
            <a-select-option value="7">亲戚</a-select-option>
            <a-select-option value="8">朋友</a-select-option>
            <a-select-option value="9">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="驾驶证有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if=" hasDriver">
          <a-range-picker
            style="width: 100%"
            :value="pickerValue"
            @change="handlePickerDate" />
        </a-form-item>

        <a-form-item label="驾驶证" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="hasDriver">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{'isup':1}"
            :headers="headers"
            :beforeUpload="frontBeforeUpload"
            @change="handleDriveChange"
          >
            <img v-if="picDriveUrl" :src="picDriveUrl" alt="头像" style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="uploadDriveLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import Vue from 'vue'
  // 引入搜索部门弹出框的组件
  import departWindow from './DepartWindow'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getAction } from '@/api/manage'
  import {addUser,editUser,queryUserRole,queryall } from '@/api/api'
  import { disabledAuthFilter } from "@/utils/authFilter"
  import {duplicateCheck } from '@/api/api'
  import {
    initDictOptions,
    filterDictText
  } from '@/components/dict/JDictSelectUtil'

  export default {
    name: "RoleModal",
    components: {
      departWindow,
    },
    data () {
      return {
        pickerValue: [],
        nationList:['汉族','满族','蒙古族','回族','藏族','维吾尔族','苗族','彝族','壮族','布依族','侗族','瑶族','白族','土家族','哈尼族','哈萨克族','傣族','黎族','傈僳(音：素)族','佤族','畲族','高山族','拉祜(音：护)族','水族','东乡族','纳西族','景颇族','柯尔克孜族','土族','达斡(音：握)尔族','仫(音：目)佬族','羌族','布朗族','撒拉族','毛南族','仡佬族','锡伯族','阿昌族','普米族','朝鲜族','塔吉克族','怒族','乌孜别克族','俄罗斯族','鄂温克族','德昂族','保安族','裕固族','京族','塔塔尔族','独龙族','鄂伦春族','赫哲族','门巴族','珞巴族','基诺族'],
        departDisabled: false, //是否是我的部门调用该页面
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth:800,
        drawerWidth:700,
        modaltoggleFlag:true,
        confirmDirty: false,
        projectRowsSource: [], // 保存标段信息
        projectTipsSource: [], // 保存工点信息
        selectedDepartKeys:[], //保存用户选择部门id
        checkedDepartKeys:[],
        checkedDepartNames:[], // 保存部门的名称 =>title
        checkedDepartNameString:"", // 保存部门的名称 =>title
        userId:"", //保存用户id
        disableSubmit:false,
        userDepartModel:{userId:'',departIdList:[]}, // 保存SysUserDepart的用户部门中间表数据需要的对象
        dateFormat:"YYYY-MM-DD",
        validatorRules:{
          username:{
            rules: [{
              required: true, message: '请输入用户账号!'
            },{
              validator: this.validateUsername,
            }]
          },
          password:{
            rules: [{
              required: true,
              pattern:/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
              message: '密码由8位数字,大小写字母和特殊符号组成!'
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword:{
            rules: [{
              required: true, message: '请重新输入登陆密码!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          },
          realname:{rules: [{ required: true, message: '请输入用户名称!' }]},
          phone:{rules: [{required: true, validator: this.validatePhone}]},
          idnumber: {rules: [{validator: this.validateIdNumber}]},
          email:{
            rules: [{
              validator: this.validateEmail
            }],
          },
          roles:{},
          //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
          checkedDepartNameRules:{rules: [{ required: true, message: '请选择线路分配!' }]},
        },
        title:"操作",
        visible: false,
        model: {},
        roleList:[],
        selectedRole:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        uploadLoading:false,
        uploadDriveLoading: false,
        confirmLoading: false,
        headers:{},
        form:this.$form.createForm(this),
        picUrl: "",
        picDriveUrl: "",
        url: {
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
          userWithDepart: "/line/data_byId", // 引入为指定用户查看部门信息需要的url
          userId:"/sys/user/generateUserId", // 引入生成添加用户情况下的url
          syncUserByUserName:"/process/extActProcess/doSyncUserByUserName",//同步用户到工作流
        },
        workTypeDictOptions: []
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
      // console.log(this.$form.createForm(this))
      // getAction('/segment/list', {pageSize: 1000}).then(res=>{
      //   if (res.success) {
      //     this.projectRowsSource = res.result.records;
      //   }
      //   if(res.code===510){
      //     this.$message.warning(res.message)
      //   }
      // })
      // getAction('/point/list', {pageSize: 1000}).then(res=>{
      //   if (res.success) {
      //     this.projectTipsSource = res.result.records;
      //   }
      //   if(res.code===510){
      //     this.$message.warning(res.message)
      //   }
      // })
      this.initDictConfig()
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      },
      isDriver(){
        const driver = this.roleList.filter(item=>item.roleCode === "driver")
        if(driver.length > 0){
          return driver[0]['id'];
        }
      },
      hasDriver(){
        return this.selectedRole.includes(this.isDriver);
      }
    },
    methods: {
      initDictConfig() {
        //初始化字典 - 工种
        initDictOptions('work_type').then((res) => {
          if (res.success) {
            this.workTypeDictOptions = res.result;
          }
        });
      },
      filterOption(input, option){
        console.log(input, option.props)
        // option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      handlePickerDate(value, mode){
        this.pickerValue = value
        this.model.driveLicenseStart = value[0];
        this.model.driveLicenseEnd = value[1];
        console.log(this.pickerValue, this.model)
      },
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      //窗口最大化切换
      toggleScreen(){
        if(this.modaltoggleFlag){
          this.modalWidth = window.innerWidth;
        }else{
          this.modalWidth = 800;
        }
        this.modaltoggleFlag = !this.modaltoggleFlag;
      },
      initialRoleList(sysType){
        console.log(this.sysType, 'this.sysType')
        const params = {};
        if(sysType){
          params.sysType = sysType;
        }
        queryall(params).then((res)=>{
          if(res.success){
            this.roleList = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      changeRoleQueryall(selected){
        this.selectedRole = []
        if(selected.length > 0){
          console.log(selected, '2!!!');
          selected.some((item)=>{
            if(item.sysType){
              this.initialRoleList(item.sysType)
              return true;
            }
          })
        }
      },
      loadUserRoles(userid){
        queryUserRole({userid:userid}).then((res)=>{
          if(res.success){
            this.selectedRole = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      refresh () {
          this.selectedDepartKeys=[];
          this.checkedDepartKeys=[];
          this.checkedDepartNames=[];
          this.checkedDepartNameString = "";
          this.userId=""
      },
      add () {
        this.picUrl = "";
        this.picDriveUrl = "";
        this.refresh();
        this.edit({activitiSync:'1'});
        this.roleList = [];
      },
      edit (record) {
        console.log(record, 'record')
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        let that = this;
        that.checkedDepartNameString = "";
        that.form.resetFields();
        if(record.hasOwnProperty("id")){
          that.picUrl = "";
          that.picDriveUrl = "";
        }
        that.nationValue = record.nation;
        that.picUrl = record.avatar || '';
        that.picDriveUrl = record.driveLicenseImg || '';
        if(record.driveLicenseStart && record.driveLicenseEnd){
          that.pickerValue = [moment(record.driveLicenseStart), moment(record.driveLicenseEnd)];
        }
        // console.log()
        that.userId = record.id;
        that.visible = true;
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model,'username','sex', 'nation','workerType', 'lineId', 'segmentId', 'pointId', 'address', 'idNumber', 'emergencyContact', 'emergencyContactTel', 'emergencyContactRelationship', 'realname','email','phone','activitiSync'))
        });
        // 调用查询用户对应的部门信息的方法
        that.checkedDepartKeys = [];
        that.loadCheckedDeparts(record);
      },
      //
      loadCheckedDeparts(record){
        let that = this;
        if(!that.userId){return}
        getAction(that.url.userWithDepart,{userId:that.userId, lineId: record.lineId || '',segmentId: record.segmentId || '',pointId: record.pointId || ''}).then((res)=>{
          // that.checkedDepartNames = [];
          if(res.success){
            for (let i = 0; i < res.result.length; i++) {
              that.checkedDepartNames.push(res.result[i].title);
              this.checkedDepartNameString = this.checkedDepartNames.join(",");
              this.model.checkedDepartNameString = this.checkedDepartNameString
              this.form.setFieldsValue(pick(this.model,'username','sex', 'nation','workerType', 'lineId', 'segmentId', 'pointId', 'address', 'idNumber', 'emergencyContact', 'emergencyContactTel', 'emergencyContactRelationship', 'realname','email','phone','activitiSync', 'checkedDepartNameString'))
              that.checkedDepartKeys.push(res.result[i]);
            }
            that.userDepartModel.departIdList = that.checkedDepartKeys;
            if(!!record.id){
              console.log(this.checkedDepartKeys, 'this.checkedDepartKeys')
              this.changeRoleQueryall(this.checkedDepartKeys);
              this.loadUserRoles(record.id);
            }
          } else{
            console.log(res.message);
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
        this.userDepartModel = {userId:'',departIdList:[]};
        this.checkedDepartNames = [];
        this.checkedDepartNameString='';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
      },
      moment,
      handleSubmit () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log('let formData =', Object.assign(this.model, values))
          if (!err) {
            let driveLicenseImg = that.model.driveLicenseImg;
            let driveLicenseStart = that.model.driveLicenseStart;
            let driveLicenseEnd = that.model.driveLicenseEnd;
            if(this.hasDriver){
              if(!driveLicenseImg){
                 console.log(driveLicenseImg)
                this.$message.error('请上传驾驶证图片');
                return ;
              }

              if(!driveLicenseStart || !driveLicenseEnd){
               this.$message.error('请选择驾驶证有效期');
               return ;
              }
            }
            that.confirmLoading = true;
            let avatar = that.model.avatar;
            if(!values.birthday){
              values.birthday = '';
            }else{
              values.birthday = values.birthday.format(this.dateFormat);
            }
            let formData = Object.assign(this.model, values);
            formData.avatar = avatar;
            formData.driveLicenseImg = driveLicenseImg;
            formData.selectedroles = this.selectedRole.length>0?this.selectedRole.join(","):'';
            // formData.selecteddeparts = this.userDepartModel.departIdList.length>0?this.userDepartModel.departIdList.join(","):'';
            if(this.userDepartModel.departIdList.length>0){
              let lineArr = [];
              let segmentArr = [];
              let pointArr = [];
              let teamArr = []
              this.userDepartModel.departIdList.map(item=>{
                if(item.type === 'line'){
                  lineArr.push(item.value)
                }
                if(item.type === 'segment'){
                  segmentArr.push(item.value)
                }
                if(item.type === 'point'){
                  pointArr.push(item.value)
                }
                if(item.type === 'workTeam'){
                  teamArr.push(item.value)
                }
                console.log(item.type === 'line',item.type === 'segment',item.type === 'point',item,'departIdList');
              })

              formData.lineId = lineArr.join(',');
              formData.segmentId = segmentArr.join(',');
              formData.pointId = pointArr.join(',');
              formData.teamId = teamArr.join(',');
              console.log(this.userDepartModel.departIdList, lineArr,segmentArr,pointArr, 'departIdList')
            }
            // that.addDepartsToUser(that,formData); // 调用根据当前用户添加部门信息的方法
            let obj;
            if(!this.model.id){
              formData.id = this.userId;
              obj=addUser(formData);
            }else{
              obj=editUser(formData);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.checkedDepartNames = [];
              that.userDepartModel.departIdList = {userId:'',departIdList:[]};
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        const confirmpassword=form.getFieldValue('confirmpassword');

        if (value && confirmpassword && value !== confirmpassword) {
          callback('两次输入的密码不一样！');
        }
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一样！');
        } else {
          callback()
        }
      },
      validatePhone(rule, value, callback){
        if(!value){
          callback('请输入手机号码!');
        }else{
          if(new RegExp(/^1[0-9]{10}$/).test(value)){
            var params = {
              tableName: 'sys_user',
              fieldName: 'phone',
              fieldVal: value,
              dataId: this.userId
            };
            duplicateCheck(params).then((res) => {
              if (res.success) {
                callback()
              } else {
                callback("手机号已存在!")
              }
            })
          }else{
            callback("请输入正确格式的手机号码!");
          }
        }
      },
      validateIdNumber(rule, value, callback){
        if(!value){
          callback()
        } else{
          if(new RegExp(/^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/).test(value)){
            callback()
          }else{
            callback("请输入正确格式的身份证号!");
          }
        }
      },
      validateEmail(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(value)){
            var params = {
              tableName: 'sys_user',
              fieldName: 'email',
              fieldVal: value,
              dataId: this.userId
            };
            duplicateCheck(params).then((res) => {
              console.log(res)
              if (res.success) {
                callback()
              } else {
                callback("邮箱已存在!")
              }
            })
          }else{
            callback("请输入正确格式的邮箱!")
          }
        }
      },
      validateUsername(rule, value, callback){
        var params = {
          tableName: 'sys_user',
          fieldName: 'username',
          fieldVal: value,
          dataId: this.userId
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
          callback()
        } else {
          callback("用户名已存在!")
        }
      })
      },
      handleConfirmBlur  (e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value
      },

      normFile  (e) {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e
        }
        return e && e.fileList
      },
      // beforeUpload: function(file){
      //   var fileType = file.type;
      //   if(fileType.indexOf('image')<0){
      //     this.$message.warning('请上传图片');
      //     return false;
      //   }
      //   //TODO 验证文件大小
      // },
      handleChange (info) {
        this.picUrl = "";
        this.uploadLoading = true;
        this.upload(info, 'img', (result)=>{
          this.picUrl = result;
          this.model.avatar = result;
          this.uploadLoading = false;
        })
      },
      handleDriveChange (info, key) {
        this.picDriveUrl = "";
        this.uploadDriveLoading = true;
        this.upload(info, 'img', (result)=>{
          this.picDriveUrl = result;
          this.model.driveLicenseImg = result;
          this.uploadDriveLoading = false;
        })
      },
      frontBeforeUpload: function(file) {
        return false
      },
      upload(info, name, call) {
        let that = this
        let reader = new FileReader()
        // console.log(info);

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
              // console.log(res)
              call && call(res.result)
            })
            .catch(err => {
              this.uploadLoading = false;
              this.uploadDriveLoading = false;
              console.log(err)
            })
        }
      },
      // 搜索用户对应的部门API
      onSearch(){
        this.$refs.departWindow.add(this.checkedDepartKeys,this.userId);
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk (formData) {
        console.log(formData, 'modalFormOk')
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i]);
          this.checkedDepartNames.push(formData.departIdList[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
          this.model.checkedDepartNameString = this.checkedDepartNameString
          this.form.setFieldsValue(pick(this.model,'username','sex', 'nation','workerType', 'lineId', 'segmentId', 'pointId', 'address', 'idNumber', 'emergencyContact', 'emergencyContactTel', 'emergencyContactRelationship', 'realname','email','phone','activitiSync', 'checkedDepartNameString'))
        }
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        if(this.selectedDepartKeys.length > 0){
          const [oldKeys] = this.checkedDepartKeys.filter(res=>res.type === 'line');
          const [nowKeys] = this.selectedDepartKeys.filter(res=>res.type === 'line');
          console.log(oldKeys, nowKeys)
          if((nowKeys && oldKeys && oldKeys.value !== nowKeys.value)|| !oldKeys){
            this.changeRoleQueryall(this.selectedDepartKeys);
          }
        } else {
          this.roleList = [];
        }
        this.checkedDepartKeys = this.selectedDepartKeys;  //更新当前的选择keys
       },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
    }
  }
</script>

<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }

  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
  .checkedDepartName-class{
    height:0;
    width:0;
    opacity: 0;
    position: absolute;
  }
</style>