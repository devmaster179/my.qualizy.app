<template>
  <vs-popup
    classContent="popup-example"
    class="popup-image-upload"
    :title="$t('Add your Billing Detail')"
    :active.sync="activePrompt"
  >
    <VuePerfectScrollbar
      class="scroll-template-making mt-4 pb-6 px-4 log-sidebar"
      :settings="settings"
    >
      <div>
        <h1>Main Content</h1>
      </div>
    </VuePerfectScrollbar>
    <vs-divider />
    <div class="flex items-center justify-end">
      <vs-button>O K</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
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
  },
  data() {
    return {
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
  },
  methods: {},
};
</script>

<style scoped>
</style>


