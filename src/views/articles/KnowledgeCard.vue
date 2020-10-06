<template>
  <div class="knowledge-card">
    <vx-card>
      <h2 class="mb-4 text-center">{{$t("categories") | capitalize}}</h2>
      <div class="category-area">
        <!-- <VuePerfectScrollbar class="category-area px-4" :settings="settings"> -->
        <div class="v-full" v-for="knowledge in knowledges" :key="knowledge.id">
          <h5
            :class="selectedId==knowledge.id?'text-warning font-bold':'text-primary'"
            class="underline cursor-pointer"
            @click="selectCategory(knowledge.id)"
          >{{knowledge.name}}</h5>
        </div>
        <!-- </VuePerfectScrollbar> -->
      </div>
      <div class="footer w-full">
        <vs-alert active="true" class="text-center cursor-pointer" @click="openAdd">
          <span class="ml-2">{{$t("Add a new article")}}</span>
        </vs-alert>
      </div>
    </vx-card>
    <vs-prompt
      :title="$t('Create a new article')"
      :accept-text="$t('save') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="!errors.any() && docName!='' && docTitle!='' && category!=''"
      @accept="addArticle"
      :active.sync="activeArticle"
    >
      <div class="con-exemple-prompt">
        <div class="vx-col w-full mb-5">
          <v-select
            class="w-full"
            name="catogory"
            label="name"
            v-validate="'required'"
            :options="knowledges"
            v-model="category"
          ></v-select>
          <span
            class="text-danger text-sm"
            v-show="errors.has('catogory')"
          >{{ errors.first('catogory') }}</span>
        </div>
        <div class="vx-col w-full mb-5">
          <vs-input
            v-validate="'required|min:2'"
            :label-placeholder="$t('title') | capitalize"
            name="title"
            v-model="docTitle"
            class="mt-5 w-full"
            ref="password"
          />
          <!-- <vs-input v-validate="'required'" label-placeholder="Title" name="title" v-model="title" class="mt-5 w-full" /> -->
          <span class="text-danger text-sm" v-show="errors.has('title')">{{ errors.first('title') }}</span>
        </div>
        <div class="vx-col w-full">
          <input
            type="file"
            accept="application/pdf"
            ref="docFile"
            name="doc"
            @change="getDoc($event.target.name, $event.target.files)"
            style="display:none;"
          />
          <vs-button
            type="filled"
            color="success"
            @click="$refs.docFile.click()"
          >{{$t("Select a PDF")}}</vs-button>
          <span class="pl-2">{{docName}}</span>
        </div>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";

import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "../../firebase/firebaseStorage";

export default {
  components: {
    VuePerfectScrollbar,
    VSelect
  },
  computed: {
    knowledges() {
      return this.$store.getters["app/knowledge_category"];
    }
  },
  data() {
    return {
      category: "",
      docFile: "",
      docTitle: "",
      docName: "",
      docUpload: "",
      ref: "",
      activeArticle: false,
      selectedId: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7
      }
    };
  },
  watch: {
    docUpload() {
      var _this = this;
      this.docUpload.on(
        "state_changed",
        sp => {},
        null,
        () => {
          this.docUpload.snapshot.ref.getDownloadURL().then(downloadURL => {
            db.collection("knowledge")
              .add({
                title: this.docTitle,
                file: downloadURL,
                fileName: this.docName,
                type: "article",
                category: this.category.id,
                ref: this.ref,
                group: JSON.parse(localStorage.getItem("userInfo")).group,
                updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                updated_at: new Date()
              })
              .then(() => {
                this.docTitle = "";
                this.docName = "";
                _this.$vs.loading.close();

                _this.$vs.notify({
                  title: "Success",
                  text: "A article is inserted successfully",
                  iconPack: "feather",
                  icon: "icon-alert-circle",
                  color: "success"
                });
                _this.selectCategory(_this.category.id);
              })
              .catch(error => {
                this.docTitle = "";
                this.docName = "";
                _this.$vs.loading.close();
                _this.$vs.notify({
                  title: "Failed",
                  text: error.message,
                  iconPack: "feather",
                  icon: "icon-alert-circle",
                  color: "warning"
                });
              });
          });
        }
      );
    }
  },
  methods: {
    openAdd() {
      this.clear();
      this.activeArticle = true;
    },
    clear() {
      this.category = "";
      this.docTitle = "";
      this.docName = "";
    },
    getDoc(fileName, file) {
      this.docFile = file;
      this.docName = file[0].name;
    },
    addArticle() {
      this.$vs.loading();
      const { maxSize } = this;
      let file = this.docFile;
      let doc = file[0];
      if (file.length > 0) {
        let size = doc.size / maxSize / maxSize;
        if (size > 1) {
          this.$vs.loading.close();
          this.errorNotify(
            "Your file is too big! Please select an image under 1MB"
          );
        } else {
          var d = new Date();
          var storageRef = storage.ref();
          this.ref =
            JSON.parse(localStorage.getItem("userInfo")).group +
            "/" +
            JSON.parse(localStorage.getItem("userInfo")).id +
            "/docs/" +
            d.getTime() +
            d.getMilliseconds();
          var mountainsRef = storageRef.child(this.ref);
          this.docUpload = mountainsRef.put(doc);
        }
      }
    },
    selectCategory(id) {
      this.$emit("showArticle", id);
      this.selectedId = id;
    }
  }
};
</script>

<style scoped>
.category-area {
  min-height: 300px;
  /* max-width: calc(100vh - 10rem); */
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
<style>
.vs-dialog {
  max-width: 600px !important;
}
</style>