<template>
  <div>
    <el-row style="margin-top: 200px" type="flex" justify="center" :gutter="30">
      <el-col :span="8">
        <div style="width: 100%; height: 100%" @click="handleLink('import')">
          <el-tooltip class="item" effect="dark" content="点击录入" placement="bottom-end">
            <el-card style="cursor: pointer" shadow="hover">
              <p class="home-p">我要录入</p>
            </el-card>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="width: 100%; height: 100%" @click="handleLink('select')">
          <el-tooltip class="item" effect="dark" content="点击查询" placement="bottom-end">
            <el-badge :value="countDoc" :max="500" type="warning">
              <el-card style="cursor: pointer" shadow="hover">
                <p class="home-p">我要查询</p>
              </el-card>
            </el-badge>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <el-container>
      <p
        style="position: absolute; bottom: 0; width: 100%; text-align: center; color: #C0C4CC;font-size: 14px;"
      >©2020 Data Integration Code Platform v1.0.0</p>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      countDoc: ""
    };
  },
  methods: {
    handleLink(target) {
      // router.push({ name: 'user', params: { userId: 123 }});
      let id = new Date().getTime() + this.createUniqueId(1);
      this.$router.push({ name: target, params: { id: id } });
    },
    loadCount() {
      this.request
        .request("get", this.baseUrl + "/inter/countdoc", "", "")
        .then(res => {
          if (res.status === 200) {
            this.countDoc = res.data;
          }
        });
    },
    createUniqueId(n) {
      n = 1; // 生成一个唯一id，包含数字和字母
      var random = function() {
        // 生成10-12位不等的字符串
        return Number(
          Math.random()
            .toString()
            .substr(2)
        ).toString(36); // 转换成十六进制
      };
      var arr = [];
      function createId() {
        var num = random();
        var _bool = false;
        arr.forEach(v => {
          if (v === num) _bool = true;
        });
        if (_bool) {
          createId();
        } else {
          arr.push(num);
        }
      }
      var i = 0;
      while (i < n) {
        createId();
        i++;
      }
      this.uniqueId = arr[0];
      return arr;
    }
  },
  created() {
    this.loadCount();
  }
};
</script>


  