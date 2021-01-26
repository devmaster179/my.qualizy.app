<template>
  <vs-popup
    classContent="popup-example"
    class="popup-image-upload"
    :title="$t('Upload your own images')"
    :active.sync="activePrompt"
  >
    <VuePerfectScrollbar
      class="scroll-template-making mt-4 pb-6 px-4 log-sidebar"
      :settings="settings"
    >
      <div>
        <div>
          <img class="preview" :src="picture" />
        </div>
        <div>
          <input type="file" @change="previewImage" accept="image/*" />
        </div>
      </div>
    </VuePerfectScrollbar>
    <vs-divider />
    <div class="flex items-center justify-end">
      <vs-button :disabled="activeUploading" @click="onUpload">{{
        activeUploading ? $t("Uploading") : $t("Upload")
      }}</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Multiselect from "vue-multiselect";
import { db } from "@/firebase/firebaseConfig";
import firebase from "firebase";

export default {
  components: {
    VuePerfectScrollbar,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    uploading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageData: null,
      picture: require(`@/assets/images/template_image/1.svg`),
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
    activeUploading: {
      get() {
        return this.uploading;
      },
      set() {
        this.$emit("activeUpload");
      },
    },
  },
  methods: {
    previewImage(event) {
      this.uploadValue = 0;
      // this.picture = null;
      const file = event.target.files[0];
      this.imageData = file;
      this.picture = URL.createObjectURL(file);
    },

    onUpload() {
      this.activeUploading = true;
      const storageRef = firebase
        .storage()
        .ref(`template_images/${Date.now()}`)
        .put(this.imageData);

      storageRef.on(
        `state_changed`,
        (snapshot) => {},
        (error) => {
          console.log(error.message);
        },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            console.log("url: ", url);
            this.picture = url;

            let tImage = {
              created_by: JSON.parse(localStorage.getItem("userInfo")).id,
              url: url,
              created_at: new Date(),
            };
            this.$store.dispatch("app/addTemplateImage", {
              tImage,
              id: Date.now(),
            });
            this.activePrompt = false;
            db.collection("template_images")
              .add(tImage)
              .then((res) => {});
          });
        }
      );
    },
  },
};
</script>

<style scoped>
img.preview {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.popup-image-upload .vs-popup {
  z-index: 10000000000;
}
</style>


