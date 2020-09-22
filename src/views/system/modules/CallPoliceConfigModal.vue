<template>
  <a-modal :maskClosable="false"
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: disabled} }"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标段">
          <a-select placeholder="请选择" v-decorator="['segmentId', validatorRules.title]" @change="searchPoint">
            <a-select-option
              v-for="(item, index) in dictOptions"
              :key="index"
              :value="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工点">
           <a-select placeholder="请选择" v-decorator="['pointId', validatorRules.title]" @change="beforeSearchReceiver">
            <a-select-option
              v-for="(item, index) in pointDictOptions"
              :key="index"
              :value="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="报警接收人">
          <a-select
              showSearch
              v-decorator="['receiverId', validatorRules.title ]"
              placeholder="请输入"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="searchReceiver"
              :notFoundContent="null"
              @change="setreceiverPhone"
            >
              <a-select-option v-for="d in monitorList" :key="d.id">{{d.realname}}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接收人电话">
          <a-input
            placeholder="请输入"
            v-model="model.receiverPhone"
            disabled
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <select-user-list-modal ref="UserListModal" @choseUser="choseUser"></select-user-list-modal>
  </a-modal>
</template>

<script>
import { httpAction } from "@/api/manage";
import pick from "lodash.pick";
import { getAction } from "@/api/manage";
import JDate from "@/components/jeecg/JDate";
import JEditor from "@/components/jeecg/JEditor";
import SelectUserListModal from "./SelectUserListModal";
import moment from "moment";

export default {
  components: { JEditor, JDate, SelectUserListModal },
  name: "SysAnnouncementModal",
  data() {
    return {
      title: "操作",
      visible: false,
      disableSubmit: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        title: { rules: [{ required: true, message: "请输入!" }] },
        msgCategory: {
          rules: [{ required: true, message: "请选择消息类型!" }]
        },
        msgType: {
          rules: [{ required: true, message: "请选择通告对象类型!" }]
        },
        endTime: { rules: [{ validator: this.endTimeValidate }] },
        startTime: { rules: [{ validator: this.startTimeValidate }] }
      },
      url: {
        queryByIds: "/sys/user/queryByIds",
        add: "/bp/callPoliceConfig/add",
        edit: "/bp/callPoliceConfig/edit"
      },
      userType: false,
      userIds: [],
      selectedUser: [],
      disabled: false,
      msgContent: "",
      dictOptions: [],
      pointDictOptions: [],
      monitorList:[],

    };
  },
  created() {
    this.searchType()
    this.searchReceiver()
  },
  methods: {
    setreceiverPhone(value) {
      const receiver = this.monitorList.filter(i=>{return i.id == value})
      this.model.receiverPhone =  receiver[0].phone
    },
    beforeSearchReceiver(value){
      this.pointId =value
      this.model.receiverId=''
      this.model.receiverPhone=''
      this.form.setFieldsValue(pick(
            this.model,
            "segmentId",
            "pointId",
            "receiverId",
            "receiverPhone"
          ))
      this.searchReceiver()
    },
    searchReceiver(value) {
      getAction('/sys/user/user_list', {
            realname: value || '',
            pointId: this.pointId,
            segmentId: this.segmentId,
            pageSize: 999999
          })
          .then(res => {
            this.monitorList = res.result.records
          })
          .catch(err => {
            console.log(err)
          })
    },
    searchPoint(segmentId) {
      this.model.pointId=''
      this.model.receiverId=''
      this.model.receiverPhone=''
      this.form.setFieldsValue(pick(
            this.model,
            "segmentId",
            "pointId",
            "receiverId",
            "receiverPhone"
          ))
      
      this.segmentId =segmentId
      const url = "/point/list";
      const params = {segmentId};
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result;
          this.pointDictOptions = result.records;
        }
      });
    },
    searchType() {
      const url = "/bp/userCenter/adminSegments";
      const params = {};
      return getAction(url, params).then(res => {
        if (res.success) {
          let result = res.result;
          this.dictOptions = result.records;
        }
      });
    },
    add() {
      this.edit({});
    },
    async edit(record) {
      this.form.resetFields();
      await this.searchPoint(record.segmentId)
      await this.searchReceiver()
      this.model = {};
      this.disable = false;
      this.visible = true;
      this.model = Object.assign({}, record);
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "segmentId",
            "pointId",
            "receiverId",
            "receiverPhone"
          )
        );
      });
    },
    close() {
      this.$emit("close");
      this.selectedUser = [];
      this.visible = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = "";
          let method = "";
          if (!this.model.id) {
            httpurl += this.url.add;
            method = "post";
          } else {
            httpurl += this.url.edit;
            method = "put";
          }
          let formData = Object.assign(this.model, values);
          if (this.userType) {
            formData.userIds = this.userIds;
          }
          console.log(formData);

          const { id, segmentId, pointId, receiverId, receiverPhone } = formData
          httpAction(httpurl, { id, segmentId, pointId, receiverId, receiverPhone }, method).then(res => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit("ok");
              that.close();
            } else {
              that.$message.warning(res.message);
            }
            that.confirmLoading = false;
          });
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.$emit("close");
      this.resetUser();
    },
    resetUser() {
      this.userType = false;
      this.userIds = [];
      this.selectedUser = [];
      this.disabled = false;
      this.$refs.UserListModal.edit(null, null);
    },
    selectUserIds() {
      this.$refs.UserListModal.add(this.selectedUser, this.userIds);
    },
    chooseMsgType(value) {
      if ("USER" == value) {
        this.userType = true;
      } else {
        this.userType = false;
        this.selectedUser = [];
        this.userIds = [];
      }
    },
    // 子modal回调
    choseUser: function(userList) {
      this.selectedUser = [];
      this.userIds = [];
      for (var i = 0; i < userList.length; i++) {
        this.selectedUser.push(userList[i].realname);
        this.userIds += userList[i].id + ",";
      }
    },
    startTimeValidate(rule, value, callback) {
      let endTime = this.form.getFieldValue("endTime");
      if (!value || !endTime) {
        callback();
      } else if (moment(value).isBefore(endTime)) {
        callback();
      } else {
        callback("开始时间需小于结束时间");
      }
    },
    endTimeValidate(rule, value, callback) {
      let startTime = this.form.getFieldValue("startTime");
      if (!value || !startTime) {
        callback();
      } else if (moment(startTime).isBefore(value)) {
        callback();
      } else {
        callback("结束时间需大于开始时间");
      }
    }
  }
};
</script>

<style scoped>
</style>