<template>
  <div class="category-add">
    <vx-card>
      <div class="flex items-center justify-center content" @click="openAddCategoryPrompt">
        <div class="flex-col cursor-pointer">
          <div class="text-center">
            <vs-icon color="primary" size="100px" icon-pack="feather" icon="icon-plus-circle" />
          </div>
          <div>
            <h4 class="font-medium mt-4 text-primary">{{$t("add category") | capitalize}}</h4>
          </div>
        </div>
      </div>
    </vx-card>
    <vs-prompt
      :title="$t('Add category for knowledge base')"
      :accept-text="$t('save') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      button-cancel="border"
      :is-valid="!errors.any() && name!=''"
      @cancel="clearCategory"
      @accept="addCategory"
      @close="clearCategory"
      :active.sync="openAddCategory"
    >
      <div class="p-4">
        <VuePerfectScrollbar class="category-new-area pt-4" :settings="settings">
          <vs-input
            v-validate="'required|min:2'"
            name="name"
            class="w-full"
            :class="{'mb-4': !errors.has('name')}"
            size="large"
            :label-placeholder="$t('Category name')"
            v-model="name"
          />
          <p class="text-danger text-sm mb-4" v-show="errors.has('name')">{{ errors.first('name') }}</p>
          <vs-textarea :label="$t('add comment') | capitalize" v-model="comment" />
          <span>Category Image</span>
          <img
            v-if="initImage"
            @click="$refs.categoryImage.click()"
            :src="require(`@/assets/images/pages/graphic-3.png`)"
            style="height:150px;"
          />
          <img v-else @click="$refs.categoryImage.click()" :src="imageUrl" style="height:150px;" />
          <input
            type="file"
            accept="image/*"
            name="categoryImage"
            ref="categoryImage"
            @change="onCategoryImage($event.target.name, $event.target.files)"
            style="display: none;"
          />
        </VuePerfectScrollbar>
      </div>
    </vs-prompt>
  </div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "@/firebase/firebaseStorage";

export default {
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      imageUrl: "",
      initImage: true,
      ref: "",
      docName: "",
      docFile: "",
      name: "",
      comment: "",
      openAddCategory: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
    };
  },
  methods: {
    onCategoryImage(fileName, file) {
      this.initImage = false;
      this.docFile = file;
      this.docName = file[0].name;
      this.imageUrl = URL.createObjectURL(file[0]);
    },
    openAddCategoryPrompt() {
      this.clearCategory();
      this.openAddCategory = true;
    },
    clearCategory() {
      this.comment = "";
      this.name = "";
      this.imageUrl = "";
      this.initImage = true;
    },
    addCategory() {
      var _this = this;
      this.$vs.loading();
      if (this.imageUrl == "") {
        db.collection("knowledge").add({
          name: this.name,
          type: "category",
          image: "",
          comment: this.comment,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_at: new Date(),
        });
        setTimeout(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: "Success",
            text: "A category is created successfully",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
        }, 1000);
      } else {
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
              "/knowlegdge/" +
              d.getTime() +
              d.getMilliseconds();
            var mountainsRef = storageRef.child(this.ref);
            var docUpload = mountainsRef.put(doc);
            docUpload.on(
              "state_changed",
              (snapshot) => {
                var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
              },
              (error) => {
                console.log(error);
              },
              () => {
                docUpload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  db.collection("knowledge").add({
                    type: "category",
                    name: this.name,
                    image: downloadURL,
                    ref: this.ref,
                    comment: this.comment,
                    group: JSON.parse(localStorage.getItem("userInfo")).group,
                    updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                    updated_at: new Date(),
                  });
                  setTimeout(() => {
                    this.$vs.loading.close();
                    this.$vs.notify({
                      title: "Success",
                      text: "A category is created successfully",
                      iconPack: "feather",
                      icon: "icon-alert-circle",
                      color: "success",
                    });
                  }, 1000);
                });
              }
            );
          }
        }
      }
    },
    validateForm() {
      // return this.name != '' && this.comment != ''
      return true;
    },
  },
  watch: {
    docUpload() {
      var _this = this;
    },
  },
};
</script>
<style scoped>
.category-add .content {
  min-height: 300px;
}
.category-new-area {
  max-height: 300px;
}
</style>

<style>
.vs-dialog {
  max-width: 600px !important;
}
</style>