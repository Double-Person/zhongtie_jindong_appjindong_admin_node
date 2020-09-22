<template>
  <a-modal :maskClosable="false"
    :title="title"
    width="80%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题">
              <a-input placeholder="请输入" v-decorator="['title', validatorRules.title ]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学习积分">
              <a-input-number
                placeholder="请输入"
                v-decorator="['studyScore', validatorRules.studyScore ]"
                style="width:100%"
              />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="至少学习时长">
              <a-input-number
                placeholder="请输入"
                v-decorator="['minStudyTime', validatorRules.minStudyTime ]"
              />分钟
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种">
              <a-select placeholder="请选择" v-decorator="[ 'workType', validatorRules.workType]">
                <a-select-option
                  v-for="(item, index) in workTypeDictOptions"
                  :value="item.value"
                  :key="index"
                >{{item.text}}</a-select-option>
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
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item
              label="内容"
              :labelCol="{lg: {span: 2}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 22}, sm: {span: 22} }"
            >
              <vue-ueditor-wrap
                placeholder="请输入"
                v-model="model.content"
                :config="myConfig"
                :destroy="true"
              ></vue-ueditor-wrap>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import { httpAction } from "@/api/manage";
import pick from "lodash.pick";
import moment from "moment";
import JUpload from "@/components/jeecg/JUpload";

export default {
  name: "SafetyLearningStatisticsModal",
  components: {
    VueUeditorWrap,
    JUpload
  },
  props: {
    articleTypeDictOptions: {
      type: Array,
      default: []
    },
    workTypeDictOptions: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      base64Img: "",
      uploadLoading: false,
      title: "操作",
      visible: false,
      model: {
        img: "",
        content: ""
      },
      labelCol: {
        lg: {
          span: 5
        },
        sm: {
          span: 5
        }
      },
      wrapperCol: {
        lg: {
          span: 19
        },
        sm: {
          span: 19
        }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        title: {
          rules: [
            {
              required: true,
              message: "请输入标题!"
            }
          ]
        },
        workType: {
          rules: [
            {
              required: true,
              message: "请输入工种!"
            }
          ]
        },
        studyScore: {
          rules: [
            {
              required: true,
              message: "请输入学习积分!"
            }
          ]
        },
        type: {
          rules: [
            {
              required: true,
              message: "请选择类型!"
            }
          ]
        },
        minStudyTime: {
          rules: [
            {
              required: true,
              message: "请输入至少学习时长!"
            }
          ]
        },
        img: {
          rules: [
            {
              required: true,
              message: "请上传封面!"
            }
          ]
        }
      },
      url: {
        add: "/bp/safeLearning/add",
        edit: "/bp/safeLearning/edit"
      },
      myConfig: {
        toolbars: [
          [
            "anchor", //锚点
            "undo", //撤销
            "redo", //重做
            "bold", //加粗
            "indent", //首行缩进
            "snapscreen", //截图
            "italic", //斜体
            "underline", //下划线
            "strikethrough", //删除线
            "subscript", //下标
            "fontborder", //字符边框
            "superscript", //上标
            "formatmatch", //格式刷
            "source", //源代码
            "blockquote", //引用
            "pasteplain", //纯文本粘贴模式
            "selectall", //全选
            "print", //打印
            "preview", //预览
            "horizontal", //分隔线
            "removeformat", //清除格式
            "time", //时间
            "date", //日期
            "unlink", //取消链接
            "insertrow", //前插入行
            "insertcol", //前插入列
            "mergeright", //右合并单元格
            "mergedown", //下合并单元格
            "deleterow", //删除行
            "deletecol", //删除列
            "splittorows", //拆分成行
            "splittocols", //拆分成列
            "splittocells", //完全拆分单元格
            "deletecaption", //删除表格标题
            "inserttitle", //插入标题
            "mergecells", //合并多个单元格
            "deletetable", //删除表格
            "cleardoc", //清空文档
            "insertparagraphbeforetable", //"表格前插入行"
            "insertcode", //代码语言
            "fontfamily", //字体
            "fontsize", //字号
            "paragraph", //段落格式
            "simpleupload", //单图上传
            "insertimage", //多图上传
            "edittable", //表格属性
            "edittd", //单元格属性
            "link", //超链接
            "emotion", //表情
            "spechars", //特殊字符
            "searchreplace", //查询替换
            "map", //Baidu地图
            "gmap", //Google地图
            "insertvideo", //视频
            "help", //帮助
            "justifyleft", //居左对齐
            "justifyright", //居右对齐
            "justifycenter", //居中对齐
            "justifyjustify", //两端对齐
            "forecolor", //字体颜色
            "backcolor", //背景色
            "insertorderedlist", //有序列表
            "insertunorderedlist", //无序列表
            "fullscreen", //全屏
            "directionalityltr", //从左向右输入
            "directionalityrtl", //从右向左输入
            "rowspacingtop", //段前距
            "rowspacingbottom", //段后距
            "pagebreak", //分页
            "insertframe", //插入Iframe
            "imagenone", //默认
            "imageleft", //左浮动
            "imageright", //右浮动
            // 'attachment', //附件
            "imagecenter", //居中
            "wordimage", //图片转存
            "lineheight", //行间距
            "edittip ", //编辑提示
            "customstyle", //自定义标题
            "autotypeset", //自动排版
            "webapp", //百度应用
            "touppercase", //字母大写
            "tolowercase", //字母小写
            "background", //背景
            "template", //模板
            "scrawl", //涂鸦
            "music", //音乐
            "inserttable", //插入表格
            "drafts", // 从草稿箱加载
            "charts" // 图表
          ]
        ],
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        serverUrl: process.env.VUE_APP_BASE_API + "/system/ueditor/action"
      }
    };
  },
  methods: {
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "title",
            "workType",
            "studyScore",
            "type",
            "minStudyTime",
            "img",
            "content"
          )
        );
        //时间格式化
      });
    },
    close() {
      this.$emit("close");
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
          delete this.model.http;
          let formData = Object.assign(this.model, values);
          //时间格式化
          console.log(formData);
          httpAction(httpurl, formData, method).then(res => {
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
      this.close();
    },
    // 上传 bofore
    frontBeforeUpload: function(file) {
      return false;
    },
    // 上传 change
    frontHandleChange(info) {
      // console.log(info)
      this.upload(info, "img");
    },
    // upload
    upload(info, name) {
      let that = this;
      let reader = new FileReader();
      reader.readAsDataURL(info.file);
      reader.onload = function() {
        that.base64Img = reader.result;
        that.base64Img = encodeURI(that.base64Img);
        // encodeURI(URIstring)
        that.axios
          .post("/common/uploadbase64img", {
            folder: "admin/",
            base64Img: that.base64Img
          })
          .then(res => {
            console.log(res);
            // that.model.img = res.result
            that.$set(that.model, "img", res.result);
          })
          .catch(err => {
            console.log(err);
          });
      };
    }
  }
};
</script>

<style lang="less" scoped>
</style>
