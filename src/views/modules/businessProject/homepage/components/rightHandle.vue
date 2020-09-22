<template>
      <a-card :bordered="false">
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <!-- 树-->
          <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span style="user-select: none">
                <a-directory-tree
                  selectable
                  :replaceFields="replaceFields"
                  :selectedKeys="selectedKeys"
                  :checkStrictly="true"
                  :expandedKeys="expandedKeys"
                  :autoExpandParent="autoExpandParent"
                  @select="onSelect"
                  @expand="onExpand"

                  :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
                  :treeData="departTree"
                />
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <a-menu slot="overlay" v-if="isAdmin && scopeData && scopeData.sysType">
                  <!-- <a-menu-item @click="handleAdd" key="1">添加</a-menu-item> -->
                  <a-menu-item @click="handleDelete" key="2">删除</a-menu-item>
                   <a-menu-item @click="handleEdit" key="4" >编辑</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
        </div>
      </a-card>
</template>

<script>
import { getAction, deleteAction} from '@/api/manage'
export default {
  name: 'projectRows',
  components: {
  },
  data() {
    return {
      $scope: -1,
      dropTrigger: '',
      selectedKeys: [],
      checkedKeys: [],
      iExpandedKeys: [],
      departTree: [],
      expandedKeys:[],
      autoExpandParent: true,
      replaceFields: {
        children:'children', title:'title', key:'id'
      }
    }
  },
  props: {
    hasSegment:{
      type: Boolean,
      default: false
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
            type: Array,
            default: () => {
                return []
            }
    },
    scopeData: {
            type: Object,
            default: () => {
                return {}
            }
        }
  },
  computed: {
    
  },
  created() {
    this.loadTree()
  },
  methods: {
    onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys;
        // this.autoExpandParent = false;
        this.$emit('changeExpandedKeys', expandedKeys);

      },
    onChange(){

    },
    onSelect(selectedKeys, e) {
        const dataRef = e.node.dataRef;
        this.$scope = dataRef;
      console.log('onSelect',dataRef)

        if(dataRef.isParent){
          this.dropTrigger = 'contextmenu';
          this.$emit('change', dataRef);
          // this.loadLeaf(dataRef);
          this.handleAdd();
        }

        if(dataRef.isSecond){
          this.dropTrigger = 'contextmenu';
          this.$emit('change', dataRef);
          this.handleAdd();
        }

        if(dataRef.isPoint){
          this.dropTrigger = '';
          this.$emit('change', dataRef);
          this.handleAdd();
        }
    },
    signid(args = '') {
      const [prefix] = [...args]
      const uid =
        Math.floor(Math.random() * 26 + 10).toString(36) +
        new Date().getTime().toString(36)
      const dif = 12 - uid.length
      const ustr = Math.floor(Math.random() * Math.pow(36, dif)).toString(36)
      return `${prefix || ''}${uid}${('000' + ustr).substr(
        `${ustr.length + 3 - `${dif}`}`
      )}`
    },
    loadLeaf(dataRef){
      const url = '/segment/list';
      getAction(url, {lineId: dataRef.id, pageSize:1000}).then((res) => {
          if (res.success) {
            for (let i = 0; i < res.result.records.length; i++) {
              let temp = res.result.records[i];
              temp.title = temp.name;
              temp.key = this.signid('second');
              temp.isSecond = true;
              temp.parentLineId = dataRef.id;
              temp.parentLineTitle = dataRef.title;
            }
            this.$nextTick(()=>{
              dataRef.children = res.result.records;
              this.$forceUpdate();
            })
          }
      })
    },
    handleAdd() {
      console.log('handleAdd')
      this.$emit('change', {evt: 'add', scope: this.$scope});
    },
    closeDrop() {
        this.dropTrigger = ''
    },
    handleDelete() {
        console.log('handleDelete');
        const { isParent } = this.$scope;
        if(this.$scope !== -1){
          this.delOrResClick({url:`/${isParent? 'line': 'segment'}/delete`, id: this.$scope.id});
        }
    },
    handleEdit(){
      this.$emit('change', {evt: 'edit', scope: this.$scope});
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = '';
      }
    },
    loadTree() {
        this.treeData = []
        this.departTree = []
        const url = '/line/tree';
        this.$scope = -1;
        getAction(url).then((res) => {
          console.log(res);
          if (res.success) {
            for (let i = 0; i < res.result.lineList.length; i++) {
              let temp = res.result.lineList[i];
              temp.id = temp.lineId;
              temp.title = temp.lineName;
              // temp.key = this.signid('parent');
              temp.key = temp.id;

              temp.isParent = true;
              temp.children = temp.segmentList;
              if(temp.children.length > 0){
                temp.children.map(segmentItem=>{
                  segmentItem.title = segmentItem.segmentName;
                  segmentItem.id = segmentItem.segmentId;
                  // segmentItem.key = this.signid('second');
                  segmentItem.key = segmentItem.id;
                  segmentItem.isSecond = true;
                  segmentItem.parentLineId = temp.lineId;
                  segmentItem.parentLineTitle = temp.title;
                  segmentItem.children = segmentItem.pointList;
                  if(segmentItem.children.length > 0){
                    segmentItem.children.map(pointItem=>{
                      pointItem.title = pointItem.pointName;
                      pointItem.id = pointItem.pointId;
                      // pointItem.key = this.signid('point');
                      pointItem.key = pointItem.id;
                      pointItem.isPoint = true;
                      pointItem.parentLineId = segmentItem.segmentId;
                      pointItem.parentLineTitle = segmentItem.title;
                    })
                  }
                })
              }
              this.treeData.push(temp)
              this.departTree.push(temp)
            }
            this.$emit('loadData', this.treeData)
            this.loading = false
          }
        })
      },
      // setThisExpandedKeys(node) {
      //   if (node.children && node.children.length > 0) {
      //     this.iExpandedKeys.push(node.key)
      //     for (let a = 0; a < node.children.length; a++) {
      //       this.setThisExpandedKeys(node.children[a])
      //     }
      //   }
      // },
    // 删除还是恢复
    delOrResClick({url, id}) {
      const params = {id}
      console.log(url, params)
      return deleteAction(url, params).then(res => {
        if (res.success) {
          this.$emit('change', {evt: 'delete'});
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@assets/less/common.less';
.ant-card{
  &.no-pad{
  /deep/  .ant-card-body{
      padding: 0;
    }
  }
}
</style>