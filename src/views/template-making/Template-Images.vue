<template>
  <vs-dropdown vs-custom-content class="cursor-pointer mr-4">
    <div class="flex items-center">
      <img
        :src="require(`@/assets/images/template_image/${image}`)"
        style="width:48px;height:48px;"
      />
      <span class="karla-bold select-image-text ml-2">{{$t("select image")}}</span>
    </div>
    <vs-dropdown-menu class="vx-navbar-dropdown template-images">
      <span class="karla-bold select-image-text ml-2">{{$t("select image")}}</span>

      <div class="vx-row py-4" style="width:300px;">
        <div class="vx-col sm:w-1/4 xs:w-1/3 mb-2" v-for="(img,key) in images" :key="key">
          <div class="images" :class="img==image ? 'active' : ''">
            <img
              class="cursor-pointer"
              :src="require(`@/assets/images/template_image/${img}`)"
              style="width:48px;height:48px;"
              @click="selectImage=img"
            />
          </div>
        </div>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  props: {
    image: {
      type: String,
      default: "1.svg"
    }
  },
  data() {
    return {
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
        "13.svg"
      ],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  components: {
    VuePerfectScrollbar
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
      }
    },
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      }
    }
  }
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
</style>

<style>
.vs-dropdown-menu.template-images {
  z-index: 54000;
}
</style>