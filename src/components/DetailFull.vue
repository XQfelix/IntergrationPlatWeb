<template >
  <div>
    <el-card shadow="hover" style="margin-bottom:10px">
      <el-page-header @back="goBack" content="代码查看"></el-page-header>
    </el-card>
    <el-row>
      <el-col :span="7">
        <el-card shadow="never">
          <div>
            <p style="color: #303133">
              文档ID:
              <span style="color: #909399; margin-left:12px;font-size: 14px">{{interDoc.interId}}</span>
            </p>
            <p style="color: #303133">
              文档名称:
              <span style="color: #909399;font-size: 14px">{{interDoc.interName}}</span>
            </p>
            <p style="color: #303133">
              DIX版本 :
              <span style="color: #e6a23c;font-size: 14px">{{interDoc.dixTag}}</span>
            </p>
            <p style="color: #303133">
              创建时间:
              <span style="color: #909399;font-size: 14px">{{interDoc.interCreateTime}}</span>
            </p>
            <p style="color: #303133">
              文档描述:
              <span style="color: #e6a23c; font-size: 14px">{{interDoc.interDesc}}</span>
            </p>
            <p style="color: #303133">
              文档作者:
              <span style="color: #909399;font-size: 14px">{{interDoc.interEditor}}</span>
            </p>
            <p>
              <el-tag
                :key="tag"
                v-for="(tag, index) in preTags"
                :disable-transitions="false"
                :type="tagColors[index]"
              >{{tag}}</el-tag>
            </p>
            <p style="margin-bottom: 0">
              <el-image
                :key="index"
                v-for="(pic, index) in srcList"
                style="width: 150px; height: 150px; margin-right:10px"
                :src="pic"
                :preview-src-list="srcList"
              ></el-image>
            </p>
          </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 10px" v-loading="loading">
          优化建议:
          <el-input
            type="textarea"
            style="margin-top:10px"
            :rows="7"
            placeholder="请输入建议改进的部分"
            v-model="docSuggest"
          ></el-input>
          <el-button
            @click="handleSuggest"
            size="small"
            style="float: right; margin: 10px 0px"
            plain
            type="warning"
          >提交</el-button>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card shadow="never" id="myeditor">
          <MyEditor :editHeight="100" :codes="interCode" @onMounted="javascriptOnMounted" />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible="centerDialogVisible" width="25%" center :show-close="false">
      <!-- <span class="detail-dig-btn">近期不再显示</span> -->
      <span>请问该篇文章对您是否有帮助 ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-star-on" size="mini" type="warning" @click="centerDialog" plain>有</el-button>
        <el-button
          icon="el-icon-star-off"
          size="mini"
          type="info"
          @click="centerDialogError"
          plain
        >无</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyEditor from "./myEditor";
export default {
  name: "DetailFull",
  components: {
    MyEditor
  },
  data() {
    return {
      jsEditor: "",
      centerDialogVisible: false,
      loading: false,
      preTags: [],
      interDoc: "",
      interId: "",
      lastTag: [],
      docSuggest: "",
      tagColors: ["warning", "success", "info", "", "danger"],
      interCode: "",
      srcList: []
    };
  },
  methods: {
    javascriptOnMounted(edit) {
      this.jsEditor = edit;
    },
    centerDialog() {
      this.centerDialogVisible = false;
      this.$router.push({ name: "select", params: { intertag: this.lastTag } });
      this.$message({
        type: "success",
        message: "希望您也可以录入相关代码, 来帮助到更多的人"
      });
    },
    centerDialogError() {
      this.centerDialogVisible = false;
      this.$router.push({ name: "select", params: { intertag: this.lastTag } });
      this.$message({
        type: "info",
        message: "尝试查看其他文档来获取帮助, 期待我们进一步完善吧"
      });
    },
    goBack() {
      this.centerDialogVisible = true;
    },
    loadDoc() {
      this.preTags = [];
      this.request
        .request("post", this.baseUrl + "/inter/querydocbyid", "", this.interId)
        .then(res => {
          this.interDoc = res.data;
          const interTags = JSON.parse(res.data.interTag);
          interTags.forEach(element => {
            this.preTags.push(element);
          });
          if (res.data.interImage) {
            const interImages = JSON.parse(res.data.interImage);
            interImages.forEach(element => {
              this.srcList.push(this.baseUrl + "/inter/getimage/" + element);
            });
          }
          this.interCode = JSON.parse(res.data.interCode).interCode;
          this.jsEditor.setValue(this.interCode);
        });
    },
    handleSuggest() {
      this.loading = true;
      let reqeustParam = {};
      reqeustParam.docSuggest = this.docSuggest;
      reqeustParam.interId = this.interId;
      this.request
        .request("post", this.baseUrl + "/inter/docsuggest", "", reqeustParam)
        .then(res => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
          if (res.status === 200) {
            this.docSuggest = "";
            this.$message({
              message:
                "非常感谢您退出的宝贵意见, 我们将认真参考您的建议, 对代码进行优化!",
              type: "success"
            });
          }
        });
    }
  },
  created() {
    this.interId = this.$route.params.id;
    this.lastTag = this.$route.params.intertag;
    this.loadDoc();
  }
};
</script>