<template>
  <vs-popup :title="$t('create a new article')" :active.sync="activeOpen">
    <div class="p-4">
      <div class="file-import">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".pdf, video/*"
          @change="handleClick"
        />
        <!-- -->
        <div
          @click="$refs.fileInput.click()"
          @drop="handleDrop"
          @dragover="handleDragover"
          @dragenter="handleDragover"
          class="pl-5 py-2 cursor-pointer flex items-center border-2 border-dashed d-theme-border-grey-light d-theme-dark-bg text-xl"
        >
          <feather-icon
            icon="UploadCloudIcon"
            svgClasses="h-10 w-10 stroke-current text-grey"
            class="block"
          />
          <div class="ml-4">
            <span class="karla-bold text-primary">{{$t("add pdf")}}</span>
            <span class="karla-bold">{{$t("or drop PDF here")}}</span>
            <span class="text-sm ml-2" v-if="file.length>0">({{file[0].name}})</span>
          </div>
        </div>
      </div>
      <div class="title-section w-full mt-base">
        <label class="karla color-my-black">{{$t("title")}}</label>
        <vs-input v-model="title" class="w-full" />
      </div>
      <div class="article-actions flex justify-end mt-base">
        <vs-button
          class="ml-4"
          color="rgba(108, 80, 240, 0.1)"
          text-color="rgba(108, 80, 240)"
          style="padding:.8rem 2rem!important;"
          @click="activeOpen=false"
        >
          <span class="karla ml-2">{{$t("cancel")}}</span>
        </vs-button>
        <vs-button
          @click="saveArticle"
          :disabled="file.length==0 || title==''"
          class="ml-4"
          color="rgba(108, 80, 240)"
          text-color="white"
          style="padding:.8rem 2rem!important;"
        >
          <span class="karla ml-2">{{$t("save")}}</span>
        </vs-button>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "../../firebase/firebaseStorage";
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "",
      file: [],
    };
  },
  computed: {
    activeOpen: {
      get() {
        return this.open;
      },
      set() {
        return this.$emit("close");
      },
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.title = "";
        this.file = [];
      }
    },
  },
  methods: {
    saveArticle() {
      this.activeOpen = false;
      this.$vs.loading();
      const { maxSize } = this;
      if (this.file.length > 0) {
        let doc = this.file[0];
        let size = doc.size / maxSize / maxSize;
        if (size > 1) {
          this.errorNotify(
            "Your file is too big! Please select an image under 1MB"
          );
        } else {
          var d = new Date();
          var storageRef = storage.ref();
          let ref =
            JSON.parse(localStorage.getItem("userInfo")).group +
            "/" +
            JSON.parse(localStorage.getItem("userInfo")).id +
            "/docs/" +
            d.getTime() +
            d.getMilliseconds();
          var mountainsRef = storageRef.child(ref);
          let docUpload = mountainsRef.put(doc);
          docUpload.on(
            "state_changed",
            (sp) => {},
            null,
            () => {
              docUpload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.$vs.loading.close();
                db.collection("knowledge").add({
                  title: this.title,
                  file: downloadURL,
                  fileName: doc.name,
                  type: "article",
                  category: this.$route.params.id,
                  ref: ref,
                  isVideo: this.isVideo(doc),
                  group: JSON.parse(localStorage.getItem("userInfo")).group,
                  updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                  updated_at: new Date(),
                });
      
                this.$userflow.track("Create KnowledgeBase Article" , {
                  title: this.title,
                  file: downloadURL,
                  fileName: doc.name,
                  group: JSON.parse(localStorage.getItem("userInfo")).group
                })
                window.gist.track("Create KnowledgeBase Article" , {
                  title: this.title,
                  file: downloadURL,
                  fileName: doc.name,
                  group: JSON.parse(localStorage.getItem("userInfo")).group
                })
              });
            }
          );
        }
      }
    },
    handleClick(e) {
      const files = e.target.files;
      const rawFile = files[0];
      if (!this.isPDF(rawFile) && !this.isVideo(rawFile)) {
        this.$vs.notify({
          title: "Error",
          text: "Only supports upload .pdf suffix files",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        return false;
      } else {
        this.file = files;
      }
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$vs.notify({
          title: "Error",
          text: "Only support uploading one file!",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        return;
      }
      const rawFile = files[0]; // only use files[0]
      if (!this.isPDF(rawFile) && !this.isVideo(rawFile)) {
        this.$vs.notify({
          title: "Error",
          text: "Only supports upload .pdf or video suffix files",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        return false;
      }
    },
    isPDF(file) {
      return /\.(pdf)$/.test(file.name);
    },
    isVideo(file) {
      return (
        /\.(mp4)$/.test(file.name) ||
        /\.(m4v)$/.test(file.name) ||
        /\.(avi)$/.test(file.name) ||
        /\.(mpg)$/.test(file.name)
      );
    },
  },
};
</script>