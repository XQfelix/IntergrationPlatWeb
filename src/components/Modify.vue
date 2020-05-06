<template>
  <div>
    <el-card shadow="hover">
      <el-page-header @back="goBack" content="代码修改"></el-page-header>
      <p
        style="position: absolute;top: 17px;left: 210px; height: 16px; border-left: 1px solid #C0C4CC;"
      ></p>
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="handleSave"
        type="text"
        style="position: absolute;top: 23px;left: 230px; font-size:14px"
      >保存</el-button>
    </el-card>
    <el-row>
      <el-col :span="12">
        <el-card shadow="hover" style="margin-top:10px">
          <el-form label-position="left" label-width="80px" :model="formLabelAlign">
            <el-row :gutter="6">
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <el-form-item label="名称">
                    <span class="imput-span">*</span>
                    <el-input v-model="formLabelAlign.interName" placeholder="输入脚本名称"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="24">
                <el-form-item label="描述">
                  <span class="imput-span">*</span>
                  <el-input v-model="formLabelAlign.interDesc" placeholder="针对脚本中业务简单描述"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="作者" style="margin-bottom: 1px">
                  <el-input v-model="formLabelAlign.interEditor" placeholder="建议填写, 以便查阅者向您咨询"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="4">
                <div class="grid-content bg-purple">
                  <el-form-item label="DIX版本" style="margin-bottom: 1px">
                    <span class="imput-span">*</span>
                    <el-select v-model="formLabelAlign.dixTag" placeholder="选择DIX版本">
                      <el-option
                        :key="dixTag"
                        v-for="dixTag in dixTags"
                        :label="dixTag"
                        :value="dixTag"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="关键词">
              <span class="imput-span">*</span>
              <el-tag
                :key="tag"
                v-for="(tag, index) in formLabelAlign.interTag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
                :type="tagColors[index]"
              >{{tag}}</el-tag>
              <el-autocomplete
                style="width: 200px"
                size="small"
                v-if="inputVisible"
                class="input-new-tag"
                v-model="inputValue"
                :fetch-suggestions="querySearch"
                placeholder="若无对应项, 请输入"
                @select="handleSelect"
                @keyup.enter.native="handleInputConfirm"
                ref="saveTagInput"
              ></el-autocomplete>
              <el-tooltip
                class="item"
                effect="dark"
                content="添加关键词, 若候选框没有符合选项, 直接输入按回车即可"
                placement="bottom-end"
              >
                <el-button
                  v-if="!inputVisible && formLabelAlign.interTag.length<5"
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                >
                  <i class="el-icon-plus"></i>
                </el-button>
              </el-tooltip>
              <p
                style="font-size:12px; margin: 0px; color: #e6a23c;margin-bottom: -20px;"
              >请尽可能多的添加关键词, 这样检索效率会更高!</p>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="hover" style="margin-top:10px">
          <el-form label-position="left" label-width="80px">
            <el-form-item label="图片" style="margin-bottom:-12px;">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                :data="singleFilePro"
                :file-list="pictureList"
              >
                <div
                  v-if="pictureList.length===0"
                  class="el-upload__tip"
                  slot="tip"
                >若无文本格式的代码, 则将代码图片上传!</div>
                <el-tooltip class="item" effect="dark" content="上传图片" placement="bottom">
                  <i class="el-icon-plus"></i>
                </el-tooltip>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="hover" style="margin-top:10px">
          <el-form label-position="left" label-width="80px">
            <el-form-item label="文件">
              <el-upload
                class="upload-demo"
                drag
                :before-upload="handleFileBeforeUpload"
                :data="singleTextFilePro"
                :action="uploadTextUrl"
                :on-success="handleTextSuccess"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将代码文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div
                  style="margin-bottom: -18px;margin-top:-10px"
                  class="el-upload__tip"
                  slot="tip"
                >亦可将代码(*.txt/*.js)文件直接上传, 自动填充右侧代码块</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top:10px">
        <el-card shadow="hover" id="myeditor">
          <MyEditor
            :editHeight="100"
            :readOnly="'false'"
            :codes="formLabelAlign.interCode"
            @onMounted="javascriptOnMounted"
            @onCodeChange="javascriptOnCodeChange"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="更新确认" :visible.sync="centerDialogVisible" close-on-click-modal width="25%">
      <p style="font-size:14px">为了文档查阅时候更清晰, 且符合安全规范, 请您进行如下确认</p>
      <p style="font-size:14px; color:#F56C6C; font-size: 13px">1.确保将要修改的该文档确定之前由你录入</p>
      <p style="font-size:14px; color:#e6a23c; font-size: 13px">2.文档中涉及IP, 用户, 密码等涉密信息是否处理</p>
      <p style="font-size:14px; color:#e6a23c; font-size: 13px">3.文档内容是否格式化</p>
      <span slot="footer" class="dialog-footer">
        <el-button
          icon="el-icon-success"
          size="mini"
          type="warning"
          @click="centerDialog"
          plain
        >我已确认</el-button>
        <el-button
          icon="el-icon-question"
          size="mini"
          type="info"
          @click="centerDialogError"
          plain
        >如何格式化</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyEditor from "./myEditor";
export default {
  name: "Modify",
  components: {
    MyEditor
  },
  data() {
    return {
      centerDialogVisible: false,
      jsEditor: "",
      uploadTextUrl: this.baseUrl + "/inter/uploadtext",
      fullscreenLoading: false,
      uploadUrl: this.baseUrl + "/inter/upload",
      typeList: [],
      tagColors: ["", "success", "info", "warning", "danger"],
      pictureList: [],
      dixTags: [
        "v5.15.0",
        "v5.14.0",
        "v5.13.0",
        "v5.12.0",
        "v5.11.0",
        "v5.10.0",
        "v5.9.0",
        "v5.8.0",
        "v5.7.0",
        "v5.6.0"
      ],
      inputVisible: false,
      inputValue: "",
      dialogImageUrl: "",
      dialogVisible: false,
      singleFilePro: {},
      singleTextFilePro: {},
      formLabelAlign: {
        interEditor: "",
        interId: "",
        interName: "",
        interDesc: "",
        dixTag: "",
        interTag: [],
        interCode: "function run(){\n}"
      }
    };
  },
  methods: {
    centerDialog() {
      const formLabelAlign = this.formLabelAlign;
      if (formLabelAlign.interName === "") {
        this.$message.error("请输入名称!!");
      } else if (formLabelAlign.dixTag === "") {
        this.$message.error("请选择DIX版本!!");
      } else if (formLabelAlign.interTag === "") {
        this.$message.error("请添加代码相关的关键词!!");
      } else if (formLabelAlign.interDesc === "") {
        this.$message.error("请添加代码相关描述!!");
      } else {
        this.fullscreenLoading = true;
        const param = this.formLabelAlign;
        const code = param.interCode;
        param.interCode = JSON.stringify({ interCode: code });
        this.request
          .request("post", this.baseUrl + "/inter/save", "", param)
          .then(res => {
            if (res.data === 1) {
              this.centerDialogVisible = false;
              this.fullscreenLoading = false;
              this.$router.push({ name: "select" });
            } else {
              this.fullscreenLoading = false;
              this.$message.error("保存失败, 请检查所填写的字段!");
            }
          });
      }
    },
    centerDialogError() {
      this.centerDialogVisible = false;
      this.$notify({
          title: '如何格式化',
          dangerouslyUseHTMLString: true,
          message: '<p>将鼠标移入代码编辑器中</br>鼠标右键选择</br><span style="color:#e6a23c">Format Document</span></p>',
          duration: 10000,
          type: 'warning'
        });
    },
    handleBeforeUpload(file) {
      this.singleFilePro.uid = file.uid;
      this.singleFilePro.interId = this.formLabelAlign.interId;
    },
    handleFileBeforeUpload(file) {
      this.singleTextFilePro.uid = file.uid;
      this.singleTextFilePro.interId = this.formLabelAlign.interId;
    },
    handleSave() {
      this.centerDialogVisible = true;
    },
    javascriptOnMounted(edit) {
      this.jsEditor = edit;
    },
    javascriptOnCodeChange(value, event) {
      this.formLabelAlign.interCode = value;
    },
    handleRemove(file, fileList) {
      const oldUid = file.uid;
      let param = {};
      param.fileName = file.url;
      param.uid = file.uid;
      param.interId = this.formLabelAlign.interId;
      this.request
        .request("post", this.baseUrl + "/inter/removeimage", "", param)
        .then(res => {
          const picList = this.pictureList;
          picList.forEach(element => {
            if (oldUid === element.uid) {
              picList.splice(element, 1);
              this.pictureList = picList;
            }
          });
        });
    },
    handleTextSuccess(response, file, fileList) {
      this.jsEditor.setValue(response);
    },
    handleSuccess(response, file, fileList) {
      this.pictureList.push({ name: file.name, url: file.url, uid: file.uid });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClose(tag) {
      this.formLabelAlign.interTag.splice(
        this.formLabelAlign.interTag.indexOf(tag),
        1
      );
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        if (this.formLabelAlign.interTag.indexOf(inputValue) === -1) {
          this.formLabelAlign.interTag.push(inputValue.toLowerCase());
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    goBack() {
      this.$router.push({ name: "home" });
    },
    handleSelect(item) {
      this.handleInputConfirm();
    },
    querySearch(queryString, cb) {
      var typeList = this.typeList;
      var results = queryString
        ? typeList.filter(this.createFilter(queryString))
        : typeList;
      cb(results);
    },
    createFilter(queryString) {
      return type => {
        return (
          type.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    loadTags() {
      this.request
        .request("get", this.baseUrl + "/inter/querytag", "", "")
        .then(res => {
          this.typeList = res.data;
        });
    },
    loadDoc() {
      let interId = window.location.href;
      interId = interId.substring(
        interId.indexOf("detail/") + 7,
        interId.indexOf("/modify")
      );
      this.request
        .request("post", this.baseUrl + "/inter/modifydocbyid", "", interId)
        .then(res => {
          if (res.status === 200) {
            this.formLabelAlign.dixTag = res.data.dixTag;
            this.formLabelAlign.interName = res.data.interName;
            this.formLabelAlign.interTag = JSON.parse(res.data.interTag);
            this.formLabelAlign.interDesc = res.data.interDesc;
            this.formLabelAlign.interEditor = res.data.interEditor;
            this.formLabelAlign.interCode = JSON.parse(
              res.data.interCode
            ).interCode;
            if (res.data.interImage) {
              const tempImage = JSON.parse(res.data.interImage);
              tempImage.forEach(item => {
                item.url = this.baseUrl + "/inter/getimage/" + item.url;
              });
              this.pictureList = tempImage;
            }
            this.jsEditor.setValue(this.formLabelAlign.interCode);
          }
        });
    }
  },
  created() {
    this.loadTags();
    this.loadDoc();
  },
  mounted() {
    this.formLabelAlign.interId = this.$route.params.id;
  }
};
</script>
  