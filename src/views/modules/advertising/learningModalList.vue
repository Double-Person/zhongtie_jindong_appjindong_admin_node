<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="类型">
              <j-dict-select-tag placeholder="请选择" v-model="queryParam.type" title="类型" dictCode="article_type"/>
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-item label="工种">
              <j-dict-select-tag placeholder="请选择" v-model="queryParam.workType" title="工种" dictCode="work_type"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker

                v-model="queryParam.timeRange"
                style="width: 100%"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag  placeholder="请选择" v-model="queryParam.status" title="状态" dictCode="article_status"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="标题">
                <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="学习人数">
                <a-row>
                  <a-col :span="11">
                    <a-input placeholder="请输入" v-model="queryParam.minStudyCount"></a-input>
                  </a-col>
                  <a-col :span="2" style="text-align:center">
                    至
                  </a-col>
                  <a-col :span="11">
                    <a-input placeholder="请输入" v-model="queryParam.maxStudyCount"></a-input>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if='!learningModal'>
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- 原型里没有全选，如果需要全选把下面的内容添加到 a-table 标签 -->
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

        <span slot="action" slot-scope="text, record" v-if="learningModal">
          <a @click="handleLearningModalSelect(record)">选择</a>
        </span>
        <span slot="action" slot-scope="text, record" v-else>
          <router-link :to="{ name: 'safetylearning-detail-@id', params: { id: record.id }}">详情</router-link>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                  <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <!-- 状态 1:待发布 2:已发布 start -->
              <a-menu-item v-if="record.status == 1">
                <a-popconfirm title="确定发布吗?" @confirm="() => handlePublish(record.id)">
                  <a>发布</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.status == 2">
                <a-popconfirm title="确定取消发布吗?" @confirm="() => handleCancelPublish(record.id)">
                  <a>取消发布</a>
                </a-popconfirm>
              </a-menu-item>
              <!-- 状态 1:待发布 2:已发布 end -->
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->

    <safetyLearningStatistics-modal ref="modalForm" @ok="modalFormOk" :articleTypeDictOptions="articleTypeDictOptions" :workTypeDictOptions="workTypeDictOptions"></safetyLearningStatistics-modal>
  </a-card>
</template>

<script>
  import SafetyLearningStatisticsModal from "@/views/modules/businessProject/safetyLearning/SafetyLearningStatisticsModal";
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JDate from '@/components/jeecg/JDate'
  import { JeecgListMixin } from "@/mixins/JeecgListMixin";
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import {putAction} from '@/api/manage'
  export default {
    name: "UserStatisticsList",
    mixins: [JeecgListMixin],
    components: {
      SafetyLearningStatisticsModal,
      JDictSelectTag,
      JDate
    },
    props: {
      learningModal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        description: "安全学习统计页面",
        // 表头
        columns: [
          {
            title: "安全学习标题",
            align: "center",
            dataIndex: "title",
            width: 300
          },
          // {
          //   title: "类型",
          //   align: "center",
          //   dataIndex: "type",
          //   customRender: (text, record, index) => {
          //     //字典值替换通用方法
          //     return filterDictText(this.articleTypeDictOptions, String(text));
          //   }
          // },
          {
            title: "至少学习时长(分钟)",
            align: "center",
            dataIndex: "minStudyTime"
          },
          {
            title: "学习积分",
            align: "center",
            dataIndex: "studyScore"
          },
          {
            title: "学习人数",
            align: "center",
            dataIndex: "studyCount"
          },
          {
            title: "收藏人数",
            align: "center",
            dataIndex: "favoriteCount"
          },
          {
            title: "评论数",
            align: "center",
            dataIndex: "commentCount"
          },
          {
            title: "点赞数",
            align: "center",
            dataIndex: "likeCount"
          },
          {
            title: "工种",
            align: "center",
            dataIndex: "workType",
            customRender: (text, record, index) => {
              //字典值替换通用方法
              return filterDictText(this.workTypeDictOptions, String(text));
            }

          },
          {
            title: "创建时间",
            align: "center",
            dataIndex: "createTime"
          },
          {
            title: "状态",
            align: "center",
            dataIndex: "status",
            customRender: (text, record, index) => {
              //字典值替换通用方法
              return filterDictText(this.articleStatusDictOptions, String(text));
            }
          },
          {
            title: "操作",
            dataIndex: "action",
            align: "center",
            scopedSlots: { customRender: "action" }
          }
        ],
        url: {
          list: "/bp/safeLearning/list",
          delete: "/bp/safeLearning/delete",
          publish: "/bp/safeLearning/publish",
          cancelPublish: "/bp/safeLearning/cancelPublish",
          // deleteBatch: "/bp/userStatistics/deleteBatch",
          // exportXlsUrl: "bp/userStatistics/exportXls",
          // importExcelUrl: "bp/userStatistics/importExcel"
        },
        articleStatusDictOptions: [],
        articleTypeDictOptions: [],
        workTypeDictOptions: [],
        filters:{
          status:2
        }
      };
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleLearningModalSelect(record) {
        this.$emit('learningModalSelect', record)
      },
      initDictConfig() {
        console.log("--我才是真的方法!--")
        //初始化字典 - 状态
        initDictOptions('article_status').then((res) => {
          if (res.success) {
            this.articleStatusDictOptions = res.result;
          }
        });
        //初始化字典 - 类型
        initDictOptions('article_type').then((res) => {
          if (res.success) {
            this.articleTypeDictOptions = res.result;
          }
        });
        //初始化字典 - 工种
        initDictOptions('work_type').then((res) => {
          if (res.success) {
            this.workTypeDictOptions = res.result;
          }
        });
      },
      handlePublish: function (id) {
        if(!this.url.publish){
          this.$message.error("请设置url.publish属性!")
          return
        }
        var that = this;
        putAction(that.url.publish, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleCancelPublish: function (id) {
        if(!this.url.cancelPublish){
          this.$message.error("请设置url.cancelPublish!")
          return
        }
        var that = this;
        putAction(that.url.cancelPublish, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      onDateChange: function (value, dateString) {
        console.log(dateString[0], dateString[1]);
        this.queryParam.beginTime = dateString[0];
        this.queryParam.endTime = dateString[1];
        // if(dateString[0] === dateString[1]) {
        this.queryParam.beginTime += ' 00:00:00'
        this.queryParam.endTime += ' 23:59:59'
        // }
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  };
</script>
<style scoped>
  @import "~@assets/less/common.less";
</style>