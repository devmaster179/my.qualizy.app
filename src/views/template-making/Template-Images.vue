<template>
  <div>
    <vs-dropdown vs-custom-content class="cursor-pointer mr-4">
      <div class="flex items-center">
        <img :src="applyImage(image)" style="width: 48px; border-radius: 50%" />
        <span class="karla-bold select-image-text ml-2">{{
          $t("select image")
        }}</span>
      </div>
      <vs-dropdown-menu class="vx-navbar-dropdown template-images">
        <span class="karla-bold select-image-text ml-2">{{
          $t("select image")
        }}</span>

        <div class="vx-row py-4" style="width: 300px">
          <div
            class="vx-col sm:w-1/4 xs:w-1/3 mb-2"
            v-for="(img, key) in images"
            :key="key"
          >
            <div class="images" :class="img == image ? 'active' : ''">
              <img
                class="cursor-pointer"
                :src="require(`@/assets/images/template_image/${img}`)"
                style="width: 48px; height: 48px"
                @click="selectImage = img"
              />
            </div>
          </div>
          <div
            class="vx-col sm:w-1/4 xs:w-1/3 mb-2"
            v-for="img in templateImages"
            :key="img.id"
          >
            <div
              class="images"
              style="width: 48px; height: 48px !important"
              :class="img.url == image ? 'active' : ''"
            >
              <img
                class="cursor-pointer w-full h-full"
                :src="img.url"
                style="object-fit: contain"
                @click="selectImage = img.url"
              />
            </div>
          </div>
        </div>
        <div class="uploadmore-btn" @click="activeImageUploadPopup = true">
          <span>Upload More</span>
        </div>
      </vs-dropdown-menu>
    </vs-dropdown>

    <template-image-popup
      :open="activeImageUploadPopup"
      :uploading="activeUploading"
      @close="activeImageUploadPopup = false"
      @activeUpload="activeUploading = true"
    />
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import TemplateImagePopup from "../template-making/TemplateImagePopup";

export default {
  props: {
    image: {
      type: String,
      default: "1.svg",
    },
  },
  data() {
    return {
      activeImageUploadPopup: false,
      activeUploading: false,
      images: [
        "1.svg",
        "2.svg",
        "3.svg",
        "4.svg",
        "5.svg",
        "6.svg",
        "7.svg",
        "8.svg",
        "9.svg",
        "10.svg",
        "11.svg",
        "12.svg",
        "13.svg",
      ],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  components: {
    TemplateImagePopup,
    VuePerfectScrollbar,
  },
  computed: {
    selectImage: {
      get() {
        let tempTemplate = this.$store.getters["app/getTempTemplate"];
        if (tempTemplate !== undefined && tempTemplate.content !== undefined)
          return tempTemplate.content.templateImage;
        return "";
      },
      set(val) {
        this.$store.dispatch("app/chnTemplateImage", val);
        this.activePrompt = false;
      },
    },
    templateImages() {
      let templateImages = this.$store.getters["app/templateImages"];
      console.log("from getter", templateImages);
      return templateImages;
    },
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
  },
};
</script>

<style scoped>
.scroll-template-image {
  max-height: calc(100vh - 10rem);
}
.images img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  -webkit-box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
  position: relative;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.images img:hover {
  -webkit-transform: translateY(-5px);
  transform: translateY(-5px);
  -webkit-box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
}

.images.active img {
  -webkit-transform: translate(0) !important;
  transform: translate(0) !important;
  background: rgba(var(--vs-primary), 0.05) !important;
  color: rgba(var(--vs-primary), 1);
  -webkit-box-shadow: 0px 0px 1px 3px rgba(var(--vs-primary), 1) !important;
  box-shadow: 0px 0px 1px 3px rgba(var(--vs-primary), 1) !important;
}

.vs-dropdown-menu.template-images {
  z-index: 54000;
}

.uploadmore-btn {
  text-align: center;
  background-color: #f2f2f2;
  padding: 5px;
  cursor: pointer;
}

.uploadmore-btn > span {
}
</style>