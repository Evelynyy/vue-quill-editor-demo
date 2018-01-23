<template>
  <div class="hello">
    <h1>{{msg}}</h1>

    <!-- use vue quill editor -->
    <quill-editor
      style="height: 400px"
      v-model="content"
      ref="myQuillEditor"
      class="editor"
      :options="myQuillEditor"
      @focus="onEditorFocus">
    </quill-editor>

    <!-- image upload dialog -->
    <el-dialog
      title="图片上传"
      :visible.sync="dialogUploadImage"
      width="30%">
      <el-upload
        :auto-upload="false"
        ref="upload"
        :action="uploadURL"
        :headers="headers"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        name="image"
        style="margin-top:30px;">
        <el-button size="medium" slot="trigger">选取文件</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="DialogUploadImage=false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'beginning',
  data () {
    return {
      msg: 'Vue-quill-editor Demo', // message
      myQuillEditor: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['image']
            ],
            handlers: {
              'image': this.showUploadDialog
            }
          }
        },
        placeholder: 'insert your text here'
      }, // quill editor config setting
      content: '', // quill-editor data model
      dialogUploadImage: false, // show upload dialog or not
      uploadURL: '', // upload url eg: http://xxx-test.xxxxxx.com/api/jboard/announcements/upload
      headers: {
        Authorization: ''
      }, // request header
      fileList: [] // filelist
    }
  },
  components: {
    'quill-editor': quillEditor
  },
  methods: {
    /**
     *
     * listen editor on focus
     * to confirm the position of cursor
     * reference: https://quilljs.com/docs/api/#selection
     *
     */
    onEditorFocus (val) {
      console.log(val)
      let range = val.getSelection()
      if (range) {
        if (range.length === 0) {
          console.log('User cursor is at index', range.index)
          this.length = range.index
        } else {
          var text = val.getText(range.index, range.length)
          console.log('User has highlighted: ', text)
          this.length = range.index
        }
      } else {
        this.length = val.getText().length
      }
      console.log(this.length)
    },
    /**
     *
     * show upload dialog
     *
     */
    showUploadDialog () {
      this.dialogUploadImage = true
    },
    /**
     *
     * handle event before upload
     *
     */
    beforeUpload () {
      this.headers.Authorization = '' // value of token
    },
    /**
     *
     * handle event for uploading success
     *
     */
    handleUploadSuccess (res, file, fileList) {
      let quill = this.$refs.myQuillEditor.quill
      // if success
      if (res.code === 200 && res.url !== null) {
        // insert image into editor
        quill.insertEmbed(this.length, 'image', res.url)
        // adjust the cursor into last position
        quill.setSelection(this.length + 1)
        // clear the filelist
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error(res.message)
      }
    },
    /**
     *
     * handle event for uploading fail
     *
     */
    handleUploadError (err) {
      this.$message.error(err)
    },
    /**
     *
     * handle event for confirming upload
     *
     */
    confirmUpload () {
      // element-ui upload methods
      this.$refs.upload.submit()
      this.DialogUploadImage = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
