
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
      <input
        type="file"
        accept="image/*"
        @change="detectFiles($event.target.files)"
      />
      <span class="text-input">Upload File</span>
      <button
        type="button"
        title="Upload"
        class="btn-upload-all vs-upload--button-upload"
      >
        <i translate="translate" class="material-icons notranslate"
          >cloud_upload</i
        >
      </button>
    </div>
  </div>
</template>

<script>
import { storage } from "../../firebase/firebaseStorage";
import { mapGetters } from 'vuex'

export default {
  props: {
    indexs: {
      type: Array,
    },
  },
  data() {
    return {
      imagePreview: "",
      inUpload: false,
      progressUpload: 100,
      file: File,
      ref: "",
    };
  },
  computed: {
    ...mapGetters([
      'internetOnline'
    ])
  },
  methods: {
    detectFiles(fileList) {
      var that = this;
      var img = new Image();
      var reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
        that.imagePreview = e.target.result;
        img.onload = function () {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          var MAX_WIDTH = 400;
          var MAX_HEIGHT = 300;
          var width = img.width;
          var height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          var dataurl = canvas.toDataURL(fileList[0].type);
          that.upload(dataurl, fileList[0].name, fileList[0].type);
        };
      };
      reader.readAsDataURL(fileList[0]);
    },
    async upload(file, name, type) {
      var d = new Date();
      var storageRef = storage.ref();
      this.ref =
        JSON.parse(localStorage.getItem("userInfo")).group +
        "/" +
        JSON.parse(localStorage.getItem("userInfo")).id +
        "/logs/images/" +
        name;

      
      if (this.internetOnline === false)
        this.$vs.notify({
          time: 10000,
          title: "Offline mode",
          text:
            "Your internet connection is off or so slow. Files will be uploaded automatically once the connection is activated.",
          color: "primary",
        });

      this.inUpload = false;
      this.$emit("url", this.imagePreview, this.ref, this.indexs, "offline");
      var mountainsRef = storageRef.child(this.ref);
      var uploadTask = mountainsRef.putString(file, "data_url", {
        contentType: type,
      });
      // var uploadTask = mountainsRef.put(file);

      uploadTask.on(
        "state_changed",
        (sp) => {
          this.progressUpload =
            100 - (sp.bytesTransferred / sp.totalBytes) * 100;
        },
        (error) => {
          this.$vs.notify({
            time: 7000,
            title: "Failed uploading",
            text:
              error.code +
              `
                Error is occured when file is uploding.`,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.$emit("url", downloadURL, this.ref, this.indexs);
            this.progressUpload = 0;
            this.inUpload = false;
          });
        }
      );
    },
  },
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