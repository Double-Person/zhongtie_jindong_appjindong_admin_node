<template>
  <a-modal :maskClosable="false"
    :width="modalWidth"
    :visible="visible"
    title="标段搜索"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    >
    <!--部门树-->
    <template>
      <a-select v-model="selectAll" @change="loadLeaf" placeholder="请选择线路" style="width:80%;margin-right:10px;">
        <a-select-option v-for="(item, index) in lineTree" :key="index" :value="item.id">{{item.name}}</a-select-option>
      </a-select>
      <a-checkbox :checked="checkedAll"  @change="onChangeCheckAll">全选</a-checkbox>
      <a-form :form="form">
      <a-form-item label="">
         
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="">
      <a-tree
        multiple
        treeCheckable="tree"
        checkable
        :checkedKeys="checkedKeys"
        allowClear="true"
        :checkStrictly="true"
        @select="onSelect"
        @check="onCheck"
        :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
        :treeData="departTree"
        placeholder="请选择线路"
        >
      </a-tree>
      </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import { queryIdTree } from '@/api/api'
  import userModal from './UserModal'
  export default {
    name: "DepartWindow",
    components: {
      userModal,
    },
    data () {
      return {
        selectAll: '',
        checkedDepartKeys: [],
        checkedAll:false,
        lineTree: [],
        checkedKeys:[], // 存储选中的部门id
        allDepart: {},
        firstKeys: [],
        userId:"", // 存储用户id
        model:{}, // 存储SysUserDepartsVO表
        userDepartModel:{userId:'',departIdList:[]}, // 存储用户id一对多部门信息的对象
        departList:[], // 存储部门信息
        modalWidth:400,
        departTree:[],
        title:"操作",
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        headers:{},
        form:this.$form.createForm(this),
        url: {
          userId:"/sys/user/generateUserId", // 引入生成添加用户情况下的url
        },
      }
    },
    created(){
      // this.queryDepartTree();
    },
    methods: {
      onSelect(selectedKeys, e) {
        const dataRef = e.node.dataRef;
        if(dataRef.isSecond){
          this.loadPoint(dataRef);
        }
      },
      loadPoint(dataRef){
        // const url = '/point/list';
        // getAction(url, {segmentId: dataRef.id, pageSize: 1000}).then((res) => {
        //     if (res.success) {
        //       for (let i = 0; i < res.result.records.length; i++) {
        //         let temp = res.result.records[i];
        //         temp.title = temp.name;
        //         temp.value = temp.id;
        //         temp.key = temp.id;
        //         temp.parentId = dataRef.id;
        //         temp.type = 'point';
        //         temp.isPoint = true;
        //         this.allDepart[temp.value] = temp;
        //       }
        //       this.$nextTick(()=>{
        //         console.log(res.result.records)
        //         dataRef.children = res.result.records;
        //         this.$forceUpdate();
        //       })
        //     }
        // })
      },
      loadLeaf(dataRef){
        this.checkedKeys = [];
        this.checkedAll = false;
        this.selectAll = dataRef;
        const depart = this.allDepart[dataRef];
        this.checkedDepartKeys = [{
          key : depart.value,
          value : depart.value,
          title : depart.title,
          sysType: depart.sysType,
          type : 'line'
        }]
        this.$nextTick(()=>{
          this.departTree = depart.segmentList;
          console.log(dataRef, depart.segmentList);
          this.$forceUpdate();
        })
        // const url = '/segment/list';
        // getAction(url, {lineId: dataRef, pageSize: 1000}).then((res) => {
        //     if (res.success) {
        //       for (let i = 0; i < res.result.records.length; i++) {
        //         let temp = res.result.records[i];
        //         temp.title = temp.name;
        //         temp.value = temp.id;
        //         temp.key = temp.id;
        //         temp.type = 'segment';
        //         temp.isSecond = true;
        //         this.allDepart[temp.value] = temp;
        //       }
        //       this.$nextTick(()=>{
        //         this.departTree = res.result.records;
        //         this.$forceUpdate();
        //       })
        //     }
        // })
      },
      onChangeCheckAll(event){
        const ischecked = event.target.checked;
        if(ischecked){
          const result = [];
          this.departTree.map(res=>{
            const { children, id } = res;
            result.push(id);
            if(children && children.length > 0){
              children.map(cln=>{
                result.push(cln.id);
              })
            }
          })
          this.checkedKeys = result;
          this.checkedAll = true;
          this.addDepart();
        } else {
          this.checkedAll = false;
          this.checkedKeys = [];
        }
      },
      add (checkedDepartKeys,userId) {
        console.log(checkedDepartKeys, 'editrecord')
        this.userId = userId;
        this.edit(checkedDepartKeys, userId);
      },
      edit (record) {
        this.visible = true;
        this.$nextTick(()=>{
            this.departTree = [];
            this.$forceUpdate();
        })
        // console.log(this.checkedKeys)
        if(record.length > 0){
          record.map(res=>{
            const {type, value, title, sysType} = res;
            if(type === 'line'){
              this.checkedDepartKeys = [{
                key : value,
                value : value,
                title : title,
                sysType: sysType,
                type : 'line'
              }]
              this.queryDepartTree(value);
            } else {
              this.checkedKeys.push(value);
            }
          })
        } else {
          this.queryDepartTree();
        }
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.checkedKeys = [];
        this.allDepart = {};
        this.firstKeys = [];
        this.lineTree = [];
        this.checkedDepartKeys = [];
        this.checkedAll = false;
        this.selectAll = '';
        this.$nextTick(()=>{
          this.departList = [];
          this.$forceUpdate();
        })
      },
      handleSubmit () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err) => {
          if (!err) {
            that.confirmLoading = true;
            if(this.userId == null){
              getAction(this.url.userId).then((res)=>{
                if(res.success){
                  let formData = {userId:res.result,
                  departIdList:[...this.departList, ...this.checkedDepartKeys]}
                  console.log(formData)
                  that.$emit('ok', formData);
                }
              }).finally(() => {
                that.departList = [];
                that.confirmLoading = false;
                that.close();
              })
            }else {
              let formData = {userId:this.userId,
                departIdList:[...this.departList, ...this.checkedDepartKeys]}
              console.log(formData)
              that.departList = [];
              that.$emit('ok', formData);
              that.confirmLoading = false;
              that.close();
            }
          }
        })
      },
      handleCancel () {
        this.close()
      },
      // 选择部门时作用的API
      onCheck(checkedKeys, info){
        console.log(info.checkedNodes, 'checkedNodes')
        this.departList = [];
        this.checkedKeys = checkedKeys.checked;
        let checkedNodes = info.checkedNodes;
        if(info.checked){
           const {children, value, isPoint, parentId} = info.node.dataRef;
           console.log(info.node.dataRef)
            if(this.firstKeys.includes(value)){
              this.checkedKeys = [];
            }
            if(isPoint && !this.checkedKeys.includes(parentId)){
              this.checkedKeys.push(parentId);
            }
            if(!this.checkedKeys.includes(value)){
              this.checkedKeys.push(value)
            }
            if(children && children.length > 0){
                children.map((item)=>{
                  if(!this.checkedKeys.includes(item.value)){
                    this.checkedKeys.push(item.value)
                  }
                  if(item.children && item.children.length > 0){
                    item.children.map((items)=>{
                      if(!this.checkedKeys.includes(items.value)){
                        this.checkedKeys.push(items.value)
                      }
                    })
                  }
                })
            }
        } else {
          const {children, value} = info.node.dataRef;
          const firIndex =  this.checkedKeys.findIndex(friitem=>friitem === value);
          if(firIndex !== -1){
            this.checkedKeys.splice(firIndex,1)
          }
          if(children && children.length > 0){
              children.map((item)=>{
                const newIndex =  this.checkedKeys.findIndex(newitem=>newitem === item.value);
                console.log('取消选中', item,newIndex)
                if(newIndex !== -1){
                  this.checkedKeys.splice(newIndex,1)
                }
                if(item.children && item.children.length > 0){
                  item.children.map((items)=>{
                    const nowIndex =  this.checkedKeys.findIndex(nowitem=>nowitem === items.value);
                    if(nowIndex !== -1){
                      this.checkedKeys.splice(nowIndex,1)
                    }
                  })
                }
             })
          }
        }
        this.addDepart();
        console.log('onCheck', this.checkedKeys);
      },
      addDepart(){
        for (let i = 0; i < this.checkedKeys.length; i++) {
          let de = this.allDepart[this.checkedKeys[i]];
          console.log(de,this.allDepart, this.checkedKeys)
          let depart = {key:"",value:"",type: "",title:""};
          depart.key = de.value;
          depart.value = de.value;
          depart.title = de.title;
          depart.type = de.type;
          this.departList.push(depart);
        }
      },
      queryDepartTree(edit){
        this.treeData = []
        const url = '/line/tree'
        getAction(url, {pageSize: 1000}).then((res) => {
          if (res.success) {
            for (let i = 0; i < res.result.lineList.length; i++) {
              let temp = res.result.lineList[i];
              temp.title = temp.lineName;
              temp.name = temp.lineName;
              temp.id = temp.lineId;
              temp.value = temp.lineId;
              temp.children = temp.segmentList;
              temp.type = 'line';
              if(Array.isArray(temp.segmentList) && temp.segmentList.length > 0){
                for (let o = 0; o < temp.segmentList.length; o++) {
                  let segment = temp.segmentList[o];
                  segment.title = segment.segmentName;
                  segment.id = segment.segmentId;
                  segment.value = segment.segmentId;
                  segment.key = segment.segmentId;
                  segment.parentId = temp.id;
                  segment.children = segment.pointList;
                  segment.type = 'segment';
                  segment.isSecond = true;
                  this.allDepart[segment.value] = segment;
                  if(segment && Array.isArray(segment.pointList) && segment.pointList.length > 0){
                    for (let q = 0; q < segment.pointList.length; q++) {
                      let point = segment.pointList[q];
                      point.title = point.pointName;
                      point.id = point.pointId;
                      point.value = point.pointId;
                      point.key = point.pointId;
                      point.parentId = segment.id;
                      point.type = 'point';
                      point.isPoint = true;
                      this.allDepart[point.value] = point;
                      console.log(point, 'updatePoint');
                    }
                  }
                }
                if(temp.id === edit){
                  this.$nextTick(()=>{
                    this.departTree = temp.segmentList;
                    this.$forceUpdate();
                  })
                }
              }
              this.allDepart[temp.value] = temp;
              this.lineTree.push(temp);
              if(edit){
                this.selectAll = edit;
              }
            }
            // console.log(this.lineTree)
            // this.departList = this.lineTree[2]['segmentList'];
                // if(editLine === temp.id){
                //   this.$nextTick(()=>{
                //     this.departList = [...temp.segmentList];
                //     this.$forceUpdate();
                //     console.log(this.departList, 'temp.editLine')
                //   })
                // }
            // console.log(this.lineTree, 'queryDepartTree');
            this.loading = false
          }
        })
      }
      },
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }
</style>