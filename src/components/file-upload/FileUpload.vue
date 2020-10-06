
<template>
  <div class="con-input-upload my-2">
    <div v-if="inUpload" class="img-upload m-0">
      <img :src="imagePreview" />
      <span
        class="input-progress vs-progress--foreground"
        :style="'width:' + progressUpload + '%; opacity:.5;'"
      ></span>
    </div>

    <div v-else>
      <input type="file" accept="image/*" @change="detectFiles($event.target.files)" />
      <span class="text-input">Upload File</span>
      <button type="button" title="Upload" class="btn-upload-all vs-upload--button-upload">
        <i translate="translate" class="material-icons notranslate">cloud_upload</i>
      </button>
    </div>
  </div>
</template>

<script>
import { storage } from "../../firebase/firebaseStorage";

export default {
  props: {
    indexs: {
      type: Array
    }
  },
  data() {
    return {
      imagePreview: "",
      inUpload: false,
      progressUpload: 100,
      file: File,
      ref: ""
    };
  },
  methods: {
    detectFiles(fileList) {
      var that = this;
      var reader = new FileReader();
      reader.onload = function(e) {
        that.imagePreview = e.target.result;
        that.inUpload = true;
      };
      reader.readAsDataURL(fileList[0]);

      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x]);
      });
    },
    upload(file) {
      var d = new Date();
      var storageRef = storage.ref();
      this.ref =
        JSON.parse(localStorage.getItem("userInfo")).group +
        "/" +
        JSON.parse(localStorage.getItem("userInfo")).id +
        "/logs/images/" +
        file.name;

      var mountainsRef = storageRef.child(this.ref);
      var uploadTask = mountainsRef.put(file);

      uploadTask.on(
        "state_changed",
        sp => {
          this.progressUpload =
            100 - (sp.bytesTransferred / sp.totalBytes) * 100;
        },
        error => {
          this.$vs.notify({
            time: 7000,
            title: "Failed uploading",
            text:
              error.code +
              `
                Error is occured when file is uploding.`,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.$emit("url", downloadURL, this.ref, this.indexs);
            this.progressUpload = 0;
            this.inUpload = false;
          });
        }
      );
    }
  },
  watch: {}
};
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
.vs-upload--button-upload {
  z-index: 1 !important;
}
</style>