<template>
  <div class="myEditor">
    <div
      id="container"
      :style="{ height: editorHeight + 'px', width: editorWidth }"
      ref="container"
    ></div>
    <!-- <div id="container" ref="container"></div> -->
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
export default {
  props: {
    codes: {
      type: String,
      default: function() {
        return "function run(){\n\n}";
      }
    },
    editHeight: {
      type: Number,
      default: function() {
        return document.querySelector("html").clientHeight - 95;
      }
    },
    editWidth: {
      type: String,
      default: function() {
        return "100%";
      }
    },
    readOnly: {
      type: String,
      default: function() {
        return "true";
      }
    }
  },
  data() {
    return {
      editorHeight: "",
      editorWidth: "",
      readonly:"",
    };
  },
  created() {
    let self = this;
    this.editorWidth = self.editWidth;
    this.editorHeight =
      self.editHeight == 100
        ? document.querySelector("html").clientHeight - 95
        : document.querySelector("html").clientHeight - 276;
        this.readonly = self.readOnly;
  },
  watch: {
    codes: {
      // immediate: true, // 监听到后，立即执行 handler方法
      handler(val) {
        if (this.readonly != 'false') {
          this.monacoEditor.setValue(val);
        }
      }
    },
    // readOnly: {
    //   immediate: true, // 监听到后，立即执行 handler方法
    //   handler(val) {
    //     this.readonly = val;
    //   }
    // }
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      let self = this;
      // self.$refs.container.innerHTML = "";
      self.monacoEditor = monaco.editor.create(self.$refs.container, {
        value: self.codes,
        language: "javascript",
        theme: "vs-dark",
        readOnly: self.readOnly,
        autoIndent: true,
        automaticLayout: true,
        glyphMargin: true
      });
      self.$emit("onMounted", self.monacoEditor); //编辑器创建完成回调
      self.monacoEditor.onDidChangeModelContent(function(event) {
        //编辑器内容changge事件
        self.codesCopy = self.monacoEditor.getValue();
        self.$emit("onCodeChange", self.monacoEditor.getValue(), event);
      });
      //编辑器随窗口自适应
      // window.addEventListener("resize", initEditor());
    }
  }
};
</script>

<style scoped>
#container {
  height: 630px;
  width: 100%;
}
</style>