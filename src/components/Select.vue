<template>
  <div>
    <el-card shadow="hover" style="margin-bottom:10px">
      <el-page-header @back="goBack" content="代码检索"></el-page-header>
    </el-card>
    <div style="margin-top:70px; text-align: center;">
      <div v-if="dynamicTags.length===0" class="logoimg"><img src="/code/static/search.png" height="100px"/></div>
      <div v-else style="margin-bottom: 20px;padding-top:15px;height: 30px;">
        <el-tag
          style="animation: opc 1s;"
          :key="tag"
          v-for="(tag, index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          :type="tagColors[index]"
        >{{tag}}</el-tag>
      </div>
      <el-autocomplete
        style="width: 700px; margin-bottom: 30px;"
        class="inline-input"
        v-model="inputValue"
        :fetch-suggestions="querySearch"
        placeholder="输入要检索的内容..."
        @select="handleSelect"
        suffix-icon="el-icon-search"
        @keyup.enter.native="handleInputConfirm"
      ></el-autocomplete>
    </div>
    <el-row style="margin-top:20px">
      <el-col>
        <el-card shadow="never">
          <el-table stripe :data="tableData" style="width: 100%" v-loading="loading">
            <!-- <el-table-column prop="interName" label="名称" width="200"></el-table-column> -->
            <el-table-column prop="interDesc" label="描述" width="500"></el-table-column>
            <el-table-column prop="interTag" label="关键词" width="400">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in JSON.parse(scope.row.interTag)"
                  :type="tagColors[index%5]"
                  disable-transitions
                >{{tag}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="interCreateTime" min-width="200" label="创建时间">
              <template slot-scope="scope">
                <span>{{ scope.row.interCreateTime }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="warning"
                  @click="handlePreview(scope.$index, scope.row)"
                >预览</el-button>
                <el-button
                  size="mini"
                  type="info"
                  plain
                  @click="handleDetail(scope.$index, scope.row)"
                >详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            style="margin-top: 10px; color: #909399"
            :hide-on-single-page="hideOnSinglePage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="100"
            layout="prev, next"
            :total="tableData.length"
          ></el-pagination>-->
        </el-card>
      </el-col>
    </el-row>
    <el-drawer
      show-close
      direction="ltr"
      :visible.sync="drawer"
      :wrapperClosable="false"
      size="50%"
      :destroy-on-close="true"
      :before-close="handleBeforeClose"
    >
      <p style="position: absolute; top: 0px; font-size: 19px; left: 12px;">代码预览</p>
      <span
        v-if="imgTip"
        style="color: #e6a23c;position: absolute;top: 52px;left: 12px;font-size: 13px;"
      >该文档可能包含图片, 点击详情查阅</span>
      <el-card shadow="never">
        <div>
          <p style="color: #303133">
            文档ID :
            <span style="color: #909399; margin-left: 12px;font-size: 14px">{{preDoc.interId}}</span>
          </p>
          <p style="color: #303133">
            DIX版本 :
            <span style="color: #e6a23c; margin-left: 5px;font-size: 14px">{{preDoc.dixTag}}</span>
          </p>
          <p style="color: #303133">
            文档描述 :
            <span style="color: #e6a23c;font-size: 14px">{{preDoc.interDesc}}</span>
          </p>
          <p>
            <el-tag
              :key="tag"
              v-for="(tag, index) in preTags"
              :disable-transitions="false"
              :type="tagColors[index]"
            >{{tag}}</el-tag>
          </p>
        </div>
      </el-card>
      <!-- <div id="codeView" :style="{ 'overflow-y': 'scroll', 'min-height': highHeight + 'px'}" v-highlight>
          <pre><code v-html="preCode"></code></pre>
      </div>-->
      <el-card shadow="never" id="myeditor" style="margin-top:-20px">
        <MyEditor :readOnly="'true'" :codes="preCode" :editHeight="200" />
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import MyEditor from "./myEditor";
export default {
  components: {
    MyEditor
  },
  name: "Select",
  data() {
    return {
      imgTip: false,
      preTags: [],
      preDoc: "",
      loading: false,
      preCode: "",
      drawer: false,
      hideOnSinglePage: true,
      currentPage: 1,
      typeList: [],
      inputValue: "",
      tagColors: ["success", "danger", "", "warning", "danger"],
      dynamicTags: [],
      tableData: [],
      allTableData: []
    };
  },
  methods: {
    handleBeforeClose(done) {
      this.imgTip = false;
      this.preCode = "";
      this.preTags = [];
      this.preDoc = "";
      this.drawer = false;
    },
    handlePreview(index, row) {
      this.preTags = [];
      const interTags = JSON.parse(row.interTag);
      interTags.forEach(element => {
        this.preTags.push(element);
      });
      this.preCode = JSON.parse(row.interCode).interCode;
      if (this.preCode.length < 25) {
        this.imgTip = true;
      }
      this.preDoc = row;
      this.drawer = true;
    },
    handleDetail(index, row) {
      const interTag = this.dynamicTags;
      this.$router.push({
        name: "detail",
        params: { id: row.interId, intertag: interTag }
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        if (this.dynamicTags.indexOf(inputValue) === -1) {
          this.dynamicTags.push(inputValue.toLowerCase());
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
      this.loadDocs();
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.loadDocs();
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
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return type => {
        return (
          type.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1
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
    loadDocs() {
      this.loading = true;
      this.request
        .request("post", this.baseUrl + "/inter/querydoc", "", this.dynamicTags)
        .then(res => {
          if (res.status === 200) {
            this.tableData.length = 0;
            this.tableData = res.data;
          }
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    routerBack() {
      const tempTags = this.$route.params.intertag;
      if (tempTags === undefined || tempTags.length === 0) {
        this.dynamicTags = [];
      } else {
        this.dynamicTags = tempTags;
      }
    }
  },
  created() {
    this.routerBack();
    this.loadTags();
    this.loadDocs();
  },
  mounted() {}
};
</script>
